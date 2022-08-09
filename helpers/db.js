const mongoose = require('mongoose');
const express = require('express');


const url = 'mongodb://localhost/logindb'


mongoose.connect(url,{useNewUrlParser:true,useUnifiedTopology: true});

const con = mongoose.connection

con.on('open',function(){
    console.log('connected..');
});

module.exports = con;
