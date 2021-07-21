// populates the fields in the form with the existing user details in Database
window.onload = function loadDetails(){

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
    xhttp.open("GET", "/loaduserprofile", true);
    xhttp.send();
};

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
    xhttp.open("POST", "/updateuserprofile", true);
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