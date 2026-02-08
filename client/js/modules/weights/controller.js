import { stateManager } from '../../core/stateManager.js';
import { weightsApi } from './api.js';
import { weightsRenderer } from './renderer.js';
import { parse } from '../../shared/utils.js';

export const weightsController = {
	async init() {
		await this.loadData();
	},
	
	async loadData() {
		try {
			const weightsResult = await weightsApi.getAllWeights();
			
			if (weightsResult && weightsResult.success) {
				stateManager.action.setWeights(weightsResult.weights || []);
			}
			
			weightsRenderer.render();
			this.setupAddListener();
			this.setupDeleteListeners();
		} catch (error) {
			console.error('Failed to load weights data:', error);
		}
	},
	
	setupDeleteListeners() {
		const deleteButtons = document.querySelectorAll('[data-weight-id]');
		deleteButtons.forEach(btn => {
			btn.addEventListener('click', async (e) => {
				const weightId = parse.float(btn.getAttribute('data-weight-id'));
				if (!confirm('Delete this weight entry?')) return;
				
				try {
					const result = await weightsApi.deleteWeight(weightId);
					if (result && result.success && result.weightId) {
						stateManager.action.deleteWeightEntry(result.weightId);
					weightsRenderer.render();
					this.setupAddListener();
					this.setupDeleteListeners();
				} else {
						alert('Failed to delete weight');
					}
				} catch (error) {
					alert(`Error: ${error.message}`);
				}
			});
		});
	},
	
	setupAddListener() {
		const addWeightBtn = document.getElementById('addWeightBtn');
		if (addWeightBtn) {
			addWeightBtn.addEventListener('click', async () => {
				const weightInput = document.getElementById('weightInput');
				const weight = parse.float(weightInput?.value);
				
				if ((weight === null) || (weight <= 0)) {
					alert('Please enter a valid weight');
					return;
				}
				
				// Check if weight already exists for today
				const currentState = stateManager.get();
				const today = new Date().toDateString();
				const todayWeight = currentState.weights.find(w => {
					const weightDate = new Date(w.timestamp);
					return weightDate.toDateString() === today;
				});
				
				if (todayWeight) {
					alert('You already have a weight entry for today. Please delete it first before adding a new one.');
					return;
				}
				
				try {
					const result = await weightsApi.addWeight(weight);
					if (result && result.success && result.entry) {
						stateManager.action.addWeightEntry({
							id: result.entry.id,
							weight: result.entry.weight,
							timestamp: result.entry.timestamp
						});
						weightInput.value = '';
						weightsRenderer.render();
						this.setupAddListener();
						this.setupDeleteListeners();
					} else {
						alert('Failed to add weight');
					}
				} catch (error) {
					alert(`Error: ${error.message}`);
				}
			});
		}
	}
};
