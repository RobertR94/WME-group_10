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

app.get("/items", (req, res, next) => {
  res.json(jsonArray);
});

app.get("/items/:id", (req, res, next) => {
  const itemId = req.params.id;
  const item = jsonArray.find(_item => _item.id === itemId);

  if (item) {
    res.json(item);
  } else {
    res.json({ status: `No such id ${itemId} in database` });
  }
});

app.get("/items/:id1/:id2", (req, res, next) => {
  const id1 = req.params.id1;
  const id2 = req.params.id2;
  if (id1 < 1 || id2 > Object.keys(jsonArray).length || id1 > id2) {
    res.json({ status: `Range not possible` });
  }
  var countries = [];
  for (i = id1 - 1; i < id2; i++) {
    countries.push(jsonArray[i]);
  }

  res.json(countries);
});

app.get("/properties", (req, res, next) => {
  res.json(Object.keys(jsonArray[1]));
});

app.get("/properties/:num", (req, res, next) => {
  const num = req.params.num;
  const properties = Object.keys(jsonArray[1]);
  if (num < 1 || num > properties.length) {
    res.json({ status: `No such property available.` });
  } else {
    res.json(properties[num]);
  }
});

app.post("/items", (req, res) => {
  //konsumiert json-Objekt mit Property name sowie 2 beliebigen Properties,
  //gibt Status: „Added country {name} to list!“ zurück

  const item = req.body;

  jsonArray.push(item);

  res.json({ status: `Added country ${item.name} to list!` });
});

app.delete("/items", (req, res) => {
  // löscht letztes Land aus der Liste
  //Status: „Deleted last country: {name}!“
});

app.delete("/items/:id", (req, res) => {
  // löscht Land mit der ID id,
  //Status bei Erfolg: „Item {id} deleted successfully.“ oder bei Fehler: „No such id {id} in database“
});

/**************************************************************************
 ********************** handle HTTP METHODS ***********************
 **************************************************************************/

// DO NOT CHANGE!
// bind server to port
var server = app.listen(3000, function() {
  var host = server.address().address;
  var port = server.address().port;
  console.log("Example app listening at http://%s:%s", host, port);
});
