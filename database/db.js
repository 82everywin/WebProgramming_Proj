const mysql = require('mysql');

const conn = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'root',
    database: 'chatting_app'
})


conn.connect((err) => {
    if(err) console.log(err);
    else console.log('Connected to the database');
})