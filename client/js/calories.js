'use strict';

import { listener, strToEl, parse } from './utils.js';
import { stateManager } from './stateManager.js';

let ui = {};

export async function renderCaloriesScreen(appDiv) {
	const response = await fetch('calories.html');
	const html = await response.text();
	appDiv.innerHTML = html;
	
	ui = {
		addEntryBtn: document.getElementById('addEntryBtn'),
		foodNameInput: document.getElementById('foodName'),
		calorieAmountInput: document.getElementById('calorieAmount'),
		entriesHolder: document.querySelector('.entriesHolder'),
		totalCaloriesDisplay: document.querySelector('.todayCalories'),
		navWeight: document.getElementById('navWeight')
	};
	
	renderEntries();
	
	listener.add(addEntryBtn, 'click', addNewEntry);
	listener.add(foodNameInput, 'keypress', inputKeyPress);
	listener.add(calorieAmountInput, 'keypress', inputKeyPress);
	listener.add(navWeight, 'click', changePage);
};

function renderEntries() {
	const state = stateManager.get();
	ui.entriesHolder.innerHTML = '';
	ui.totalCaloriesDisplay.textContent = `${state.todayCalories} / ${state.maxCalories} kcal`;
	
	if (!state.entries || (state.entries.length === 0)) {
		ui.entriesHolder.appendChild(strToEl(`
			<div class="noEntries">
				<span>No entries</span>
			</div>
		`));
		
		return;
	}
	
	const sortedEntries = [...state.entries].sort((a, b) => 
		new Date(b.timestamp) - new Date(a.timestamp)
	);
	
	for (let entry of sortedEntries) {
		let el = strToEl(`
			<div class="entry">
				<span class="name">${entry.name}</span>
				<span class="calories">${entry.calories} kcal</span>
				<button class="deleteButton" data-entry-id="${entry.id}">Delete</button>
			</div>
		`);
		
		listener.add(el.querySelector('.deleteButton'), 'click', async (e) => {
			const entryId = parse.int(e.currentTarget.dataset.entryId);
			
			if (entryId === null) {
				alert('This entry does not have an ID');
				return;
			}
			
			const confirmed = confirm('Are you sure that you want to delete this entry?');
			
			if (!confirmed) {
				return;
			}
			
			if (await stateManager.action.deleteCalorieEntry(entryId)) {
				renderEntries();
			} else {
				alert('Failed to delete entry');
			}
		});
		
		ui.entriesHolder.appendChild(el);
	}
};

async function addNewEntry() {
	const name = parse.string(ui.foodNameInput.value);
	const calories = parse.int(ui.calorieAmountInput.value);
	
	if ((name === null) || (calories === null)) {
		alert('Please fill in all fields');
		return;
	}
	
	if (calories < 0) {
		alert('Calories must be 0 or above');
		return;
	}
	
	if (await stateManager.action.addCalorieEntry(name, calories)) {
		ui.foodNameInput.value = '';
		ui.calorieAmountInput.value = '';
	} else {
		alert('Failed to save entry');
	}
}

function inputKeyPress(e) {
	if ((e.key === 'Enter') && foodNameInput.value.trim() && calorieAmountInput.value) {
		handleEntry();
	}
}

function changePage() {
	stateManager.action.changeScreen('weight');
}