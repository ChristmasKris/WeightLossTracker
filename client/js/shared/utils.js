'use strict';

function logError(message, data = {}) {
	console.error(`[ERROR] ${message}`, data);
}

export const listener = {
	functions: {},
	
	add(arg1, arg2, arg3, arg4) {
		let name = false, elementsInput, eventsInput, callback, id;
		
		if ((typeof arg1 === 'object') || ((typeof arg1 === 'string') && (['#', '.'].includes(arg1.charAt(0))))) {
			elementsInput = arg1;
			eventsInput = arg2;
			callback = arg3;
		} else {
			name = arg1;
			elementsInput = arg2;
			eventsInput = arg3;
			callback = arg4;
		}
		
		if ((elementsInput === undefined) || (elementsInput === null)) {
			logError('listener.add(): Elements input is missing or invalid.', { elements: elementsInput });
			return false;
		}
		
		let elementsList;
		
		if (typeof elementsInput === 'string') {
			try {
				elementsList = Array.from(document.querySelectorAll(elementsInput));
			} catch (_) {
				logError('listener.add(): Invalid selector string.', { elements: elementsInput });
				return false;
			}
		} else if ((elementsInput === window) || (elementsInput === document)) {
			elementsList = [elementsInput];
		} else if ((elementsInput) && ((elementsInput.nodeType === 1) || (elementsInput.nodeType === 9))) {
			elementsList = [elementsInput];
		} else if (Array.isArray(elementsInput)) {
			elementsList = elementsInput;
		} else if (typeof elementsInput.length === 'number') {
			elementsList = Array.from(elementsInput);
		} else {
			elementsList = [elementsInput];
		}
		
		if (!elementsList || (elementsList.length === 0)) {
			return false;
		}
		
		let eventsList = Array.isArray(eventsInput) ? eventsInput : [eventsInput];
		
		if ((!eventsList) || (eventsList.length === 0) || (eventsList.some((ev) => (typeof ev !== 'string') || (ev.trim() === '')))) {
			logError('listener.add(): Events input is missing or invalid.', { events: eventsInput });
			return false;
		}
		
		if (typeof callback !== 'function') {
			logError('listener.add(): Callback is not a function.', { callback });
			return false;
		}
		
		if (listener.functions[name] !== undefined) {
			logError('listener.add(): Listener with this name already exists.', { name });
			return false;
		}
		
		if (name === false) {
			do {
				id = `listener_${Math.random().toString(36).substr(2, 9)}`;
			} while (listener.functions[id] !== undefined);
			name = id;
		}
		
		listener.functions[name] = {
			elements: elementsList,
			function: callback,
			events: eventsList
		};
		
		for (const element of elementsList) {
			for (const eventName of eventsList) {
				element.addEventListener(eventName, callback);
			}
		}
		
		return true;
	},
	
	remove(name) {
		if ((typeof name !== 'string') || (name.trim() === '')) {
			logError('listener.remove(): Name must be a non-empty string.', { name });
			return false;
		}
		
		if (listener.functions[name] === undefined) {
			logError('listener.remove(): Listener with this name does not exist.', { name });
			return false;
		}
		
		const record = listener.functions[name];
		const elementsList = Array.isArray(record.elements) ? record.elements : [record.elements];
		const eventsList = Array.isArray(record.events) ? record.events : [record.events];
		
		for (const element of elementsList) {
			for (const eventName of eventsList) {
				element.removeEventListener(eventName, record.function);
			}
		}
		
		delete listener.functions[name];
		return true;
	}
};

export function strToEl(input) {
	if (typeof input !== 'string') {
		logError('strToEl(): Input is not a string.', { input });
		return null;
	}
	
	input = input.trim();
	
	if (!input) {
		logError('strToEl(): Input is empty after trim.', { input });
		return null;
	}
	
	let templateElement;
	
	try {
		templateElement = document.createElement('template');
	} catch (error) {
		logError('strToEl(): Failed to create template element.', { error });
		return null;
	}
	
	try {
		templateElement.innerHTML = input;
	} catch (error) {
		logError('strToEl(): Failed to set innerHTML on template.', { error });
		return null;
	}
	
	const content = templateElement.content;
	const elementList = Array.from(content.children);
	
	if (elementList.length === 0) {
		logError('strToEl(): No element nodes found in input.', { string: input });
		return null;
	}
	
	if (elementList.length === 1) {
		return elementList[0];
	}
	
	const fragment = document.createDocumentFragment();
	
	for (const element of elementList) {
		fragment.appendChild(element);
	}
	
	return fragment;
}

export const parse = {
	int(value) {
		if ((value === null) || (value === undefined) || (typeof value === 'boolean') || (typeof value === 'object')) {
			return null;
		}
		
		if (typeof value === 'string') {
			const trimmed = value.trim();
			if (!trimmed) return null;
			
			const match = trimmed.match(/^[+-]?\d+/);
			if (!match) {
				return null;
			}
			value = match[0];
		}
		
		const number = Number(value);
		if ((!Number.isFinite(number)) || (!Number.isInteger(number)) || (!Number.isSafeInteger(number))) {
			return null;
		}
		
		return number;
	},
	
	float(value) {
		if ((value === null) || (value === undefined) || (typeof value === 'boolean') || (typeof value === 'object')) {
			return null;
		}
		
		if (typeof value === 'string') {
			const trimmed = value.trim();
			if (!trimmed) {
				return null;
			}
			if (trimmed.includes(',')) {
				return null;
			}
			
			const match = trimmed.match(/^[+-]?\d+(\.\d+)?/);
			if (!match) {
				return null;
			}
			value = match[0];
		}
		
		const number = Number(value);
		if (!Number.isFinite(number)) {
			return null;
		}
		
		return number;
	},
	
	string(value) {
		if ((value === null) || (value === undefined) || (typeof value === 'boolean') || (typeof value === 'object') || (typeof value === 'function') || (typeof value === 'symbol')) {
			return null;
		}
		
		if (typeof value === 'string') {
			const trimmed = value.trim();
			if (!trimmed) {
				return null;
			}
			return trimmed;
		}
		
		if (typeof value === 'number') {
			if (!Number.isFinite(value)) {
				return null;
			}
			return String(value);
		}
		
		if (typeof value === 'bigint') {
			return value.toString();
		}
		
		return null;
	},
	
	stringOrDefault(value, defaultValue = null) {
		const parsedValue = parse.string(value);
		return parsedValue === null ? defaultValue : parsedValue;
	},
	
	intOrDefault(value, defaultValue = null) {
		const parsedValue = parse.int(value);
		return parsedValue === null ? defaultValue : parsedValue;
	},
	
	floatOrDefault(value, defaultValue = null) {
		const parsedValue = parse.float(value);
		return parsedValue === null ? defaultValue : parsedValue;
	}
};
