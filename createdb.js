var mysql = require('mysql');
var con = mysql.createConnection({
    host: 'localhost',
    user:'root',
    password: 'oludav@1920',
    database: 'smart_queue'
});
con.connect((err)=>{
    if(err){
        console.log(err.message);
    }
    console.log('connected to server');
});

/*con.query("CREATE DATABASE IF NOT EXISTS users", (err, result)=>{
    if(err){
        console.log(err.message);
    }
    console.log('db created');
});
*/
con.query("CREATE TABLE IF NOT EXISTS users(id INT AUTO_INCREMENT PRIMARY KEY,fullname VARCHAR(60) NOT NULL,phone VARCHAR(60) NOT NULL,address VARCHAR(80) NOT NULL,complain LONGTEXT NOT NULL,queue_status VARCHAR(15) NOT NULL)", (err, result)=>{
    if(err){
        console.log(err.message);
    }
    console.log("Table created");
});
con.end();