// function to display the image
function showimage(n) {
  // console.log("n = " + n);
  var img = document.getElementsByClassName("images");
  // console.log("img = "+img.length);
  var dots = document.getElementsByClassName("dot");
  // console.log("dots = "+dots.length);

  //display first image if scroll past bounds
  if (n > img.length)
  {
    index = 1;
  }
  //display last image if scroll below bounds
  if (n < 1)
  {
    index = img.length;
  }
  //hide images
  for (var i = 0; i < img.length; i++)
  {
      img[i].style.display = "none";
  }
  //remove active dots
  for (i = 0; i < dots.length; i++)
  {
      dots[i].className = dots[i].className.replace("active"," ");
  }
  //display image
  img[index-1].style.display = "block";
  //indicate active dot
  dots[index-1].className += " active";

}

var index = 1;
showimage(index);

function select(n) {
  showimage(index += n);
}

function dotselect(n) {
  showimage(index = n);
}