'use strict';

import { config } from '../shared/config.js';
import { clientStorage } from '../shared/clientStorage.js';

const callbacks = [];
const state = {
	auth: {
		key: null,
		isAuthenticated: false
	},
	ui: {
		currentPage: 'login',
		error: null,
		message: null
	},
	calorieEntries: [],
	todayCalories: 0,
	todayWeight: null,
	weights: [],
	maxCalories: null
};

export const stateManager = {
	subscribe(callback, statePath = null) {
		callbacks.push({ callback, statePath });
		
		return () => {
			const index = callbacks.findIndex(c => c.callback === callback && c.statePath === statePath);
			
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
			const updateValue = updates[key];
			const stateValue = state[key];
			const isPlainObject = (value) => (typeof value === 'object') && (value !== null) && !Array.isArray(value);
			
			if (isPlainObject(updateValue) && isPlainObject(stateValue)) {
				Object.assign(stateValue, updateValue);
			} else {
				state[key] = updateValue;
			}
		});
		
		callbacks.forEach(({ callback, statePath }) => {
			if (!statePath) {
				callback(state);
			} else if (Array.isArray(statePath)) {
				if (statePath.some(path => path in updates)) {
					callback(state);
				}
			} else if (statePath in updates) {
				callback(state);
			}
		});
	},
	
	action: {
		init() {
			const key = clientStorage.get(config.CLIENT_STORAGE_KEY_NAME);
			
			if (key) {
				stateManager.set({
					auth: { key, isAuthenticated: true },
					ui: { currentPage: 'weights' }
				});
			}
		},
		
		login(key) {
			clientStorage.set(config.CLIENT_STORAGE_KEY_NAME, key);
			
			stateManager.set({
				auth: { key, isAuthenticated: true },
				ui: { currentPage: 'weights', error: null }
			});
		},
		
		logout() {
			clientStorage.remove(config.CLIENT_STORAGE_KEY_NAME);
			
			stateManager.set({
				auth: { key: null, isAuthenticated: false },
				ui: { currentPage: 'login', error: null }
			});
		},
		
		changePage(newPageName) {
			stateManager.set({
				ui: {
					currentPage: newPageName
				}
			});
		},
		
		addCalorieEntry(entry) {
			const newEntries = [entry, ...state.calorieEntries];
			const totalCalories = newEntries.reduce((sum, e) => sum + (e.calories || 0), 0);
			
			stateManager.set({
				calorieEntries: newEntries,
				todayCalories: totalCalories
			});
		},
		
		deleteCalorieEntry(entryId) {
			const newEntries = state.calorieEntries.filter(e => e.id !== entryId);
			const totalCalories = newEntries.reduce((sum, e) => sum + (e.calories || 0), 0);
			
			stateManager.set({
				calorieEntries: newEntries,
				todayCalories: totalCalories
			});
		},
		
		addWeightEntry(weight) {
			const newWeights = [weight, ...state.weights];
			
			stateManager.set({
				weights: newWeights,
				todayWeight: weight
			});
		},
		
		deleteWeightEntry(weightId) {
			const newWeights = state.weights.filter(w => w.id !== weightId);
			
			stateManager.set({
				weights: newWeights
			});
		},
		
		setMaxCalories(maxCalories) {
			stateManager.set({
				maxCalories
			});
		},
		
		setCalorieEntries(entries) {
			const totalCalories = entries.reduce((sum, e) => sum + (e.calories || 0), 0);
			
			stateManager.set({
				calorieEntries: entries,
				todayCalories: totalCalories
			});
		},
		
		setWeights(weights) {
			stateManager.set({
				weights
			});
		}
	}
};
