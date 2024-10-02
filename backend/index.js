const express=require('express');
const mongoose=require('mongoose');
const app=express();
const dotenv=require('dotenv');
const pinRouter=require('./Routes/Userpin');
const userRouter = require('./Routes/User');
const PORT = process.env.PORT||3600;
const cors=require('cors');


const corsOptions = {
    origin: 'http://localhost:3000', // Allow only this origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify methods you want to allow
    credentials: true, // Allow credentials if needed
};

// Apply the CORS middleware before defining routes or using other middleware
app.use(cors(corsOptions));

dotenv.config();
app.use(express.json()); // to parser these details into the body in the router we need this
mongoose.connect(process.env.MONGO_URL,{useNewUrlParser:true,
    useUnifiedTopology:true,
}).then(()=>[
    console.log('MongoDB connected Successfuly!')
]).catch((err)=>{console.log(err.message)});
app.get('/',(req,res)=>{
    res.send("APP IS WORKING");
})
app.use('/api/users',userRouter);
app.use('/api/pins',pinRouter);
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});



app.listen(PORT,(error)=>{
    if(error){
        console.log(`${error.message}`);
    }
    else{
        console.log(`the server is running on port no :${PORT}`);
    }

})