// close the registration pop up
function closeRegPopUp() {
    document.getElementById('idreg').style.display='none';
}

// open the registration pop up
function openRegPopUp() {
    document.getElementById('idreg').style.display='block';
}

// function to register new user
function registerNewOfficial(){

      // Collects all input data
      var new_profile = {
            first_name: document.getElementById('popfname').value,
            last_name: document.getElementById('poplname').value,
            email: document.getElementById('popemail').value,
            phone: document.getElementById('poptel').value,
            username: document.getElementById('popusername').value,
            password: document.getElementById('poppassword').value,
            is_manager: false,
            is_official: true
      };

      // create AJAX request
      var xhttp = new XMLHttpRequest();

      // define function to run on response
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
                alert("Success!");
                location.reload(); // Refresh page upon success, making future registrations possible
        } else if (this.readyState == 4 && this.status == 400){
                alert("You already have an account with us! Please login.");
                location.reload(); // Refresh in case of error so user can try again
        }
      };

      xhttp.open('POST', '/users/register', true);
      xhttp.setRequestHeader("Content-type", "application/json");
      xhttp.send(JSON.stringify(new_profile));
}