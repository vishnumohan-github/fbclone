const jwt = require('jsonwebtoken');

module.exports = async(req,res,next)=>{

    const token = req.header('Authorization');
    console.log(token);
    if(!token) return res.status(400).send('access denied');

    try{
        const verified = await jwt.verify(token,process.env.TOKEN_SECRET);
        req.user= verified;
        next();
    }
    catch(err){
        res.status(400).send('error occured');
        console.log(err);
    }
};