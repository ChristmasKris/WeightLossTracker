'use strict';

import http from 'http';
import url from 'url';
import dotenv from 'dotenv';

import { authenticatePassword } from './auth.js';
import { addEntry, getTodayEntries, deleteEntry, getTodayWeight, addWeight, getAllWeights, deleteWeight, getCurrentMaxCalories } from './database.js';
import { initScheduler } from './scheduler.js';

dotenv.config();
const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
	
	if (req.method === 'OPTIONS') {
		res.writeHead(200);
		res.end();
		return;
	}
	
	const parsedUrl = url.parse(req.url, true);
	const pathname = parsedUrl.pathname;
	
	if (pathname === '/api/auth' && req.method === 'POST') {
		let body = '';
		
		req.on('data', (chunk) => {
			body += chunk.toString();
		});
		
		req.on('end', () => {
			try {
				const { password } = JSON.parse(body);
				const isValid = authenticatePassword(password);
				res.writeHead(200, { 'Content-Type': 'application/json' });
				res.end(JSON.stringify({ success: isValid }));
			} catch (error) {
				res.writeHead(400, { 'Content-Type': 'application/json' });
				res.end(JSON.stringify({ success: false }));
			}
		});
		
		return;
	}
	
	if (pathname === '/api/entry' && req.method === 'POST') {
		let body = '';
		
		req.on('data', (chunk) => {
			body += chunk.toString();
		});
		
		req.on('end', () => {
			try {
				const { name, calories, password } = JSON.parse(body);
				
				if (!authenticatePassword(password)) {
					res.writeHead(401, { 'Content-Type': 'application/json' });
					res.end(JSON.stringify({ success: false, message: 'Unauthorized' }));
					return;
				}
				
				if (!name || !calories) {
					res.writeHead(400, { 'Content-Type': 'application/json' });
					res.end(JSON.stringify({ success: false, message: 'Missing name or calories' }));
					return;
				}
				
				const caloriesInt = parseInt(calories);
				if (isNaN(caloriesInt) || caloriesInt <= 0) {
					res.writeHead(400, { 'Content-Type': 'application/json' });
					res.end(JSON.stringify({ success: false, message: 'Calories must be a positive integer' }));
					return;
				}
				
				const entry = addEntry(name, caloriesInt);
				res.writeHead(201, { 'Content-Type': 'application/json' });
				res.end(JSON.stringify({ success: true, entry }));
			} catch (error) {
				res.writeHead(400, { 'Content-Type': 'application/json' });
				res.end(JSON.stringify({ success: false, message: 'Invalid request' }));
			}
		});
		
		return;
	}
	
	if (pathname === '/api/getTodayEntries' && req.method === 'GET') {
		try {
			const entries = getTodayEntries();
			res.writeHead(200, { 'Content-Type': 'application/json' });
			res.end(JSON.stringify({ success: true, entries }));
		} catch (error) {
			res.writeHead(400, { 'Content-Type': 'application/json' });
			res.end(JSON.stringify({ success: false, message: 'Error retrieving entries' }));
		}
		
		return;
	}
	
	if (pathname === '/api/deleteEntry' && req.method === 'POST') {
		let body = '';
		
		req.on('data', (chunk) => {
			body += chunk.toString();
		});
		
		req.on('end', () => {
			try {
				const { entryId, password } = JSON.parse(body);
				
				if (!authenticatePassword(password)) {
					res.writeHead(401, { 'Content-Type': 'application/json' });
					res.end(JSON.stringify({ success: false, message: 'Unauthorized' }));
					return;
				}
				
				if (!entryId) {
					res.writeHead(400, { 'Content-Type': 'application/json' });
					res.end(JSON.stringify({ success: false, message: 'Missing entry ID' }));
					return;
				}
				
				if (deleteEntry(parseInt(entryId))) {
					res.writeHead(201, { 'Content-Type': 'application/json' });
					res.end(JSON.stringify({ success: true, entryId: parseInt(entryId) }));
				} else {
					res.writeHead(400, { 'Content-Type': 'application/json' });
					res.end(JSON.stringify({ success: false, message: 'Could not delete entry' }));
				}
			} catch (error) {
				res.writeHead(400, { 'Content-Type': 'application/json' });
				res.end(JSON.stringify({ success: false, message: 'Invalid request' }));
			}
		});
		
		return;
	}
	
	if (pathname === '/api/getTodayWeight' && req.method === 'GET') {
		try {
			const weight = getTodayWeight();
			res.writeHead(200, { 'Content-Type': 'application/json' });
			res.end(JSON.stringify({ success: true, weight }));
		} catch (error) {
			res.writeHead(400, { 'Content-Type': 'application/json' });
			res.end(JSON.stringify({ success: false, message: 'Error retrieving weight' }));
		}
		
		return;
	}
	
	if (pathname === '/api/getAllWeights' && req.method === 'GET') {
		try {
			const weights = getAllWeights();
			res.writeHead(200, { 'Content-Type': 'application/json' });
			res.end(JSON.stringify({ success: true, weights }));
		} catch (error) {
			res.writeHead(400, { 'Content-Type': 'application/json' });
			res.end(JSON.stringify({ success: false, message: 'Error retrieving weights' }));
		}
		
		return;
	}
	
	if (pathname === '/api/weight' && req.method === 'POST') {
		let body = '';
		
		req.on('data', (chunk) => {
			body += chunk.toString();
		});
		
		req.on('end', () => {
			try {
				const { weight, password } = JSON.parse(body);
				
				if (!authenticatePassword(password)) {
					res.writeHead(401, { 'Content-Type': 'application/json' });
					res.end(JSON.stringify({ success: false, message: 'Unauthorized' }));
					return;
				}
				
				if (weight === null || weight === undefined) {
					res.writeHead(400, { 'Content-Type': 'application/json' });
					res.end(JSON.stringify({ success: false, message: 'Missing weight' }));
					return;
				}
				
				const weightFloat = parseFloat(weight);
				if (isNaN(weightFloat) || weightFloat <= 0) {
					res.writeHead(400, { 'Content-Type': 'application/json' });
					res.end(JSON.stringify({ success: false, message: 'Weight must be a positive number' }));
					return;
				}
				
				// Round to 2 decimal places
				const weightRounded = Math.round(weightFloat * 100) / 100;
				
				const entry = addWeight(weightRounded);
				res.writeHead(201, { 'Content-Type': 'application/json' });
				res.end(JSON.stringify({ success: true, entry }));
			} catch (error) {
				res.writeHead(400, { 'Content-Type': 'application/json' });
				res.end(JSON.stringify({ success: false, message: 'Invalid request' }));
			}
		});
		
		return;
	}
	
	if (pathname === '/api/deleteWeight' && req.method === 'POST') {
		let body = '';
		
		req.on('data', (chunk) => {
			body += chunk.toString();
		});
		
		req.on('end', () => {
			try {
				const { weightId, password } = JSON.parse(body);
				
				if (!authenticatePassword(password)) {
					res.writeHead(401, { 'Content-Type': 'application/json' });
					res.end(JSON.stringify({ success: false, message: 'Unauthorized' }));
					return;
				}
				
				if (!weightId) {
					res.writeHead(400, { 'Content-Type': 'application/json' });
					res.end(JSON.stringify({ success: false, message: 'Missing weight ID' }));
					return;
				}
				
				if (deleteWeight(parseInt(weightId))) {
					res.writeHead(201, { 'Content-Type': 'application/json' });
					res.end(JSON.stringify({ success: true, weightId: parseInt(weightId) }));
				} else {
					res.writeHead(400, { 'Content-Type': 'application/json' });
					res.end(JSON.stringify({ success: false, message: 'Could not delete weight' }));
				}
			} catch (error) {
				res.writeHead(400, { 'Content-Type': 'application/json' });
				res.end(JSON.stringify({ success: false, message: 'Invalid request' }));
			}
		});
		
		return;
	}
	
	if (pathname === '/api/getCurrentMaxCalories' && req.method === 'GET') {
		try {
			const maxCalories = getCurrentMaxCalories();
			res.writeHead(200, { 'Content-Type': 'application/json' });
			res.end(JSON.stringify({ success: true, maxCalories }));
		} catch (error) {
			res.writeHead(400, { 'Content-Type': 'application/json' });
			res.end(JSON.stringify({ success: false, message: 'Error retrieving max calories' }));
		}
		
		return;
	}
	
	res.writeHead(404, { 'Content-Type': 'application/json' });
	res.end(JSON.stringify({ message: 'Not found' }));
});

server.listen(PORT, () => {
	console.log(`Calorie Tracker server running on http://localhost:${PORT}`);
	initScheduler();
});