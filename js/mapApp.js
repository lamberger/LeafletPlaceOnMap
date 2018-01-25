/**
 * App for navigating a place
 * Author: Patrik Lamberger
 *
 * @requires Mapbox and leaflet@0.7.7
 * @version 0.0.1
 */
var MapApp = (function () {
    // Properties
    var myMap = L.map('map');
    var userLocation = 0;
    var geojsonFeature = {};
    var locateCurrentUserPosition, 
        locateCurrentUserPositionIcon, 
        locationLayer, 
        position, 
        locationToCalc,
        locationPoint,
        calcDistance,
        distanceToPlace;
    const KILOMETER = " Km";
    const METER = " Meter";
    const AVSTANDTILLPLATS = "Avstånd hit: ";
    const TILLATPLATSATKOMST = "Tillåt platsåtkomst för att se avstånd hit."

    // Methods
    function init() {
        // Application init code
        //False för att inte applikationen ska zooma in användarens position
        myMap.locate({ setView: false });
        //Vy för marknadsplat (Nordöstra Karlstad)
        myMap.setView([59.407275790901465, 13.581258058547974], 18);
        //Integration med Mapbox
        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
            maxZoom: 20,
            id: 'mapbox.streets',
            accessToken: 'your api key'
        }).addTo(myMap);

        myMap.on('locationfound', onLocationFound);
        myMap.on('locationerror', onLocationError);
        createMarketArea();
    }

    function setUserPosition(userPosition) {
        userLocation = userPosition;
    }

    function calc(cord) {
        if (userLocation == 0) {
            position = "";
        } else {
            position = userLocation.distanceTo(cord);
        }
        return position;
    }

    function onLocationFound(e) {
        locateCurrentUserPositionIcon = L.icon({
            iconUrl: 'img/userPosition.png',
            iconSize: [32, 32]
        });

        locateCurrentUserPosition = L.marker(e.latlng, {
            icon: locateCurrentUserPositionIcon
        });
        setUserPosition(locateCurrentUserPosition._latlng);
        /* Ta bort och skapar locationLayer när användaren tillåter platsåtkomst
           för att distanceToPlace ska uppdateras. */
        myMap.removeLayer(locationLayer);
        createMarketArea();
        locateCurrentUserPosition.addTo(myMap);
    }

    function onLocationError(e) {
        alert("Error type: " + e.message);
    }

    function createMarketArea() {
        geojsonFeature = {
            "type": "FeatureCollection",
            "features": [{
                "type": "Feature",
                "properties": {
                    "img": "<img src='img/cc.png' />",
                    "title": "PLATS NR. 1",
                    "description": "Den första platsen #1"
                },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [
                        [
                            [13.580528497695921, 59.407120173442856],
                            [13.58083426952362, 59.40709287206064],
                            [13.580920100212097, 59.40718569667046],
                            [13.580635786056519, 59.40720753771816],
                            [13.580528497695921, 59.407120173442856]
                        ]
                    ]
                }
            }, {
                "type": "Feature",
                "properties": {
                    "img": "<img src='img/ccc.png' />",
                    "title": "PLATS NR. 2",
                    "description": "Den andra platsen #2"
                },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [
                        [
                            [13.581402897834778, 59.40771533810736],
                            [13.581182956695555, 59.40757337317373],
                            [13.581510186195372, 59.40754880225944],
                            [13.581665754318237, 59.40769622747787],
                            [13.581402897834778, 59.40771533810736]
                        ]
                    ]
                }
            }]
        };
        //Skapar ett lager för geojsonFeature och ett gemensamt utseende för alla objekt
        locationLayer = L.geoJson(false, {
            style: function (feature) {
                return { opacity: 0.3, fillOpacity: 0.4, fillColor: "#e82b8b" };
            },
            onEachFeature: onEachFeature
        }).addTo(myMap);
        locationLayer.addData(geojsonFeature);
    };

    function onEachFeature(feature, layer) {
        // Har feature properties?
        if (feature.properties) {
            // Koordinater. Räknar ut centrum i varje Polygon 
            locationPoint = layer.getBounds().getCenter();
            //Skickar locationPoint för beräkning avstånd
            calcDistance = calc(locationPoint);
            //Om platsåtkomst är godkänd returnerar calc number annars en string
            if (typeof calcDistance == 'number') {
                if (calcDistance > 1000) {
                    calcDistance = calcDistance / 1000;
                    distanceToPlace = AVSTANDTILLPLATS + calcDistance.toFixed(2) + KILOMETER;
                } else {
                    distanceToPlace = AVSTANDTILLPLATS + calcDistance.toFixed(2) + METER;
                }
            }
            else {
                distanceToPlace = TILLATPLATSATKOMST;
            }

            layer.bindPopup(
                feature.properties.img + "<h3>" +
                feature.properties.title + "</h3><p>" +
                feature.properties.description + "</p><i>" + 
                distanceToPlace + "</i>"
            )
        }
    }

    return {
        init: init
    };

})();

MapApp.init();


