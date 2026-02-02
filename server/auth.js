'use strict';

import dotenv from 'dotenv';

dotenv.config();
const PASSWORD = process.env.PASSWORD;

export const authenticatePassword = (pwd) => {
	return pwd === PASSWORD;
};