'use strict';

import { stateManager } from '../../core/stateManager.js';
import { caloriesApi } from './api.js';
import { caloriesRenderer } from './renderer.js';
import { parse, listener } from '../../shared/utils.js';

export const caloriesController = {
	async init() {
		await this.loadData();
	},
	
	async loadData() {
		try {
			const [entries, maxCalories] = await Promise.all([
				caloriesApi.getTodayEntries(),
				caloriesApi.getMaxCalories()
			]);
			
			if (entries && entries.success) {
				const normalizedEntries = (entries.entries || []).map(entry => ({
					...entry,
					food: entry.food ?? entry.name
				})).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
				stateManager.action.setCalorieEntries(normalizedEntries);
			}
			
			if (maxCalories && maxCalories.success) {
				stateManager.action.setMaxCalories(maxCalories.maxCalories);
			}
			
			caloriesRenderer.render();
			this.setupAddListener();
			this.setupDeleteListeners();
		} catch (error) {
			console.error('Failed to load calorie data:', error);
		}
	},
	
	setupDeleteListeners() {
		listener.add('.deleteButton', 'click', async (e) => {
			const entryId = parse.int(e.currentTarget.dataset.entryId);
			
			if (!confirm('Delete this entry?')) {
				return;
			}
			
			try {
				const result = await caloriesApi.deleteEntry(entryId);
				
				if (result && result.success && result.entryId) {
					stateManager.action.deleteCalorieEntry(result.entryId);
					caloriesRenderer.render();
					this.setupAddListener();
					this.setupDeleteListeners();
				} else {
					alert('Failed to delete entry');
				}
			} catch (error) {
				alert(`Error: ${error.message}`);
			}
		});
	},
	
	setupAddListener() {
		listener.add('.addEntryButton', 'click', async () => {
			const foodInput = document.getElementById('foodName');
			const caloriesInput = document.getElementById('calorieAmount');
			const food = foodInput?.value?.trim();
			const calories = parse.int(caloriesInput?.value);
			
			if (!food || (calories === null) || (calories <= 0)) {
				alert('Please enter a valid consumable and a valid calorie amount');
				return;
			}
			
			try {
				const result = await caloriesApi.addEntry(food, calories);
				
				if (result && result.success && result.entry) {
					stateManager.action.addCalorieEntry({
						id: result.entry.id,
						food: result.entry.name,
						calories: result.entry.calories,
						date: result.entry.timestamp
					});
					
					foodInput.value = '';
					caloriesInput.value = '';
					caloriesRenderer.render();
					this.setupAddListener();
					this.setupDeleteListeners();
				} else {
					alert('Failed to add entry');
				}
			} catch (error) {
				alert(`Error: ${error.message}`);
			}
		});
	}
};