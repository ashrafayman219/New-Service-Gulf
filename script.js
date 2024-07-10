// display variables
var displayMap;
let view;
let sketchVal;
let servicesLayer;
let placePoint01;
let pointGraphic;
let bufferGraphic;
let featureFilter;
let featureLayers = [];
let geojsons = [
  {
    regionsURL:
      "https://raw.githubusercontent.com/ashrafayman219/New-ESRI-s-Service/main/UpdatedG.json",
    title: "المحافظات",
  },
  {
    regionsURL:
      "https://raw.githubusercontent.com/ashrafayman219/New-ESRI-s-Service/main/Urban.json",
    title: "التجمعات العمرانية",
  },
  {
    regionsURL:
      "https://raw.githubusercontent.com/ashrafayman219/New-ESRI-s-Service/main/Services.json",
    title: "الخدمات",
  },
];

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

async function initializeMapNewService() {
  try {
    const [
      esriConfig,
      intl,
      Map,
      MapView,
      FeatureLayer,
      Legend,
      GeoJSONLayer,
      Query,
      reactiveUtils,
      FeatureTable,
      Graphic,
      GraphicsLayer,
      Slider,
      FeatureFilter,
      geometryEngine,
      geodesicUtils,
      Point,
    ] = await Promise.all([
      loadModule("esri/config"),
      loadModule("esri/intl"),
      loadModule("esri/Map"),
      loadModule("esri/views/MapView"),
      loadModule("esri/layers/FeatureLayer"),
      loadModule("esri/widgets/Legend"),
      loadModule("esri/layers/GeoJSONLayer"),
      loadModule("esri/rest/support/Query"),
      loadModule("esri/core/reactiveUtils"),
      loadModule("esri/widgets/FeatureTable"),
      loadModule("esri/Graphic"),
      loadModule("esri/layers/GraphicsLayer"),
      loadModule("esri/widgets/Slider"),
      loadModule("esri/layers/support/FeatureFilter"),
      loadModule("esri/geometry/geometryEngine"),
      loadModule("esri/geometry/support/geodesicUtils"),
      loadModule("esri/geometry/Point"),
    ]);

    intl.setLocale("ar");
    esriConfig.apiKey =
      "AAPK67a9b2041fcc449d90ab91d6bae4a156HTaBtzlYSKLe8L-zBuIgrSGvxOopzVQEtdwVrlp6RKN9Rrq_y2qkTax7Do1cHqm9"; // Will change it

    const template = {
      // autocasts as new PopupTemplate()
      title: "{GName}",
      content: [
        {
          type: "fields",
          fieldInfos: [
            {
              fieldName: "OBJECTID",
              label: "رقم المسلسل",
            },
            {
              fieldName: "GName",
              label: "اسم المحافظة",
            },
            {
              fieldName: "Shape_Length",
              label: "المحيط",
            },
            {
              fieldName: "Shape_Area",
              label: "المساحة التقريبية",
            },
          ],
        },
      ],
    };

    const urbanTemplate = {
      // autocasts as new PopupTemplate()
      title: "{وصف}",
      content: [
        {
          type: "fields",
          fieldInfos: [
            {
              fieldName: "البلدية",
              label: "البلدية",
            },
            {
              fieldName: "التجمع_العمراني",
              label: "التجمع العمراني",
            },
            {
              fieldName: "عدد_السكان",
              label: "عدد السكان",
            },
            {
              fieldName: "E",
              label: "خط الطول",
            },
            {
              fieldName: "N",
              label: "خط العرض",
            },
          ],
        },
      ],
    };

    const servicesTemplate = {
      // autocasts as new PopupTemplate()
      title: "{الخدمة}",
      content: [
        {
          type: "fields",
          fieldInfos: [
            {
              fieldName: "المركز",
              label: "المركز",
            },
            {
              fieldName: "نوع_الخدمة",
              label: "نوع الخدمة",
            },
            {
              fieldName: "E",
              label: "خط الطول",
            },
            {
              fieldName: "N",
              label: "خط العرض",
            },
          ],
        },
      ],
    };

    const rendererindustrialComplex = {
      type: "simple",
      symbol: {
        type: "web-style",
        name: "city-hall",
        styleName: "Esri2DPointSymbolsStyle",
      },
    };

    const sym1 = {
      type: "web-style",
      name: "gas-station",
      styleName: "Esri2DPointSymbolsStyle",
    };

    const sym2 = {
      type: "web-style",
      name: "atm",
      styleName: "Esri2DPointSymbolsStyle",
    };

    const sym3 = {
      type: "web-style",
      name: "grocery-store",
      styleName: "Esri2DPointSymbolsStyle",
    };

    const sym4 = {
      type: "web-style",
      name: "university",
      styleName: "Esri2DPointSymbolsStyle",
    };

    const sym5 = {
      type: "web-style",
      name: "place-of-worship",
      styleName: "Esri2DPointSymbolsStyle",
    };

    const sym6 = {
      type: "web-style",
      name: "hospital",
      styleName: "Esri2DPointSymbolsStyle",
    };

    const sym7 = {
      type: "web-style",
      name: "hotel",
      styleName: "Esri2DPointSymbolsStyle",
    };

    const rendererServices = {
      type: "unique-value",
      // symbol: {
      //   type: "web-style",
      //   name: "landmark",
      //   styleName: "Esri2DPointSymbolsStyle"
      // },
      field: "نوع_الخدمة",
      label: "الخدمات المتاحة",
      uniqueValueInfos: [
        {
          value: "الخدمات البترولية", // features labeled as "high"
          symbol: sym1, // will be assigned sym1
          label: "الخدمات البترولية",
        },
        {
          value: "الخدمات البنكية", // features labeled as "medium"
          symbol: sym2, // will be assigned sym2
        },
        {
          value: "الخدمات التجارية", // features labeled as "low"
          symbol: sym3, // will be assigned sym2
        },
        {
          value: "الخدمات التعليمية", // features labeled as "low"
          symbol: sym4, // will be assigned sym2
        },
        {
          value: "الخدمات الدينية", // features labeled as "low"
          symbol: sym5, // will be assigned sym2
        },
        {
          value: "خدمات صحية", // features labeled as "low"
          symbol: sym6, // will be assigned sym2
        },
        {
          value: "خدمات فندقية", // features labeled as "low"
          symbol: sym7, // will be assigned sym2
        },
      ],
    };

    async function createFeatureLayers(geojsons) {
      const arrayFeatures = [];
      for (const geojsonURL of geojsons) {
        const geojsonLayer = new GeoJSONLayer({
          url: geojsonURL.regionsURL,
          title: geojsonURL.title,
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
            // renderer: renderer,
          });

          arrayFeatures.push(featureLayer);
        });
        featureLayers = arrayFeatures;
      }
      return featureLayers;
    }

    displayMap = new Map({
      basemap: "topo-vector",
    });

    view = new MapView({
      center: [45.0792, 23.8859], // longitude, latitude, centered on KSA
      container: "displayMap",
      map: displayMap,
      zoom: 3,
      constraints: {
        minZoom: 8,
      },
      highlightOptions: {
        color: "#39ff14",
        haloOpacity: 0.9,
        fillOpacity: 0,
      },
      popup: {
        dockEnabled: true,
        dockOptions: {
          // dock popup at bottom-right side of view
          buttonEnabled: false,
          breakpoint: false,
          position: "bottom-left",
        },
      },
    });

    const bufferLayer = new GraphicsLayer();
    view.map.add(bufferLayer);

    // create the layerView's to add the filter
    let sceneLayerView = null;
    let featureLayerView = null;

    const bufferNumSlider = new Slider({
      container: "bufferNum",
      min: 0,
      max: 1000,
      steps: 1,
      visibleElements: {
        labels: true,
      },
      precision: 0,
      labelFormatFunction: (value, type) => {
        return `${value.toString()}m`;
      },
      values: [0],
    });

    // let bufferSize = 0;
    // bufferNumSlider.on(["thumb-change", "thumb-drag"], bufferVariablesChanged);
    // function bufferVariablesChanged(event) {
    //   bufferSize = event.value;
    //   updateFilter();
    // }

    let highlightSelect; // Feature selection highlight
    let placesLayer = new GraphicsLayer({
      // Layer for places features
      id: "graphicsLayer",
    });
    displayMap.add(placesLayer);

    const listNode = document.getElementById("incomeList");

    await createFeatureLayers(geojsons).then((featureLayers) => {
      console.log(featureLayers);
      if (featureLayers) {
        featureLayers.map((layer) => {
          displayMap.add(layer);
          if (layer.title === "المحافظات") {
            layer.popupTemplate = template;
            layer.visible = false;
            // view.whenLayerView(layer).then(function (layerView) {
            //   view.goTo(
            //     {
            //       target: layer.fullExtent,
            //     },
            //     {
            //       duration: 2000,
            //     }
            //   );
            // });
          } else if (layer.title === "التجمعات العمرانية") {
            layer.renderer = rendererindustrialComplex;
            layer.popupTemplate = urbanTemplate;
            // layer.visible = false;

            let infoPanel; // Left panel for place information
            const resultPanel01 = document.getElementById("results");
            const flow = document.getElementById("flow");

            //create graphic for mouse point click
            pointGraphic = new Graphic({
              symbol: {
                type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
                color: [0, 0, 139, 0],
                outline: {
                  color: [255, 255, 255, 0],
                  width: 0,
                },
              },
            });

            // Create graphic for distance buffer
            bufferGraphic = new Graphic({
              symbol: {
                type: "simple-fill", // autocasts as new SimpleFillSymbol()
                color: [173, 216, 120, 0.2],
                outline: {
                  // autocasts as new SimpleLineSymbol()
                  color: [255, 255, 255],
                  width: 1,
                },
              },
            });

            let graphics;
            let start = 0;
            let highlight;

            view.whenLayerView(layer).then(async function (layerView) {
              featureLayerView = layerView;
              view.goTo(
                {
                  target: layer.fullExtent,
                },
                {
                  duration: 2000,
                }
              );

              const featureCount = await layer.queryFeatureCount();
              // document
              //   .getElementById("tablePager")
              //   .setAttribute("total-items", featureCount);

              // fetch the first twenty features that have the highest population number
              queryPage(0);

              function queryPage(page) {
                const query = {
                  start: page,
                  num: featureCount,
                  outFields: ["*"],
                  returnGeometry: true,
                  orderByFields: ["عدد_السكان DESC"],
                };
                const promise = layer
                  .queryFeatures(query)
                  .then((featureSet) =>
                    convertFeatureSetToRows(featureSet, query)
                  );
              }

              function convertFeatureSetToRows(featureSet, query) {
                document.getElementById("incomeList").innerHTML = "";

                graphics = featureSet.features;
                graphics.forEach((result, index) => {
                  // console.log(result, "result")
                  const attributes = result.attributes;
                  const name = attributes["التجمع_العمراني"];
                  const des = `عدد السكان: ${attributes["عدد_السكان"]}`;

                  // الوصف: ${attributes["وصف"]}
                  // const popu = `عدد السكان: ${attributes["عدد_السكان"]}`;

                  const item = document.createElement("calcite-list-item");
                  item.setAttribute("label", name);
                  item.setAttribute("value", index);
                  item.setAttribute("description", des);
                  // item.setAttribute("population", popu);
                  item.addEventListener("click", onCountyClickHandler);
                  document.getElementById("incomeList").appendChild(item);
                });

                if (highlight) {
                  highlight.remove();
                }
                // highlight = layerView.highlight(featureSet.features);
              }

              // ***************************************************
              // this function runs when user clicks on the county
              // in the list shown on the right side of the app
              // ***************************************************
              function onCountyClickHandler(event) {
                const target = event.target;
                const resultId = target.getAttribute("value");
                // get the graphic corresponding to the clicked zip code
                const result =
                  resultId && graphics && graphics[parseInt(resultId, 10)];
                // console.log(result, "result")
                if (result) {
                  view
                    .goTo(
                      {
                        target: result.geometry,
                        zoom: 15,
                      },
                      {
                        duration: 600,
                      }
                    )
                    .then(() => {
                      view.openPopup({
                        features: [result],
                        location: result.geometry.centroid,
                      });

                      let bufferSize = 0;
                      // bufferNumSlider.on(
                      //   ["thumb-change", "thumb-drag"],
                      //   bufferVariablesChanged
                      // );
                      var inputval = document.getElementById("iiin");
                      document
                        .getElementById("showFilter")
                        .addEventListener("click", () => {
                          const showFilterButton =
                            document.getElementById("showFilter");
                          showFilterButton.setAttribute("loading", "true"); // Set the button to loading state
                          showFilterButton.setAttribute("disabled", "true"); // Set the button to disabled state
                          bufferSize = inputval.value;
                          updateFilter()
                            .then(() => {
                              showFilterButton.removeAttribute("loading"); // Remove the loading state after the operation is complete
                              showFilterButton.removeAttribute("disabled"); // Remove the disabled state after the operation is complete
                            })
                            .catch(() => {
                              showFilterButton.removeAttribute("loading"); // Remove the loading state in case of an error
                              showFilterButton.removeAttribute("disabled"); // Remove the disabled state in case of an error
                            });
                        });
                      function bufferVariablesChanged(event) {
                        bufferSize = inputval.value;
                        // updateFilter();
                      }

                      // view.on("click", (event) => {
                      view.graphics.remove(pointGraphic);
                      if (view.graphics.includes(bufferGraphic)) {
                        view.graphics.remove(bufferGraphic);
                      }

                      // updateFilter()
                      // set the geometry filter on the visible FeatureLayerView
                      function updateFilter() {
                        return new Promise((resolve, reject) => {
                          updateFilterGeometry();

                          // console.log(filterGeometry, "filterGeometryfilterGeometryfilterGeometry")
                          featureFilter = {
                            // autocasts to FeatureFilter
                            geometry: filterGeometry,
                            spatialRelationship: "intersects",
                          };

                          if (featureLayerView) {
                            featureLayerView.filter = featureFilter;
                            // console.log(featureFilter, "featureFilter")
                            // if (featureLayerViewFilterSelected) {
                            // } else {
                            //   featureLayerView.filter = null;
                            // }
                          } else {
                            featureLayerView.filter = null;
                          }
                          if (sceneLayerView) {
                            sceneLayerView.filter = featureFilter;
                            // if (sceneLayerViewFilterSelected) {
                            // } else {
                            //   sceneLayerView.filter = null;
                            // }
                          } else {
                            sceneLayerView.filter = null;
                          }
                          resolve();
                        });
                      }

                      // update the filter geometry depending on bufferSize
                      let filterGeometry = null;
                      function updateFilterGeometry() {
                        // add a polygon graphic for the bufferSize
                        if (result) {
                          queryFeatures(result);
                          sketchVal = result.geometry;
                          console.log(
                            sketchVal,
                            "sketchValsketchValsketchValsketchValsketchVal"
                          );
                          if (bufferSize > 0) {
                            sketchVal = result.geometry.centroid;
                            const bufferGeometry =
                              geometryEngine.geodesicBuffer(
                                result.geometry,
                                bufferSize,
                                "meters"
                              );
                            if (bufferLayer.graphics.length === 0) {
                              bufferLayer.add(
                                new Graphic({
                                  geometry: bufferGeometry,
                                  symbol: {
                                    type: "simple-fill", // autocasts as new SimpleFillSymbol()
                                    color: [173, 30, 120, 0.5],
                                    outline: {
                                      // autocasts as new SimpleLineSymbol()
                                      color: [255, 100, 155],
                                      width: 1,
                                    },
                                  },
                                })
                              );
                            } else {
                              bufferLayer.graphics.getItemAt(0).geometry =
                                bufferGeometry;
                            }
                            return (filterGeometry = bufferGeometry);
                          } else {
                            bufferLayer.removeAll();
                            filterGeometry = result.geometry;
                          }
                        }
                      }

                      // document.getElementById("infoDiv").style.display =
                      //   "block";

                      function queryFeatures(screenPoint) {
                        let distance = bufferSize;
                        let units = "meters";
                        const point = screenPoint.geometry;
                        // console.log("Query Geometry:", point);
                        servicesLayer
                          .queryFeatures({
                            geometry: point,
                            // distance and units will be null if basic query selected
                            distance: distance,
                            units: units,
                            spatialRelationship: "intersects",
                            returnGeometry: true,
                            returnQueryGeometry: true,
                            outFields: ["*"],
                          })
                          .then((featureSet) => {
                            // console.log(featureSet, "featureSet");
                            // set graphic location to mouse pointer and add to mapview
                            pointGraphic.geometry = point;
                            // var pointt = point
                            view.graphics.add(pointGraphic);
                            // // open popup of query result
                            // view.openPopup({
                            //   location: point,
                            //   features: featureSet.features,
                            //   featureMenuOpen: true
                            // });

                            if (featureSet.queryGeometry) {
                              bufferGraphic.geometry = featureSet.queryGeometry;
                              view.graphics.add(bufferGraphic);
                            }
                            tabulatePlaces(featureSet);
                          });
                      }

                      // Investigate the individual PlaceResults from the array of results
                      // from the PlacesQueryResult and process them
                      function tabulatePlaces(results) {
                        // console.log(results, "featureSet");
                        // console.log(result.geometry, "result.geometry");
                        resultPanel01.innerHTML = "";
                        if (infoPanel) infoPanel.remove();
                        const distances = [];
                        results.features.forEach((placeResult) => {
                          const distance = geodesicUtils.geodesicDistance(
                            new Point({
                              x: result.geometry.longitude,
                              y: result.geometry.latitude,
                            }),
                            new Point({
                              x: placeResult.geometry.longitude,
                              y: placeResult.geometry.latitude,
                            }),
                            "kilometers"
                          );
                          distances.push({ placeResult, distance });
                          // addResult(placeResult, distance);
                        });
                        // Sort the array based on distance.distance in ascending order
                        distances.sort((a, b) => a.distance.distance - b.distance.distance);
                        distances.forEach((item) => {
                          addResult(item.placeResult, item.distance);
                        });
                        // if (distances.length > 0) {
                        //   animateClosestFeature(distances[0].placeResult);
                        // }
                      }

                      // Visualize the places on the map based on category
                      // and list them on the left panel with more details
                      async function addResult(place, distance) {
                        // console.log(distance, "distance")
                        placePoint01 = [place.attributes.E, place.attributes.N];
                        // console.log(placePoint01, "placePoint01")
                        const placePoint = {
                          type: "point",
                          y: place.attributes.N,
                          x: place.attributes.E,
                        };
                        // const landmark = new WebStyleSymbol({
                        //   name: "landmark",
                        //   styleName: "Esri2DPointSymbolsStyle",
                        // });
                        const placeGraphic = new Graphic({
                          geometry: placePoint,
                          symbol: {
                            type: "simple-marker",
                            color: [255, 255, 255, 0],
                            outline: {
                              color: [255, 255, 255, 0],
                              width: 0,
                            },
                          },
                        });

                        // switch (activeCategory) {
                        //   case "10000":
                        //     placeGraphic.symbol = arts;
                        //     break;
                        //   case "11000":
                        //     placeGraphic.symbol = business;
                        //     break;
                        //   case "12000":
                        //     placeGraphic.symbol = community;
                        //     break;
                        //   case "13000":
                        //     placeGraphic.symbol = dining;
                        //     break;
                        //   case "15000":
                        //     placeGraphic.symbol = hospital;
                        //     break;
                        //   case "16000":
                        //     placeGraphic.symbol = landmark;
                        //     break;
                        //   case "17000":
                        //     placeGraphic.symbol = retail;
                        //     break;
                        //   case "18000":
                        //     placeGraphic.symbol = sports;
                        //     break;
                        //   case "19000":
                        //     placeGraphic.symbol = travel;
                        //     break;
                        //   default:
                        //     placeGraphic.symbol = arts;
                        // }

                        // Add each graphic to the GraphicsLayer
                        view.graphics.add(placeGraphic);
                        // // Fetch more details about each place based
                        // // on the place ID with all possible fields
                        // const fetchPlaceParameters = new FetchPlaceParameters({
                        //   apiKey,
                        //   placeId: place.placeId,
                        //   requestedFields: ["all"],
                        // });

                        const infoDiv =
                          document.createElement("calcite-list-item");
                        const description = `
                      ${place.attributes["البلدية"]} - ${Number(
                          distance.distance.toFixed(2)
                        )} km`;
                        // ${Number((place.distance / 1000).toFixed(1))} km`;
                        infoDiv.label = place.attributes["الخدمة"];
                        infoDiv.description = description;

                        // If a place in the left panel is clicked
                        // then open the feature's popup
                        infoDiv.addEventListener("click", async () => {
                          view.openPopup({
                            location: placePoint,
                            title: place.attributes["البلدية"],
                            content: "See panel for more details",
                          });

                          // Highlight the selected place feature
                          const layerView = await view.whenLayerView(
                            placesLayer
                          );
                          highlightSelect = layerView.highlight(placeGraphic);

                          // Move the view to center on the selected place feature
                          // view.zoom = 12;
                          view.center = placePoint01;

                          // Pass the FetchPlaceParameters and the location of the
                          // selected place feature to the getDetails() function
                          getDetails(place, placePoint);
                        });
                        resultPanel01.appendChild(infoDiv);
                        return place;
                      }

                      async function animateClosestFeature(feature) {
                        const closestFeatureGraphic = new Graphic({
                          geometry: feature.geometry,
                          symbol: {
                            type: "simple-marker",
                            color: [255, 0, 0, 0.5],
                            size: "16px",
                            outline: {
                              color: [255, 255, 255],
                              width: 1,
                            },
                          },
                        });
                        view.graphics.add(closestFeatureGraphic);
                      }

                      // Get place details and display in the left panel
                      async function getDetails(place, placePoint) {
                        // // Get place details
                        // const result = await places.fetchPlace(fetchPlaceParameters);
                        // const placeDetails = result.placeDetails;
                        // Move the view to center on the selected place feature
                        view.goTo(placePoint);

                        // Set-up panel on the left for more place information
                        infoPanel = document.createElement("calcite-flow-item");
                        flow.appendChild(infoPanel);
                        infoPanel.heading = place.attributes["البلدية"];
                        infoPanel.description = place.attributes["الخدمة"];
                        // Pass attributes from each place to the setAttribute() function
                        setAttribute(
                          "Description",
                          "information",
                          place.description
                        );
                        setAttribute(
                          "Address",
                          "map-pin",
                          place.attributes["المنطقة"]
                        );
                        setAttribute(
                          "Phone",
                          "mobile",
                          place.attributes["المحافظة"]
                        );
                        // setAttribute("Hours", "clock", placeDetails.hours.openingText);
                        // setAttribute("Rating", "star", placeDetails.rating.user);
                        // setAttribute("Email", "email-address", placeDetails.contactInfo.email);
                        // setAttribute(
                        //   "Facebook",
                        //   "speech-bubble-social",
                        //   placeDetails.socialMedia.facebookId ?
                        //   `www.facebook.com/${placeDetails.socialMedia.facebookId}` :
                        //   null
                        // );
                        // setAttribute(
                        //   "Twitter",
                        //   "speech-bubbles",
                        //   placeDetails.socialMedia.twitter ?
                        //   `www.twitter.com/${placeDetails.socialMedia.twitter}` :
                        //   null
                        // );
                        // setAttribute(
                        //   "Instagram",
                        //   "camera",
                        //   placeDetails.socialMedia.instagram ?
                        //   `www.instagram.com/${placeDetails.socialMedia.instagram}` :
                        //   null
                        // );
                        // If another place is clicked in the left panel, then close
                        // the popup and remove the highlight of the previous feature
                        infoPanel.addEventListener(
                          "calciteFlowItemBack",
                          async () => {
                            view.closePopup();
                            highlightSelect.remove();
                            highlightSelect = null;
                          }
                        );
                      }

                      // // Take each place attribute and display on left panel
                      // function setAttribute(heading, icon, validValue) {
                      //   if (validValue) {
                      //     const element =
                      //       document.createElement("calcite-block");
                      //     element.heading = heading;
                      //     element.description = validValue;
                      //     const attributeIcon =
                      //       document.createElement("calcite-icon");
                      //     attributeIcon.icon = icon;
                      //     attributeIcon.slot = "icon";
                      //     attributeIcon.scale = "m";
                      //     element.appendChild(attributeIcon);
                      //     infoPanel.appendChild(element);
                      //   }
                      // }

                      // Take each place attribute and display on left panel
                      function setAttribute(heading, icon, validValue) {
                        if (validValue) {
                          const element =
                            document.createElement("calcite-block");
                          element.heading = heading;
                          element.description = validValue;
                          const attributeIcon =
                            document.createElement("calcite-action");
                          attributeIcon.icon = "layer";
                          attributeIcon.slot = "actions-end";
                          attributeIcon.scale = "m";
                          element.appendChild(attributeIcon);
                          infoPanel.appendChild(element);
                        }
                      }

                      // });
                    })
                    .catch((error) => {
                      if (error.name != "AbortError") {
                        console.error(error);
                      }
                    });
                }
              }

              // ************************************************************************
              // User clicked on the page number on the calcite-pagination
              // set up the query page and fetch the features from the service corresponding
              // to the page number
              // ************************************************************************
              document
                .getElementById("tablePager")
                .addEventListener("calcitePaginationChange", (event) => {
                  let page;
                  if (event.target.startItem === 1) {
                    page = 0;
                  } else {
                    page = event.target.startItem;
                  }
                  queryPage(page);

                  // set up the view for the new results
                  view.zoom = 8;
                  view.center = [42.83777007050006, 18.914984955772834];
                  if (view.popup.visible) {
                    view.popup.visible = false;
                  }
                });

              const resultPanel = document.getElementById("result-panel");
              const toggleButton = document.getElementById("toggle-button");
              const toggleButtonServices = document.getElementById(
                "toggleService-button"
              );
              view.ui.add(toggleButton, "top-left");
              view.ui.add(toggleButtonServices, "top-left");

              toggleButton.addEventListener("click", function () {
                if (resultPanel.clientWidth == 390) {
                  resultPanel.style.width = "0px";
                  tablePager.style.width = "0px";
                  toggleButton.icon = "chevrons-right";
                  toggleButton.title = "افتح قائمة الظاهرات";
                } else {
                  resultPanel.style.width = "390px";
                  tablePager.style.width = "390px";
                  toggleButton.icon = "chevrons-left";
                  toggleButton.title = "اغلق قائمة الظاهرات";
                }
              });
            });
          } else if (layer.title === "الخدمات") {
            servicesLayer = layer;
            layer.renderer = rendererServices;
            layer.popupTemplate = servicesTemplate;

            view.whenLayerView(layer).then(function (layerView) {
              sceneLayerView = layerView;
              // view.goTo(
              //   {
              //     target: layer.fullExtent,
              //   },
              //   {
              //     duration: 2000,
              //   }
              // );
            });
            // layer.visible = false;
          }
          // else if (layer.title === "الجامعات") {
          //   layer.renderer = rendererUniversty
          //   layer.visible = false;
          // } else if (layer.title === "المدارس") {
          //   layer.renderer = rendererSchools
          //   layer.visible = false;
          // }
        });
      }
    });

    // view.on("click", function (event) {
    //   view.hitTest(event).then(function (response) {
    //     if (response.results.length) {
    //       let graphic = response.results.filter(function (result) {
    //           for (const layerName of featureLayers) {
    //             if (result.graphic.layer === layerName) {
    //               return (
    //                 result.graphic.layer === layerName
    //               );
    //             }
    //           }
    //       })[0].graphic;
    //       view.goTo(
    //         {
    //           target: graphic,
    //         },
    //         {
    //           duration: 2000,
    //         }
    //       );
    //     }
    //   });
    // });

    await view.when();

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

    // view.whenLayerView(KansasCityBoundaries).then(function (layerView) {
    //   view.goTo(
    //     {
    //       target: KansasCityBoundaries.fullExtent,
    //     },
    //     {
    //       duration: 2000,
    //     }
    //   );
    // });

    //add widgets
    addWidgets()
      .then(([view, displayMap]) => {
        console.log(
          "Widgets Returned From Require Scope",
          view,
          displayMap,
          featureLayer
        );
        // You can work with the view object here
      })
      .catch((error) => {
        // Handle any errors here
      });

    return [view, displayMap]; // You can return the view object
  } catch (error) {
    console.error("Error initializing map:", error);
    throw error; // Rethrow the error to handle it further, if needed
  }
}

// calling
initializeMapNewService()
  .then(() => {
    console.log("Map Returned From Require Scope", displayMap, view);
    // You can work with the view object here
  })
  .catch((error) => {
    // Handle any errors here
  });

async function addWidgets() {
  try {
    // await initializeMap();
    const [
      Fullscreen,
      BasemapGallery,
      Expand,
      ScaleBar,
      Measurement,
      Search,
      Home,
      LayerList,
    ] = await Promise.all([
      loadModule("esri/widgets/Fullscreen"),
      loadModule("esri/widgets/BasemapGallery"),
      loadModule("esri/widgets/Expand"),
      loadModule("esri/widgets/ScaleBar"),
      loadModule("esri/widgets/Measurement"),
      loadModule("esri/widgets/Search"),
      loadModule("esri/widgets/Home"),
      loadModule("esri/widgets/LayerList"),
    ]);

    var basemapGallery = new BasemapGallery({
      view: view,
    });

    var Expand22 = new Expand({
      view: view,
      content: basemapGallery,
      expandIcon: "basemap",
      group: "top-right",
      // expanded: false,
      expandTooltip: "Open Basmap Gallery",
      collapseTooltip: "Close",
    });
    view.ui.add([Expand22], { position: "top-right", index: 6 });

    var fullscreen = new Fullscreen({
      view: view,
    });
    view.ui.add(fullscreen, "top-right");

    var scalebar = new ScaleBar({
      view: view,
      unit: "metric",
    });
    view.ui.add(scalebar, "bottom-right");

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

    const measurement = new Measurement({
      view: view,
      activeTool: "distance"
    });
    view.ui.add(measurement, "top-right");
    
    layerList.visibilityAppearance = "checkbox";
    var Expand5 = new Expand({
      view: view,
      content: layerList,
      expandIcon: "layers",
      group: "top-right",
      // expanded: false,
      expandTooltip: "قائمة الطبقات",
      collapseTooltip: "اغلاق",
    });

    view.ui.add([Expand5], { position: "top-left", index: 6 });

    await view.when();

    return [view, displayMap]; // You can return the view object
  } catch (error) {
    console.error("Error initializing map:", error);
    throw error; // Rethrow the error to handle it further, if needed
  }
}
