let planselect, planselect2, planselect3;
let inputVal, buttonQuery, comparisonOperators;

// display variables
var displayMap;
var view;
var gL;

// New
let geojsons = [];
let featureLayer;

var featureLayers = [];
console.log(featureLayers, "featureLayers global");

function loadModule(moduleName) {
  return new Promise((resolve, reject) => {
    require([moduleName], (module) => {
      if (module) {
        resolve(module);
      } else {
        reject(new Error(`Module not found: ${moduleName}`));
      }
    }, (error) => {
      reject(error);
    });
  });
}

async function initializeMapPlannersWithNewFeatures(randomGeoJSON) {
  try {
    const [esriConfig, WebScene, Map, MapView, Popup, SceneView, intl] =
      await Promise.all([
        loadModule("esri/config"),
        loadModule("esri/WebScene"),
        loadModule("esri/Map"),
        loadModule("esri/views/MapView"),
        loadModule("esri/widgets/Popup"),
        loadModule("esri/views/SceneView"),
        loadModule("esri/intl"),
      ]);

    intl.setLocale("ar");
    esriConfig.apiKey =
      "AAPKd0a4217e82944515a7f3df52cb9d578cg-xi22yCw4m8d85NYxlC4d7q_58JlYYlu0c2GBPsXinGmbvN1wB5-86rp39u1qWn";

    displayMap = new Map({
      // basemap: "dark-gray-vector",
      basemap: "gray-vector",
      // layers: [layer],
    });

    view = new MapView({
      // center: [31.233334, 30.033333], // longitude, latitude, centered on Egypt
      center: [45.0792, 23.8859], // longitude, latitude, centered on SA
      container: "displayMap",
      map: displayMap,
      zoom: 5,
      highlightOptions: {
        // color: [255, 255, 0, 1],
        // haloOpacity: 0.9,
        // fillOpacity: 0.2
        color: "#39ff14",
        haloOpacity: 0.9,
        fillOpacity: 0,
      },
      popup: new Popup({
        defaultPopupTemplateEnabled: true,
      }),
      // highlightOptions: {
      //   color: [255, 241, 58],
      //   fillOpacity: 0.4
      // }
    });

    await view.when();

    //add widgets
    addWidgetsNew()
      .then(([view, displayMap]) => {
        console.log(
          "Widgets Returned From Require Scope",
          view,
          displayMap,
          featureLayer
        );
        // You can work with the view object here

        //Show Attributes
        showAttributes()
          .then(([view, displayMap]) => {
            // console.log("Widgets Returned From Require Scope", view, displayMap, featureLayer);
            // You can work with the view object here
          })
          .catch((error) => {
            // Handle any errors here
          });

        // clickToDownloadScreenshot();
      })
      .catch((error) => {
        // Handle any errors here
      });

    //create layers
    createLayers(geojsons, randomGeoJSON)
      .then(([view, displayMap, geoJSONarr]) => {
        // console.log("featureLayers Returned From Require Scope", featureLayer);
        // You can work with the view object here
      })
      .catch((error) => {
        // Handle any errors here
      });

    return [view, displayMap, gL]; // You can return the view object
  } catch (error) {
    console.error("Error initializing map:", error);
    throw error; // Rethrow the error to handle it further, if needed
  }
}

async function addWidgetsNew() {
  try {
    // await initializeMap();

    const [
      Fullscreen,
      BasemapGallery,
      Expand,
      ScaleBar,
      AreaMeasurement2D,
      Search,
      Home,
      LayerList,
    ] = await Promise.all([
      loadModule("esri/widgets/Fullscreen"),
      loadModule("esri/widgets/BasemapGallery"),
      loadModule("esri/widgets/Expand"),
      loadModule("esri/widgets/ScaleBar"),
      loadModule("esri/widgets/AreaMeasurement2D"),
      loadModule("esri/widgets/Search"),
      loadModule("esri/widgets/Home"),
      loadModule("esri/widgets/LayerList"),
    ]);

    // var fullscreen = new Fullscreen({
    //   view: view,
    // });
    // view.ui.add(fullscreen, "top-right");

    var basemapGallery = new BasemapGallery({
      view: view,
    });

    var Expand22 = new Expand({
      view: view,
      content: basemapGallery,
      expandIcon: "basemap",
      group: "top-right",
      // expanded: false,
      expandTooltip: "Ù…Ø¹Ø±Ø¶ Ø®Ø±ÙŠØ·Ø© Ø§Ù„Ø£Ø³Ø§Ø³",
      collapseTooltip: "Ø§ØºÙ„Ø§Ù‚",
    });
    view.ui.add([Expand22], { position: "top-right", index: 6 });

    var scalebar = new ScaleBar({
      view: view,
      unit: "metric",
    });
    view.ui.add(scalebar, "bottom-right");

    // var measurementWidget = new AreaMeasurement2D({
    //   view: view,
    // });
    // // view.ui.add(measurementWidget, "top-left")

    // var Expand4 = new Expand({
    //   view: view,
    //   content: measurementWidget,
    //   expandIcon: "measure",
    //   group: "top-right",
    //   // expanded: false,
    //   expandTooltip: "Expand to Measure",
    //   collapseTooltip: "Close Measure",
    // });
    var search = new Search({
      //Add Search widget
      view: view,
    });
    view.ui.add(search, { position: "top-left", index: 0 }); //Add to the map

    var homeWidget = new Home({
      view: view,
    });
    view.ui.add(homeWidget, "top-left");

    var layerList = new LayerList({
      view: view,
      listItemCreatedFunction: function (event) {
        var item = event.item;
        // displays the legend for each layer list item
        item.panel = {
          content: "legend",
        };
      },
      showLegend: true,
    });

    layerList.visibilityAppearance = "checkbox";

    var Expand5 = new Expand({
      view: view,
      content: layerList,
      expandIcon: "layers",
      group: "top-right",
      // expanded: false,
      expandTooltip: "Ù‚Ø§Ø¦Ù…Ø© Ø§Ù„Ø·Ø¨Ù‚Ø§Øª",
      collapseTooltip: "Ø§ØºÙ„Ø§Ù‚",
    });

    view.ui.add([Expand5], { position: "top-left", index: 6 });
    // view.ui.add([Expand4], { position: "top-left", index: 3 });

    // let map2 = document.getElementById("map-content");
    // view.ui.add(map2, "top-right");

    // view.ui.add("controlsWidget", "top-right");
    view.ui.add(["plans"], "top-right");
    view.ui.add(["plans2"], "top-right");
    view.ui.add(["plans3"], "top-right");
    view.ui.add(["plans4"], "top-right");
    view.ui.add(["plans5"], "top-right");
    view.ui.add(["plans6"], "top-right");
    // view.ui.add("dataContainer", "top-right");
    // view.ui.add("info", "top-right");

    await view.when();

    return [view, displayMap]; // You can return the view object
  } catch (error) {
    console.error("Error initializing map:", error);
    throw error; // Rethrow the error to handle it further, if needed
  }
}

async function createLayers(geojsons, randomGeoJSON) {
  try {
    const [
      GeoJSONLayer,
      FeatureLayer,
      Query,
      reactiveUtils,
      Legend,
      FeatureTable,
    ] = await Promise.all([
      loadModule("esri/layers/GeoJSONLayer"),
      loadModule("esri/layers/FeatureLayer"),
      loadModule("esri/rest/support/Query"),
      loadModule("esri/core/reactiveUtils"),
      loadModule("esri/widgets/Legend"),
      loadModule("esri/widgets/FeatureTable"),
    ]);

    const region7 = {
      type: "simple-fill", // autocasts as new SimpleFillSymbol()
      color: "#127aa0",
      style: "solid",
      outline: {
        width: 0.2,
        color: [255, 255, 255, 0.5],
      },
    };

    const region6 = {
      type: "simple-fill", // autocasts as new SimpleFillSymbol()
      color: "#7f89a1",
      style: "solid",
      outline: {
        width: 0.2,
        color: [255, 255, 255, 0.5],
      },
    };

    const region5 = {
      type: "simple-fill", // autocasts as new SimpleFillSymbol()
      color: "#99977F",
      style: "solid",
      outline: {
        width: 0.2,
        color: [255, 255, 255, 0.5],
      },
    };

    const region4 = {
      type: "simple-fill", // autocasts as new SimpleFillSymbol()
      color: "#fffcd4",
      style: "solid",
      outline: {
        width: 0.2,
        color: [255, 255, 255, 0.5],
      },
    };

    const region3 = {
      type: "simple-fill", // autocasts as new SimpleFillSymbol()
      color: "#b1cdc2",
      style: "solid",
      outline: {
        width: 0.2,
        color: [255, 255, 255, 0.5],
      },
    };

    const region2 = {
      type: "simple-fill", // autocasts as new SimpleFillSymbol()
      color: "#38627a",
      style: "solid",
      outline: {
        width: 0.2,
        color: [255, 255, 255, 0.5],
      },
    };

    const region1 = {
      type: "simple-fill", // autocasts as new SimpleFillSymbol()
      color: "#0d2644",
      style: "solid",
      outline: {
        width: 0.2,
        color: [255, 255, 255, 0.5],
      },
    };

    const renderer = {
      type: "unique-value", // autocasts as new ClassBreaksRenderer()
      field: "Ø¥Ø³ØªØ®Ø¯Ø§Ù…_Ø§Ù„Ø£Ø±Ø¶",
      // normalizationField: "EDUCBASECY",
      legendOptions: {
        title: "ØªØµÙ†ÙŠÙ Ø§Ù„Ù…Ø®Ø·Ø· ØªØ¨Ø¹Ø§ Ù„Ø§Ø³ØªØ®Ø¯Ø§Ù… Ø§Ù„Ø£Ø±Ø¶",
      },
      // defaultSymbol: {
      //   type: "simple-fill", // autocasts as new SimpleFillSymbol()
      //   color: "#38689a",
      //   style: "solid",
      //   outline: {
      //     width: 0.2,
      //     color: [255, 255, 255, 0.5],
      //   },
      // },
      // defaultLabel: "Ù„Ø§ ÙŠÙˆØ¬Ø¯",
      uniqueValueInfos: [
        {
          value: "Ø³ÙƒÙ†ÙŠ",
          symbol: region1,
          label: "Ø³ÙƒÙ†ÙŠ",
        },
        {
          value: "Ø¯ÙŠÙ†ÙŠ",
          symbol: region2,
          label: "Ø¯ÙŠÙ†ÙŠ",
        },
        {
          value: "ØªØ¬Ø§Ø±ÙŠ",
          symbol: region3,
          label: "ØªØ¬Ø§Ø±ÙŠ",
        },
        {
          value: "Ø­ÙƒÙˆÙ…ÙŠ",
          symbol: region4,
          label: "Ø­ÙƒÙˆÙ…ÙŠ",
        },
        {
          value: "ØªØ¹Ù„ÙŠÙ…ÙŠ",
          symbol: region5,
          label: "ØªØ¹Ù„ÙŠÙ…ÙŠ",
        },
        {
          value: "Ø§Ø³ØªØ«Ù…Ø§Ø±ÙŠ",
          symbol: region6,
          label: "Ø§Ø³ØªØ«Ù…Ø§Ø±ÙŠ",
        },
        {
          value: "Ù…Ø±Ø§ÙÙ‚ Ø¹Ø§Ù…Ø©",
          symbol: region7,
          label: "Ù…Ø±Ø§ÙÙ‚ Ø¹Ø§Ù…Ø©",
        },
      ],
    };

    let legend = new Legend({
      view: view,
      // layerInfos: [
      //   {
      //     layer: District1_Neighborhoods,
      //     title: "Region 1"
      //   },
      //   {
      //     layer: District2_Neighborhoods,
      //     title: "Region 2"
      //   },
      // ]
    });
    legend.headingLevel = 2;
    legend.style = {
      type: "card",
      layout: "stack",
    };
    legend.basemapLegendVisible = true;
    legend.hideLayersNotInCurrentView = true;
    view.ui.add(legend, "bottom-left");

    async function createFeatureLayers(geojsons) {
      const arrayFeatures = [];
      for (const geojsonURL of geojsons) {
        const parsedUrl = new URL(geojsonURL);
        const pathname = parsedUrl.pathname;
        const pathParts = pathname.split("/");
        const filenameWithExtension = pathParts[pathParts.length - 1];
        const title = filenameWithExtension.split(".")[0];

        const geojsonLayer = new GeoJSONLayer({
          url: geojsonURL,
          title: title,
        });
        await geojsonLayer.queryFeatures().then(function (results) {
          console.log(results);
          const featureLayer = new FeatureLayer({
            source: results.features,
            outFields: ["*"],
            fields: results.fields,
            objectIdField: results.fields[0].name,
            geometryType: results.geometryType,
            title: geojsonLayer.title,
            renderer: renderer,
          });

          // Typical usage for the FeatureTable widget. This will recognize all fields in the layer if none are set.
          const featureTable = new FeatureTable({
            view: view, // The view property must be set for the select/highlight to work
            layer: featureLayer,
            visibleElements: {
              header: true,
              menu: true,
              // Autocast to VisibleElements
              menuItems: {
                clearSelection: true,
                refreshData: true,
                toggleColumns: true,
                selectedRecordsShowAllToggle: true,
                selectedRecordsShowSelectedToggle: true,
                zoomToSelection: true,
              },
              selectionColumn: true,
              columnMenus: true,
            },
            container: document.getElementById("tableDiv"),
          });

          arrayFeatures.push(featureLayer);
        });
        featureLayers = arrayFeatures;
      }
      return featureLayers;
    }

    const selectElement = document.getElementById("comparison-operator");
    // Define comparison operators
    const operators = [
      "Ø£ÙƒØ¨Ø± Ù…Ù†",
      "Ø£ØµØºØ± Ù…Ù†",

      "ÙŠØ³Ø§ÙˆÙŠ",
      "Ø£ÙƒØ¨Ø± Ù…Ù† Ø§Ùˆ ÙŠØ³Ø§ÙˆÙŠ",
      "Ø£ØµØºØ±Â Ù…Ù†Â Ø§ÙˆÂ ÙŠØ³Ø§ÙˆÙŠ",
    ];

    // Loop through operators and create options
    operators.forEach((operator) => {
      const option = document.createElement("option");
      option.value = operator;
      option.text = operator;
      selectElement.appendChild(option);
    });

    function isNumberKey(evt) {
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
      }
      return true;
    }

    let query = new Query();
    await createFeatureLayers(geojsons).then((featureLayers) => {
      console.log(featureLayers);
      var planss = [];
      for (let i = 0; i < featureLayers.length; i++) {
        if (!planss.includes(featureLayers[i].title)) {
          planss.push(featureLayers[i].title);
          var opt = document.createElement("option");
          opt.value = featureLayers[i].title;
          opt.textContent = featureLayers[i].title;
          planselect.appendChild(opt);
        }
      }

      if (geojsons.length === 1) {
        if (featureLayers) {
          featureLayers.map((layer) => {
            if (layer.title === randomGeoJSON) {
              displayMap.add(layer);
              view.whenLayerView(layer).then(() => {
                view.goTo(
                  {
                    target: layer.fullExtent,
                  },
                  {
                    duration: 3000,
                    speedFactor: 0.8,
                    easing: "in-out-coast-quadratic",
                  }
                );
              });
            }
          });
        }
      } else {
        if (featureLayers) {
          featureLayers.map((layer) => {
            displayMap.add(layer);
          });

          const getAllLayerViews = view.map.allLayers.map((layer) =>
            view.whenLayerView(layer)
          );
          const layerViews = Promise.all(getAllLayerViews).then(() => {
            var combinedExtent = null;
            displayMap.layers.forEach(function (layer) {
              if (layer.visible) {
                var layerExtent = layer.fullExtent || layer.initialExtent;
                if (layerExtent) {
                  if (combinedExtent) {
                    combinedExtent = combinedExtent.union(layerExtent);
                  } else {
                    combinedExtent = layerExtent.clone();
                  }
                }
              }
            });

            if (combinedExtent) {
              view.goTo(
                {
                  target: combinedExtent,
                },
                {
                  duration: 3000,
                  speedFactor: 0.8,
                  easing: "in-out-coast-quadratic",
                }
              );
            }
          });
        }
      }
    });

    planselect.addEventListener("change", function () {
      view.on("click", function (event) {
        view.hitTest(event).then(function (response) {
          if (response.results.length) {
            let graphic = response.results.filter(function (result) {
              for (const layerName of featureLayers) {
                if (result.graphic.layer === layerName) {
                  return result.graphic.layer === layerName;
                }
              }
            })[0].graphic;
            view.goTo(
              {
                target: graphic,
              },
              {
                duration: 2500,
              }
            );
          }
        });
      });

      if (this.value == "all") {
        displayMap.removeAll();
        featureLayers.map((layer) => {
          displayMap.add(layer);
        });

        var combinedExtent = null;
        displayMap.layers.forEach(function (layer) {
          if (layer.visible) {
            var layerExtent = layer.fullExtent || layer.initialExtent;
            if (layerExtent) {
              if (combinedExtent) {
                combinedExtent = combinedExtent.union(layerExtent);
              } else {
                combinedExtent = layerExtent.clone();
              }
            }
          }
        });

        // function customEasing(t) {
        //   return 1 - Math.abs(Math.sin(-1.7 + t * 4.5 * Math.PI)) * Math.pow(0.5, t * 10);
        // }

        // Check if a combined extent is calculated
        if (combinedExtent) {
          // Call the goTo function to zoom to the combined extent
          view.goTo(
            {
              target: combinedExtent,
            },
            {
              duration: 3000,
              speedFactor: 0.8,
              easing: "in-out-coast-quadratic",
            }
          );
        }
      } else {
        planselect2.style.display = "block";
        var plansss = [];
        var plansss3 = [];
        for (let i = 0; i < featureLayers.length; i++) {
          if (featureLayers[i].title === this.value) {
            displayMap.addMany([featureLayers[i]]);
            view.whenLayerView(featureLayers[i]).then((layerView) => {
              view.goTo(
                {
                  target: featureLayers[i].fullExtent,
                },
                {
                  duration: 3000,
                  speedFactor: 0.3,
                  easing: "in-out-coast-quadratic",
                }
              );
            });

            // select 2
            while (planselect2.firstChild) {
              planselect2.removeChild(planselect2.firstChild);
            }
            for (let f = 0; f < featureLayers[i].fields.length; f++) {
              if (!plansss.includes(featureLayers[i].fields[f].name)) {
                plansss.push(featureLayers[i].fields[f].name);
                var opt2 = document.createElement("option");
                opt2.value = featureLayers[i].fields[f].name;
                opt2.textContent = featureLayers[i].fields[f].name;
                planselect2.appendChild(opt2);
              }
            }

            planselect2.addEventListener("change", function () {
              planselect3.style.display = "block";
              // select 3
              // alert(this.value)
              var val = this.value;
              while (planselect3.firstChild) {
                planselect3.removeChild(planselect3.firstChild);
              }
              for (let t = 0; t < featureLayers[i].source.items.length; t++) {
                Object.keys(
                  featureLayers[i].source.items[t].attributes
                ).forEach((key) => {
                  // console.log(`${key}: ${featureLayers[i].source.items[t].attributes[key]}`);
                  if (key === this.value) {
                    if (
                      !plansss3.includes(
                        featureLayers[i].source.items[t].attributes[key]
                      )
                    ) {
                      if (
                        isNaN(featureLayers[i].source.items[t].attributes[key])
                      ) {
                        plansss3.push(
                          featureLayers[i].source.items[t].attributes[key]
                        );
                        var opt3 = document.createElement("option");
                        opt3.value =
                          featureLayers[i].source.items[t].attributes[key];
                        opt3.textContent =
                          featureLayers[i].source.items[t].attributes[key];
                        planselect3.appendChild(opt3);
                      } else {
                        // display comparisonOperators select
                        planselect3.style.display = "none";
                        comparisonOperators.style.display = "block";
                        inputVal.style.display = "block";
                        buttonQuery.style.display = "block";

                        comparisonOperators.addEventListener(
                          "change",
                          function () {
                            var operators = this.value;
                            var inputreturnedVal =
                              document.getElementById("inputt").value;
                            if (inputreturnedVal) {
                              buttonQuery.addEventListener(
                                "click",
                                function () {
                                  featureLayers[i].definitionExpression =
                                    val +
                                    " " +
                                    operators +
                                    " '" +
                                    inputreturnedVal +
                                    "'";
                                }
                              );
                            }
                          }
                        );
                      }
                    }
                  }
                });
              }
              console.log(this.value, "this.value");
              planselect3.addEventListener("change", function () {
                featureLayers[i].definitionExpression =
                  val + " = '" + this.value + "'";
              });
            });
          }
        }
      }
    });

    await view.when();

    return [view, displayMap]; // You can return the view object
  } catch (error) {
    console.error("Error initializing map:", error);
    throw error; // Rethrow the error to handle it further, if needed
  }
}
