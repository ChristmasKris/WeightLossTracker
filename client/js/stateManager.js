'use strict';

import { config } from './config.js';
import { clientStorage } from './clientStorage.js';
import { api } from './api.js';

const callbacks = [];
const state = {
	auth: {
		key: null,
		isAuthenticated: false
	},
	ui: {
		currentScreen: 'login',
		error: null,
		message: null
	},
	entries: [],
	todayCalories: 0,
	todayWeight: null,
	weights: [],
	maxCalories: null
};

export const stateManager = {
	subscribe(callback) {
		callbacks.push(callback);
		
		return () => {
			const index = callbacks.indexOf(callback);
			
			if (index > -1) {
				callbacks.splice(index, 1);
			}
		};
	},
	
	get() {
		return { ...state };
	},
	
	set(updates) {
		Object.keys(updates).forEach(key => {
			if ((typeof updates[key] === 'object') && !Array.isArray(updates[key]) && (updates[key] !== null)) {
				Object.assign(state[key], updates[key]);
			} else {
				state[key] = updates[key];
			}
		});
		
		callbacks.forEach(callback => callback(state));
	},
	
	action: {
		init() {
			const key = clientStorage.get(config.CLIENT_STORAGE_KEY_NAME);
			
			if (key) {
				stateManager.set({
					auth: { key, isAuthenticated: true },
					ui: { currentScreen: 'tracker' }
				});
			}
		},
		
		login(key) {
			clientStorage.set(config.CLIENT_STORAGE_KEY_NAME, key);
			
			stateManager.set({
				auth: { key, isAuthenticated: true },
				ui: { currentScreen: 'tracker', error: null }
			});
		},
		
		async addCalorieEntry(name, calories) {
			if (await api.addCalorieEntry(name, calories, state.auth.key) === false) {
				return;
			}
			
			await stateManager.action.fetchTodayEntries();
			return true;
		},
		
		async deleteCalorieEntry(entryId) {
			if (await api.deleteEntry(entryId, state.auth.key) === false) {
				return false;
			}
			
			await stateManager.action.fetchTodayEntries();
			return true;
		},
		
		async addWeight(weight) {
			if (await api.addWeight(weight, state.auth.key) === false) {
				return false;
			}
			
			await stateManager.action.fetchTodayWeight();
			await stateManager.action.fetchAllWeights();
			return true;
		},
		
		async deleteWeight(weightId) {
			if (await api.deleteWeight(weightId, state.auth.key) === false) {
				return false;
			}
			
			await stateManager.action.fetchTodayWeight();
			await stateManager.action.fetchAllWeights();
			return true;
		},
		
		async fetchTodayEntries() {
			const entries = await api.getTodayEntries();
			const todayCalories = entries.reduce((sum, item) => {
				return sum + (Number(item.calories) || 0);
			}, 0);
			
			stateManager.set({
				entries,
				todayCalories
			});
		},
		
		async fetchTodayWeight() {
			const weight = await api.getTodayWeight();
			stateManager.set({ todayWeight: weight });
		},
		
		async fetchAllWeights() {
			const weights = await api.getAllWeights();
			stateManager.set({ weights });
		},
		
		async fetchMaxCalories() {
			const maxCalories = await api.getCurrentMaxCalories();
			stateManager.set({ maxCalories });
		},
		
		changeScreen(newScreenName) {
			stateManager.set({
				ui: {
					currentScreen: newScreenName
				}
			});
		}
	}
};