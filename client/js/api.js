'use strict';

import { config } from './config.js';

export const api = {
	async authenticate(key) {
		try {
			const response = await fetch(`${config.API_URL}/auth`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					key
				})
			});
			
			const data = await response.json();
			return data.success;
		} catch (error) {
			console.error('Auth error:', error);
			return false;
		}
	},
	
	async addCalorieEntry(name, calories, key) {
		try {
			const response = await fetch(`${config.API_URL}/entry`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					name,
					calories,
					key
				})
			});
			
			const data = await response.json();
			return data.success;
		} catch (error) {
			console.error('Add entry error:', error);
			return false;
		}
	},
	
	async getTodayEntries() {
		try {
			const response = await fetch(`${config.API_URL}/getTodayEntries`, {
				method: 'GET'
			});
			
			const data = await response.json();
			return data.entries;
		} catch (error) {
			console.error('Get today entries error:', error);
			return false;
		}
	},
	
	async deleteEntry(entryId, key) {
		try {
			const response = await fetch(`${config.API_URL}/deleteEntry`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					entryId,
					key
				})
			});
			
			const data = await response.json();
			return data.success;
		} catch (error) {
			console.error('Delete entry error:', error);
			return false;
		}
	},
	
	async getTodayWeight() {
		try {
			const response = await fetch(`${config.API_URL}/getTodayWeight`, {
				method: 'GET'
			});
			
			const data = await response.json();
			return data.weight;
		} catch (error) {
			console.error('Get weight error:', error);
			return null;
		}
	},
	
	async addWeight(weight, key) {
		try {
			const response = await fetch(`${config.API_URL}/weight`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					weight,
					key
				})
			});
			
			const data = await response.json();
			return data.success;
		} catch (error) {
			console.error('Add weight error:', error);
			return false;
		}
	},
	
	async getAllWeights() {
		try {
			const response = await fetch(`${config.API_URL}/getAllWeights`, {
				method: 'GET'
			});
			
			const data = await response.json();
			return data.weights;
		} catch (error) {
			console.error('Get all weights error:', error);
			return [];
		}
	},
	
	async deleteWeight(weightId, key) {
		try {
			const response = await fetch(`${config.API_URL}/deleteWeight`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					weightId,
					key
				})
			});
			
			const data = await response.json();
			return data.success;
		} catch (error) {
			console.error('Delete weight error:', error);
			return false;
		}
	},
	
	async getCurrentMaxCalories() {
		try {
			const response = await fetch(`${config.API_URL}/getCurrentMaxCalories`, {
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