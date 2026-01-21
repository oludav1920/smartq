const express =  require("express");
const app = express();
require('dotenv').config();
const mysql = require('mysql');
const cookieParser = require('cookie-parser');
app.use(cookieParser());
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static('Public'));
const nodemailer = require('nodemailer');

app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/Public/index.html");
});

app.get("/reg",(req,res)=>{
    res.sendFile(__dirname+"/Public/smartq_reg.html");
});

const con = mysql.createConnection({
        host: process.env.SERVER_HOST,
        user: process.env.SERVER_USER,
        password: process.env.SERVER_PASSWORD,
        database: process.env.SERVER_DATABASE
    });

app.post('/regproccess', (req,res)=>{
    const {fullname, name, email, phonenumber, date, time, address, niche, sub_niche, complaint, status} = req.body;
    
    const dataToCheck = [email];
    const log =`SELECT FROM ${process.env.USERS_TABLE} WHERE email=?`;
    con.query(log, dataToCheck, (err,result)=>{
         if(err){
             console.log(err.message);
         }
         if(result > 0){
             return res.send("user already exist");
         }
         else{}
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

    //SEND MAIL

    const transporter = nodemailer.createTransport({
    service: process.env.MAIL_PROVIDER,
    auth:{
        user: process.env.MAIL_FROM,
        pass: process.env.MAIL_PASSWORD
    }
    });

const emailoptions={
    from: process.env.EMAIL_FROM,
    to: email,
    subject: `smart registration`,
    text: `you have successfully register with smart queue, you can now login and enjy our service`
    }

transporter.sendMail(emailoptions, (err,results)=>{
    if(err){
        console.log(err);
    }
    console.log('Email sent successfully')
});
});

app.get("/dashboard",(req,res)=>{
    res.sendFile(__dirname+"/Public/dashboard.html");
});

//fetch for all table
app.post('/fetch-process', (req, res) => {
    try {
        const qry = `SELECT COUNT(*) as total FROM ${process.env.USERS_TABLE}`;
        con.query(qry, (err, result) => {
            if(err) {
                console.log('Database error:', err.message);
                return res.status(500).json({ 
                    success: false, 
                    error: 'Database query failed' 
                });
            }
            
            console.log('Query result:', result); // Debug log
            
            res.status(200).json({ 
                success: true, 
                count: result[0].total // Extract just the count
            });
        });
    } catch (error) {
        console.log('Server error:', error.message);
        res.status(500).json({ 
            success: false, 
            error: 'Server error' 
        });
    }
});

//fetch for all table
app.post('/fetch-email-process', (req, res) => {
    try {
        const qry = `SELECT COUNT(*) as email FROM ${process.env.USERS_TABLE} WHERE email=?`;
        con.query(qry, [email], (err, result) => {
            if(err) {
                console.log('Database error:', err.message);
                return res.status(500).json({ 
                    success: false, 
                    error: 'Database query failed' 
                });
            }
            
            console.log('Query result:', result); // Debug log
            
            res.status(200).json({ 
                success: true, 
                count: result[0].email // Extract just the count
            });
        });
    } catch (error) {
        console.log('Server error:', error.message);
        res.status(500).json({ 
            success: false, 
            error: 'Server error' 
        });
    }
});


    // //SELECT QUERY
    
    // const dataToCheck = [email, fullname];
    // const log =`SELECT FROM users WHERE email=? AND fullname=?`;
    // con.query(log, dataToCheck, (err,result)=>{
    //     if(err){
    //         console.log(err.message);
    //     }
    //     console.log("login success");
    //     let dataret = result[0];
    //     return res.json(dataret);
    //     //res.sendFile(__dirname+"dashboard.html"+?result[0]);
    // });

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

app.post('/loginproc', (req, res)=>{
    const {email,name} = req.body;
    console.log(email,name);
})

app.listen(process.env.PORT,()=>{
    console.log(`started at ${process.env.PORT}`);
});
