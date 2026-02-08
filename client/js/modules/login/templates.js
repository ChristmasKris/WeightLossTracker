'use strict';

export const loginTemplates = {
	loginForm() {
		return `
			<div class="container">
				<h1>Weight loss tracker</h1>
				<input type="password" class="keyInput" placeholder="Access key" required/>
				<button class="loginButton">Sign In</button>
			</div>
		`;
	}
};