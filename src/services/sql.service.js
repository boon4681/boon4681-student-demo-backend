const mysql = require('mysql2/promise');

module.exports = {
    student: mysql.createPool({
        host: 'localhost',
        user: 'root',
        database: 'student',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        password: process.env.SQL_PASSWORD
    })
}