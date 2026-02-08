import { stateManager } from '../../core/stateManager.js';
import { weightsTemplates } from './templates.js';

export const weightsRenderer = {
	render() {
		const mainContent = document.querySelector('main');
		if (!mainContent) {
			return;
		}
		
		const state = stateManager.get();
		const weights = state.weights || [];
		
		mainContent.innerHTML = '';
		
		const containerHTML = weightsTemplates.container(weights);
		
		if (typeof containerHTML === 'string') {
			const wrapper = document.createElement('div');
			wrapper.innerHTML = containerHTML;
			Array.from(wrapper.children).forEach(child => mainContent.appendChild(child));
		} else if (containerHTML) {
			mainContent.appendChild(containerHTML);
		}
	}
};
