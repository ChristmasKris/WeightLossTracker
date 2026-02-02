'use strict';

import { listener } from './utils.js';
import { api } from './api.js';
import { actions } from './state.js';

export const renderLoginScreen = async (appDiv) => {
	const response = await fetch('login.html');
	const html = await response.text();
	appDiv.innerHTML = html;
	setupLoginEvents();
};

const setupLoginEvents = () => {
	const loginBtn = document.getElementById('loginBtn');
	const passwordInput = document.getElementById('passwordInput');
	
	const handleLogin = async () => {
		const password = passwordInput.value;
		
		if (!password) {
			alert('Please enter a password');
			return;
		}
		
		const isValid = await api.authenticate(password);
		
		if (isValid) {
			actions.login(password);
		} else {
			alert('Invalid password');
			passwordInput.value = '';
		}
	};
	
	const handleKeyPress = (e) => {
		if (e.key === 'Enter' && passwordInput.value) {
			handleLogin();
		}
	};
	
	listener.add(loginBtn, 'click', handleLogin);
	listener.add(passwordInput, 'keypress', handleKeyPress);
};
