const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const project_router = require('./routes/pages')
const mysql = require('mysql');
dotenv.config({path:'./.env'});


const app = express();


app.use('/uploads', express.static('uploads'));
app.use('/static',express.static('static'))
app.use(express.json());
app.use(express.urlencoded({ extended : false}));

//Using project_router
app.use('/',project_router);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

//Connecting MYSQL DB
const db = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'miniproject'
})

db.connect((error)=>{
    if(error){
        console.log(error);
    }
    else{
        console.log("Connected to MYSQL Database");
    }
})

//lISTENING PORT
app.listen(process.env.PORT,()=>{
    console.log("Server running on port :"+process.env.PORT);
})