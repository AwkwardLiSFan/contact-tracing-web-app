var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    proxy: 'http://194.195.253.34',
    auth: {
        user: 'bojackfan431@gmail.com',
        pass: 'asdaue@#!234'
    }
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// route to load current details of admin on Account page
router.get('/loaduserprofile', function(req,res,next){
    req.pool.getConnection(function(err,connection) {
            if (err) {
            res.sendStatus(500);
            return;
            }

            // get details of user currently logged in
            var query = "SELECT given_name, last_name, email, phone_number, username, password FROM User WHERE user_id = (SELECT user_id FROM User WHERE username = ?)";
            connection.query(query, [req.session.user],function (err, rows, fields) {
                 connection.release();
                 if (err){
                       res.sendStatus(500);
                       return;
                 }
                 res.json(rows[0]);
            });
    });
});

// route to update a user's profile data in the database
router.post('/updateuserprofile', function(req,res,next){
    req.pool.getConnection(function(err,connection) {
            if (err) {
            res.sendStatus(500);
            return;
            }

            // udpate the details of user currently logged in
            var query = "UPDATE User SET given_name = ?, last_name = ?, email = ?, phone_number = ?, username = ?, password = ? WHERE username = ?";
            connection.query(query, [req.body.given_name, req.body.last_name, req.body.email, req.body.phone_number, req.body.username, req.body.password, req.session.user],function (err, rows, fields) {
                 connection.release();
                 if (err){
                       res.sendStatus(500);
                       return;
                 }
                 res.sendStatus(200);
            });
    });
});

// route to update the selected user's profile
router.post('/updateselectedprofile', function(req,res,next){
    req.pool.getConnection(function(err,connection) {
            if (err) {
            res.sendStatus(500);
            return;
            }

            // udpate the details of user currently logged in
            var query = "UPDATE User SET given_name = ?, last_name = ?, email = ?, phone_number = ?, username = ?, password = ? WHERE username = ?";
            connection.query(query, [req.body.given_name, req.body.last_name, req.body.email, req.body.phone_number, req.body.username, req.body.password, req.body.username],function (err, rows, fields) {
                 connection.release();
                 if (err){
                       res.sendStatus(500);
                       return;
                 }
                 res.sendStatus(200);
            });
    });
});

// route to update the selected venue info
router.post('/updateselectedvenue', function(req,res,next){
    req.pool.getConnection(function(err,connection) {
            if (err) {
            res.sendStatus(500);
            return;
            }

            // udpate the details of user currently logged in
            var query = "UPDATE Venue SET venue_name = ?, venue_address = ?, venue_capacity = ?, venue_phone = ?, venue_type = ? WHERE venue_name = ?";
            connection.query(query, [req.body.venue_name, req.body.venue_address, req.body.venue_capacity, req.body.venue_phone, req.body.venue_type, req.body.venue_name],function (err, rows, fields) {
                 connection.release();
                 if (err){
                       res.sendStatus(500);
                       return;
                 }
                 res.sendStatus(200);
            });
    });
});

// route to display all the venues the user has checked into
router.get('/showallvenues', function(req,res,next){
    //connect to the database
    req.pool.getConnection(function(err,connection){
        if(err){
            res.sendStatus(500);
        }

        var query = "SELECT Venue.venue_name, Venue.venue_address, Venue.venue_type, checkInHistory.time FROM Venue, checkInHistory WHERE checkInHistory.v_id = Venue.venue_id AND checkInHistory.u_id = (SELECT user_id FROM User WHERE username = ?)";

        connection.query(query, [req.session.user], function(err, rows, fields){
            connection.release();
            if(err){
                res.sendStatus(500);
            }
            res.json(rows); // Sends an array of RowDataPacket objects. Check users.js if confused on how to handle this data
        });
    });
});

// route to get check-in history for selected user (Admin feature)
router.post('/showchosenuserhistory', function(req,res,next){
    //connect to the database
    req.pool.getConnection(function(err,connection){
        if(err){
            res.sendStatus(500);
        }

        var query = "SELECT Venue.venue_name, Venue.venue_address, Venue.venue_type, checkInHistory.time FROM Venue, checkInHistory WHERE checkInHistory.v_id = Venue.venue_id AND checkInHistory.u_id = (SELECT user_id FROM User WHERE username = ?)";

        connection.query(query, [req.body.username], function(err, rows, fields){
            connection.release();
            if(err){
                res.sendStatus(500);
            }
            res.json(rows); // Sends an array of RowDataPacket objects. Check users.js if confused on how to handle this data
        });
    });
});

//route to display all venues
router.get('/showvenues', function(req,res,next){
    //connect to the database
    req.pool.getConnection(function(err,connection){
        if(err){
            res.sendStatus(500);
        }

        var query = "SELECT Venue.venue_name, Venue.venue_type FROM Venue";

        connection.query(query, function(err, rows, fields){
            connection.release();
            if(err){
                res.sendStatus(500);
            }
            res.json(rows); // Sends an array of RowDataPacket objects. Check users.js if confused on how to handle this data
        });
    });
});

// route to display all the users existing in the database (Admin view only)
router.get('/showallusers', function(req,res,next){
    //connect to the database
    req.pool.getConnection(function(err,connection){
        if(err){
            res.sendStatus(500);
        }

        var query = "SELECT User.given_name, User.last_name, User.username FROM User";

        connection.query(query, function(err, rows, fields){
            connection.release();
            if(err){
                res.sendStatus(500);
            }
            res.json(rows); // Sends an array of RowDataPacket objects. Check users.js if confused on how to handle this data
        });
    });
});

// route to get history of check-ins for a venue
router.get('/showallvisitors', function(req,res,next){
    //connect to the database
    req.pool.getConnection(function(err,connection){
        if(err){
            res.sendStatus(500);
        }

        var query = "SELECT User.given_name, User.last_name, User.phone_number, checkInHistory.time FROM User INNER JOIN checkInHistory ON checkInHistory.u_id = User.user_id WHERE v_id = (SELECT venue_id FROM Venue WHERE Venue.manager_id = (SELECT User.user_id FROM User WHERE username = ?))";

        connection.query(query, [req.session.user], function(err, rows, fields){
            connection.release();
            if(err){
                res.sendStatus(500);
            }
            res.json(rows); // Sends an array of RowDataPacket objects. Check users.js if confused on how to handle this data
        });
    });
});

// route to get history of check-ins for a selected venue (Admin feature)
router.post('/showchosenvenuehistory', function(req,res,next){
    //connect to the database
    req.pool.getConnection(function(err,connection){
        if(err){
            res.sendStatus(500);
        }

        var query = "SELECT User.given_name, User.last_name, User.phone_number, checkInHistory.time FROM User INNER JOIN checkInHistory ON checkInHistory.u_id = User.user_id WHERE checkInHistory.v_id = (SELECT venue_id FROM Venue WHERE venue_name=?)";

        connection.query(query, [req.body.venue_name], function(err, rows, fields){
            connection.release();
            if(err){
                res.sendStatus(500);
            }
            res.json(rows); // Sends an array of RowDataPacket objects. Check users.js if confused on how to handle this data
        });
    });
});

//route to get profile data of selected user
router.post('/getuserdata', function(req,res,next){
    //connect to the database
    console.log("We have received: " + req.body);
    req.pool.getConnection(function(err,connection){
        if(err){
            res.sendStatus(500);
        }

        var query = "SELECT * FROM User WHERE username=?";

        connection.query(query, [req.body.username], function(err, rows, fields){
            connection.release();
            if(err){
                res.sendStatus(500);
            }
            res.json(rows[0]); // Sends an array of RowDataPacket objects. Check users.js if confused on how to handle this data
        });
    });
});

//route to get venue details from venue name
router.post('/getselectedvenue', function(req,res,next){
    //connect to the database
    console.log("We have received: " + req.body);
    req.pool.getConnection(function(err,connection){
        if(err){
            res.sendStatus(500);
        }

        var query = "SELECT * FROM Venue WHERE venue_name=?";

        connection.query(query, [req.body.venue_name], function(err, rows, fields){
            connection.release();
            if(err){
                res.sendStatus(500);
            }
            res.json(rows[0]); // Sends an array of RowDataPacket objects. Check users.js if confused on how to handle this data
        });
    });
});

router.get('/gethotspots', function(req, res, next) {
    req.pool.getConnection(function(err,connection){
        if(err){
            res.sendStatus(500);
            return;
        }

        var query = "SELECT Venue.venue_id, Venue.venue_name, Venue.venue_type, Venue.venue_capacity, Venue.venue_address, Venue.venue_xcoordinate, Venue.venue_ycoordinate, Hotspot.hotspot_intensity FROM Venue LEFT JOIN Hotspot ON Venue.venue_id=Hotspot.v_id";

        connection.query(query, function(err, rows, fields){
            connection.release();
            if(err){
                res.sendStatus(500);
            }
            res.json(rows); // Sends an array of RowDataPacket objects. Check users.js if confused on how to handle this data
        });
    });
});

router.post('/addHotspot', function(req,res,next){
    req.pool.getConnection(function(err,connection) {
        if (err) {
        res.sendStatus(500);
        return;
        }

        // udpate the details of user currently logged in
        var query = "INSERT INTO Hotspot (v_id,hotspot_intensity) VALUES (?,?)";
        connection.query(query, [req.body.v_id,req.body.hotspot_intensity], function (err, rows, fields) {
             connection.release();
             if (err){
                   res.sendStatus(500);
                   return;
             }
             res.sendStatus(200);
        });
    });
});

router.post('/removeHotspot', function(req,res,next){
    req.pool.getConnection(function(err,connection) {
        if (err) {
        res.sendStatus(500);
        return;
        }

        // udpate the details of user currently logged in
        var query = "DELETE FROM Hotspot WHERE v_id = ?";
        connection.query(query, [req.body.v_id], function (err, rows, fields) {
             connection.release();
             if (err){
                   res.sendStatus(500);
                   return;
             }
             res.sendStatus(200);
        });
    });
});

// router.post('/updatehotspots', function(req, res, next) {
//     req.pool.getConnection(function(err,connection){
//         if(err){
//             res.sendStatus(500);
//             return;
//         }

//         var spots = [];
//         var send1 = 0, send2 = 0;

//         var queryA = "INSERT INTO Hotspot (v_id, intensity) VALUES ";
//         var queryR = "DELETE * FROM Hotspot WHERE v_id IN ";

//         for (var i=1;i<req.body.count;i++) {
//             if (req.body[i].cmd == 0) {
//                 queryR = queryR + req.body[i].venue_id + ',';
//             } else if (req.body[i].cmd == 1) {
//                 queryA = queryA + "(" + req.body[i].venue_id + ", 2)";
//                 if (i<req.body.count) {
//                     queryA = queryA + ",";
//                 }
//             }
//         }

//         connection.query(queryA, function(err, rows, fields){
//             connection.release();
//             if(err){
//                 res.sendStatus(500);
//             }
//         });
//         connection.query(queryR, function(err, rows, fields){
//             connection.release();
//             if(err){
//                 res.sendStatus(500);
//             }
//         });
//     });
// });


// route to get data from server based on user's preferences which are recorded in req.body
router.post('/notifications', function(req,res,next){
    console.log(req.body.hotspotList + " " + req.body.visitAlert);
    var queryResults = [];
    // if user has requested a list of all hotspots
    if(req.body.hotspotList == true){



        // get list of hotspots from database
        // STEP 1: Request connection to database; check for errors
        req.pool.getConnection(function(err,connection){
            if(err){
               res.sendStatus(500);
               return;
            }

            //STEP 2: Get the user's email address
            var query = "SELECT email FROM User WHERE username = ?";
            connection.query(query, [req.session.user], function(err,rows,fields){
                if(err){
                    res.sendStatus(500);
                    return ;
                }
                else {
                    queryResults.push(rows[0].email);
                    console.log(queryResults[0]);
                }

                // STEP 3: Get a list of all active hotspots
                var hotspotsQuery = "SELECT DISTINCT Venue.venue_name, Venue.venue_address, Venue.venue_phone, Venue.venue_type FROM Venue, Hotspot WHERE Hotspot.v_id = Venue.venue_id";
                connection.query(hotspotsQuery, function(err,rows,fields){ // Takes query and the function to run when the query returns the results (Username matching username).
                    //connection.release();
                    if(err){
                        res.sendStatus(500);
                        return;
                    }
                    for (let i = 0 ; i < rows.length; i++ ){
                        console.log(rows[i].venue_name + " " + rows[i].venue_address + " " + rows[i].venue_phone + " " + rows[i].venue_type);
                        queryResults.push(JSON.stringify(rows[i]));
                    }
                    console.log("Current hotspots are: " + queryResults);
                    //res.json(queryResults);

                    if(req.body.visitAlert == true)
                    {
                        //find all hotspot visits made by the person who is logged in
                        console.log('okay this is being reached');
                        var hotspotQuery = "SELECT DISTINCT Venue.venue_name, Venue.venue_address, Venue.venue_phone, Venue.venue_type, checkInHistory.time FROM Venue, checkInHistory, Hotspot  WHERE checkInHistory.v_id = Venue.venue_id AND Venue.venue_id = Hotspot.v_id AND checkInHistory.u_id = (SELECT user_id FROM User WHERE username=?)";
                        connection.query(hotspotQuery, [req.session.user], function(err,rows,fields){ // Takes query and the function to run when the query returns the results (Username matching username).
                            connection.release();
                            if(err){
                                res.sendStatus(500);
                                return;
                            }

                            for (let i = 0 ; i < rows.length; i++ ){
                                console.log(rows[i].venue_name + " " + rows[i].venue_address + " " + rows[i].venue_phone + " " + rows[i].venue_type);
                                queryResults.push(JSON.stringify(rows[i]));
                            }

                            console.log("Current value of array is: " + queryResults);
                            res.json(queryResults);
                        });
                    }
                    else {
                        connection.release() ;
                        res.json(queryResults) ;
                    }

                });
            });
        });
    }
    else
        res.sendStatus(500);
});

router.post('/email',function(req,res,next){

    // verify connection configuration
    transporter.verify(function(error, success) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email processed");
      }
    });

    console.log("Sending to: " + req.body.recipient + " the message: " + req.body.text);

    let info = transporter.sendMail({
       from: 'bojackfan431@gmail.com', // sender address
       to: req.body.recipient, // list of receivers
       subject: 'Covid Tracers Notification', // subject of email
       text: req.body.text, // body of email
       html: "<p>" + req.body.text + "</p>" // html body
    });

    res.sendStatus(200) ;
});

// route to insert a check-in into the database
router.post('/checkdata', function(req, res, next) {
      const q=req.body.q;
      console.log("/checkdata reached, user is: " + req.session.user) ;
      req.pool.getConnection( function(err,connection) {
            if (err) {
            res.sendStatus(500);
            return;
            }

            // insert check in data to checkinhistory
            var query = "INSERT INTO checkInHistory (u_id, v_id, time) VALUES ((SELECT user_id FROM User WHERE username = ?), ?, NOW())"; //need to figure out how to grab user ID else can make an extra field
            connection.query(query, [req.session.user, q],function (err, data) {
                 connection.release();
                 if (err){
                       res.sendStatus(500);
                       return;
                 }
            });
      });
      res.redirect('users/redirect');
});

module.exports = router;
