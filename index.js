const express =  require("express");
const app = express();
require('dotenv').config();
const mysql = require('mysql');
const cookieParser = require('cookie-parser');
app.use(cookieParser());
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static('Public'));

app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/Public/index.html");
});

app.get("/reg",(req,res)=>{
    res.sendFile(__dirname+"/Public/smartq_reg.html");
});


app.post('/regproccess', (req,res)=>{
    const {fullname, name, email, phonenumber, date, time, address, niche, sub_niche, complaint, status} = req.body;
    const con = mysql.createConnection({
        host: process.env.SERVER_HOST,
        user: process.env.SERVER_USER,
        password: process.env.SERVER_PASSWORD,
        database: process.env.SERVER_DATABASE
    });

    //INSERT DATA
    const dataToInsert = [fullname, name, email, phonenumber, date, time, address, niche, sub_niche, complaint, status];
    const qry = `INSERT INTO ${process.env.USERS_TABLE}(fullname, name, email, phone, date, time, address, niche, sub_niche, complain, queue_status) VALUES(?,?,?,?,?,?,?,?,?,?,?)`;
    con.query(qry, dataToInsert, (err,result)=>{
        if(err){
            console.log(err.message);
        }
        console.log('registration successful');

        res.sendFile(__dirname+"/Public/regsuccess.html");
    });
});

app.get("/dashboard",(req,res)=>{
    res.sendFile(__dirname+"/Public/dashboard.html");
});


    //SELECT QUERY
    
    /*const dataToCheck = [email, fullname];
    const log =`SELECT FROM root WHERE email=? AND fullname=?`;
    con.query(log, dataToCheck, (err,result)=>{
        if(err){
            console.log(err.message);
        }
        console.log("login success");
        //res.sendFile(__dirname+"dashboard.html"+?result[0]);
    });*/

//COOKIE
app.get('/save',(req,res)=>{
    let data = {email:'ade', fullname:'ola'};
    res.cookie('usersdata',data, {maxAge:900000, httpOnly:true});
    res.sendFile(__dirname+"/Public/dashboard.html");
});
app.get('/fetch',(req,res)=>{
    let username =req.cookies.usersdata;
    let fname = userdata.fullname
    res.sendFile(__dirname+"/Public/dashboard.html");
});
app.get('/clear',(req,res)=>{
    res.clearCookie('username');
    res.sendFile(__dirname+"/Public/index.html");
});

app.listen(process.env.PORT,()=>{
    console.log(`started at ${process.env.PORT}`);
});
