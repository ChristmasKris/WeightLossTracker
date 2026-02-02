'use strict';

import { getState, setState, actions } from './state.js';
import { api } from './api.js';
import { listener, strToEl, parse } from './utils.js';

let unsubscribe;

export const renderWeightScreen = async (appDiv) => {
	const response = await fetch('weight.html');
	const html = await response.text();
	appDiv.innerHTML = html;
	setupWeightEvents(appDiv);
	renderWeights();
};

const renderWeights = () => {
	const state = getState();
	const container = document.querySelector('.weightsHolder');
	
	if (!container) return;
	
	container.innerHTML = '';
	
	if (!state.weights || state.weights.length === 0) {
		container.appendChild(strToEl(`
			<div class="noWeights">
				<span>No entries</span>
			</div>
		`));
		return;
	}
	
	for (let weight of state.weights) {
		const date = new Date(weight.timestamp);
		const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
		
		let el = strToEl(`
			<div class="weight-entry">
				<div class="weight-info">
					<span class="weight-value">${weight.weight} kg</span>
					<span class="weight-date">${dateStr}</span>
				</div>
				<button class="deleteButton" data-weight-id="${weight.id}">Delete</button>
			</div>
		`);
		
		listener.add(el.querySelector('.deleteButton'), 'click', async (e) => {
			const weightId = parse.int(e.currentTarget.dataset.weightId);
			
			if (weightId === null) {
				alert('This weight entry does not have an ID');
				return;
			}
			
			const confirmed = confirm('Are you sure you want to delete this weight entry?');
			
			if (!confirmed) {
				return;
			}
			
			const state = getState();
			const success = await api.deleteWeight(weightId, state.auth.password);
			
			if (success) {
				await actions.fetchAllWeights();
				await actions.fetchTodayWeight();
				renderWeights();
			} else {
				alert('Failed to delete weight entry');
			}
		});
		
		container.appendChild(el);
	}
};

const setupWeightEvents = (appDiv) => {
	const addWeightBtn = appDiv.querySelector('#addWeightBtn');
	const weightInput = appDiv.querySelector('#weightInput');
	const navTracker = appDiv.querySelector('#navTracker');
	const navWeight = appDiv.querySelector('#navWeight');
	
	if (addWeightBtn) {
		listener.add(addWeightBtn, 'click', async () => {
			const state = getState();
			
			if (state.todayWeight) {
				alert('You already entered your weight today. Delete the existing weight first to be able to add a new one.');
				return;
			}
			
			let weight = parseFloat(weightInput.value);
			const password = state.auth.password;
			
			if (!weight || weight <= 0 || isNaN(weight)) {
				alert('Please enter a valid weight');
				return;
			}
			
			weight = Math.round(weight * 100) / 100;
			const success = await api.addWeight(weight, password);
			
			if (success) {
				await actions.fetchTodayWeight();
				await actions.fetchAllWeights();
				renderWeights();
				weightInput.value = '';
			} else {
				alert('Failed to save weight');
			}
		});
		
		weightInput.addEventListener('keypress', (e) => {
			if (e.key === 'Enter') {
				addWeightBtn.click();
			}
		});
	}
	
	if (navTracker) {
		navTracker.addEventListener('click', () => {
			setState({ ui: { currentScreen: 'tracker' } });
		});
	}
};
