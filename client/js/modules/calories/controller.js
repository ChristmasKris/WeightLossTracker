import { stateManager } from '../../core/stateManager.js';
import { caloriesApi } from './api.js';
import { caloriesRenderer } from './renderer.js';
import { parse } from '../../shared/utils.js';

export const caloriesController = {
	async init() {
		await this.loadData();
	},
	
	async loadData() {
		try {
			const [entriesResult, maxCaloriesResult] = await Promise.all([
				caloriesApi.getTodayEntries(),
				caloriesApi.getMaxCalories()
			]);
			
			if (entriesResult && entriesResult.success) {
				const normalizedEntries = (entriesResult.entries || []).map(entry => ({
					...entry,
					food: entry.food ?? entry.name
				})).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
				stateManager.action.setCalorieEntries(normalizedEntries);
			}
			
			if (maxCaloriesResult && maxCaloriesResult.success) {
				stateManager.action.setMaxCalories(maxCaloriesResult.maxCalories);
			}
			
			caloriesRenderer.render();		this.setupAddListener();			this.setupDeleteListeners();
		} catch (error) {
			console.error('Failed to load calorie data:', error);
		}
	},
	
	setupDeleteListeners() {
		const deleteButtons = document.querySelectorAll('[data-entry-id]');
		deleteButtons.forEach(btn => {
			btn.addEventListener('click', async (e) => {
				const entryId = parse.int(btn.getAttribute('data-entry-id'));
				if (!confirm('Delete this entry?')) return;
				
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
		});
	},
	
	setupAddListener() {
		const addEntryBtn = document.getElementById('addEntryBtn');
		if (addEntryBtn) {
			addEntryBtn.addEventListener('click', async () => {
				const foodInput = document.getElementById('foodName');
				const caloriesInput = document.getElementById('calorieAmount');
				
				const food = foodInput?.value?.trim();
				const calories = parse.int(caloriesInput?.value);
				
				if ((!food) || (calories === null) || (calories <= 0)) {
					alert('Please enter valid food name and calorie amount');
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
	}
};
