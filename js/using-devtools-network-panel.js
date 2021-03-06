// global, to play with it in console :-)

// Substitute whereClause with where
var map, countryLayer;

require(["esri/map",
    "esri/layers/GraphicsLayer",
    "esri/layers/FeatureLayer",
    "esri/geometry/Extent",

    "esri/tasks/QueryTask",
    "esri/tasks/query",

    "esri/symbols/SimpleFillSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/Color",

    "dojo/query",
    "dojo/on",
    "dojo/dom",
    "dojo/domReady!"
  ],
  function(Map, GraphicsLayer, FeatureLayer, Extent, QueryTask, Query, SimpleFillSymbol, SimpleLineSymbol, Color, query, on, dom) {
    // Create map
    map = new Map("mapDiv", {
      basemap: "gray",
      extent: new Extent({
        "type": "extent",
        "xmin": -19166155.26931955,
        "ymin": -3443111.900529757,
        "xmax": 20037508.342788905,
        "ymax": 14559337.001190286,
        "spatialReference": {
          "wkid": 102100,
          "latestWkid": 3857
        }
      })
    });

    // query result graphic layer
    countryLayer = new GraphicsLayer({
      opacity: 0.75
    });

    map.addLayers([countryLayer]);


    function addToCoutryLayer(featureSet) {
      countryLayer.clear();
      // make a symbol
      var sfs = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
        new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
          new Color([200, 0, 200]), 2), new Color([187, 123, 0])
      );
      var numFeatures = featureSet.features.length;
      console.log("Features :" + numFeatures);
      for (var i = 0; i < numFeatures; i++) {
        var graphic = featureSet.features[i];
        graphic.symbol = sfs;
        countryLayer.add(graphic);
      }
    }



    on(dom.byId("btnQuery"), "click", function() {
      // query features
      var myQuery = new Query();
      //myQuery.geometry = map.extent;
      myQuery.outField = ["OBJECTID"];
      myQuery.whereclause = "Country like 'g%'";
      //  myQuery.where = "Country like 'g%' ";
      myQuery.returnGeometry = true;
      // use maxAllowableOffset for generalization
      //myQuery.maxAllowableOffset = 100;

      var queryTask = new QueryTask("http://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/World_Countries_(Generalized)/FeatureServer/0");
      queryTask.execute(myQuery, addToCoutryLayer);
      // show them in a graphicLayer
    });


    // Toggle panel
    on(dom.byId("chevron"), "click", function(e) {
      // fix [
      if (query(".glyphicon.glyphicon-chevron-up")[0]) {
        query(".glyphicon").replaceClass("glyphicon-chevron-down", "glyphicon-chevron-up");
        query(".panel-body.collapse").removeClass("in");
      } else {
        query(".glyphicon").replaceClass("glyphicon-chevron-up", "glyphicon-chevron-down");
        query(".panel-body.collapse").addClass("in");
      }
    });
  });
