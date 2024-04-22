$(document).ready(function (){
    $('#example').DataTable();
});

var map = L.map('map').setView([52.849226, 7.913939], 13); // Startpunkt-Koordinaten einstellen
const nurzuZiehen = document.getElementById('nurZuZiehendeKunden');
nurzuZiehen.addEventListener('change', setUpdateMap);


function setUpdateMap(){
    mapLoeschen();
    var theCoordinates

    if(nurzuZiehen.checked){
        theCoordinates = coordinatesArrayBestellt.fleachenZuZiehen
    } else {
        theCoordinates = coordinatesArrayBestellt.fleachenAlle
    }

    setMap(theCoordinates)
    setZoomArea(theCoordinates);
}

function mapLoeschen(){
    map.eachLayer(function (layer) {
        if (layer instanceof L.Polygon) {
            map.removeLayer(layer);
        }
    });
}

function setMap(coordinatesArrayBestellt){
    var flaechenID = 0;
    var coordinates = []; // Hier werden die Koordinaten für die aktuelle Fläche gesammelt
    var colorArt = '#b9f700'

    coordinatesArrayBestellt.forEach(function (fleachenStueck) {
    if (flaechenID === fleachenStueck.ARTIKELNR) {
        coordinates.push([fleachenStueck.FKOORDINATENIDLAT, fleachenStueck.FKOORDINATENIDLNG]);
        if(fleachenStueck.PROBENSTATUS === 1){
            colorArt = fleachenStueck.FLAECHENFARBE
        } else {
            colorArt = '#b9f700'
        }
    } else {                
        if (coordinates.length > 2) {
            var polygon = L.polygon(coordinates, { 
                color: colorArt, 
                fillColor: colorArt, 
                fillOpacity: 0.6 ,     
                info: flaechenID }).addTo(map);

            polygon.on('click', function () {
                var info = this.options.info;
                const neuBeantragenCheckbox = document.querySelector('input[name=neuBeantragen'+info+']');

                if (neuBeantragenCheckbox.checked) {
                neuBeantragenCheckbox.checked = false;                        
                } else {
                neuBeantragenCheckbox.checked = true;
                }                    
            });

        }

        flaechenID = fleachenStueck.ARTIKELNR;
        coordinates = [
            [fleachenStueck.FKOORDINATENIDLAT, fleachenStueck.FKOORDINATENIDLNG],
        ];
    }
        });

    // Zum Schluss das letzte Polygon zeichnen (falls vorhanden)
    if (coordinates.length > 2) {
    var polygon = L.polygon(coordinates, { 
        color: colorArt, 
        fillColor: colorArt, 
        fillOpacity: 0.4 ,     
        info: flaechenID }).addTo(map);

        polygon.on('click', function () {
        var info = this.options.info;
        const neuBeantragenCheckbox = document.querySelector('input[name=neuBeantragen'+info+']');

        
        if (neuBeantragenCheckbox.checked) {
            neuBeantragenCheckbox.checked = false;                        
        } else {
            neuBeantragenCheckbox.checked = true;
        }                    
    });
    }

    flaechenID = 0;
    coordinates = []; // Hier werden die Koordinaten für die aktuelle Fläche gesammelt


    // Zum Schluss das letzte Polygon zeichnen (falls vorhanden)
    if (coordinates.length > 2) {
    L.polygon(coordinates, { color: 'blue', fillColor: 'blue', fillOpacity: 0.4 }).addTo(map);
    }
    var drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);

    var drawControl = new L.Control.Draw({
    draw: {
        polygon: {
        shapeOptions: {
            color: 'blue'
        },
        allowIntersection: false,
        drawError: {
            color: 'orange',
            timeout: 1000
        },
        showArea: true
        },
        polyline: false,
        circle: false,
        marker: false,
        circlemarker: false
    },
    edit: {
        featureGroup: drawnItems,
        remove: true
    }
    });
}

function setZoomArea(coordinatesArray){
    
    if(coordinatesArray.length > 0){ 
        var minLat = Number.POSITIVE_INFINITY;
        var maxLat = Number.NEGATIVE_INFINITY;
        var minLng = Number.POSITIVE_INFINITY;
        var maxLng = Number.NEGATIVE_INFINITY;

        for (var i = 0; i < coordinatesArray.length; i++) {
            var latitude = parseFloat(coordinatesArray[i].FKOORDINATENIDLAT);
            var longitude = parseFloat(coordinatesArray[i].FKOORDINATENIDLNG);

            minLat = Math.min(minLat, latitude);
            maxLat = Math.max(maxLat, latitude);
            minLng = Math.min(minLng, longitude);
            maxLng = Math.max(maxLng, longitude);
        }


        var bounds = L.latLngBounds(L.latLng(minLat, minLng), L.latLng(maxLat, maxLng));
        map.fitBounds(bounds);

        L.tileLayer('https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
            maxZoom: 20,
            subdomains:['mt0','mt1','mt2','mt3'],
            attribution: '© Google'
            }).addTo(map);
    }
}


function changeColor(userID){


    fetch('/products/changeColor', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userID: userID })
      })
      .then(response => response.status)
      .then(status => handleResponse(status))
      .catch(error => console.error('Error:', error));
}


function handleResponse(status) {
    if (status === 200) {
      location.reload(); // Hier die Seite neu laden
    } else if (status === 404) {
      console.error('ERROR')
    }
  }
  




