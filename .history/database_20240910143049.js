const mysql = require('mysq12');

const pool = mysql.createPool({
host: 'localhost',
user: 'root',
database: 'db67_emmid',
}

password:

module.exports = pool.promise();