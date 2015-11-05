// global, to play with it in console :-)
var map, countiesLayer;

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
        "xmin": -10042631.573203186,
        "ymin": 3473025.0742536555,
        "xmax": -9895872.478895845,
        "ymax": 3511931.521650758,
        "spatialReference": {
          "wkid": 102100,
          "latestWkid": 3857
        }
      })
    });

    // URL Counties : http://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_Counties/FeatureServer/0
    // query result graphic layer
    countiesLayer = new GraphicsLayer({
      opacity: 0.75
    });

    map.addLayers([countiesLayer]);


    function addToCoutiesLayer(featureSet) {
      countiesLayer.clear();
      // make a symbol
      var sfs = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
        new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
          new Color([200, 0, 200]), 2), new Color([187, 123, 0])
      );
      var numFeatures = featureSet.features.length;
      console.log("Features :" + numFeatures)
      for (var i = 0; i < numFeatures; i++) {
        var graphic = featureSet.features[i];
        graphic.symbol = sfs;
        countiesLayer.add(graphic);
      }
    }



    on(dom.byId("btnQuery"), "click", function() {
      // query features
      var myQuery = new Query();
      myQuery.geometry = map.extent;
      myQuery.outFields = ["FID"];
      myQuery.returnGeometry = true;
      // use maxAllowableOffset for generalization
      //myQuery.maxAllowableOffset = 100;

      var queryTask = new QueryTask("http://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_Counties/FeatureServer/0");
      queryTask.execute(myQuery, addToCoutiesLayer);
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
