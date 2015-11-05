/**

Adapted from https://github.com/ekenes/esri-js-samples/blob/master/ge-gs/index.html
 by Kristian Ekenes - https://github.com/ekenes/
**/

// global, to play with it in console :-)
var map, citiesLayer, geometryEngineLayer, geometryServiceLayer, myGeometryService;

require(["esri/map",
    "esri/graphic",
    "esri/layers/GraphicsLayer",
    "esri/layers/FeatureLayer",
    "esri/geometry/Extent",

    "esri/tasks/QueryTask",
    "esri/tasks/query",

    "esri/symbols/SimpleFillSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/Color",

    "esri/geometry/geometryEngineAsync",
    "esri/tasks/GeometryService",
    "esri/tasks/BufferParameters",

    "dojo/query",
    "dojo/on",
    "dojo/dom",
    "dojo/domReady!"
  ],
  function(Map, Graphic, GraphicsLayer, FeatureLayer, Extent, QueryTask, Query, SimpleFillSymbol, SimpleLineSymbol, SimpleMarkerSymbol, Color,
    geometryEngineAsync, GeometryService, BufferParameters, query, on, dom) {
    // Create map
    map = new Map("mapDiv", {
      basemap: "gray",
      extent: new Extent({
        "type": "extent",
        "xmin": -1684313.3448943025,
        "ymin": 4815193.011167619,
        "xmax": 3011977.672945677,
        "ymax": 7043485.259736487,
        "spatialReference": {
          "wkid": 102100,
          "latestWkid": 3857
        }
      })
    });
    myGeometryService = new GeometryService("http://utility.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer");

    // query result graphic layer
    citiesLayer = new GraphicsLayer({
      opacity: 0.60
    });
    // buffers result layers
    geometryEngineLayer = new GraphicsLayer({
      opacity: 0.75
    });
    geometryServiceLayer = new GraphicsLayer({
      opacity: 0.75
    });

    map.addLayers([citiesLayer, geometryServiceLayer, geometryEngineLayer]);

    /** core functions **/

    // add featureSet as graphic on the map
    function addToCitiesLayer(featureSet) {
      // clean previous graphs
      citiesLayer.clear();
      cleanBuffers();
      // make a symbol
      var citiesMarker = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_SQUARE, 10,
        new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
          new Color([255, 0, 0]), 1),
        new Color([0, 255, 0, 0.25]));

      var numFeatures = featureSet.features.length;
      console.log("Features :" + numFeatures);

      for (var i = 0; i < numFeatures; i++) {
        var graphic = featureSet.features[i];
        graphic.symbol = citiesMarker;
        citiesLayer.add(graphic);
      }
      // when query is ok : show bufer button
      query("#btnBuffer").removeClass("hidden");
    }

    // create a buffer using geometry service
    function createBufferService() {

      var geoms = getGeoms(citiesLayer.graphics);
      var startTime = Date.now();

      // set a buffer of 50 km
      var bufferParams = new BufferParameters();
      bufferParams.geometries = geoms;
      bufferParams.distances = [50];
      bufferParams.unit = GeometryService.UNIT_KILOMETER;
      bufferParams.geodesic = true;
      bufferParams.unionResults = false;
      bufferParams.outSpatialReference = map.spatialReference;

      var serviceBufferSym = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
        new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
          new Color([100, 100, 200]), 2), new Color([10, 184, 188])
      );
      // call the service
      myGeometryService.buffer(bufferParams).then(function(gsBuffers) {
        gsBuffers.forEach(function(geometry, i) {
          // then add geometries as graphics
          var serviceBufferGraphic = new Graphic();
          serviceBufferGraphic.geometry = geometry;
          serviceBufferGraphic.symbol = serviceBufferSym;

          geometryServiceLayer.add(serviceBufferGraphic);
        });
        return Date.now();
      }).then(function(endTime) {
        // then check the process time and show it.
        var processTime = (endTime - startTime) / 1000;
        dom.byId("executeTimeService").innerHTML = "GeometryService execution time : " + processTime + " sec";
      });
    }


    function createBufferEngine() {
      var geoms = getGeoms(citiesLayer.graphics);
      var startTime = Date.now();

      var engineBufferSym = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
        new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
          new Color([100, 100, 200]), 2), new Color([140, 34, 188])
      );
      // call the engine
      geometryEngineAsync.geodesicBuffer(geoms, [50], "kilometers", false).then(function(geBuffers) {
        geBuffers.forEach(function(geometry, i) {
          // then add geometries as graphics
          var engineBufferGraphic = new Graphic();
          engineBufferGraphic.geometry = geometry;
          engineBufferGraphic.symbol = engineBufferSym;

          geometryServiceLayer.add(engineBufferGraphic);
        });
        return Date.now();
      }).then(function(endTime) {
        // then check the process time and show it.
        var processTime = (endTime - startTime) / 1000;
        dom.byId("executeTimeEngine").innerHTML = "GeometryEngine execution time : " + processTime + " sec";
      });
    }

    /** Utils functions **/

    function cleanBuffers() {
      geometryServiceLayer.clear();
      geometryEngineLayer.clear();
      dom.byId("executeTimeEngine").innerHTML = "";
      dom.byId("executeTimeService").innerHTML = "";

    }
    function getGeoms(graphics) {
      return graphics.map(function(item, i) {
        return item.geometry;
      });
    }

    /** UI functions **/

    on(dom.byId("btnQuery"), "click", function() {
      // query features
      var myQuery = new Query();
      myQuery.geometry = map.extent;
      myQuery.outFields = ["*"];
      myQuery.returnGeometry = true;
      myQuery.outSpatialReference = map.spatialReference;

      var queryTask = new QueryTask("http://services.arcgis.com/V6ZHFr6zdgNZuVG0/ArcGIS/rest/services/WorldCities/FeatureServer/0");
      queryTask.execute(myQuery, addToCitiesLayer);

    });
    // launch buffers
    on(dom.byId("btnBuffer"), "click", function() {
      cleanBuffers();
      dom.byId("executeTimeEngine").innerHTML = "Executing GeometryEngine buffer ...";
      dom.byId("executeTimeService").innerHTML = "Executing GeometryService buffer ...";
      createBufferService();
      createBufferEngine();
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
