'use strict';

export const caloriesTemplates = {
	container(entries, totalCalories, maxCalories) {
		return `
			<div class="container">
				<h1>Calories</h1>
				<input type="text" id="foodName" placeholder="Consumable name" required/>
				<input type="number" id="calorieAmount" placeholder="Calories" step="1" min="0" required/>
				<button id="addEntryBtn">Add entry</button>
			</div>
			<div class="entries">
				<h1>Today's entries</h1>
				<span class="todayCalories">${totalCalories} / ${maxCalories} kcal</span>
				<div class="progress">
					<div class="bar" style="width: ${Math.min((totalCalories / maxCalories) * 100, 100)}%"></div>
				</div>
				<div class="entriesHolder">
					${entries && entries.length > 0 
						? entries.map(e => this.entryCard(e)).join('')
						: '<div class="noEntries"><span>No entries</span></div>'
					}
				</div>
			</div>
		`;
	},
	
	entryCard(entry) {
		return `
			<div class="entry">
				<span class="name">${entry.food}</span>
				<span class="calories">${entry.calories} kcal</span>
				<button class="deleteButton" data-entry-id="${entry.id}">Delete</button>
			</div>
		`;
	}
};