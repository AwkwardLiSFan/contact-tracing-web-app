// empty array to assign all the venues into
venue_list = [];

// retrieve list of all venues as JSON data and assign to empty array created above
window.onload = function loadUsers(){
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
     console.log("accessed database") ;
     user_list = JSON.parse(this.responseText);
     console.log(user_list);
     displayUsers(user_list);
    }
  };
  xhttp.open("GET", "/showallvisitors", true);
  xhttp.send();
};

// function to display the JSON data retrieved from the DB
function displayUsers(arr) {
    var i;
    for(i = 0; i < arr.length; i++) {
        new_row = document.createElement("TR");
        ugname = document.createElement("TD");
        ulname = document.createElement("TD");
        uphone = document.createElement("TD");
        utime = document.createElement("TD");
        ugname.innerText = arr[i].given_name;
        ulname.innerText = arr[i].last_name;
        uphone.innerText = arr[i].phone_number;
        utime.innerText = arr[i].time;
        new_row.appendChild(ugname);
        new_row.appendChild(ulname);
        new_row.appendChild(uphone);
        new_row.appendChild(utime);
        document.getElementById("add_here").appendChild(new_row);
    }
}