// DO NOT CHANGE!
//init app with express, util, body-parser, csv2json
var express = require("express");
var app = express();
var sys = require("util");
var path = require("path");
var bodyParser = require("body-parser");
var Converter = require("csvtojson").Converter;

//register body-parser to handle json from res / req
app.use(bodyParser.json());

//register public dir to serve static files (html, css, js)
app.use(express.static(path.join(__dirname, "public")));

// END DO NOT CHANGE!

/**************************************************************************
 ****************************** csv2json *********************************
 **************************************************************************/

const csvFilePath = "./world_data.csv";
const csv = require("csvtojson");
var jsonArray;
csv()
  .fromFile(csvFilePath)
  .then(function(jsonArrayObj) {
    //when parse finished, result will be emitted here.
    jsonArray = jsonArrayObj;
  });

/**************************************************************************
 ********************** handle HTTP METHODS ***********************
 **************************************************************************/

app.get("/items", (req, res, next) => {
  
  res.json(jsonArray);
});

app.get("/items/:id", (req, res, next) => {
  const itemId = parseInt(req.params.id);
  const item = jsonArray.find(_item => parseInt(_item.id) === itemId);

  if (item) {
    res.json(item);
  } else {
    res.json({ status: `No such id ${itemId} in database` });
  }
});

app.get("/items/:id1/:id2", (req, res, next) => {
  const id1 = parseInt(req.params.id1);
  const id2 = parseInt(req.params.id2);
  const item1 = jsonArray.find(_item => parseInt(_item.id) === id1);
  const item2 = jsonArray.find(_item => parseInt(_item.id) === id2);
  if (!item1 || !item2 || id1 > id2) {
    res.json({ status: `Range not possible` });
  }
  var countries = [];
  for (i = id1; i <= id2; i++) {
    const item = jsonArray.find(_item => parseInt(_item.id) === i);
    if (item) {
      countries.push(item);
    }
  }

  res.json(countries);
});

app.get("/properties", (req, res, next) => {
  res.json(Object.keys(jsonArray[1]));
});

app.get("/properties/:num", (req, res, next) => {
  const num = parseInt(req.params.num) - 1;
  const properties = Object.keys(jsonArray[1]);
  if (!properties[num]) {
    res.json({ status: `No such property available.` });
  } else {
    res.json(properties[num]);
  }
});

app.post("/items", (req, res) => {
  //konsumiert json-Objekt mit Property name sowie 2 beliebigen Properties,
  //gibt Status: „Added country {name} to list!“ zurück
  const init_length = Object.keys(jsonArray).length;
  const item = req.body;
  const keys = Object.keys(item);

  if (keys.length < 3) {
    res.json({ status: `Should have more than 2 properties.` });
  } else if (!("name" in item)) {
    res.json({ status: `Property 'name' is obligatory.` });
  } else {
    jsonArray.push(item);
    if (init_length < 9) {
      jsonArray[init_length].id = "00" + (init_length + 1);
    } else if (init_length < 99) {
      jsonArray[init_length].id = "0" + (init_length + 1);
    }
    res.json({ status: `Added country ${item.name} to list!` });
  }
});

app.delete("/items", (req, res) => {
  name = jsonArray[Object.keys(jsonArray).length - 1].name;
  jsonArray.pop();
  //Status: „Deleted last country: {name}!“
  res.json({ status: `Deleted last country: ${name}!` });
});

app.delete("/items/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const item = jsonArray.find(_item => parseInt(_item.id) === id);
  if (item) {
    jsonArray = jsonArray.filter(function(country) {
      return parseInt(country.id) !== id;
    });
    res.json({ status: `Item ${id} deleted successfully.` });
  } else {
    res.json({ status: `No such id ${id} in database` });
  }
});


 

// DO NOT CHANGE!
// bind server to port
var server = app.listen(3000, function() {
  var host = server.address().address;
  var port = server.address().port;
  console.log("Example app listening at http://%s:%s", host, port);
});
