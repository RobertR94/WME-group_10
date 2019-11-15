
//World Data
var world_data = [
  ["ID", "Country", "Birth / 1000", "cellphones / 100", "children / woman", "electric usage", "internet usage"],
  ["001", "Brazil", "16.405", "90.01936334", "1.862", "2201.808724", "39.22"],
  ["002", "Canada", "10.625", "70.70997244", "1.668", "15119.76414", "80.1708665"],
  ["003", "Chile", "15.04", "97.01862561", "1.873", "3276.06449", "38.8"],
  ["004", "China", "13.536", "55.97490921", "1.642", "2632.724637", "28.97659939"],
  ["005", "Colombia", "20.605", "92.34584564", "2.405", "1041.994137", "30"],
  ["006", "Ecuador", "20.989", "92.84925653", "2.69", "1078.038961", "24.6"],
  ["007", "Egypt", "24.83", "69.43661504", "2.919", "1607.918763", "24.28 "],
  ["008", "Finland", "11.127", "144.1530224", "1.86" ,"15241.61194", "82.53133098"],
  ["009", "France", "12.21", "95.44434226", "1.978", "7339.946832", "69.0633593"],
  ["010", "Germany", "8.136", "127.4188883", "1.376", "6753.05764", "79.48523153"],
  ["011", "Iceland", "14.738", "107.6604456", "2.123", "51259.18763", "92.13686385"],
  ["012", "Iraq", "31.585", "65.47478839", "4.276", "1086.323768", "1.047516616"],
  ["013", "Japan", "8.201", "91.8955442", "1.359", "7838.005685", "77.38468963"],
  ["014", "Kazakhstan", "19.775", "107.7147692", "2.537", "4447.142293", "17.91457965"],
  ["015", "Mexico", "19.091", "74.25785259", "2.313", "1869.82352", "26.34"],
  ["016", "New Zealand", "13.831", "108.7301521", "2.125", "9375.550304", "79.82609287"],
  ["017", "Nigeria", "40.134", "8.23561006", "6.021", "119.8151486", "20"],
  ["018", "Peru", "21.342", "85.86901405", "2.545", "1043.052601", "31.4"],
  ["019", "Russia", "10.828", "161.1162887", "1.537", "6132.978648", "29.23584146"],
  ["020", "Saudi Arabia", "23.569", "167.3474553", "2.898", "7430.743897", "38"],
  ["021", "South Africa", "22.113", "93.33587369", "2.5", "4532.021902", "10.08745979"],
  ["022", "Sweden", "11.72", "112.1241184", "1.937", "14143.01101", "77.79971962"],
  ["023", "United Arab Emirates", "14.027", "153.7997194", "1.903", "9998.291079", "91.12326108"],
  ["024", "United Kingdom", "12.195", "130.1742603", "1.89", "5685.635995", "64"],
  ["025", "United States", "14.191", "89.14911634", "2.002", "12913.71143", "71.21181627"]
]


var birth = false, cellphone = false, cm = false, eu = false,  iu = false;
var ids = ["s1", "s2", "s3", "s4", "s5"];
var sort_val = [birth, cellphone, cm, eu, iu];

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

//i_up.classList.add("fasfa-angle-up");
//i_down.classList.add("fasfa-angle-down");
//tn.innerHTML = val;

//Create a new Cell
function addCell(tr, val, row){


  var tn;
  if(row == 0){
    tn = document.createElement('th')
    if(val == "Country"){
      tn.id = "sort_all"
    }
  }
  else{
    tn = document.createElement('td')
  }
  
  tn.innerHTML = val;
  tr.appendChild(tn);
}

//Create row
function addRow(tEl, rowData, row){

  var tr;
  tr = document.createElement('tr')
  var i;
  for(i = 0; i < 7; i++){

    if(!shouldFilter(i)){
      addCell(tr, rowData[i], row)
    }     
  }
  tEl.appendChild(tr);
}

//Get table to the html file
function createTable(data){

  var countr;
  table_head = document.getElementById('data_head');
  table_body = document.getElementById('data_body');
  var i;
  for(i = 0; i < data.length; i++){

    if(i == 0){
      addRow(table_head, data[i], i);
    }
    else{
      addRow(table_body, data[i], i);
    }
  }

  countr = document.getElementById('sort_all');
  i_up = document.createElement("i");
  i_down = document.createElement("i")
  i_up.classList += "fas fa-angle-up";
  i_down.classList += "fas fa-angle-down";
  i_up.onclick = function asc() { 
    sortCountrys(0);
  }
  i_down.onclick = function desc() {
    sortCountrys(1);
  }
  countr.appendChild(i_up);
  countr.appendChild(i_down);

}

//sort table old function
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

function refresh(){

  var head = document.getElementById('data_head');
  while (head.firstChild) {
    head.removeChild(head.firstChild);
  }
  var body = document.getElementById('data_body');
  while (body.firstChild) {
    body.removeChild(body.firstChild);
  }
  createTable(world_data);
}

function filterCol(n){
  
  setFilterCol(n);
  refresh();
  
  
}

function setFilterCol(col){
  var elem;
  elem = document.getElementById(ids[col]);
  if(sort_val[col] == false){
    sort_val[col] = true
    elem.classList.remove("underline");
  }
  else{
    sort_val[col] = false;
    elem.classList.add("underline");
  }
  
}

function shouldFilter(col){

  if(col >= 2){
    return sort_val[col -2];
  }
  else
    return false;
}

//sort Table alphabetical new function
function sortCountrys(n){

  var table, dir, run, shouldSwitch, cell, elem, nextElem, i;
  cell = 1;
  run = true;

  if(n == 0){
    dir = "asc";
  }
  else{
    dir="desc";
  }

  while(run){

    
    run = false;
    for(i = 1; i < world_data.length - 1; i++){

      elem = world_data[i][cell];
      nextElem = world_data[i +1][cell];

      if(dir == "asc"){
        if(elem > nextElem){
          temp = world_data[i];
          world_data[i] = world_data[i + 1];
          world_data[i + 1] = temp;
          run = true;
        }
      }
      else if(dir == "desc"){
        if(elem < nextElem){
          temp = world_data[i];
          world_data[i] = world_data[i + 1];
          world_data[i + 1] = temp;
          run = true;
        }
      }
    }
  }

  refresh();


}
  

document.addEventListener('DOMContentLoaded', function() {
  createTable(world_data);
}, false);

