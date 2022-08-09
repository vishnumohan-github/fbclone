const User = require('../model/loginSchema');
const TOKEN = require('../model/passwordToken');
const sendEmail = require('../mail/ForgetPassMail');
const {resetPasswordValidation,resetValidation} = require('../validation');

const crypto = require('crypto');
const bcrypt = require('bcrypt');
const router = require('express').Router();

router.post('/',async(req,res)=>{
    try{
    const {error}= resetPasswordValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);
   
    const user = await User.findOne({email: req.body.email});
    if(!user)   return res.status(400).send({err:'user not exists'});
   
    const email = await User.findOne({email: req.body.email});
        if(!email.isVerified) return res.status(400).send({
            message: 'please verify your email'
        });

    let token = await TOKEN.findOne({userId: user._id});
    if(!token) {

        token = await new TOKEN({
            userId: user._id,
            token: crypto.randomBytes(64).toString('hex'),
        });  
    }
    try{
        const savedToken = await token.save();
        console.log(savedToken);
    }catch(err){
        res.status(400).send({err:'errrrrrrrrr'});
    }
        const link = `  https://0148-111-92-20-232.in.ngrok.io/password-reset/${user._id}/${token.token}`;
        await sendEmail(user.email,'password reset',link);

        res.send('password reset link has sent to your gmail account');
    }catch(err){
        res.status(400).send({err:'errror occured'});
        console.log(err);
    }
});

router.get('/:userId/:token/api',async(req,res)=>{
    res.send('hello world');
});

router.post('/:userId/:token',async(req,res)=>{
    try{
        const {error}= resetValidation(req.body);
        if(error) return res.status(400).send(error.details[0].message);

        const email = await User.findOne({email: req.body.email});
        if(!email.isVerified) return res.status(400).send({
            message: 'please verify your email'
        });
    
        const user = await User.findById( req.params.userId);
        if(!user)   return res.status(400).send({err:'invalid or expired'});
    
        const token = await TOKEN.findOne({
            userId: user._id,
            token: req.params.token
        });
        if(!token) return res.status(400).send({err:'invalid or expired'});
        
        
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(req.body.password,salt);
        user.password= hashedPassword;
        const savedpass = await user.save();
        console.log(savedpass);
        await token.delete();
    
        res.send('password-reset successful ');
        }
        catch(err){
            res.send("eiuirror occured");
            console.log(err);
        }
});
module.exports = router;
