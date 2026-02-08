'use strict';

import { stateManager } from '../../core/stateManager.js';
import { caloriesTemplates } from './templates.js';

export const caloriesRenderer = {
	render() {
		const mainContent = document.querySelector('main');
		const state = stateManager.get();
		const entries = state.calorieEntries || [];
		const maxCalories = state.maxCalories || 2000;
		const totalCalories = entries.reduce((sum, entry) => sum + (entry.calories || 0), 0);
		mainContent.innerHTML = '';
		const containerHTML = caloriesTemplates.container(entries, totalCalories, maxCalories);
		
		if (typeof containerHTML === 'string') {
			const wrapper = document.createElement('div');
			wrapper.innerHTML = containerHTML;
			Array.from(wrapper.children).forEach(child => mainContent.appendChild(child));
		} else if (containerHTML) {
			mainContent.appendChild(containerHTML);
		}
	}
};