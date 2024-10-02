const mongoose=require('mongoose')


const pinSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
    },
    title:{
        type:String,
        required:true,
        min:3,
    },
    desc:{
        type:String,
        required:true,
        min:3
    },
    rating:{
        type:Number,
        required:true,
        min:0,
        max:5,
    },
    //im gonna indicate the coordinates for the map pins
    lat:{
        type:Number,
        required:true,
    },
    long:{
        type:Number,
        required:true,
    }
    
   
},
{timestamps:true});//this is for updating the pin with the created and update date for the developers liek the time they created their account and all

module.exports=mongoose.model('pin',pinSchema)