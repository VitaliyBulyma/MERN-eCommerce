const express = require("express");
const app = express();
const mongoose = require("mongoose");
const morgan = require('morgan');
const bodyParser =require('body-parser');
const cookieParser =require('cookie-parser');
const expressValidator =require('express-validator');

require("dotenv").config();

// import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

// db connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }).then(()=>{
    console.log(`Db connection successfully established!`);
});
mongoose.connection.on('error', err =>{
    console.log(`Db connection error: ${err.message}`);
});


// middlewares 
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());


// routes middleware
app.use('/api', authRoutes);
app.use('/api', userRoutes);


const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
