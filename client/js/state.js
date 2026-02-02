'use strict';

import { clientStorage } from './clientStorage.js';
import { api } from './api.js';

const STORAGE_KEY = 'calorie_tracker_password';

const state = {
	auth: {
		password: null,
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

const observers = [];

export const subscribe = (callback) => {
	observers.push(callback);
	
	return () => {
		const index = observers.indexOf(callback);
		
		if (index > -1) {
			observers.splice(index, 1);
		}
	};
};

const notify = () => {
	observers.forEach(callback => callback(state));
};

export const getState = () => {
	return { ...state };
};

export const setState = (updates) => {
	if (updates.auth) {
		Object.assign(state.auth, updates.auth);
	}
	
	if (updates.ui) {
		Object.assign(state.ui, updates.ui);
	}
	
	if (updates.input) {
		Object.assign(state.input, updates.input);
	}
	
	if (updates.entries) {
		state.entries = updates.entries;
	}
	
	if (updates.todayCalories) {
		state.todayCalories = updates.todayCalories;
	}
	
	if (updates.todayWeight !== undefined) {
		state.todayWeight = updates.todayWeight;
	}
	
	if (updates.weights) {
		state.weights = updates.weights;
	}
	
	if (updates.maxCalories !== undefined) {
		state.maxCalories = updates.maxCalories;
	}
	
	notify();
};

export const actions = {
	init: () => {
		const password = clientStorage.get(STORAGE_KEY);
		
		if (password) {
			setState({
				auth: { password, isAuthenticated: true },
				ui: { currentScreen: 'tracker' }
			});
		}
	},
	
	login: (password) => {
		clientStorage.set(STORAGE_KEY, password);
		
		setState({
			auth: { password, isAuthenticated: true },
			ui: { currentScreen: 'tracker', error: null }
		});
	},
	
	fetchTodayEntries: async () => {
		const entries = await api.getTodayEntries();
		const todayCalories = entries.reduce((sum, item) => {
			return sum + (Number(item.calories) || 0);
		}, 0);
		
  		setState({
			entries,
			todayCalories
		});
	},
	
	fetchTodayWeight: async () => {
		const weight = await api.getTodayWeight();
		setState({ todayWeight: weight });
	},
	
	fetchAllWeights: async () => {
		const weights = await api.getAllWeights();
		setState({ weights });
	},
	
	fetchMaxCalories: async () => {
		const maxCalories = await api.getCurrentMaxCalories();
		setState({ maxCalories });
	}
};