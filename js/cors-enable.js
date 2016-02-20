// global, to play with it in console :-)
var map, polygonLayer;

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
    "esri/config",
     "esri/urlUtils",
    "dojo/domReady!"
  ],
  function(Map, GraphicsLayer, FeatureLayer, Extent, QueryTask, Query, SimpleFillSymbol, SimpleLineSymbol, Color, query, on, dom,esriConfig,urlUtils) {


    // Create map
    map = new Map("mapDiv", {
      basemap: "gray",
      center: [-77.0164,38.9047],
      zoom:8
    });

    //urlUtils.addProxyRule({
    //  urlPrefix: "sampleserver4.arcgisonline.com",
    //  proxyUrl: "http://web.local/resource-proxy/PHP/proxy.php"
    //});

    // query result graphic layer
    polygonLayer = new GraphicsLayer({
      opacity: 0.75
    });

    map.addLayers([polygonLayer]);


    function addToPolygonLayer(featureSet) {
      polygonLayer.clear();
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
        polygonLayer.add(graphic);
      }
    }

    on(dom.byId("btnQuery"), "click", function() {
      // query features
      var myQuery = new Query();
      //myQuery.geometry = map.extent;
      myQuery.outField = ["OBJECTID"];
      myQuery.where = "1=1";
      //  myQuery.where = "Country like 'g%' ";
      myQuery.returnGeometry = true;
      // use maxAllowableOffset for generalization
      //myQuery.maxAllowableOffset = 100;

      var queryTask = new QueryTask("http://sampleserver4.arcgisonline.com/ArcGIS/rest/services/HomelandSecurity/Incident_Data_Extraction/MapServer/2");
      queryTask.execute(myQuery, addToPolygonLayer);
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
