mapboxgl.accessToken = 'pk.eyJ1Ijoid2FsZnVydXMiLCJhIjoiY2twbzB0bjIxMDA4eTJwbzU2Zm1uaHh4bSJ9.Mb9QozZmNjmK9APRKpRqpQ';
var map = new mapboxgl.Map({
  container: 'mapA',
  style: 'mapbox://styles/mapbox/dark-v10',
  center: [138.364, -34.5544],
  zoom: 8
});

var hotspots = [];
var options=[];

function loadHotspots() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      console.log("accessed database") ;
      hotspots = [];
      hotspots = JSON.parse(this.responseText);
      console.log(hotspots);
      updateMap(hotspots);
      updateList(hotspots);
    }
  };
  xhttp.open("GET", "/gethotspots", true);
  xhttp.send();
}

window.onload = loadHotspots();


// function updateHotspots() {
//   var xhttp = new XMLHttpRequest();
//   xhttp.onreadystatechange = function() {
//     if (this.readyState == 4 && this.status == 200) {
//     console.log("accessed database") ;
//     hotspots = JSON.parse(this.responseText);
//     console.log(hotspots);
//     updateMap(hotspots);
//     }
//   };
//   xhttp.open("GET", "/gethotspots", true);
//   xhttp.send();
// }


// // Checkbox one, doesn't work, xD
// function updateHotspots() {

//   var xhttp = new XMLHttpRequest();
//   var cmd = -1;
//   var intensity = -1;
//   var count = 0;
//   var uTable = [];

//   for (var i=0;i<checks.length;i++) {
//     if (checks[i].checked == true) {
//       if (!hotspots[i].hotspot_intensity) {
//         cmd = 1;
//         intensity = 2;
//         count++;
//       }
//     } else if (checks[i].checked == false) {
//       if (hotspots[i].hotspot_intensity) {
//         cmd = 0;
//         intensity = 1;
//         count++;
//       }
//     }
//     var hSpot = {
//       venue_id: i,
//       hotspot_intensity: intensity,
//       cmd: cmd
//     };
//     uTable.push(hSpot);
//   }
//   uTable.unshift(count);

//   xhttp.open('POST', '/updatehotspots', true);
//   xhttp.setRequestHeader("Content-type", "application/json");
//   xhttp.send(JSON.stringify(uTable));

// }


function addHotspot() {
  var dBox = document.getElementById('venues');
  var val = dBox.value;
  console.log(val);
  var n = -1;


  if (hotspots[val].hotspot_intensity === null) {
    var spot = {
      v_id: hotspots[val].venue_id,
      hotspot_intensity: 2
    };

    var xhttp = new XMLHttpRequest();
     xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          alert("Added Hotspot.");
          loadHotspots();
        }
     };

    xhttp.open('POST', '/addhotspot', true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(spot));
  } else {
    alert("Error, duplicate Hotspot.");
  }
}

function removeHotspot() {
  var dBox = document.getElementById('venues');
  var val = dBox.value;
  var n = -1;


  if (hotspots[val].hotspot_intensity > 1) {
    var spot = {
      v_id: hotspots[val].venue_id
    };

    var xhttp = new XMLHttpRequest();
     xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          alert("Removed Hotspot.");
          loadHotspots();
        }
     };

    xhttp.open('POST', '/removehotspot', true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(spot));
  } else {
    alert("Error, not a hotspot.");
  }
}

function updateList(arr) {
  var selectBox = document.getElementById('venues');
  selectBox.options.length = 0;
  for (var i=0;i<arr.length;i++) {
    var name = arr[i].venue_name;
    var opt = document.createElement('option');
    opt.value = i;
    opt.text = name;
    selectBox.appendChild(opt);
    options.push(opt);
  }
}

function updateMap(arr) {
    for (var i=0;i<arr.length;i++) {
        var x = arr[i].venue_xcoordinate;
        var y = arr[i].venue_ycoordinate;
        if (arr[i].hotspot_intensity > 1) {
          var hMark = document.createElement('div');
          var pop = arr[i].venue_capacity;
          hMark.className = 'hMark';
          var intense = '';
          if (pop < 10) {
            intense = 'Low';
          } else if (pop>=10 && pop<50) {
            intense = 'Moderate';
          } else if (pop>=50) {
            intense = 'Severe';
          }
          new mapboxgl.Marker(hMark)
          .setLngLat([x,y])
          .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
          .setHTML('<h3>' + arr[i].venue_name + '</h3><p><b>' + arr[i].venue_type + '</b></p><p><b>Address:</b> ' + arr[i].venue_address + '<p><p><b>Risk:</b> ' + intense + '</p>'))
          .addTo(map);
        } else {
          var vMark = document.createElement('div');
          vMark.className = 'vMark';

          new mapboxgl.Marker(vMark)
          .setLngLat([x,y])
          .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
          .setHTML('<h3>' + arr[i].venue_name + '</h3><p><b>' + arr[i].venue_type + '</b></p><p><b>Address:</b> ' + arr[i].venue_address + '<p>'))
          .addTo(map);
        }
    }
}

// function displayHotspot(arr) {
//   for (var i=0;i<arr.length;i++) {

//     var hCheck = document.createElement('INPUT');
//     hCheck.type = "checkbox";
//     hCheck.name = "hCheck";
//     if (arr[i].hotspot_intensity > 1) {
//       hCheck.checked = true;
//     } else {
//       hCheck.checked = false;
//     }
//     checks.push(hCheck);

//     var row = document.createElement("TR");
//     var vName = document.createElement("TD");
//     var vAddress = document.createElement("TD");
//     var vHotspot = document.createElement("TD");

//     vName.innerText=arr[i].venue_name;
//     vAddress.innerText=arr[i].venue_address;
//     vHotspot.appendChild(hCheck);

//     row.appendChild(vName);
//     row.appendChild(vAddress);
//     row.appendChild(vHotspot);

//   }
// }
