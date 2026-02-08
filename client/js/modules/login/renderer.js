import { loginTemplates } from './templates.js';

export const loginRenderer = {
	renderLoginForm() {
		const mainContent = document.getElementById('main-content');
		if (!mainContent) {
			return;
		}
		
		const formHTML = loginTemplates.loginForm();
		mainContent.innerHTML = '';
		
		const formElement = typeof formHTML === 'string' 
			? (() => { const d = document.createElement('div'); d.innerHTML = formHTML; return d.firstElementChild; })()
			: formHTML;
			
		if (formElement) {
			mainContent.appendChild(formElement);
		}
	}
};
