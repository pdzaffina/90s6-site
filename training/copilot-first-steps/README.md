# 90S6 Copilot First Steps

A 90S6-branded adaptation of the Copilot First Steps learning experience. Course content, use-case data, prompt library, content library, and custom-course builder are maintained as separate files.

Pages: `index.html` guided course, `prompt-library.html` prompt library, `content-library.html` course builder, `custom-course.html` custom course.

The hero illustration and model-selector demonstration load from the original Tribal Technology repository. Copy those assets locally to make this course self-contained.

Serve this repository with any static web server and open `copilot-first-steps/index.html`. Practice with fictional or approved work data and follow your organization's data-handling policies.


## Editing course content
Open `content-editor.html` in the published course to use the visual Content Studio. Select a lesson or Prompt Library item, edit the fields, add or remove sections, and reorder lesson sections. Draft changes are saved in the current browser using local storage.

When ready, choose **Export updated content files**. The editor downloads `use-cases-data.js` and `prompts-data.js`. Replace the matching files in this folder in GitHub and commit the changes. The course pages then use the updated content. Browser drafts are local to that browser and are not automatically published or shared.
