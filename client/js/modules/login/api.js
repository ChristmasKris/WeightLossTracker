'use strict';

import { apiHandler } from '../../core/apiHandler.js';

export const loginApi = {
	async authenticate(key) {
		try {
			const response = await apiHandler.request('/auth', {
				method: 'POST',
				body: {
					key
				}
			});
			
			return response;
		} catch (error) {
			throw new Error(`Authentication failed: ${error.message}`);
		}
	}
};