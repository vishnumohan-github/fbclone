const router = require('express').Router();
const verify = require('../middleware/verifyToken');


router.get('/home',verify,(req,res)=>{
    res.send('http://192.168.29.187:3000/goutham.jpg');
});
module.exports = router;