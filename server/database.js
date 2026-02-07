'use strict';

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'database.json');

const readDB = () => {
	try {
		const data = fs.readFileSync(dbPath, 'utf-8');
		return JSON.parse(data);
	} catch (error) {
		return { entries: [], weights: [] };
	}
};

const writeDB = (db) => {
	fs.writeFileSync(dbPath, JSON.stringify(db, null, '\t'));
};

export const getEntries = () => {
	const db = readDB();
	return db.entries || [];
};

export const addEntry = (name, calories) => {
	const db = readDB();
	const entriesArray = db.entries || [];
	
	const maxId = entriesArray.length > 0 
		? Math.max(...entriesArray.map(e => e.id || 0))
		: 0;
	
	const newEntry = {
		id: maxId + 1,
		name,
		calories,
		timestamp: new Date().toISOString()
	};
	
	entriesArray.push(newEntry);
	db.entries = entriesArray;
	writeDB(db);
	return newEntry;
};

export const getTodayEntries = () => {
	const entries = getEntries();
	const today = new Date().toISOString().split('T')[0];
	
	return entries.filter(entry => {
		const entryDate = entry.timestamp.split('T')[0];
		return entryDate === today;
	});
};

export const deleteEntry = (entryId) => {
	const db = readDB();
	const entriesArray = db.entries || [];
	const filteredEntries = entriesArray.filter(entry => entry.id !== entryId);
	
	if (filteredEntries.length === entriesArray.length) {
		return false;
	}
	
	db.entries = filteredEntries;
	writeDB(db);
	return true;
};

// WEIGHTS
export const getTodayWeight = () => {
	const db = readDB();
	const weights = db.weights || [];
	const today = new Date().toISOString().split('T')[0];
	
	return weights.find(weight => {
		const weightDate = weight.timestamp.split('T')[0];
		return weightDate === today;
	}) || null;
};

export const addWeight = (weight) => {
	const db = readDB();
	const weights = db.weights || [];
	
	// Remove existing weight for today
	const today = new Date().toISOString().split('T')[0];
	db.weights = weights.filter(w => {
		const wDate = w.timestamp.split('T')[0];
		return wDate !== today;
	});
	
	const maxId = weights.length > 0 
		? Math.max(...weights.map(w => w.id || 0))
		: 0;
	
	const newWeight = {
		id: maxId + 1,
		weight,
		timestamp: new Date().toISOString()
	};
	
	db.weights.push(newWeight);
	writeDB(db);
	return newWeight;
};

export const getAllWeights = () => {
	const db = readDB();
	return (db.weights || []).sort((a, b) => 
		new Date(b.timestamp) - new Date(a.timestamp)
	);
};

export const deleteWeight = (weightId) => {
	const db = readDB();
	const weights = db.weights || [];
	const filteredWeights = weights.filter(weight => weight.id !== weightId);
	
	if (filteredWeights.length === weights.length) {
		return false;
	}
	
	db.weights = filteredWeights;
	writeDB(db);
	return true;
};

// MAX CALORIES
export const getMaxCalories = () => {
	const db = readDB();
	return (db.maxCalories || []).sort((a, b) => 
		new Date(b.timestamp) - new Date(a.timestamp)
	);
};

export const addMaxCalories = (maxCalories) => {
	const db = readDB();
	const maxCaloriesArray = db.maxCalories || [];
	
	const newEntry = {
		maxCalories,
		timestamp: new Date().toISOString()
	};
	
	maxCaloriesArray.push(newEntry);
	db.maxCalories = maxCaloriesArray;
	writeDB(db);
	return newEntry;
};

export const getCurrentMaxCalories = () => {
	const maxCaloriesArray = getMaxCalories();
	return maxCaloriesArray.length > 0 ? maxCaloriesArray[0].maxCalories : null;
};
