// This handles the MySQL connection

const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'OrlandoFRN',
  password: 'Fernand18',
  database: 'todo_app'
});

module.exports = pool.promise();
