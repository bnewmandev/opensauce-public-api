const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const util = require('./lib/util');

// Import routes
const userRoute = require('./routes/user');
const postRoute = require('./routes/post');
const commentRoute = require('./routes/comment');
const searchRoute = require('./routes/query');
const adminRoute = require('./routes/admin');

// Imports from .env
dotenv.config();
const port = process.env.PORT;

// Connect to database
mongoose.connect(
	process.env.DB_CONNECT,
	{ useNewUrlParser: true, useUnifiedTopology: true },
	() => util.log('connected to database')
);


// Hide express is running
app.use((req, res, next) => {
	res.setHeader('X-Powered-By', 'OpenSauce/API');
	next();
});


// Middleware
app.use(express.json());


// Route Middlewares:
app.use('/api/user', userRoute);
app.use('/api/post', postRoute);
app.use('/api/comment', commentRoute);
app.use('/api/search', searchRoute);
app.use('/api/admin', adminRoute);

// sets port to port defined in env and outputs success message to console
app.listen(3000, () => util.log(`Server Online on port ${port}`));
