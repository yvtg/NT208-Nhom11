import pg from 'pg';
import dotenv from 'dotenv';

// Load biến môi trường từ file .env
dotenv.config();

// Sử dụng connection string cho PostgreSQL
const { Pool } = pg;
const connectionString = process.env.DATABASE_URL;

const database = new Pool({
    connectionString,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

export default database;
