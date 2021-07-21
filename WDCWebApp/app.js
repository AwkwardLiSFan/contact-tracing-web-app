var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser'); // Cookies
var logger = require('morgan');
var session = require('express-session'); // Session
var breadcrumb = require('express-url-breadcrumb'); // For page breadcrumbs
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// use mysql
var mysql = require('mysql');
var jquery = require('jquery'); // Use this when you figure out how to use the module in users.js

//create a pool of connections to be used to connect with the SQL server
var dbConnectionPool = mysql.createPool({
    connectionLimit: 3,
    host: 'localhost',
    database: 'covidApp'
});

var app = express();

// making sure we have access to the database before we process routes in index.js,
app.use(function(req, res, next){
    req.pool = dbConnectionPool;
    next();
});

app.use(breadcrumb()); // Use for every page request

// Cookie content
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Session content
// Every request will have a session attached to it
app.use(session({
    secret: 'pass234',          // Unique cryptographic secret. A string of your choice
    resave: false,              // Repeat the session or not
    saveUninitialized: true,    // All requests to have a session attached to them even though we havent manually initialized a session
    cookie: {secure:false}      // Session cookie to only work over HTTPS or not
}));

app.use(passport.initialize());
app.use(passport.session());

// send the profile using AJAX
function sendProfile(new_profile){
    // create AJAX request
    var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
    var xhttp = new XMLHttpRequest();

    // define function to run on response
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
                console.log("Success!");
      } else if (this.readyState == 4 && this.status == 401){
                console.log("Unknown error. Please refresh and try again");
      }
    };

    xhttp.open('POST', '/users/facebook_callback', true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(new_profile));
}

// implementing FB login
passport.use(new FacebookStrategy({
    clientID: '481012482984619',
    clientSecret: 'e50a60956b978ccfbb5eecfff3e5ae47',
    callbackURL: "https://ide-3b11fbcefc8643ed8aabbde2d063795b-8080.cs50.ws/auth/facebook/callback",
  },
  function(accessToken, refreshToken, profile, done) {
    console.log(profile);
    return done(null, profile);
  }
));

passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(id, done) {
  return(null, id);
});


// Redirect the user to Facebook for authentication.  When complete,
// Facebook will redirect the user back to the application at
//     /auth/facebook/callback
app.get('/auth/facebook', passport.authenticate('facebook'));

// Facebook will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.
app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/users/redirect',
                                      failureRedirect: '/' }));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
