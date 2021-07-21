
function logout(){

    var logout = window.confirm("Are you sure you want to log out?");

    if (logout) {
        // create AJAX request
        var xhttp = new XMLHttpRequest();

        // define function to run on response
        xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {

            if (logout) {
                alert("Logging Out");
                window.location.assign(this.responseText); // https://ide-3b11fbcefc8643ed8aabbde2d063795b-8080.cs50.ws/ is sent back from server /logout post
            } // Should have an else statement. You can revert if you don't like the warning before logout. It would have to somehow cancel the post that deletes the user server data.
          }
        };
        xhttp.open('POST', '/users/logout', true);
        xhttp.send();
    } else {
        return 0;
    }
}

// empty array to assign all the users into
var user_list = [];
// empty array to assign all the users into
var venues_list = [];

// retrieve list of all users as JSON data and assign to empty array created above
function loadVenues(){
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
     console.log("accessed database") ;
     venues_list = JSON.parse(this.responseText);
     console.log(venues_list);
     displayVenues(venues_list);
    }
  };
  xhttp.open("GET", "/showvenues", true);
  xhttp.send();
}

// function to display the JSON data retrieved from the DB
function displayVenues(arr) {
    var i;
    for(i = 0; i < arr.length; i++) {
        var new_row = document.createElement("TR");
        var vname = document.createElement("TD");
        var vtype = document.createElement("TD");
        vname.classList.add("venue-clickable");
        vname.innerText = arr[i].venue_name;
        vtype.innerText = arr[i].venue_type;
        new_row.appendChild(vname);
        new_row.appendChild(vtype);
        document.getElementById("add_venues_here").appendChild(new_row);
    }
}
// retrieve list of all users as JSON data and assign to empty array created above
window.onload = function loadUsers(){

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
     console.log("accessed database") ;
     user_list = JSON.parse(this.responseText);
     console.log(user_list);
     displayUsers(user_list);
     loadVenues() ;
    }
  };
  xhttp.open("GET", "/showallusers", true);
  xhttp.send();
};

// function to display the JSON data retrieved from the DB
function displayUsers(arr) {
    var i;
    for(i = 0; i < arr.length; i++) {
        var new_row = document.createElement("TR");
        var ugname = document.createElement("TD");
        var ulname = document.createElement("TD");
        var uname = document.createElement("TD");
        uname.classList.add("clickable");
        ugname.innerText = arr[i].given_name;
        ulname.innerText = arr[i].last_name;
        uname.innerText = arr[i].username;
        new_row.appendChild(ugname);
        new_row.appendChild(ulname);
        new_row.appendChild(uname);
        document.getElementById("add_here").appendChild(new_row);
    }
}

window.onclick = e => {
    if(e.target.className == 'clickable'){
        console.log(e.target.innerText);
        document.getElementById('pi').style.display = "block";
        var p = {
            username: e.target.innerText
        };
        loadDetails(p) ;
    }
    else if(e.target.className == 'venue-clickable'){
    document.getElementById('venues_pi').style.display = "block";
        var q = {
                venue_name: e.target.innerText
            };
            loadDetailsVenues(q) ;
    }
};

function loadDetailsVenues(venue_name){

    // create AJAX request
    var xhttp = new XMLHttpRequest();

    // define function to run on response
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
                // populate the form with received data
                console.log("We got from server: " + this.responseText);
                var userProfile = JSON.parse(this.responseText);
                console.log(userProfile);
                document.getElementById('venue_name').value = userProfile.venue_name;
                document.getElementById('venue_address').value = userProfile.venue_address;
                document.getElementById('venue_capacity').value = userProfile.venue_capacity;
                document.getElementById('venue_phone').value = userProfile.venue_phone;
                document.getElementById('venue_type').value = userProfile.venue_type;
        }
    };
    xhttp.open("POST", "/getselectedvenue", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(venue_name));
}

// function to update the profile information in the database
function updateVenue(){

    // create a JSON object from all the current form values
    var newProfile = {
        venue_name: document.getElementById('venue_name').value,
        venue_address: document.getElementById('venue_address').value,
        venue_capacity: document.getElementById('venue_capacity').value,
        venue_phone: document.getElementById('venue_phone').value,
        venue_type: document.getElementById('venue_type').value
    };

    // create AJAX request
    var xhttp = new XMLHttpRequest();

    // define function to run on response
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log("Profile info successfully updated") ;
        }
    };
    xhttp.open("POST", "/updateselectedvenue", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(newProfile));
}

function loadDetails(username){

    // create AJAX request
    var xhttp = new XMLHttpRequest();

    // define function to run on response
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
                // populate the form with received data
                console.log("We got from server: " + this.responseText);
                var userProfile = JSON.parse(this.responseText);
                console.log(userProfile);
                document.getElementById('fname').value = userProfile.given_name;
                document.getElementById('lname').value = userProfile.last_name;
                document.getElementById('email').value = userProfile.email;
                document.getElementById('phone').value = userProfile.phone_number;
                document.getElementById('username').value = userProfile.username;
                document.getElementById('pwd_old').value = userProfile.password;
        }
    };
    xhttp.open("POST", "/getuserdata", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(username));
}

// function to update the profile information in the database
function updateProfile(){

    // create a JSON object from all the current form values
    var newProfile = {
        given_name: document.getElementById('fname').value,
        last_name: document.getElementById('lname').value,
        email: document.getElementById('email').value,
        phone_number: document.getElementById('phone').value,
        username: document.getElementById('username').value,
        password: document.getElementById('pwd').value
    };

    // create AJAX request
    var xhttp = new XMLHttpRequest();

    // define function to run on response
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log("Profile info successfully updated") ;
        }
    };
    xhttp.open("POST", "/updateselectedprofile", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(newProfile));
}

// function to check if the passwords match
function comparePass(){

    var old_pass = document.getElementById('pwd_old').value;
    var pass1 = document.getElementById('pwd').value;
    var pass2 = document.getElementById('pwd_conf').value;

    if(pass1 == '')
        alert("Please enter a password");
    else if(pass2 == '')
        alert("Please confirm password");
    else if(pass1 !== pass2)
        alert("Passwords do not match! Try again.");
    else if(pass1 === pass2 && pass1 == old_pass)
        alert("Same as current password! Try again.");
    else
        updateProfile();
}


