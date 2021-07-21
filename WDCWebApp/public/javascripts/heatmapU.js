mapboxgl.accessToken = 'pk.eyJ1Ijoid2FsZnVydXMiLCJhIjoiY2twbzB0bjIxMDA4eTJwbzU2Zm1uaHh4bSJ9.Mb9QozZmNjmK9APRKpRqpQ';
var map = new mapboxgl.Map({
  container: 'mapU',
  style: 'mapbox://styles/mapbox/dark-v10',
  center: [138.364, -34.5544],
  zoom: 8
});

var hotspots = [];
var options=[];

window.onload = function loadHotspots() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      console.log("accessed database") ;
      hotspots = [];
      hotspots = JSON.parse(this.responseText);
      console.log(hotspots);
      updateMap(hotspots);
    }
  };
  xhttp.open("GET", "/gethotspots", true);
  xhttp.send();
};


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