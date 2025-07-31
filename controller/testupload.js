const multer = require('multer');
const pdf = require('pdf-parse');
const fs = require('fs');



// const storage = multer.diskStorage({
//     destination: function(req, file, cb){
//         return cb(null,'./uploads');
//     },
//     filename: function(req, file, cb){
//         return cb(null,`${Date.now()}-${file.originalname}`)
//     },
// })

const upload = multer({dest : "/uploads"});

exports.upload_pdf = (req,res)=>{
    console.log(req.body);
    console.log(req.file);  
//     console.log(req.file.path);

//     const dataBuffer = fs.readFileSync(req.file.path);
 
//     pdf(dataBuffer).then(function(data) {
//     // number of pages
//     console.log(data.numpages,req.body.email);
//     var number_of_pages = data.numpages;
//     res.render('uploadpage',{'pages':number_of_pages, 'email':req.body.email});
// });
    
}

exports.func_upload = upload.single('pdfFile');