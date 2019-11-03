// When the user scrolls the page, execute myFunction
window.onscroll = function() {
  myFunction();
};

//Read the data fom the csv file
//returns the data as a text in a string
function readDataAsTxt(fileName) {
  

  var reader = new FileReader();
  
  return reader.readAsText(fileName).result;
      
}

// Get the navbar
var navbar = document.getElementById("navbar");

// Get the offset position of the navbar
var sticky = navbar.offsetTop;

// Add the sticky class to the navbar when you reach its scroll position. Remove "sticky" when you leave the scroll position
function myFunction() {
  if (window.pageYOffset >= sticky) {
    navbar.classList.add("sticky");
  } else {
    navbar.classList.remove("sticky");
  }
}

//sort table
function sortCountry(n){

  var table, dir, run, shouldSwitch, cell, elem, nextElem;
  table = document.getElementById('world_data');
  run = true;
  cell = 1;

  if(n == 0){
    dir = "asc";
  }
  else{
    dir="desc";
  }

  
  while(run){

    run = false;

    for(i= 1; i < (table.rows.length - 1); i++){

      elem = table.rows[i].cells[cell];
      nextElem = table.rows[i + 1].cells[cell];
  
      if(dir == "asc"){
        if(elem.innerHTML.toLowerCase() > nextElem.innerHTML.toLowerCase()){
          table.rows[i].parentNode.insertBefore(table.rows[i + 1], table.rows[i]);
          run = true;
        }
      }
      else if(dir == "desc"){
        if(elem.innerHTML.toLowerCase() < nextElem.innerHTML.toLowerCase()){
          table.rows[i].parentNode.insertBefore(table.rows[i + 1], table.rows[i]);
          run = true;
        }
      }
    }
  }

}

/*
while(run){

    run = false;

    for(i= 1; i < (table.rows.length -1); i++){

      shouldSwitch = false;
      elem = table.rows[i].cells[cell];
      nextElem = table.rows[i + 1].cells[cell];

      if(dir == "asc"){

      }
      else if(dir == "desc"){
        
      }
    }
  }

*/