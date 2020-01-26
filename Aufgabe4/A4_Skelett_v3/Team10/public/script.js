/********************************************************
 ********************* Collapsing Nav *******************
 ********************************************************/
var toggle_nav_btn = document.getElementById("pull");
toggle_nav_btn.onclick = function() {
  var main_nav = document.getElementById("main_nav");
  if (main_nav.style.display == "" || main_nav.style.display == "none") {
    main_nav.style.display = "block";
  } else {
    main_nav.style.display = "none";
  }
};

//handle events from responsive show hide and collapsing nav
window.onresize = function(event) {
  var viewport_width = document.body.offsetWidth;

  //code of collapsing nav
  if (viewport_width >= 815) {
    main_nav.style.display = "block";
  } else if (viewport_width < 815) {
    main_nav.style.display = "none";
  }
};

/********************************************************
 ********************* Sticky Header ********************
 ********************************************************/
var fixed = false;
var nav = document.getElementById("sticky_header");
var position = nav.offsetTop;

function stick() {
  var scrollY = window.scrollY || window.pageYOffset;
  if (scrollY > position && !fixed) {
    fixed = true;
    nav.className = nav.className + " fixed";
  } else if (scrollY <= position && fixed) {
    fixed = false;
    nav.classList.remove("fixed");
  }
}
window.onscroll = stick;

/********************************************************
 ********************* AJAX *****************************
 ********************************************************/
// load content on page load

var properties = [];
var countries_data = [];
var count = 0;


var map = L.map("map", {
  center: [20.0, 5.0],
  minZoom: 2,
  zoom: 1
});

$(document).ready(function() {
  getProperties();
  getItems();
  drawChart1("birth_rate_per_1000");
  drawChart2("birth_rate_per_1000");
});

function getProperties() {
  $.ajax({
    type: "GET",
    async: true,
    url: "/properties",
    success: function(data) {
      properties = data.slice(2, data.length);
      d3.select("#selectButton1")
        .selectAll("myOptions")
        .data(properties)
        .enter()
        .append("option")
        .text(function(d) {
          return d;
        }) // text showed in the menu
        .attr("value", function(d) {
          return d;
        }); // corresponding value returned by the button

      // When the button is changed, run the updateChart function
      d3.select("#selectButton1").on("change", function(d) {
        // recover the option that has been chosen
        var selectedOption = d3.select(this).property("value");
        // run the updateChart function with this selected option
        drawChart1(selectedOption);
        redrawMap(countries_data, selectedOption);
      });

      d3.select("#selectButton2")
        .selectAll("myOptions")
        .data(properties)
        .enter()
        .append("option")
        .text(function(d) {
          return d;
        }) // text showed in the menu
        .attr("value", function(d) {
          return d;
        }); // corresponding value returned by the button

      // When the button is changed, run the updateChart function
      d3.select("#selectButton2").on("change", function(d) {
        // recover the option that has been chosen
        var selectedOption = d3.select(this).property("value");
        // run the updateChart function with this selected option
        drawChart2(selectedOption);
        redrawMap(countries_data, selectedOption);
      });
    },
    error: function() {
      alert("Error!");
    }
  });
}

function getItems() {
  $.ajax({
    type: "GET",
    async: true,
    url: "/items",
    success: function(items) {
      countries_data = JSON.parse(items);
      redrawMap(countries_data, "birth_rate_per_1000");
    },
    error: function() {
      alert("Error!");
    }
  });
}

/********************************************************
 ********************* D3js vis *************************
 ********************************************************/

 //Highlight Marker on rect hover
function markMarker(hover, d){
    if(hover){
        marker = greenMarker;
    }
    else{
        marker = blueMarker;
    }
    map.eachLayer(function(layer){
        if(layer instanceof L.Marker){
            if(map.getBounds().contains(layer.getLatLng())){
                if(layer.getLatLng().lat == d.gps_lat && layer.getLatLng().lng == d.gps_long){
                    layer.setIcon(marker);
                }
            }
        }
    })

}

//Highlight rects on rect hover
function paintRect(hover, id){
    if(hover){
        color = 'green';
    }
    else{
        color = 'steelblue'
    }
    d3.selectAll('rect').each(function(d, i){
        if(d.id == id){
            d3.select(this).style('fill', color);
        }
    });

}

function drawChart1(selectedOption) {
  var svg = d3.select("#chart1");
  svg.selectAll("*").remove();

  var svg = d3.select("#chart1"),
    margin = 200,
    width = svg.attr("width") - margin,
    height = svg.attr("height") - margin;

  var xScale = d3
      .scaleBand()
      .range([0, width])
      .padding(0.4),
    yScale = d3.scaleLinear().range([height, 0]);

  var g = svg
    .append("g")
    .attr("transform", "translate(" + 100 + "," + 100 + ")");

  d3.json("/items", function(error, data) {
    if (error) {
      alert("error");
      throw error;
    }

    data.forEach(function(d) {
      d.birth_rate_per_1000 = +d.birth_rate_per_1000;
      d.cell_phones_per_100 = +d.cell_phones_per_100;
      d.children_per_woman = +d.children_per_woman;
      d.electricity_consumption_per_capita = +d.electricity_consumption_per_capita;
      d.gdp_per_capita = +d.gdp_per_capita;
      d.gdp_per_capita_growth = +d.gdp_per_capita_growth;
      d.inflation_annual = +d.inflation_annual;
      d.internet_user_per_100 = +d.internet_user_per_100;
      d.life_expectancy = +d.life_expectancy;
      d.gps_lat = +d.gps_lat;
      d.gps_long = +d.gps_long;
      d.military_expenditure_percent_of_gdp = +d.military_expenditure_percent_of_gdp;
    });

    xScale.domain(
      data.map(function(d) {
        return d.name;
      })
    );
    yScale.domain([
      0,
      d3.max(data, function(d) {
        return d[selectedOption];
      })
    ]);

    g.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", "-0.5em")
      .attr("transform", "rotate(-90)");

    g.append("g")
      .call(
        d3
          .axisLeft(yScale)
          .tickFormat(function(d) {
            return d;
          })
          .ticks(10)
      )
      .append("text")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("value");

      var bar =  g.selectAll(".bar")
        .data(data);
      var rect = bar.enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", function(d) {
          return xScale(d.name);
      })
        .attr("y", function(d) {
          return yScale(d[selectedOption]);
      })
        .attr("width", xScale.bandwidth())
        .attr("height", function(d) {
         return height - yScale(d[selectedOption]);
      })
      rect.on('mouseover', function(d){
        paintRect(true, d.id);
        markMarker(true, d);
      })
      .on('mouseout', function(d){
        paintRect(false, d.id);
        markMarker(false, d);
      })
  });



  // add the options to the button
}

function drawChart2(selectedOption) {
  var svg = d3.select("#chart2");
  svg.selectAll("*").remove();

  var svg = d3.select("#chart2"),
    margin = 200,
    width = svg.attr("width") - margin,
    height = svg.attr("height") - margin;

  var xScale = d3
      .scaleBand()
      .range([0, width])
      .padding(0.4),
    yScale = d3.scaleLinear().range([height, 0]);

  var g = svg
    .append("g")
    .attr("transform", "translate(" + 100 + "," + 100 + ")");

  d3.json("/items", function(error, data) {
    if (error) {
      alert("error");
      throw error;
    }

    xScale.domain(
      data.map(function(d) {
        return d.name;
      })
    );
    yScale.domain([
      0,
      d3.max(data, function(d) {
        return parseInt(d[selectedOption]);
      })
    ]);

    g.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", "-0.5em")
      .attr("transform", "rotate(-90)");

    g.append("g")
      .call(
        d3
          .axisLeft(yScale)
          .tickFormat(function(d) {
            return d;
          })
          .ticks(10)
      )
      .append("text")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("value");

   var bar =  g.selectAll(".bar")
      .data(data)
   var rect = bar.enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", function(d) {
        return xScale(d.name);
      })
      .attr("y", function(d) {
        return yScale(d[selectedOption]);
      })
      .attr("width", xScale.bandwidth())
      .attr("height", function(d) {
        return height - yScale(d[selectedOption]);
      });
    rect.on('mouseover', function(d){
        paintRect(true, d.id);
        markMarker(true, d);
    })
    .on('mouseout', function(d){
        paintRect(false, d.id);
        markMarker(false, d);
    })
  });

  // add the options to the button
}

/********************************************************
 ********************* Leaflet **************************
 ********************************************************/

 var greenMarker = L.ExtraMarkers.icon({
    icon: "fas fa-map-marker",
    markerColor: 'green',
    prefix: 'fa'
 })

 var blueMarker = L.ExtraMarkers.icon({
   icon: "fas fa-map-marker",
   markerColor: 'blue',
   prefix: 'fa',
 })

 

function redrawMap(data, property) {
  map.eachLayer(function(layer) {
    map.removeLayer(layer);
  });

  L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  for (var i = 0; i < data.length; ++i) {
    
    L.marker([data[i].gps_lat, data[i].gps_long], {icon: blueMarker})
      .bindPopup(
        property + "<br>" + "from: " + data[i].name + "<br>" + data[i][property]
      )
      .addTo(map).on('mousemove', function (){
         this.setIcon(greenMarker);
         latLang = this.getLatLng();
         d3.selectAll('rect').each(function(d, i){
             rect = d3.select(this);
             if(d.gps_lat == latLang.lat && d.gps_long == latLang.lng){
                rect.style('fill', 'green');
             }
         })
      }).on('mouseout', function mouseLeft(){
        this.setIcon(blueMarker);
        latLang = this.getLatLng();
        d3.selectAll('rect').each(function(d, i){
            rect = d3.select(this);
            if(d.gps_lat == latLang.lat && d.gps_long == latLang.lng){
               rect.style('fill', 'steelblue');
            }
        })
      })
  }


}
