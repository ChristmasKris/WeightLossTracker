'use strict';

import { apiHandler } from './apiHandler.js';
import { stateManager } from './stateManager.js';

export const authentication = {
	async authenticate(key) {
		try {
			const data = await apiHandler.request('/auth', {
				method: 'POST',
				body: { key }
			});
			return data.success;
		} catch (error) {
			console.error('Authentication error:', error);
			return false;
		}
	},

	logout() {
		stateManager.action.logout();
	}
};
