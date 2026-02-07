'use strict';

import { renderLoginScreen } from './login.js';
import { renderCaloriesScreen } from './calories.js';
import { renderWeightScreen } from './weight.js';
import { stateManager } from './stateManager.js';

const appDiv = document.getElementById('app');

const render = async (state) => {
	if (state.ui.currentScreen === 'login') {
		await renderLoginScreen(appDiv);
	} else if (state.ui.currentScreen === 'tracker') {
		await renderCaloriesScreen(appDiv);
	} else if (state.ui.currentScreen === 'weight') {
		await renderWeightScreen(appDiv);
	}
};

const init = async () => {
	stateManager.action.init();
	await stateManager.action.fetchTodayEntries();
	await stateManager.action.fetchTodayWeight();
	await stateManager.action.fetchAllWeights();
	await stateManager.action.fetchMaxCalories();
	
	stateManager.subscribe((state) => {
		render(state);
	});
	
	const state = stateManager.get();
	await render(state);
};

init();