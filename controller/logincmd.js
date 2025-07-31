const mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config({path:'../.env'});

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
        console.log("Connected to MYSQL Database(Login page)");
    }
})

exports.login = (req,res)=>{
    const password = req.body.password;
    const emailid = req.body.email;
    console.log(req.body);
    console.log(emailid);
    sqlquery = `SELECT password FROM users WHERE emailid='${emailid}'`;
    db.query(sqlquery,(error,result)=>{
        if(error){
            console.log(error);
        }
        else{
            console.log(result[0].password);
            const password_in_database = result[0].password;
            console.log(password_in_database+"-----"+password);
            if(password_in_database == password){
                let url = "uploadpage";
                let url_final = url.concat("/", emailid);
                console.log(url_final);
                res.redirect(url_final);
            }
            else if(password != password_in_database){
                const errorMessage = "Invalid Email or Password Please try again";
                console.log(errorMessage);
                res.redirect('loginpage');
            }
        }
    })
    
}