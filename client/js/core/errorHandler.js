'use strict';

import { listener } from '../shared/utils.js';
import { stateManager } from './stateManager.js';

export const errorHandler = {
	init() {
		listener.add(window, 'unhandledrejection', (e) => {
			this.handleError(e.reason);
			e.preventDefault();
		});
		
		listener.add(window, 'error', (e) => {
			this.handleError(e.error);
			e.preventDefault();
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