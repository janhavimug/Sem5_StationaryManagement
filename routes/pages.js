const express = require('express');
const router = express.Router();
const register_func = require('../controller/dbcmd');
const login_func = require('../controller/logincmd');
const testupload = require('../controller/testupload');
const mysql = require('mysql');
const fs = require('fs');
const pdf = require('pdf-parse');

//pdf file uploading code 
const multer = require('multer');
  const Db = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'miniproject'
  })

  Db.connect((error)=>{
    if(error){
        console.log(error);
    }
    else{
        console.log("Conneting and posting orders");
    }
})



//Creating routes
router.get('/signup',(req,res)=>{
    res.render("signup");
})
router.post('/signup',register_func.register)
//     (req,res)=>{
//     console.log(req.body);
//     email = req.body.emailid;
//     password = req.body.password;
//     db.query("SELECT * FROM logininfo");
//     res.render('login_page');
// }


router.get('/loginpage',(req,res)=>{
    res.render("login_page");
})
router.post('/loginpage',login_func.login)
// (req,res)=>{
//     console.log(req.body);
//     res.render('login_page');
// }

router.get('/home',(req,res)=>{
    res.render("homepage");
})

router.get('/shopkeep',(req,res)=>{
    orders = "SELECT * FROM orders";
    Db.query(orders,(error,result)=>{
        if(error){
            console.log("Error while retriving order data : ",error);
        }
        else{
            tablecont = {items : result};
            console.log(tablecont);
            res.render('shopkeeper',tablecont);
        }
    })
})
router.post('/shopkeep',(req,res)=>{
    console.log(req.body);
    const updateStatus = req.body.newStatus;
    const pdf_path = req.body.pdfName;
    const emailid = req.body.emailId;
    update_status_query = `UPDATE orders SET status = '${updateStatus}' WHERE emailid ='${emailid}' AND pdf_path='${pdf_path}'`;
    console.log(update_status_query);
    Db.query(update_status_query,(error,result)=>{
        if(error){
            console.log("Error while updating status : ",error);
        }
        else{
            console.log("Status updated");
            res.redirect('/shopkeep');
        }
    })
})

 router.get('/uploadpage/:email',(req,res)=>{
    console.log(req.params);
    var emailid = req.params.email;
    console.log(emailid);
    query_to_orders = `SELECT * FROM orders WHERE emailid = "${emailid}" `;
    console.log(query_to_orders)
    Db.query(query_to_orders,(error,result)=>{
        if(error){
            console.log("Error while retrieving orders :",error);
        }
        else{
            number_of_results = result.length;
            if(number_of_results > 0){
                console.log(result);
                console.log(result[0].emailid)
                email_render = result[0].emailid
                tablecont = {items : result};
                console.log(tablecont);
                res.render('uploadpage',tablecont);
            }
            else{
                res.render('uploadpage2');
            }
        }
    })
    
 })

 const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      return cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
      file.filename = file.originalname ;
      return cb(null, file.filename )
    }
  })
  
  const upload = multer({ storage: storage })
 
 router.post('/uploadpage',upload.single("pdfFile"),(req,res)=>{
    emailid = req.body.email;
    console.log(req.file)
    var url_redirect = "/uploadpage/";
    url_redirect =  url_redirect.concat(req.body.email)
    console.log(url_redirect);
    res.redirect(url_redirect);
    sqlquery = `SELECT emailid FROM users WHERE emailid="${emailid}"`;
    console.log(sqlquery)
    Db.query(sqlquery,(error,result)=>{
        if(error){
            console.log(error);
        }
        else{
            if(result[0].emailid == emailid){
                const pdf_path = req.file.originalname;
                console.log(pdf_path)
                const path_for_cost = req.file.path;
                console.log(path_for_cost);
                let dataBuffer = fs.readFileSync(path_for_cost);
                pdf(dataBuffer).then(function(data){
                    console.log(data.numpages);
                    var cost = data.numpages ;
                    console.log(cost);
                    cost = cost * 3;
                    const date = String(new Date());
                    console.log(date);

                    const status = 'In progress';
                    order_query = `INSERT INTO orders VALUES ("${emailid}","${pdf_path}",${cost},"${status}","${date}")`;
                    Db.query(order_query,(error,result)=>{
                    if(error){
                        console.log("Error while posting order : ",error);
                    }
                    else{
                        console.log("Order made")
                    }
                })
                })
                
                
            }
            else{
                errorMessage = "Invalid Email"
                console.log(errorMessage);
            }
            
        }
    })
    
 });
//stationary get
 router.get('/stationary',(req,res)=>{
     res.render('stat');
 })
//gelpens get
 router.get('/gelpen',(req,res)=>{
    res.render('gelpen');
})
router.get('/octane',(req,res)=>{
    res.render('octane');
})
router.get('/pilot',(req,res)=>{
    res.render('pilot');
})
router.get('/cartoon',(req,res)=>{
    res.render('cartoon');
})


//add to cart route
router.get('/cart',(req,res)=>{
    res.render('cart');
})

//payment route
router.get('/ordernow',(req,res)=>{
    res.render('paymentoctane');
})

//cod route
router.get('/cod',(req,res)=>{
    res.render('cod');
})

//Exporting routes
module.exports = router;