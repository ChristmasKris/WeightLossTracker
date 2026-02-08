'use strict';

import { stateManager } from '../../core/stateManager.js';
import { loginApi } from './api.js';

export const loginController = {
	init() {
		const loginForm = document.getElementById('login-form');
		if (!loginForm) {
			return;
		}
		
		loginForm.addEventListener('submit', async (e) => {
			e.preventDefault();
			
			const keyInput = document.getElementById('login-key');
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
		});
	}
};
