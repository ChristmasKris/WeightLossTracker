'use strict';

import { listener, strToEl, parse } from './utils.js';
import { stateManager } from './stateManager.js';

let ui = {};

export async function renderWeightScreen(appDiv) {
	const response = await fetch('weight.html');
	const html = await response.text();
	appDiv.innerHTML = html;
	
	ui = {
		addWeightBtn: document.getElementById('addWeightBtn'),
		weightInput: document.getElementById('weightInput'),
		weightsHolder: document.querySelector('.weightsHolder'),
		navTracker: document.getElementById('navTracker'),
		navWeight: document.getElementById('navWeight')
	};
	
	renderWeights();
	
	listener.add(ui.addWeightBtn, 'click', addNewWeight);
	listener.add(ui.weightInput, 'keypress', inputKeyPress);
	listener.add(ui.navTracker, 'click', changePage);
}

function renderWeights() {
	const state = stateManager.get();
	ui.weightsHolder.innerHTML = '';
	
	if (!state.weights || (state.weights.length === 0)) {
		ui.weightsHolder.appendChild(strToEl(`
			<div class="noWeights">
				<span>No entries</span>
			</div>
		`));
		return;
	}
	
	const sortedWeights = [...state.weights].sort((a, b) =>
		new Date(b.timestamp) - new Date(a.timestamp)
	);
	
	for (let weight of sortedWeights) {
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
			
			if (await stateManager.action.deleteWeight(weightId)) {
				renderWeights();
			} else {
				alert('Failed to delete weight entry');
			}
		});
		
		ui.weightsHolder.appendChild(el);
	}
}

async function addNewWeight() {
	const state = stateManager.get();
	
	if (state.todayWeight) {
		alert('You already entered your weight today. Delete the existing weight first to be able to add a new one.');
		return;
	}
	
	const weight = parse.float(ui.weightInput.value);
	
	if ((weight === null) || (weight <= 0)) {
		alert('Please enter a valid weight');
		return;
	}
	
	const roundedWeight = Math.round(weight * 100) / 100;
	
	if (await stateManager.action.addWeight(roundedWeight)) {
		ui.weightInput.value = '';
	} else {
		alert('Failed to save weight');
	}
}

function inputKeyPress(e) {
	if ((e.key === 'Enter') && ui.weightInput.value.trim()) {
		addNewWeight();
	}
}

function changePage() {
	stateManager.action.changeScreen('tracker');
}