'use strict';

const API_URL = 'http://192.168.0.100:3000/api';

export const api = {
	authenticate: async (password) => {
		try {
			const response = await fetch(`${API_URL}/auth`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ password })
			});
			
			const data = await response.json();
			return data.success;
		} catch (error) {
			console.error('Auth error:', error);
			return false;
		}
	},
	
	addEntry: async (name, calories, password) => {
		try {
			const response = await fetch(`${API_URL}/entry`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name, calories, password })
			});
			
			const data = await response.json();
			return data.success;
		} catch (error) {
			console.error('Add entry error:', error);
			return false;
		}
	},
	
	getTodayEntries: async () => {
		try {
			const response = await fetch(`${API_URL}/getTodayEntries`, {
				method: 'GET'
			});
			
			const data = await response.json();
			return data.entries;
		} catch (error) {
			console.error('Get today entries error:', error);
			return false;
		}
	},
	
	deleteEntry: async (entryId, password) => {
		try {
			const response = await fetch(`${API_URL}/deleteEntry`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ entryId, password })
			});
			
			const data = await response.json();
			return data.success;
		} catch (error) {
			console.error('Delete entry error:', error);
			return false;
		}
	},
	
	getTodayWeight: async () => {
		try {
			const response = await fetch(`${API_URL}/getTodayWeight`, {
				method: 'GET'
			});
			
			const data = await response.json();
			return data.weight;
		} catch (error) {
			console.error('Get weight error:', error);
			return null;
		}
	},
	
	addWeight: async (weight, password) => {
		try {
			const response = await fetch(`${API_URL}/weight`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ weight, password })
			});
			
			const data = await response.json();
			return data.success;
		} catch (error) {
			console.error('Add weight error:', error);
			return false;
		}
	},
	
	getAllWeights: async () => {
		try {
			const response = await fetch(`${API_URL}/getAllWeights`, {
				method: 'GET'
			});
			
			const data = await response.json();
			return data.weights;
		} catch (error) {
			console.error('Get all weights error:', error);
			return [];
		}
	},
	
	deleteWeight: async (weightId, password) => {
		try {
			const response = await fetch(`${API_URL}/deleteWeight`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ weightId, password })
			});
			
			const data = await response.json();
			return data.success;
		} catch (error) {
			console.error('Delete weight error:', error);
			return false;
		}
	},
	
	getCurrentMaxCalories: async () => {
		try {
			const response = await fetch(`${API_URL}/getCurrentMaxCalories`, {
				method: 'GET'
			});
			
			const data = await response.json();
			return data.maxCalories;
		} catch (error) {
			console.error('Get max calories error:', error);
			return null;
		}
	}
};