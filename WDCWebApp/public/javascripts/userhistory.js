/*  venues[
      {name:'KFC', address:'100 street', date:'2020-02-22'}, //22-02-2020
      {name:'McDonalds', address:'200 street', date:'2021-02-22'}, //22-02-2021
      {name:'Turkey Town', address:'300 street', date:'2019-03-01'}, //01-03-2019
      {name:'A good meal', address:'400 street', date:'2022-01-01'}, // 01/01/2022
      {name:'Burgerboy', address:'500 street', date:'2021-01-01'},
      {name:'Dogs R us', address:'600 street', date:'2021-04-16'},
      {name:'Dennys', address:'700 street', date:'2020-08-05'},
      {name:'Zebra restaurant', address:'800 street', date:'2021-05-04'},
      {name:'Hungry Hippos', address:'900 street', date:'2019-11-12'},
      {name:'Arbys', address:'901 street', date:'2021-03-23'}
    ]
*/

// empty array to assign all the venues into
venue_list = [];

// retrieve list of all venues as JSON data and assign to empty array created above
window.onload = function loadVenues(){
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
     console.log("accessed database") ;
     venue_list = JSON.parse(this.responseText);
     console.log(venue_list);
     displayVenues(venue_list);
    }
  };
  xhttp.open("GET", "/showallvenues", true);
  xhttp.send();
};

// function to display the JSON data retrieved from the DB
function displayVenues(arr) {
    var i;
    for(i = 0; i < arr.length; i++) {
        new_row = document.createElement("TR");
        vname = document.createElement("TD");
        vaddress = document.createElement("TD");
        vtype = document.createElement("TD");
        vtime = document.createElement("TD");
        vname.innerText = arr[i].venue_name;
        vaddress.innerText = arr[i].venue_address;
        vtype.innerText = arr[i].venue_type;
        vtime.innerText = arr[i].time;
        new_row.appendChild(vname);
        new_row.appendChild(vaddress);
        new_row.appendChild(vtype);
        new_row.appendChild(vtime);
        document.getElementById("add_here").appendChild(new_row);
    }
}

/*
const vueinst = new Vue({
  el:'#usertable',
  data:{
    venues: venue_list,
    sortby:'venue_name',
    sortdirection:'ascending',
    elementsdisplayed: 3,
    pagenumber: 1
  },

  methods:{
    //takes the string input of either 'name' when the name column is clicked or 'age' when the age column is clicked
    //and compares against our sortby string (which by default is date). If they are == then reverse (toggles sort direction)
  sorttable:function(string) {
    if(string === this.sortby)
    {
        if (this.sortdirection === 'ascending')
        {
            this.sortdirection = 'descending';
        } else {
            this.sortdirection = 'ascending';
        }
    }
    this.sortby = string;
  },

//functions to toggle next/previous page
  next:function() {
    if((this.pagenumber*this.elementsdisplayed) < this.venues.length)
      {
        this.pagenumber++;
      }
  },

  prev:function() {
      if(this.pagenumber > 1)
      {
          this.pagenumber--;
      }
  },

},
computed:{
// sorts the array with built in sort, compares the values between data and returns 1, 0 or -1 (-1 if <, 0 if =, 1 if >)
// the 'flip' flips the sign of what is returned, essentially flipping the list order
  sortedVenues:function() {
    return this.venues.sort((a,b) => {
      let flip = 1;
      if(this.sortdirection === 'descending')
      {
        flip = -1;
      }
      if(a[this.sortby] < b[this.sortby])
      {
        return -1 * flip;
      }
      if(a[this.sortby] > b[this.sortby])
      {
        return 1 * flip;
      }
      return 0;
    })
    .filter((r, indx) => {
		let start = (this.pagenumber-1)*this.elementsdisplayed;
		let end = start + this.elementsdisplayed;
		if(indx >= start && indx < end)
		{
			return true;
		}

	});
  }
}
});
*/

