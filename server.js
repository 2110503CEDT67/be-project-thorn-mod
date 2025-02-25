const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
// load env var
dotenv.config({path:'./config/config.env'});

connectDB();

const app = express();
const hospitals = require('./routes/hospitals');
const auth = require('./routes/auth');
const appointments = require('./routes/appointments');
app.use(express.json());
app.use(cookieParser());


app.use('/api/v1/hospitals',hospitals)
app.use('/api/v1/auth',auth);
app.use('/api/v1/appointments',appointments);



const PORT = process.env.PORT || 5000;
const server = app.listen(PORT,console.log("server is running in",process.env.NODE_ENV," mode on port ",PORT));

process.on('unhandledRejection',(err,promise)=>{
    console.log(`ERROR : ${err.massage}`);
    server.close(()=> process.exit(1));

});