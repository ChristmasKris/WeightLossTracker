'use strict';

import { config } from '../shared/config.js';

/**
 * Central API handler - wraps all API calls with common error handling
 */
export const apiHandler = {
	async request(endpoint, options = {}) {
		const {
			method = 'GET',
			body = null,
			key = null
		} = options;

		const url = `${config.API_URL}${endpoint}`;
		const fetchOptions = {
			method,
			headers: { 'Content-Type': 'application/json' }
		};

		if (body) {
			const payload = { ...body };
			if (key) {
				payload.key = key;
			}
			fetchOptions.body = JSON.stringify(payload);
		}

		try {
			const response = await fetch(url, fetchOptions);
			const data = await response.json();
			return data;
		} catch (error) {
			console.error(`API error on ${endpoint}:`, error);
			throw error;
		}
	}
};
