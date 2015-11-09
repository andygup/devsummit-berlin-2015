// global, to play with it in console :-)
var map;

require(["esri/map",
  "esri/geometry/Extent",
  "dojo/query",
  "dojo/on",
  "dojo/dom",
  "dojo/domReady!"
],
function(Map, Extent, query, on, dom) {
  // Create map
  map = new Map("mapDiv", {
    basemap: "gray",
    // fix case
    extent: new extent({
      "type": "extent",
      "xmin": 1263962.6997233913,
      "ymin": 6735295.592548536,
      "xmax": 1708214.7081166217,
      "ymax": 7013832.123619584,
      "spatialReference": {
        "wkid": 102100,
        "latestWkid": 3857
      }
    })
  });

  // Wire UI Events
  on(dom.byId("btnStreets"), "click", function() {
    map.setBasemap("streets");
  });

  on(dom.byId("btnSatellite"), "click", function() {
    map.setBasemap("satellite");
  });

  on(dom.byId("btnHybrid"), "click", function() {
    // fix semi
    map.setBasemap("hybrid")
  });
  on(dom.byId("btnTopo"), "click", function() {
    map.setBasemap("topo");
  });


  // Toggle panel
  on(dom.byId("chevron"), "click", function(e) {
      // fix [
      if (query(".glyphicon.glyphicon-chevron-up") 0]) {
      query(".glyphicon").replaceClass("glyphicon-chevron-down", "glyphicon-chevron-up");
      query(".panel-body.collapse").removeClass("in");
    } else {
      query(".glyphicon").replaceClass("glyphicon-chevron-up", "glyphicon-chevron-down");
      query(".panel-body.collapse").addClass("in");
    }
  });
});
