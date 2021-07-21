/*
    sql_start
    mysql --host=127.0.0.1
    SHOW DATABASES;
    USE covidApp;
    SHOW TABLES;
    DESCRIBE {tabel item} (fill {...})
    SELECT * FROM User; (or whatever tabel row you want)

    OAuth-
    Client ID: 769575487601-nmc14u2ts25biikpgoabmr9pj6cmp9fc.apps.googleusercontent.com
    Client Secret: Il3bXwyZIQtBQ-WOmSD2QA29
*/

//Patrick's SQL password: a14015fdc1e95333e6bf2df98e2603e9 Username: p_miller

/* Now that passwords are hashed enter with these credentials:
    Venue:
    U:hash1 Pass:hash1

    User:
    U:hash2 Pass:hash2

    Health off:
    U:hash3 Pass:hash3

*/

var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt'); // Include in all .js files that work with accounts
const saltRounds = 10;            // This too

const CLIENT_ID = '769575487601-nmc14u2ts25biikpgoabmr9pj6cmp9fc.apps.googleusercontent.com'; // Registered google Client ID for this site

const {OAuth2Client} = require('google-auth-library');  // Import google auth lib
const client = new OAuth2Client(CLIENT_ID);             // Create new google client using CLIENT_ID

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// General access routes go above this line (website access that does not require a login)

router.post('/register', async function(req, res, next) {

    const password = req.body.password;
    const hashedpword = await bcrypt.hash(password, saltRounds);
    console.log(hashedpword + "This is the hash here");
    console.log("user info received: " + req.body.first_name + " " + req.body.last_name); // Logs users first and last name

    req.pool.getConnection(function(err,connection){ // Requests connection to database. 'connection' is the connection to the db
        if(err){
           //console.log("Error Here 1 -> " + err);
           res.sendStatus(500);
           return;
        }

        var query = "SELECT * FROM User WHERE email = ?";
        var addUserQuery = "INSERT INTO User(given_name, last_name, username, email, phone_number, password, is_manager, is_official) VALUES (?,?,?,?,?,?,?,?)";
        //INSERT INTO User(given_name, last_name, username, email, phone_number, password, is_manager, is_official) VALUES ('hash3','hash3','hash3','hash@gm',1111111111,'hash3',0,1)

        // Check if user email exists in the database
        connection.query(query,[req.body.email], function(err,rows,fields){ // Takes query and the function to run when the query returns the results (Username matching username).
            // Once the data is found, DO NOT release the connection to the sql db as we still have another query to make. Do so only in case of errors, before returning.Relevant values are now stored in rows and fields
            if(err){
                //console.log("Error Here 2 -> " + err);
                connection.release();
                res.sendStatus(500);
                return;
            }

            if(typeof rows[0] != 'undefined'){ // If email exists in database
                connection.release();
                res.sendStatus(400);
            }
            else {
                // If user is new, add details to the database and create a new entry
                connection.query(addUserQuery,[req.body.first_name,req.body.last_name,req.body.username,req.body.email,req.body.phone,hashedpword,req.body.is_manager,req.body.is_official], function(err,rows,fields){
                    connection.release();
                    if(err){
                        //console.log("Error Here 2 -> " + err);
                        res.sendStatus(500);
                        return;
                    }
                    res.sendStatus(200); // Success. Return to admindash.js xhttp request
                });
            }
        });
    });
});

// Activated when user submits login form
router.post('/login',async function(req, res, next){
    var username = req.body.uname; // Requests user's username input from login form
    var pass = req.body.psw; // Requests user's password input from login form

    req.pool.getConnection(function(err,connection){ // Requests connection to database. 'connection' is the connection to the db
       if(err){
           //console.log("Error Here 1 -> " + err);
           res.sendStatus(500);
           return;
       }

        var query = "SELECT * FROM User WHERE username = ?";
        connection.query(query,[username],async function(err,rows,fields){ // Takes query and the function to run when the query returns the results (Username matching username).
            connection.release(); // Once the data is found, release the connection to the sql db. Relevant values are now stored in rows and fields
            if(err){
                //console.log("Error Here 2 -> " + err);
                res.sendStatus(500);
                return;
            }

            if ( typeof(rows[0]) == 'undefined') {
                //It's bad to just redirect but it will do for now :/
                res.redirect('https://ide-3b11fbcefc8643ed8aabbde2d063795b-8080.cs50.ws/');
            } else {
                //compares entered pass with hashed pass stored in db
                const comparison = await bcrypt.compare(pass, rows[0].password);
                console.log(comparison);
                if(typeof(rows[0]) == 'undefined'){ // If there is no password set at all redirect to home page
                    res.redirect('https://ide-3b11fbcefc8643ed8aabbde2d063795b-8080.cs50.ws/');
                } else {
                    var redirectURL = "/users/redirect";
                    if (rows[0].is_manager === 1){
                        redirectURL = "/users/redirect_manager";
                    }
                    else if (rows[0].is_official === 1){
                        redirectURL = "/users/redirect_official";
                    }
                    console.log(rows[0].password + " | " + pass); // Logs the db password | compared to input pass
                    if(comparison){ // If the input password is equal to the hashed sql password then set session user and redirect
                        req.session.user = username; // Sets session user id to username. If this exists the user is logged in else not logged in. (This is used in other routes below)
                        res.redirect(301, redirectURL);
                        console.log(req.session.user + " has logged in."); // Session id
                    }
                    else {
                        //res.sendStatus(401); // 401 Unauthorised, Failed login /* HEY PATRICK: This probably won't work, not sure if we can combine sendStatus and redirect; it will send 401 message and terminate */
                        res.redirect(401, 'https://ide-3b11fbcefc8643ed8aabbde2d063795b-8080.cs50.ws/'); // Redirect to home page for now. Will likely use vue.js with this.
                    }
                }
            }





            // Should we check for username match, just in case the above if does not catch it? Or will it catch it all the time?    We need to


        });
    });
});

// a login route for people who choose to sign-in with their google accounts
router.post('/login_google',function(req, res, next){
    if('token' in req.body){
        // Function call to verify the Google login token
        async function verify() {
          const ticket = await client.verifyIdToken({
              idToken: req.body.token,
              audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
              // Or, if multiple clients access the backend:
              //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
          });
          const payload = ticket.getPayload();
          req.session.user = payload['email'];
          console.log(req.session.user + " has logged in with Google."); // Session id
          res.sendStatus(200);
          // If request specified a G Suite domain:
          // const domain = payload['hd'];
        }
        verify().catch( function(){ res.sendStatus(401); } );
    }
});


router.post('/facebook_callback', function(req,res,next){
   console.log("request body: " + req.body);
   if(req.body){
       console.log("Your session has been saved, welcome " + req.body.email);
       req.session.user = req.body.email ;
       res.sendStatus(200);
   }
   else {
       res.sendStatus(401);
   }
});

// We need to forbid access to checkin.html for users who are not logged in 401/303. Because a user not logged in can access the page by adding /checkin.html in the url.

// *** IMPORTANT - Any request after this middleware will send a 401 error is the user is NOT logged in. ***
//Checks every request
router.use(function(req, res, next){
    if ('user' in req.session || 'token' in req.session || req.user){
        next();
    }
    else{
        res.sendStatus(401); // User is not logged in
        console.log("User is not logged in.");
    }
});

// WILL NOT WORK if called through AJAX
router.get('/redirect', function(req, res, next){
    //if('user' in req.session || 'token' in req.session) {// If the user information is present in the session
        console.log(req.session.user + " has loaded a page.");
        res.redirect('https://ide-3b11fbcefc8643ed8aabbde2d063795b-8080.cs50.ws/checkin.html');
    //}
})

// route to redirect to manager dashboard
router.get('/redirect_manager', function(req,res,next){
    console.log(req.session.user + " has loaded a page.");
    res.redirect('https://ide-3b11fbcefc8643ed8aabbde2d063795b-8080.cs50.ws/venuedash.html');
});

// route to redirect to health_official dashboard
router.get('/redirect_official', function(req,res,next){
    console.log(req.session.user + " has loaded a page.");
    res.redirect('https://ide-3b11fbcefc8643ed8aabbde2d063795b-8080.cs50.ws/admindash.html');
});

router.post('/logout', function(req, res, next){

    if ('user' in req.session){
        console.log(req.session.user + " has logged out.");
        delete req.session.user; // Deletes user session
    } else if('token' in req.session){
        console.log(req.session.token + " has logged out.");
        delete req.session.token; // Deletes user session
    }

    res.send('https://ide-3b11fbcefc8643ed8aabbde2d063795b-8080.cs50.ws/'); // Redirects to homepage
});

// Check user permission (Can only have 1 permission or none at all)
router.get('/checkPermission', function(req, res, next) {
    req.pool.getConnection(function(err,connection){ // Requests connection to database. 'connection' is the connection to the db
        if(err){
            console.log("Check permission route error -> " + err);
            res.sendStatus(500);
            //return;
        }

        var query = "SELECT * FROM User WHERE username = ?";

        connection.query(query,[req.session.user],function(err,rows,fields){ // Takes query and the function to run when the query returns the results (Username matching username).
            connection.release(); // Once the data is found, release the connection to the sql db. Relevant values are now stored in rows and fields
            if(err){
                console.log("Check permission route error 2 -> " + err);
                res.sendStatus(500);
                return;
            }

            if(typeof(rows[0]) == 'undefined'){
                // error management code here
                console.log("UNDEFINED USER IN CHECK PERMISSION");
            }

            console.log("is_official check");
            switch (rows[0].is_official) {
                // Not health official
                case 0:
                    if (rows[0].is_manager==0) { // Checks if user is a manager
                        res.send("NoPermission");
                        //res.sendStatus(200);
                        break;
                    } else {
                        res.send(("IsManager"));
                        //res.sendStatus(200);
                        break;
                    }
                // Is health official
                case 1:
                    res.send("IsOfficial");
                    //res.sendStatus(200);
                    break;
                default:
                    //res.send("Error!");
                    res.sendStatus(400);
            }
            console.log("is_official pass");
        });
    });
});

router.post('/changePersonalInformation', function(req, res, next){

    console.log("Changing information of user: " + req.body.given_name + " " + req.body.last_name);

    req.pool.getConnection(function(err,connection){ // Requests connection to database. 'connection' is the connection to the db
        if(err){
           console.log("Change PI error 1 -> " + err);
           res.sendStatus(500);
           return;
        }

        var query = "SELECT * FROM User WHERE username = ?";
        var updatePersonalInfo = "UPDATE User SET ";
        //var endOfQuery = "WHERE username = ?;";
        //var addUserQuery = "INSERT INTO User(given_name, last_name, username, email, phone_number, password, is_manager) VALUES (?,?,?,?,?,?,?)";
        // UPDATE User SET

        // Check if user is in the database
        connection.query(query,[req.session.user], async function(err,rows,fields){
            // Release connection here?
            if(err){
                console.log("Change PI error -> " + err);
                connection.release();
                res.sendStatus(500);
                return;
            }

            const comparison = await bcrypt.compare(req.body.old_password, rows[0].password);
            // Check password match or not
            if (comparison) {
                // Comparison passed
            } else {
                connection.release(); // release here but it gives an error of already releasing
                console.log("The password you entered in old password did not match your current password!");
                res.sendStatus(400); // Return.
                return;
            }

            var endOfQuery = " WHERE username = ?";
            //endOfQuery = endOfQuery + "'" + req.session.user + "'" + ";";

            var count = 0;
            //loop items in object. Would have used a different loop to get it working
            for (property in req.body) {
                count++;
                if (`${req.body[property]}` == '') {
                    console.log("Null value detected");
                    // Do nothing for now, i think. Have not tested yet
                    continue; // Goes to next property in the user input object
                } else {
                    if (`${property}` == 'password') { // If password. Was if count == 6
                        let inputPass = `${req.body[property]}`; // Store the input password
                        console.log("Password before hash: " + inputPass);
                        const encryptedpass = await bcrypt.hash(inputPass, saltRounds); // encrypt password
                        console.log("Password after hash: " + encryptedpass);
                        updatePersonalInfo = updatePersonalInfo.concat(`${property} = ` + `"${encryptedpass}"` + " "); // no comma bc password is always last unless undefined
                    } else if (count > 6) {
                        console.log("exits loop");
                        break; // Do nothing
                    } else {
                        updatePersonalInfo = updatePersonalInfo.concat(`${property} = '${req.body[property]}'` + ","); // Add comma to jquery
                    }
                }
            }
            if (req.body.password == '') {
                console.log("REMOVING COMMA");
                updatePersonalInfo = updatePersonalInfo.slice(0, updatePersonalInfo.length - 1); // Remove comma
            }
            //const hashedpword = await bcrypt.hash(password, saltRounds);   Creates encrypted version
            //const comparison = await bcrypt.compare(pass, rows[0].password);  Compares encrypted pass with version stored in DB

            updatePersonalInfo = updatePersonalInfo.concat(endOfQuery); // Add endOfQuery to the end ofquery

            console.log(updatePersonalInfo); // Logs query for debugging. No problem here

            connection.query(updatePersonalInfo, [req.session.user], function(err, rows, fields) { // Session user is unchanged so no problem here
                connection.release();
                if(err){
                    console.log("Error Here 2 -> " + err);
                    res.sendStatus(500);
                    return;
                }
                req.session.user = req.body.username; // So user can access the page after
                console.log(req.session.user + " Look here");
                res.sendStatus(200); // Success. Return to account.js xhttp request
            });
        });
    });
});

router.post('/changeVenueInformation', function(res, req, next) {

    req.pool.getConnection(function(err,connection){ // Requests connection to database. 'connection' is the connection to the db
        console.log("Check connection");
        if(err){
           console.log("Change VI error 1 -> " + err);
           res.sendStatus(500);
           return;
        }
        console.log("Connection Success!");

        var query1 = "SELECT * FROM User WHERE username = ?";
        var updateVenueInfo = "UPDATE Venue SET ";

        // Check if user is in the database
        connection.query(query1,[req.session.user], async function(err,rows,fields){
            if(err){
                console.log("Change VI error -> " + err);
                connection.release();
                res.sendStatus(500);
                return;
            }

            // Set user id to manager id
            var managerID = rows[0].user_id;
            var query2 = "SELECT * FROM Venue WHERE manager_id = ?";

            connection.query(query2, [managerID], function(err, rows, fields) { // Search for manager id in Venue
                // Release connection here?
                if(err){
                    console.log("Change VI error -> " + err);
                    connection.release();
                    res.sendStatus(500);
                    return;
                }

                var endOfQuery = " WHERE manager_id = ?";

                var count = 0;
                //loop items in object. Would have used a different loop to get it working
                for (property in req.body) {
                    count++;
                    if (`${req.body[property]}` == '') {
                        console.log("Null value detected");
                        // Do nothing for now, i think. Have not tested yet
                        continue; // Goes to next property in the user input object
                    } else {
                        if (`${property}` == 'venue_phone') { // If password. Was if count == 6
                            updateVenueInfo = updateVenueInfo.concat(`${property} = '${req.body[property]}'` + " "); // no comma bc password is always last unless undefined
                        } else if (count > 6) {
                            console.log("exits loop");
                            break; // Do nothing
                        } else {
                            updateVenueInfo = updateVenueInfo.concat(`${property} = '${req.body[property]}'` + ","); // Add comma to jquery
                        }
                    }
                }
                if (req.body.venue_phone == '') {
                    console.log("REMOVING COMMA");
                    updateVenueInfo = updateVenueInfo.slice(0, updateVenueInfo.length - 1); // Remove comma
                }

                updateVenueInfo = updateVenueInfo.concat(endOfQuery); // Add endOfQuery to the end ofquery

                console.log(updateVenueInfo); // Logs query for debugging. No problem here

                connection.query(updateVenueInfo, [managerID], function(err, rows, fields) { // Session user is unchanged so no problem here
                    connection.release();
                    if(err){
                        console.log("Error Here 2 -> " + err);
                        res.sendStatus(500);
                        return;
                    }
                    req.session.user = req.body.username; // So user can access the page after
                    res.sendStatus(200); // Success. Return to account.js xhttp request
                });
            });
        });
    });
});

module.exports = router;