'use strict'

var express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    app = express(),
    router = express.Router(),
    port = process.env.PORT || 3001,
    uristring = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/tippingdb';
    
// mongoose.connect(uristring, function (err, res) {
//     if (err) {
//         console.log ('ERROR connecting to: ' + uristring + '. ' + err);
//     } else {
//         console.log ('Succeeded connected to: ' + uristring);
//     }
// });

// mongoose.Promise = global.Promise;
// mongoose.connect('mongodb://localhost/tippingdb');

// Configure the API to use bodyParser and look for JSON data in the request body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
    // To prevent errors from CORS, set the headers to allow CORS with middleware
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
    // Remove caching so we get the latest data
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

// Return an error if status is not found
app.use(function (req, res) {
    res.status(404).send({ url: req.originalUrl + ' not found' });
});

// Set the route path & initialise the API
router.get('/', function(req, res) {
    res.json({ message: 'API Initialised!'});
});

// Use our router configuration when we call /api
app.use('/api', router);

// Starts the server and listens for requests
app.listen(port, function() {
    console.log(`api running on port ${port}`);
});