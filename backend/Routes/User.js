const express=require('express');
const router=express.Router();
const user = require('../models/User');
const bcrypt=require('bcrypt');


//register 
router.post('/register',async(req,res)=>{
    try {

        //generate new password
        const salt= await bcrypt.genSalt();
        const hashedpassword = await  bcrypt.hash(req.body.password,salt);
        //create new user
        const newUser = new user({
            username:req.body.username,
            email:req.body.email,
            password:hashedpassword,
        })


        //save user and send response
        const User = await newUser.save();
        res.status(200).json(User._id);
    } catch (error) {
        res.status(500).json(error);
        
    }
})


//login
router.post('/login',async(req,res)=>{
    try {
        //find user
        const User= await user.findOne({username:req.body.username}); //to send the username data inside the body
        //if no user liek that then send error as 400 status
        !User && res.status(400).json("Wrong username or password"); //we dont say directly to user wrong username so its username or passwor
        //validate the password
        const validPassword=bcrypt.compare(req.body.password,User.password);
        !validPassword &&  res.status(400).json("Wrong username or password");


        //successfull response
        res.status(200).json({_id:User._id , username:User.username}); //this will return the id and username from the registered one
    } catch (error) {
        res.status(500).json(error);
        
    }
})

module.exports=router;