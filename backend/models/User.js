const { default: mongoose } = require("mongoose");

const UserSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        min:3,
        max:20,
        unique:true, //as i dont want any user with same username
    },
    email:{
        type:String,
        reuired:true,
        max:50,
        unique:true,
    },
    password:{
        type:String,
        required:true,
        min:6,
        unique:true,
    },
   
},
{timestamps:true});//this is for updating the user with the created and update date for the developers liek the time they created their account and all

module.exports=mongoose.model('user',UserSchema)