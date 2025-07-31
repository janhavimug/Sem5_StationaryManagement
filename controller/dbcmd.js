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
        console.log("Connected to MYSQL Database");
    }
})

exports.register = (req,res)=>{
    console.log(req.body);
    const{ email, password, confirm_password} = req.body;
    db.query("SELECT emailid FROM users WHERE emailid = ?",[email],(error,result)=>{
        if(error){
            console.log(error);
            //res.render('signup')
        }
        else{
            if(result.length > 0){
                const email_error = "Email already in use";
                console.log("Email already in use");
                res.render('signup',{message:email_error});
            }
            else{
                if(password != confirm_password){
                    const password_error = "Passwords entered are not same";
                    console.log("Passwords entered are not same");
                    res.render('signup',{message:password_error});
                }
                else{
                    //Insert user query
                    insert_sql = `INSERT INTO users VALUES ("${email}","${password}")`;
                    db.query(insert_sql,(error,result)=>{
                        if(error){
                            console.log(error);
                            //res.render('signup')
                        }
                        else{
                            console.log("User added ");
                            const url = 'loginpage'
                            res.redirect(url);
                        }
                    })
                }
                
            }

        }
        
        console.log(result);
    })
    
}

