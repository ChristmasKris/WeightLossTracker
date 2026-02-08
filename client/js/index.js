'use strict';

import { stateManager } from './core/stateManager.js';
import { errorHandler } from './core/errorHandler.js';
import { loginController } from './modules/login/controller.js';
import { loginRenderer } from './modules/login/renderer.js';
import { weightsController } from './modules/weights/controller.js';
import { weightsRenderer } from './modules/weights/renderer.js';
import { caloriesController } from './modules/calories/controller.js';
import { caloriesRenderer } from './modules/calories/renderer.js';
import { clientStorage } from './shared/clientStorage.js';
import { config } from './shared/config.js';

const scriptTag = document.querySelector('script[data-page]');
const currentPage = scriptTag?.getAttribute('data-page') || 'login';
errorHandler.init();
const storedKey = clientStorage.get(config.CLIENT_STORAGE_KEY_NAME);

const pageModules = {
	login: {
		controller: loginController,
		renderer: loginRenderer,
		requireAuth: false
	},
	calories: {
		controller: caloriesController,
		renderer: caloriesRenderer,
		requireAuth: true
	},
	weights: {
		controller: weightsController,
		renderer: weightsRenderer,
		requireAuth: true
	}
};

async function initApp() {
	try {
		if (currentPage === 'login') {
			if (storedKey) {
				window.location.href = 'calories.html';
				return;
			}
			loginRenderer.renderLoginForm();
			loginController.init();
			return;
		}
		
		if ((pageModules[currentPage]?.requireAuth) && (!storedKey)) {
			window.location.href = 'index.html';
			return;
		}
		
		if (storedKey) {
			stateManager.action.login(storedKey);
		}
		
		const module = pageModules[currentPage];
		
		if (!module) {
			console.error(`Unknown page: ${currentPage}`);
			return;
		}
		
		stateManager.subscribe(() => {
			module.renderer.render();
		}, 'currentPage');
		
		if (currentPage === 'calories') {
			stateManager.subscribe(() => {
				module.renderer.render();
			}, ['calorieEntries', 'maxCalories']);
		} else if (currentPage === 'weights') {
			stateManager.subscribe(() => {
				module.renderer.render();
			}, 'weights');
		}
		
		await module.controller.init();
		setupNavigation();
	} catch (error) {
		console.error('App initialization error:', error);
		alert('Failed to initialize app');
	}
}

function setupNavigation() {
	const navButtons = document.querySelectorAll('[data-page]');
	
	navButtons.forEach(btn => {
		btn.addEventListener('click', (e) => {
			const page = btn.getAttribute('data-page');
			
			if (page && (page !== currentPage)) {
				if (page === 'calories') {
					window.location.href = 'calories.html';
				} else if (page === 'weights') {
					window.location.href = 'weight.html';
				}
			}
		});
	});
}

initApp();