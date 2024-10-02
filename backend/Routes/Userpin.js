const express=require('express')
const router=express.Router();
const pin = require('../models/pin');


//create a pin

router.post(('/'), async(req,res)=>{
    const newPin = new pin(req.body); // to send all the details of the pin model in the model folder we are usingthis and inorder to parse them in index.js we use the express.json() there inorder to send the details to the server.
    
    try {
        const savedPin= await newPin.save();
        res.status(200).json(savedPin);
    } catch (error) {
        res.status(500).json(error);
        
    }
})





//get all pins

router.get('/',async(req,res)=>{
    try {
        const newpin=await pin.find();
        res.status(200).json(newpin);
        
    } catch (error) {
        res.status(500).json(error)
        
    }
})
module.exports=router;