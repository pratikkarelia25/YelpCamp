const express = require('express');
const user = require('../models/user')
const router = express.Router();

router.get('/register',(req,res)=>{
    res.render('users/register')
})

module.exports = router