export const loginTemplates = {
	loginForm() {
		return `
			<div class="login-container">
				<h1>Calorie Tracker</h1>
				<form id="login-form" class="login-form">
					<div class="form-group">
						<label for="login-key">Access Key:</label>
						<input 
							type="password" 
							id="login-key" 
							class="input-field"
							placeholder="Enter your access key"
							autocomplete="off"
							required
						/>
					</div>
					<button type="submit" class="btn btn-primary">Login</button>
				</form>
			</div>
		`;
	}
};
