const router = require('express').Router();
const User = require('../model/loginSchema');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const {registervalidation,loginValidation} = require('../validation');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
dotenv.config();
const verify = require('../middleware/verifyToken');



const transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    service: 'gmail',
    auth:{
        user: 'austereinfosolutions@gmail.com',
        pass: process.env.PASSWORD
    },
    // tls:{
    //     rejectUnauthorized: false
    // }
});

router.post('/register',async (req,res)=>{
          
  const {error} = registervalidation(req.body);
   if(error) return res.status(400).send(error.details[0].message);
   
   const existingEmail = await User.findOne({email: req.body.email});
   if(existingEmail)   return res.status(400).send({err:'email already exists'});
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(req.body.password,salt);

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        emailToken: crypto.randomBytes(64).toString('hex'),
        isVerified: false,
    
    }); 
    try{
        const savedUser = await user.save();
        res.send(savedUser); 
    }
    catch(err){
        res.status(400).send({err:'not saved'});
    }

    var mailOptions = {
        from: '"verify your email"<vishnukundara123@gmail.com>',
        to: user.email,
        subject: 'verify your email',
        html: `<h2>${user.name}! Thanks for registering on our site</h2>
                <h4> please verify your email to continue...</h4>
                <a href=" http://localhost:3000/api/user/verify-email/${user.emailToken}  ">please click here to verify</a>`
    }

    transport.sendMail(mailOptions,function(error, info){
        if(error){
            console.log(error); 
        }
        else{
            console.log('verification email is sent to your gmail');
        }
    })
});

router.get('/verify-email/:token',async(req,res)=>{
    try{
        const token = req.params.token;
        const user = await User.findOne({emailToken: token}) 
        
        if(user){
            user.emailToken= null;
            user.isVerified = true;
            const verifiedData= await user.save();
            return res.status(200).send(verifiedData);  
        } 
    }
    catch(err){
        console.log(err);
    }
});


router.post('/login',async(req, res)=>{
    const {error} = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send({
        err : "wrong email id"
    });
    
    if(!user.isVerified) return res.status(400).send({
        err: 'please verify your email'
    });

    const validPass = await bcrypt.compare(req.body.password,user.password);
    if(!validPass) return res.status(400).send({
        err:'invalid password'});
    
    
    
    const token = jwt.sign({id: user._id},process.env.TOKEN_SECRET);
    res.header('Authorization',token).status(200).send({
        token,
        ...JSON.parse(JSON.stringify(user))
    });
    console.log(token);
    
});



module.exports = router;