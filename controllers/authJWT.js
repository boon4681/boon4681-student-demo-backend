const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'student',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    password: process.env.SQL_PASSWORD
});

const login = async () => {
    const promise = pool.promise();
    const [rows,fields] = await promisePool.query("SELECT 1");
    
}

module.exports = {
    login
}