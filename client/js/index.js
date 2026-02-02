'use strict';

import { renderLoginScreen } from './login.js';
import { renderCaloriesScreen } from './calories.js';
import { renderWeightScreen } from './weight.js';
import { getState, subscribe, actions } from './state.js';

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
	actions.init();
	await actions.fetchTodayEntries();
	await actions.fetchTodayWeight();
	await actions.fetchAllWeights();
	await actions.fetchMaxCalories();
	
	subscribe((state) => {
		render(state);
	});
	
	const state = getState();
	await render(state);
};

init();
