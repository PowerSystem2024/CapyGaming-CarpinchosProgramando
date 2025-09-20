<<<<<<< HEAD
<<<<<<< Updated upstream
const { Pool } = require('pg');
=======
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();
>>>>>>> Stashed changes
=======
// pool.js
import pkg from 'pg';
const { Pool } = pkg;
>>>>>>> 5beacc4079cd22d27b035928717b8d98d456a4ce

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
});

<<<<<<< HEAD
<<<<<<< Updated upstream
module.exports = pool;
=======
export default pool;
>>>>>>> Stashed changes
=======
export default pool;


>>>>>>> 5beacc4079cd22d27b035928717b8d98d456a4ce
