const mysql = require('mysql2');

const conn = mysql.createConnection({
    database: 'bincom_test',
    host: "127.0.0.1",
    user: "root",
    password: "453622Ike",
    insecureAuth: true,


});

conn.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});

module.exports = conn
