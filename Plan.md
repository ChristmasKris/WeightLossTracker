# Plan

- Desktop PC/laptop only first. Tablet and phone app later.
- Folder for pages which then import modules and components that they need
- Every module gets its own folder and in that folder goes the module files for every aspect necessary of that module html css js
- Separate folder in ```shared``` folder for UI components and custom UI components like inputs, modal, button, textarea etc.
- Every page has the same 1 javascript file that inits everything, also statemanager, this then calls controllers of all modules it needs, and the controllers only return data or change their own feature's global state/variables and do nothing with UI/HTML
- controller = what calls methods in a module and changes/returns module specific data
- do not pre-add html to DOM, but let each module add and remove their html when necessary
- A module does not have to be reusable
- If modules need info or to communicate, only through state manager actions
- controller.js files don't do anything with HTML, only renderer.js files
- controller.js handles/does things like eventlisteners etc.
- controller.js doesnt call renderer, only state manager actions
- only state subscriber callback calls renderer
- init page js calls renderer once initially only of every module used
- modules only subscribe to their own state variable section like state.weight which can be state.weight.currentWeight, state.weight.goalWeight etc. and renderer of that module only gets called if something changes in state.weight
- modules can subscribe to more states than just their own if necessary

# File structure

```
projectStructure/
├── assets/
│   └── fonts/
├── css/
│   ├── editor.css
│   ├── global.css
│   ├── home.css
│   └── index.css
├── docs/
├── html/
│   ├── editor.ejs
│   ├── head.ejs
│   ├── home.ejs
│   └── index.ejs
└── js/
	 ├ index.js
    ├── core/
    │   ├── apiHandler.js
    │   ├── authentication.js
    │   ├── errorHandler.js
    │   └── stateManager.js
    ├── modules/
    │   ├── calories/
    │   ├── notification/
    │   └── weight/
    │       ├── api.js
    │       ├── controller.js
    │       ├── renderer.js
    │       ├── templates.js
    │       └── styles/
    │           ├── entry.css
    │           └── form.css
    └── shared/
        ├── config.js
        ├── FontAwesome.min.js
        ├── LocalStorageHandler.js
        ├── utils.js
        └── components/
            └── button/
                ├── button.css
                └── button.js
```
