'use strict';

import { apiHandler } from '../../core/apiHandler.js';
import { stateManager } from '../../core/stateManager.js';

export const weightsApi = {
	async addWeight(weight) {
		try {
			const date = date = new Date().toISOString().split('T')[0];
			const state = stateManager.get();
			const response = await apiHandler.request('/weight', {
				method: 'POST',
				body: {
					weight,
					date
				},
				key: state.auth.key
			});
			
			return response;
		} catch (error) {
			throw new Error(`Failed to add weight: ${error.message}`);
		}
	},
	
	async deleteWeight(id) {
		try {
			const state = stateManager.get();
			const response = await apiHandler.request('/deleteWeight', {
				method: 'POST',
				body: {
					weightId: id
				},
				key: state.auth.key
			});
			
			return response;
		} catch (error) {
			throw new Error(`Failed to delete weight: ${error.message}`);
		}
	},
	
	async getTodayWeight() {
		try {
			const response = await apiHandler.request('/getTodayWeight', {
				method: 'GET'
			});
			
			return response;
		} catch (error) {
			throw new Error(`Failed to fetch today's weight: ${error.message}`);
		}
	},
	
	async getAllWeights() {
		try {
			const response = await apiHandler.request('/getAllWeights', {
				method: 'GET'
			});
			
			return response;
		} catch (error) {
			throw new Error(`Failed to fetch all weights: ${error.message}`);
		}
	}
};