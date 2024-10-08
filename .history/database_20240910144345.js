const mysql = require('mysql2');

const pool = mysql.createPool({
host: 'localhost',
user: 'root',
database: 'db67_emmid',

password: ''

});


module.exports = pool.promise();