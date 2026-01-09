require('dotenv').config({ path: './.env.test' });
import 'reflect-metadata';

// Set test environment
process.env.NODE_ENV = 'test';