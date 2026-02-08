'use strict';

import { stateManager } from '../../core/stateManager.js';
import { loginApi } from './api.js';
import { listener } from '../../shared/utils.js';

export const loginController = {
	async handleLogin() {
		const keyInput = document.querySelector('.keyInput');
		const key = keyInput?.value?.trim();
		
		if (!key) {
			alert('Please enter a key');
			return;
		}
		
		try {
			const response = await loginApi.authenticate(key);
			if (response && response.success) {
				stateManager.action.login(key);
				window.location.href = 'calories.html';
			} else {
				alert('Authentication failed');
			}
		} catch (error) {
			alert(`Login error: ${error.message}`);
		}
	},
	
	init() {
		listener.add('.loginButton', 'click', this.handleLogin);
		listener.add('.keyInput', 'keypress', (e) => {
			if (e.key === 'Enter') {
				e.preventDefault();
				this.handleLogin();
			}
		});
	}
};