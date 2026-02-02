'use strict';

/**
* A client storage handler for storing and retrieving values with localStorage.
*/
export const clientStorage = {
	/**
	* Checks if clientStorage is available and accessible.
	* @returns {boolean} True if clientStorage is available, false otherwise.
	*/
	isAvailable() {
		try {
			const testName = '__clientStorage_test__';
			localStorage.setItem(testName, 'test');
			localStorage.removeItem(testName);
			return true;
		} catch (error) {
			console.warn('clientStorage test failed:', error.message);
			return false;
		}
	},
	
	/**
	* Retrieves a value from clientStorage.
	* @param {string} name The name of the value to retrieve.
	* @returns {*} The value associated with the given name, or null if not found or on error.
	*/
	get(name) {
		if (!this.isAvailable()) {
			console.warn('clientStorage is not available');
			return null;
		}
		
		try {
			const item = localStorage.getItem(name);
			return item !== null ? JSON.parse(item) : null;
		} catch (error) {
			console.error(`Error retrieving clientStorage item "${name}":`, error);
			return null;
		}
	},
	
	/**
	* Stores a value in clientStorage.
	* @param {string} name The name under which the value will be stored.
	* @param {*} value The value to store.
	* @returns {boolean} True if the value was successfully stored, false otherwise.
	*/
	set(name, value) {
		if (!this.isAvailable()) {
			console.warn('clientStorage is not available');
			return false;
		}
		
		try {
			localStorage.setItem(name, JSON.stringify(value));
			return true;
		} catch (error) {
			console.error(`Error storing clientStorage item "${name}":`, error);
			
			if (error.name === 'QuotaExceededError') {
				console.warn('clientStorage quota exceeded. Consider clearing some data.');
			}
			
			return false;
		}
	},
	
	/**
	* Removes a value from clientStorage.
	* @param {string} name The name of the value to remove.
	* @returns {boolean} True if the value was successfully removed, false otherwise.
	*/
	remove(name) {
		if (!this.isAvailable()) {
			console.warn('clientStorage is not available');
			return false;
		}
		
		try {
			localStorage.removeItem(name);
			return true;
		} catch (error) {
			console.error(`Error removing clientStorage item "${name}":`, error);
			return false;
		}
	},
	
	/**
	* Clears all data from clientStorage.
	* @returns {boolean} True if clientStorage was successfully cleared, false otherwise.
	*/
	clear() {
		if (!this.isAvailable()) {
			console.warn('clientStorage is not available');
			return false;
		}
		
		try {
			localStorage.clear();
			return true;
		} catch (error) {
			console.error('Error clearing clientStorage:', error);
			return false;
		}
	}
};