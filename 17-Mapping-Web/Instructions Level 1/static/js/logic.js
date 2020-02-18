const API_KEY = "pk.eyJ1IjoiamN1bGhhbmUiLCJhIjoiY2s1ZzMzM2huMDNxYjNscGU0dDhpYXZ2ZyJ9.8ut2sRKKv6xypIVfpPlJzg";
// Create a map object
var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 4
  });

L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(myMap);

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", function (data){
    function styleinfo(feature){
        return {
            opacity: 1,
            fillOpacity: 1,
            fillColor: getcolor(feature.properties.mag),
            radius: getradius(feature.properties.mag),
            stroke: true
        }
    }
    function getcolor(magnitude){
        switch(true){
            case magnitude > 5:
                return "black";
            case magnitude > 4:
                return "brown";
            case magnitude > 3:
                return "red";
            case magnitude > 2:
                return "orange";
            case magnitude > 1:
                return "yellow";
            default:
                return "white";
        }
    }
    function getradius(magnitude){
        switch(true){
            case magnitude === 0:
                return 1;
            default:
                return magnitude * 4;
        }
    }
    L.geoJson(data, {
        pointToLayer: function(feature, latLng){
            return L.circleMarker(latLng);

        },
        style: styleinfo,
        onEachFeature: function(feature, layer){
            layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place)
        }
    }).addTo(myMap);
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (myMap) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1, 2, 3, 4, 5],
        colors = ["white", "yellow", "orange", "red", "brown", "black"],
        from, to;

    for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
        "<i style='background: " + colors[i] + "'>&nbsp&nbsp&nbsp&nbsp</i> " +
        grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
    }
    return div;
  };
legend.addTo(myMap);
});