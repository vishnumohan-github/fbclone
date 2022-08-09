const express = require('express');
const app = express();
const helmet = require("helmet");
const authRoute = require('./routes/auth');
const postRoute = require('./routes/post');
const con = require('./helpers/db');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const forgotPassRoute = require('./routes/reset-pass');
const home = require('./routes/home');
const bodyParser = require('body-parser');
const multer = require('multer');
const Profile = require('./model/profileSchema');
const User = require('./model/loginSchema');
const path = require('path');
const ejs = require('ejs');
const fs = require('fs');
const pdf = require('html-pdf');
const verify = require('./middleware/verifyToken');
const { isObjectIdOrHexString } = require('mongoose');
const { stringify } = require('querystring');





dotenv.config();

app.use(morgan('tiny'));
app.use(helmet.frameguard());
app.use(cors({
  origin:'*'
}));


app.use(function(req, res,next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
  res.setHeader('Access-Control-Allow-Credentials', true); // If needed

  next();
});

app.use(bodyParser.json());
app.use(bodyParser.json({limit:'50mb'})); 
app.use(bodyParser.urlencoded({extended:true, limit:'50mb'})); 
app.use(express.static(path.join(__dirname, './uploads')));
app.set("view engine", "ejs");

app.use(express.json()); 

app.use('/api/user',authRoute);
app.use('/api/user',home);
app.use('/user/forgot-password',forgotPassRoute);
app.use('/',postRoute);







const Storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req,file,cb)=>{
    cb(null, file.originalname);
  }, 
});
const upload = multer({
  storage: Storage,
  limits: { fileSize: '4MB'}
}).single('testImage');

app.post('/upload',verify,async(req,res)=>{  
  upload(req,res,async(err)=>{
    
    let user = req.user;
    console.log(user.id)
    if(err){
      console.log(err);
    }
    else{
      const newImage = new Profile({
        userId: user.id,
        name: req.body.name,
        bio: req.body.bio,
        phoneNumber: req.body.phoneNumber,
        profilePicture: req.file.filename
      })
      await newImage.save()
      .then(()=> res.send('successfully uploaded'))
      .catch((err)=> console.log(err));
    }
  });
});


// app.get('/getProfile/:name',async(req,res)=>{
// const name = req.params.name;
//   try{
//     const user = await Profile.findOne({name: name}); 
//     console.log(user);
//     res.send({
//       ...JSON.parse(JSON.stringify(user)),
//       profilePicture :`http://192.168.29.187:3000/${user.profilePicture}`
//     });
//     if(!user) return res.status(400).send({
//       err: "enter valid name"
//     })
// }
// catch(err){
//     console.log(err);
// }
// });


app.get('/getProfile',verify,async(req,res)=>{
  try{
    // const profile = await Profile.findOne({userId: req.params.id}); 
    // console.log(profile);
    // const user = await User.findOne({email: req.params.email});
    // if(!user)   return res.status(400).send({err:'user not exists'});
    let user = req.user;
    console.log(user.id)
    let profile = await Profile.findOne({userId: user.id});
    if(!profile)   return res.status(400).send({err:'not match'})

  if(stringify(profile.userId)=== stringify(user.id)){
    return res.send({
      ...JSON.parse(JSON.stringify(profile)),
      profilePicture :`http://192.168.29.187:3000/${profile.profilePicture}`
    });
    
  }
 
  }catch(err){
    console.log(err)
  }
  });

// route to download pdf file
app.get('/getPdf', verify,function(req, res) {
  res.download('./profile.pdf');  
});

// pdf



app.get("/generateReport",verify,async(req, res) => {
    // const name = req.params.name;
    // let user = await Profile.findOne({name: name}); 
    // console.log(user);
    let user = req.user;
    console.log(user.id)
    let profile = await Profile.findOne({userId: user.id});
    if(!profile)   return res.status(400).send({err:'not match'})
    
   ejs.renderFile(path.join(__dirname, './views/', "report-template.ejs"), {profile: profile }, (err, data) => {
   if (err) {
         res.send(err);
   } else {
    console.log(data);
       let options = {
           "height": "11.25in",
           "width": "8.5in",
           "header": {
               "height": "20mm"
           },
           "footer": {
               "height": "20mm",
           },
           "base": `${req.protocol}://${req.headers.host}`
       };
       pdf.create(data,options).toFile("profile.pdf", function (err, data) {
           if (err) {
               res.send(err);
           } else {
               res.send("File created successfully");
           }
       });
   }
});
})









app.listen(3000,()=>{
    console.log("port running in 3000");
});