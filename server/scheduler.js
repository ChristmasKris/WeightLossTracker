'use strict';

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { calcMaxCalories } from './utils.js';
import { addMaxCalories, getMaxCalories, getAllWeights } from './database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const userPath = path.join(__dirname, 'user.json');

const readUser = () => {
	try {
		const data = fs.readFileSync(userPath, 'utf-8');
		return JSON.parse(data);
	} catch (error) {
		console.error('Error reading user.json:', error);
		return null;
	}
};

const calculateAge = (birthDateStr) => {
	const birthDate = new Date(birthDateStr);
	const today = new Date();
	let age = today.getFullYear() - birthDate.getFullYear();
	const monthDiff = today.getMonth() - birthDate.getMonth();
	
	if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
		age--;
	}
	
	return age;
};

const getLatestWeight = () => {
	const weights = getAllWeights();
	const recentWeights = weights.slice(0, 7);
	
	if (recentWeights.length === 0) {
		return null;
	}
	
	const totalWeight = recentWeights.reduce((sum, w) => sum + w.weight, 0);
	const averageWeight = totalWeight / recentWeights.length;
	return Math.round(averageWeight * 100) / 100; // Round to 2 decimals
};

export const calculateAndSaveMaxCalories = () => {
	const user = readUser();
	
	if (!user) {
		console.error('Cannot calculate max calories: user.json not found or invalid');
		return;
	}
	
	const latestWeight = getLatestWeight();
	
	if (!latestWeight) {
		console.error('Cannot calculate max calories: no weight entries found');
		return;
	}
	
	const ageYears = calculateAge(user.birthDate);
	
	const maxCalories = calcMaxCalories({
		sex: user.gender,
		ageYears,
		heightCm: user.heightCm,
		weightKg: latestWeight,
		activity: user.activity
	});
	
	addMaxCalories(maxCalories);
	console.log(`Max calories calculated and saved: ${maxCalories} kcal at ${new Date().toISOString()}`);
};

const getClosestSunday17 = (fromDate) => {
	const target = new Date(fromDate);
	const result = new Date(target);
	result.setHours(17, 0, 0, 0);
	const currentDay = result.getDay();
	const daysSinceSunday = currentDay;
	const daysUntilSunday = currentDay === 0 ? 0 : (7 - currentDay);
	
	if (currentDay === 0) {
		return result;
	} else if (daysSinceSunday <= 3) {
		result.setDate(result.getDate() - daysSinceSunday);
	} else {
		result.setDate(result.getDate() + daysUntilSunday);
	}
	
	return result;
};

const scheduleNext = () => {
	const existingEntries = getMaxCalories();
	let nextRun;
	
	if (existingEntries.length > 0) {
		const lastEntry = new Date(existingEntries[0].timestamp);
		const twoWeeksLater = new Date(lastEntry);
		twoWeeksLater.setDate(twoWeeksLater.getDate() + 14);
		nextRun = getClosestSunday17(twoWeeksLater);
	} else {
		const twoWeeksFromNow = new Date();
		twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() + 14);
		nextRun = getClosestSunday17(twoWeeksFromNow);
	}
	
	const now = new Date();
	const msUntilNext = nextRun - now;
	
	console.log(`Next max calories calculation scheduled for: ${nextRun.toISOString()}`);
	
	setTimeout(() => {
		calculateAndSaveMaxCalories();
		scheduleNext();
	}, msUntilNext);
};

export const initScheduler = () => {
	const existingEntries = getMaxCalories();
	
	if (existingEntries.length === 0) {
		console.log('No max calories entries found. Calculating immediately...');
		calculateAndSaveMaxCalories();
	}
	
	scheduleNext();
};