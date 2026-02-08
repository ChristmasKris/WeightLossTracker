export const weightsTemplates = {
	container(weights) {
		return `
			<div class="container">
				<h1>Weight</h1>
				<input type="number" id="weightInput" placeholder="Weight (kg)" step="0.01" min="0" required/>
				<button id="addWeightBtn" class="btn">Add entry</button>
			</div>
			<div class="weights">
				<h1>All entries</h1>
				<div class="weightsHolder">
					${weights && weights.length > 0 
						? weights.map(w => this.weightEntry(w)).join('')
						: '<div class="noWeights"><span>No entries</span></div>'
					}
				</div>
			</div>
		`;
	},
	
	weightEntry(weight) {
		const date = new Date(weight.timestamp);
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');
		const year = date.getFullYear();
		const formattedDate = `${month}-${day}-${year}`;
		return `
			<div class="weight-entry">
				<div class="weight-info">
					<span class="weight-value">${weight.weight} kg</span>
					<span class="weight-date">${formattedDate}</span>
				</div>
				<button class="deleteButton" data-weight-id="${weight.id}">Delete</button>
			</div>
		`;
	}
};
