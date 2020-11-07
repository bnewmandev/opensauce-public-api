const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");

//Import routes
const authRoute = require("./routes/auth");
const userInfoRoute = require("./routes/userinfo");
const postRoute = require("./routes/postdata");
const commentRoute = require("./routes/commentdata");
const searchRoute = require("./routes/searchquery");
const adminRoute = require("./routes/admin");

//Imports from .env
dotenv.config();

//Connect to database
mongoose.connect(
    process.env.DB_CONNECT,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log("connected to database")
);


//Middleware
app.use(express.json())


//Route Middlewares:    
app.use('/api/user', authRoute); 
app.use('/api/data', userInfoRoute);
app.use('/api/post', postRoute);
app.use('/api/comment', commentRoute);
app.use('/api/search', searchRoute);
app.use('/api/admin', adminRoute);

//sets port to 3000 and outputs success message to console
app.listen(3000, () => console.log("Server Online")); 