function openForm() {
document.getElementById("checkin-popup").style.display = "block";
}
function closeForm() {
    alert("Successful check-in. Press okay to continue.");
    document.getElementById("checkin-popup").style.display = "none";
}

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

// function receives the user preferences from Dashboard page: do they want list of hotspots and/or alerts about visited hotspots
function notifications(){

    var notificationPreferences = {
        hotspotList: document.getElementById('notif1').checked,
        visitAlert: document.getElementById('notif2').checked
    };

    console.log(notificationPreferences);

    // create AJAX request
    var xhttp = new XMLHttpRequest();

    // define function to run on response
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            //alert("works till here");
            console.log(this.responseText);

            var hotspotsData = (JSON.parse(this.responseText));
            console.log("Received Data on Client-Side: " + hotspotsData);

            // create the email
            var email = hotspotsData[0];
            var body = "List of hotspots: <br><br>" ;
            for(i = 1 ; i < hotspotsData.length; i++){
                hotspotsData[i] = JSON.parse(hotspotsData[i]);
                if(hotspotsData[i].time == undefined){
                    body += "Venue: " + hotspotsData[i].venue_name + "<br>" + "Address: " + hotspotsData[i].venue_address + "<br>" + "Phone: " + hotspotsData[i].venue_phone + "<br>" + "Type: " + hotspotsData[i].venue_type ;
                    body += "<br><br>";
                }
                else {
                    body += "<b><i><p style=\"color:red\">Alert! You visited a hotspot: </i>";
                    body += hotspotsData[i].venue_name + "<br>" + "Address: " + hotspotsData[i].venue_address + "<br>" + "Phone: " + hotspotsData[i].venue_phone + "<br>" + "Type: " + hotspotsData[i].venue_type + "<br>" + "Time of Visit: " + hotspotsData[i].time;
                    body += "<br><br>";
                }
            }
            var emailBody = {
                recipient: email,
                text: body
            };
            console.log(JSON.stringify(emailBody));
            // call the function and pass composed message as body

            // Nested AJAX: now send the
            var xhttp = new XMLHttpRequest();

            // define function to run on response
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    console.log("email sent! please check your email.");
                }
            };
            xhttp.open('POST', '/email', false);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify(emailBody));
        }
    };
    xhttp.open('POST', '/notifications', false);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(notificationPreferences));
}

