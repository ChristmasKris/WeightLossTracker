'use strict';

import { apiHandler } from '../../core/apiHandler.js';
import { stateManager } from '../../core/stateManager.js';

export const caloriesApi = {
	async addEntry(food, calories) {
		try {
			const date = new Date().toISOString().split('T')[0];
			const state = stateManager.get();
			const response = await apiHandler.request('/entry', {
				method: 'POST',
				body: {
					name: food,
					calories,
					date
				},
				key: state.auth.key
			});
			
			return response;
		} catch (error) {
			throw new Error(`Failed to add entry: ${error.message}`);
		}
	},
	
	async deleteEntry(id) {
		try {
			const state = stateManager.get();
			const response = await apiHandler.request('/deleteEntry', {
				method: 'POST',
				body: {
					entryId: id
				},
				key: state.auth.key
			});
			
			return response;
		} catch (error) {
			throw new Error(`Failed to delete entry: ${error.message}`);
		}
	},
	
	async getTodayEntries() {
		try {
			const response = await apiHandler.request('/getTodayEntries', {
				method: 'GET'
			});
			
			return response;
		} catch (error) {
			throw new Error(`Failed to fetch today's entries: ${error.message}`);
		}
	},
	
	async getMaxCalories() {
		try {
			const response = await apiHandler.request('/getCurrentMaxCalories', {
				method: 'GET'
			});
			
			return response;
		} catch (error) {
			throw new Error(`Failed to fetch max calories: ${error.message}`);
		}
	}
};