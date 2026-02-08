'use strict';

import { stateManager } from './stateManager.js';

export const errorHandler = {
	init() {
		window.addEventListener('unhandledrejection', (event) => {
			this.handleError(event.reason);
			event.preventDefault();
		});

		window.addEventListener('error', (event) => {
			this.handleError(event.error);
			event.preventDefault();
		});
	},

	handleError(error, context = {}) {
		console.error('Error caught:', error, context);

		const userMessage = this.getUserMessage(error);
		stateManager.set({
			ui: {
				error: userMessage
			}
		});

		setTimeout(() => {
			stateManager.set({ ui: { error: null } });
		}, 5000);
	},

	getUserMessage(error) {
		if (error.message?.includes('fetch')) {
			return 'Network error. Please check your connection.';
		}
		if (error.message?.includes('401')) {
			return 'Session expired. Please log in again.';
		}
		return 'Something went wrong. Please try again.';
	}
};
