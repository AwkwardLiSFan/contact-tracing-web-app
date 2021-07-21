// function to close the login dialog box
function closeLogPopUp() {
    document.getElementById('idlog').style.display='none';
}

// function to open the login dialog box
function openLogPopUp() {
    document.getElementById('idlog').style.display='block';
}

// function to close the register dialog box
function closeRegPopUp() {
    document.getElementById('idreg').style.display='none';
}

// function to open the register dialog box
function openRegPopUp() {
    document.getElementById('idreg').style.display='block';
}

//function to logout
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

// function to register new user
function registerNewUser(){

      // Collects all input data
      var new_profile = {
            first_name: document.getElementById('popfname').value,
            last_name: document.getElementById('poplname').value,
            email: document.getElementById('popemail').value,
            phone: document.getElementById('poptel').value,
            username: document.getElementById('popusername').value,
            password: document.getElementById('poppassword').value,
            is_manager: document.getElementById('manager_bool').checked,
            is_official: false
      };

      // create AJAX request
      var xhttp = new XMLHttpRequest();

      // define function to run on response
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
                alert("Success! Please login to your account using chosen username/password.");
                window.location.assign('https://ide-3b11fbcefc8643ed8aabbde2d063795b-8080.cs50.ws/'); // Redirect
        } else if (this.readyState == 4 && this.status == 400){
                alert("You already have an account with us! Please login.");
                window.location.assign('https://ide-3b11fbcefc8643ed8aabbde2d063795b-8080.cs50.ws/'); // Redirect
        }
      };

      xhttp.open('POST', '/users/register', true);
      xhttp.setRequestHeader("Content-type", "application/json");
      xhttp.send(JSON.stringify(new_profile));
}

function changePersonalInformation() {
    var updateProfile = {
        given_name: document.getElementById('fname').value,
        last_name: document.getElementById('lname').value,
        username: document.getElementById('username').value,
        email: document.getElementById('email').value,
        phone_number: document.getElementById('phone').value,
        password: document.getElementById('pwd').value, // # 6 index in users.js.
        old_password: document.getElementById('pwd_old').value,
        confirm_password: document.getElementById('pwd_conf').value
    };

    // Error checking
    // if (updateProfile.password != updateProfile.old_password) {
    //     alert("Make sure your new password and confirm password match!");
    //     return 0; // Not sure if this will break something, just want to exit the function here without running the stuff below.
    // }

    // create AJAX request
    var xhttp = new XMLHttpRequest();

    // define function to run on response
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            alert("Success! Your Personal Information has been changed.");
            window.location.assign('https://ide-3b11fbcefc8643ed8aabbde2d063795b-8080.cs50.ws/account.html'); // Redirect
        } else if (this.readyState == 4 && this.status == 400){ // Password didn't match
            alert("Your password was incorrect :/");
            window.location.assign('https://ide-3b11fbcefc8643ed8aabbde2d063795b-8080.cs50.ws/account.html'); // Redirect
        }
    };

    xhttp.open('POST', '/users/changePersonalInformation', true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(updateProfile));
}

function changeVenueInformation() {
    var updateVenue = {
        venue_name: document.getElementById('cname').value,
        venue_address: document.getElementById('address2').value,
        venue_capacity: document.getElementById('cap').value,
        manager_id: document.getElementById('name').value,
        venue_phone: document.getElementById('vphone').value
    };

    // create AJAX request
    var xhttp = new XMLHttpRequest();

    // define function to run on response
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            alert("Success! Your Venue Information has been changed.");
            window.location.assign('https://ide-3b11fbcefc8643ed8aabbde2d063795b-8080.cs50.ws/account.html'); // Redirect
        } else if (this.readyState == 4 && this.status == 400){ // Password didn't match
            alert("Something went wrong!");
            window.location.assign('https://ide-3b11fbcefc8643ed8aabbde2d063795b-8080.cs50.ws/account.html'); // Redirect
        }
    };

    xhttp.open('POST', '/users/changeVenueInformation', true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(updateVenue));
}

// On successful Google sign in
function onSignIn(googleUser) {
      var profile = googleUser.getBasicProfile();

      var id_token = { token: googleUser.getAuthResponse().id_token }; // Token sent back from Google

      // DISCONNECT in order to prevent auto-login right after logout, as user is still logged into Google
      googleUser.disconnect();

      // create AJAX request
      var xhttp = new XMLHttpRequest();
      // define function to run on response
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
                alert("Welcome");
                console.log(this.responseText);
                window.location.assign('https://ide-3b11fbcefc8643ed8aabbde2d063795b-8080.cs50.ws/checkin.html');
        } else if (this.readyState == 4 && this.status >= 400){
                alert("login failed");
        }
      };
      xhttp.open('POST', '/users/login_google', true);
      xhttp.setRequestHeader("Content-type", "application/json");
      xhttp.send(JSON.stringify(id_token));
}

// Check user permission when account.html body loads
// Currently loads after body of page which is not preferable
function checkPermission() {

    // create AJAX request
      var xhttp = new XMLHttpRequest();

      // define function to run on response
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            switch (this.responseText) {
                case "NoPermission":
                    document.getElementById("vm").style.display = "none";
                    document.getElementById("bcvm").style.display = "none";
                    document.getElementById("pSearch").style.display = "none";
                    break;
                case "IsManager":
                    document.getElementById("bcu").style.display = "none";
                    document.getElementById("vSearch").style.display = "none";
                    document.getElementById("pSearch").style.display = "none";
                    break;
                case "IsOfficial":
                    // Restrict nothing
                    break;
                default:
                    alert("Permission Error!");
                    window.location.assign('https://ide-3b11fbcefc8643ed8aabbde2d063795b-8080.cs50.ws/');
            }
        } else if (this.readyState == 4 && this.status == 400) {
            alert("Permission Failed!");
            window.location.assign('https://ide-3b11fbcefc8643ed8aabbde2d063795b-8080.cs50.ws/');
        }
      };

      xhttp.open('GET', '/users/checkPermission', false);
      xhttp.send(); // Does not need to send anything. Only requests and returns data
}
