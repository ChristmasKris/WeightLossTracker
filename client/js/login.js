'use strict';

import { listener } from './utils.js';
import { api } from './api.js';
import { stateManager } from './stateManager.js';

export const renderLoginScreen = async (appDiv) => {
	const response = await fetch('login.html');
	const html = await response.text();
	appDiv.innerHTML = html;
	setupLoginEvents();
};

const setupLoginEvents = () => {
	const loginBtn = document.getElementById('loginBtn');
	const keyInput = document.getElementById('passwordInput');
	
	const handleLogin = async () => {
		const key = keyInput.value;
		
		if (!key) {
			alert('Please enter a key');
			return;
		}
		
		const isValid = await api.authenticate(key);
		
		if (isValid) {
			stateManager.action.login(key);
		} else {
			alert('Invalid key');
			keyInput.value = '';
		}
	};
	
	const handleKeyPress = (e) => {
		if (e.key === 'Enter' && keyInput.value) {
			handleLogin();
		}
	};
	
	listener.add(loginBtn, 'click', handleLogin);
	listener.add(keyInput, 'keypress', handleKeyPress);
};
