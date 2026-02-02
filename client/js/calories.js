'use strict';

import { listener, strToEl, parse } from './utils.js';
import { api } from './api.js';
import { getState, setState } from './state.js';

export const renderCaloriesScreen = async (appDiv) => {
	const response = await fetch('calories.html');
	const html = await response.text();
	appDiv.innerHTML = html;
	setupCaloriesEvents();
};

const renderEntries = (entries, container, totalCaloriesDisplay) => {
	const state = getState();
	container.innerHTML = '';
	totalCaloriesDisplay.textContent = `${state.todayCalories} / ${state.maxCalories} kcal`;
	
	if (!entries || entries.length === 0) {
		container.appendChild(strToEl(`
			<div class="noEntries">
				<span>No entries</span>
			</div>
		`));
		
		return;
	}
	
	// Sort entries by timestamp in descending order (most recent first)
	const sortedEntries = [...entries].sort((a, b) => 
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
			
			const state = getState();
			const success = await api.deleteEntry(entryId, state.auth.password);
			
			if (success) {
				const entries = await api.getTodayEntries();
				renderEntries(entries, container, totalCaloriesDisplay);
			} else {
				alert('Failed to delete entry');
			}
		});
		
		container.appendChild(el);
	}
};

const setupCaloriesEvents = () => {
	const addEntryBtn = document.getElementById('addEntryBtn');
	const foodNameInput = document.getElementById('foodName');
	const calorieAmountInput = document.getElementById('calorieAmount');
	const entriesHolder = document.querySelector('.entriesHolder');
	const totalCaloriesDisplay = document.querySelector('.todayCalories');
	const navTracker = document.getElementById('navTracker');
	const navWeight = document.getElementById('navWeight');
	const state = getState();
	renderEntries(state.entries, entriesHolder, totalCaloriesDisplay);
	
	const handleEntry = async () => {
		const name = foodNameInput.value.trim();
		const calories = parseInt(calorieAmountInput.value);
		const state = getState();
		const password = state.auth.password;
		
		if (!name || !calories) {
			alert('Please fill in all fields');
			return;
		}
		
		if (calories === 0 || isNaN(calories)) {
			alert('Calories must be a valid number');
			return;
		}
		
		const success = await api.addEntry(name, calories, password);
		
		if (success) {
			foodNameInput.value = '';
			calorieAmountInput.value = '';
			const entries = await api.getTodayEntries();
			const todayCalories = entries.reduce((sum, item) => {
				return sum + (Number(item.calories) || 0);
			}, 0);
			
			setState({
				entries,
				todayCalories
			});
			renderEntries(entries, entriesHolder, totalCaloriesDisplay);
		} else {
			alert('Failed to save entry');
		}
	};
	
	const handleKeyPress = (e) => {
		if (e.key === 'Enter' && foodNameInput.value.trim() && calorieAmountInput.value) {
			handleEntry();
		}
	};
	
	listener.add(addEntryBtn, 'click', handleEntry);
	listener.add(foodNameInput, 'keypress', handleKeyPress);
	listener.add(calorieAmountInput, 'keypress', handleKeyPress);
	
	if (navWeight) {
		navWeight.addEventListener('click', () => {
			setState({ ui: { currentScreen: 'weight' } });
		});
	}
};
