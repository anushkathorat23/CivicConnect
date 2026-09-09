const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test connection
pool.getConnection()
    .then(connection => {
        console.log('✅ Connected to MySQL database:', process.env.DB_NAME);
        connection.release();
    })
    .catch(err => {
        console.error('❌ Error connecting to MySQL database:');
        console.error('Make sure your MySQL server is running and credentials in .env are correct.');
        console.error(err.message);
    });

module.exports = pool;
