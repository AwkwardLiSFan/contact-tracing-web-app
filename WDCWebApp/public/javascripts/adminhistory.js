// function to logout of the current session
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
        xhttp.open("POST", "/users/logout", true);
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

// Check if the element clicked on is a username/venue name. If yes, then display further details regarding the same
window.onclick = e => {
    if(e.target.className == 'clickable'){
        console.log(e.target.innerText);
        document.getElementById('uh').style.display = "block";
        var p = {
            username: e.target.innerText
        };

        // seeing if data exists in the table before loading new user's check-ins; if yes, delete
        var table = document.getElementById("selected_user_history_here");
        var childCount = document.getElementById("selected_user_history_here").childElementCount;
        if(childCount !== 0)
        {
            for(var i = 0 ; i < childCount; i++)
                table.removeChild(table.childNodes[i]);
        }

        loadUserHistory(p) ;
    }
    else if(e.target.className == 'venue-clickable'){
        document.getElementById('vh').style.display = "block";
        var q = {
            venue_name: e.target.innerText
        };
        // seeing if data exists in the table before loading new user's check-ins; if yes, delete
        var v_table = document.getElementById("selected_venue_history_here");
        var v_childCount = v_table.childElementCount;
        if(v_childCount !== 0)
        {
            for(var j = 0 ; j < v_childCount; j++)
            v_table.deleteRow(j);
        }

        loadVenueHistory(q) ;
    }
};

// empty array to assign all the venues into
var venue_history = [];

// retrieve list of all venues as JSON data and assign to empty array created above
function loadVenueHistory(venue_name){
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
     console.log("accessed database") ;
     venue_history = JSON.parse(this.responseText);
     console.log(venue_history);
     displayVenueHistory(venue_history);
    }
  };
  xhttp.open("POST", "/showchosenvenuehistory", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send(JSON.stringify(venue_name));
}

// function to display the JSON data retrieved from the DB
function displayVenueHistory(arr) {

    for(let i = 0; i < arr.length; i++) {
        var new_row = document.createElement("TR");
        var gname = document.createElement("TD");
        var lname = document.createElement("TD");
        var phone = document.createElement("TD");
        var time = document.createElement("TD");
        gname.innerText = arr[i].given_name;
        lname.innerText = arr[i].last_name;
        phone.innerText = arr[i].phone_number;
        time.innerText = arr[i].time;
        new_row.appendChild(gname);
        new_row.appendChild(lname);
        new_row.appendChild(phone);
        new_row.appendChild(time);
        document.getElementById("selected_venue_history_here").appendChild(new_row);
    }
}


// empty array to assign all the venues into
var user_history = [];

// retrieve list of all venues as JSON data and assign to empty array created above
function loadUserHistory(username){
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
     console.log("accessed database") ;
     user_history = JSON.parse(this.responseText);
     console.log(user_history);
     displayUserHistory(user_history);
    }
  };
  xhttp.open("POST", "/showchosenuserhistory", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send(JSON.stringify(username));
}

// function to display the JSON data retrieved from the DB
function displayUserHistory(arr) {
    var i;
    for(i = 0; i < arr.length; i++) {
        var new_row = document.createElement("TR");
        var vname = document.createElement("TD");
        var vaddress = document.createElement("TD");
        var vtype = document.createElement("TD");
        var vtime = document.createElement("TD");
        vname.innerText = arr[i].venue_name;
        vaddress.innerText = arr[i].venue_address;
        vtype.innerText = arr[i].venue_type;
        vtime.innerText = arr[i].time;
        new_row.appendChild(vname);
        new_row.appendChild(vaddress);
        new_row.appendChild(vtype);
        new_row.appendChild(vtime);
        document.getElementById("selected_user_history_here").appendChild(new_row);
    }
}

