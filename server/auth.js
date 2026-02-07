'use strict';

import dotenv from 'dotenv';

dotenv.config();
const KEY = process.env.KEY;

export const authenticateKey = (key) => {
	return key === KEY;
};