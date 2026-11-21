(() => {
const clone = value => JSON.parse(JSON.stringify(value));
const originalCases = clone(cases);
const originalPrompts = clone(window.COPILOT_PROMPTS || []);
const storageKey = '90s6-course-content-draft-v1';
let data = {cases:clone(originalCases), prompts:clone(originalPrompts)};
let activeLesson = 0, activePrompt = 0, mode = 'lessons';
const $ = id => document.getElementById(id);
const esc = value => String(value ?? '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'","&#39;");
function status(message){$('saveStatus').textContent=message;}
function save(){try{localStorage.setItem(storageKey,JSON.stringify(data));status('Draft saved in this browser');}catch{status('Could not save browser draft');}}
function load(){try{const saved=JSON.parse(localStorage.getItem(storageKey));if(saved?.cases&&saved?.prompts){data=saved;}}catch{}}
function setMode(next){mode=next;$('lessonsPanel').classList.toggle('hidden',mode!=='lessons');$('promptsPanel').classList.toggle('hidden',mode!=='prompts');$('lessonsTab').classList.toggle('active',mode==='lessons');$('promptsTab').classList.toggle('active',mode==='prompts');}
function renderLessonList(){ $('lessonCount').textContent=data.cases.length; $('lessonList').innerHTML=data.cases.map((c,i)=>'<button type="button" data-lesson="'+i+'" class="'+(i===activeLesson?'active':'')+'">'+esc(c.title||'Untitled lesson')+'<small>Lesson '+(i+1)+'</small></button>').join('');$('lessonList').querySelectorAll('[data-lesson]').forEach(b=>b.onclick=()=>{activeLesson=Number(b.dataset.lesson);renderLessonList();renderLesson();});}
function renderLesson(){const c=data.cases[activeLesson];if(!c)return;$('lessonEditorTitle').textContent=c.title||'Untitled lesson';$('lessonPosition').textContent='LESSON '+(activeLesson+1)+' OF '+data.cases.length;$('lessonTitle').value=c.title||'';$('lessonIcon').value=c.icon||'';$('lessonTime').value=c.time||'';$('lessonShort').value=c.short||'';$('lessonIntro').value=c.intro||'';renderSections();renderLessonPrompts();}
function bind(id,key){$(id).addEventListener('input',e=>{data.cases[activeLesson][key]=e.target.value;$('lessonEditorTitle').textContent=data.cases[activeLesson].title||'Untitled lesson';renderLessonList();save();});}
function renderSections(){const sections=data.cases[activeLesson].sections||[];$('sectionEditor').innerHTML=sections.map((s,i)=>'<article class="section-card"><div class="section-card-head"><strong>SECTION '+(i+1)+'</strong><div class="section-card-actions"><button type="button" data-up="'+i+'" title="Move up">↑</button><button type="button" data-down="'+i+'" title="Move down">↓</button><button type="button" data-remove="'+i+'">Remove</button></div></div><label>Heading<input data-section-heading="'+i+'" value="'+esc(s[0])+'"></label><label>Section text<textarea rows="4" data-section-body="'+i+'">'+esc(s[1])+'</textarea></label></article>').join('')||'<p class="small-note">No sections yet. Add one to start building this lesson.</p>';
$('sectionEditor').querySelectorAll('[data-section-heading]').forEach(el=>el.oninput=()=>{sections[+el.dataset.sectionHeading][0]=el.value;save();});
$('sectionEditor').querySelectorAll('[data-section-body]').forEach(el=>el.oninput=()=>{sections[+el.dataset.sectionBody][1]=el.value;save();});
$('sectionEditor').querySelectorAll('[data-remove]').forEach(el=>el.onclick=()=>{sections.splice(+el.dataset.remove,1);renderSections();save();});
$('sectionEditor').querySelectorAll('[data-up]').forEach(el=>el.onclick=()=>{const i=+el.dataset.up;if(i>0){[sections[i-1],sections[i]]=[sections[i],sections[i-1]];renderSections();save();}});
$('sectionEditor').querySelectorAll('[data-down]').forEach(el=>el.onclick=()=>{const i=+el.dataset.down;if(i<sections.length-1){[sections[i+1],sections[i]]=[sections[i],sections[i+1]];renderSections();save();}});
}
function renderLessonPrompts(){const c=data.cases[activeLesson];let prompts=c.prompts||[];const single=c.prompt||'';$('lessonPromptEditor').innerHTML=(single?'<article class="lesson-prompt-card"><div class="lesson-prompt-card-head">PRIMARY EXAMPLE PROMPT</div><textarea id="singlePrompt" rows="4">'+esc(single)+'</textarea></article>':'')+prompts.map((p,i)=>'<article class="lesson-prompt-card"><div class="lesson-prompt-card-head"><span>PROMPT '+(i+1)+'</span><button type="button" data-remove-lesson-prompt="'+i+'">Remove</button></div><input data-lesson-prompt-label="'+i+'" value="'+esc(p[0])+'" placeholder="Prompt label"><textarea rows="4" data-lesson-prompt-text="'+i+'">'+esc(p[1])+'</textarea></article>').join('')||(!single?'<p class="small-note">No practice prompts yet.</p>':'');
const singleEl=$('singlePrompt');if(singleEl)singleEl.oninput=()=>{c.prompt=singleEl.value;save();};
$('lessonPromptEditor').querySelectorAll('[data-lesson-prompt-label]').forEach(el=>el.oninput=()=>{prompts[+el.dataset.lessonPromptLabel][0]=el.value;save();});
$('lessonPromptEditor').querySelectorAll('[data-lesson-prompt-text]').forEach(el=>el.oninput=()=>{prompts[+el.dataset.lessonPromptText][1]=el.value;save();});
$('lessonPromptEditor').querySelectorAll('[data-remove-lesson-prompt]').forEach(el=>el.onclick=()=>{prompts.splice(+el.dataset.removeLessonPrompt,1);c.prompts=prompts;renderLessonPrompts();save();});
}
function renderPromptList(){$('promptCount').textContent=data.prompts.length;$('promptList').innerHTML=data.prompts.map((p,i)=>'<button type="button" data-prompt="'+i+'" class="'+(i===activePrompt?'active':'')+'">'+esc(p.title||'Untitled prompt')+'<small>'+(esc(p.category||'Uncategorized'))+'</small></button>').join('');$('promptList').querySelectorAll('[data-prompt]').forEach(b=>b.onclick=()=>{activePrompt=+b.dataset.prompt;renderPromptList();renderPrompt();});}
function renderPrompt(){const p=data.prompts[activePrompt];if(!p)return;$('promptEditorTitle').textContent=p.title||'Untitled prompt';$('promptPosition').textContent='PROMPT '+(activePrompt+1)+' OF '+data.prompts.length;$('promptTitle').value=p.title||'';$('promptCategory').value=p.category||'';$('promptDescription').value=p.description||'';$('promptText').value=p.prompt||'';$('promptTags').value=(p.tags||[]).join(', ');}
function bindPrompt(id,key,transform=v=>v){$(id).oninput=e=>{data.prompts[activePrompt][key]=transform(e.target.value);$('promptEditorTitle').textContent=data.prompts[activePrompt].title||'Untitled prompt';renderPromptList();save();};}
function download(name,content){const blob=new Blob([content],{type:'text/javascript;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();URL.revokeObjectURL(url);}
function exportCases(){download('use-cases-data.js','const cases = '+JSON.stringify(data.cases,null,2)+';\n');}
function exportPrompts(){download('prompts-data.js','window.COPILOT_PROMPTS = '+JSON.stringify(data.prompts,null,2)+';\n');}
$('lessonsTab').onclick=()=>setMode('lessons');$('promptsTab').onclick=()=>setMode('prompts');
bind('lessonTitle','title');bind('lessonIcon','icon');bind('lessonTime','time');bind('lessonShort','short');bind('lessonIntro','intro');
$('addSection').onclick=()=>{const c=data.cases[activeLesson];c.sections=c.sections||[];c.sections.push(['New section','Add your section text here.']);renderSections();save();};
$('addLessonPrompt').onclick=()=>{const c=data.cases[activeLesson];c.prompts=c.prompts||[];c.prompts.push(['New prompt','Write your example prompt here.']);renderLessonPrompts();save();};
$('promptTitle').addEventListener('input',()=>{data.prompts[activePrompt].title=$('promptTitle').value;$('promptEditorTitle').textContent=$('promptTitle').value||'Untitled prompt';renderPromptList();save();});
bindPrompt('promptCategory','category');bindPrompt('promptDescription','description');bindPrompt('promptText','prompt');bindPrompt('promptTags','tags',v=>v.split(',').map(x=>x.trim()).filter(Boolean));
$('addLibraryPrompt').onclick=()=>{data.prompts.push({id:'new-prompt-'+Date.now(),title:'New prompt',category:'General',description:'Describe what this prompt helps with.',tags:[],prompt:'Write your prompt here. Use [BRACKETS] for details the learner should replace.'});activePrompt=data.prompts.length-1;renderPromptList();renderPrompt();save();};
$('deleteLibraryPrompt').onclick=()=>{if(!data.prompts.length)return;if(!confirm('Delete this prompt from the Prompt Library draft?'))return;data.prompts.splice(activePrompt,1);activePrompt=Math.max(0,activePrompt-1);renderPromptList();renderPrompt();save();};
$('exportAll').onclick=()=>{exportCases();setTimeout(exportPrompts,250);status('Exported both content files');};
$('resetDraft').onclick=()=>{if(!confirm('Discard all browser draft changes and reload the published content?'))return;localStorage.removeItem(storageKey);data={cases:clone(originalCases),prompts:clone(originalPrompts)};activeLesson=0;activePrompt=0;renderAll();status('Browser draft discarded');};
function renderAll(){renderLessonList();renderLesson();renderPromptList();renderPrompt();}
load();renderAll();status(localStorage.getItem(storageKey)?'Loaded saved browser draft':'Ready to edit');
})();