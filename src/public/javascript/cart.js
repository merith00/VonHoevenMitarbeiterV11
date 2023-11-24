const landTypeOptions = document.querySelectorAll('.land-type-option');

        var map = L.map('map').setView([52.849226, 7.913939], 13);

        function highlightFeature(e) {
            var layer = e.target;
            layer.setStyle({
                fillColor: 'green',  // Ändere die Füllfarbe auf Grün
                fillOpacity: 0.7  // Ändere die Füllungsopazität (optional)
            });
        }

        function resetHighlight(e) {
            var layer = e.target;
            layer.setStyle({
                fillColor: 'red',  // Setze die Füllfarbe zurück auf Rot oder deine ursprüngliche Farbe
                fillOpacity: 0.4  // Setze die Füllungsopazität zurück (optional)
            });
        }


        if(coordinatesArray.length > 0){ 
            var minLat = Number.POSITIVE_INFINITY;
            var maxLat = Number.NEGATIVE_INFINITY;
            var minLng = Number.POSITIVE_INFINITY;
            var maxLng = Number.NEGATIVE_INFINITY;

            for (var i = 0; i < coordinatesArray.length; i++) {
                var latitude = coordinatesArray[i][1];
                var longitude = coordinatesArray[i][2];

                minLat = Math.min(minLat, latitude);
                maxLat = Math.max(maxLat, latitude);
                minLng = Math.min(minLng, longitude);
                maxLng = Math.max(maxLng, longitude);
            }

            var centerLat = (minLat + maxLat) / 2;
            var centerLng = (minLng + maxLng) / 2;

            console.log(minLat , maxLat , minLng , maxLng)

            var bounds = L.latLngBounds(L.latLng(minLat, minLng), L.latLng(maxLat, maxLng));
            map.fitBounds(bounds);

        }

        landTypeOptions.forEach(option => {
            option.addEventListener('click', () => {
                landTypeOptions.forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
            });
        });


        var coordinates;


        function setKoordinates(coordinates){
            this.coordinates = coordinates;
        }


        function getKoordinates(){
            return coordinates;
        }


        L.tileLayer('https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains:['mt0','mt1','mt2','mt3'],
        attribution: '© Google'
        }).addTo(map);


        //TODO bestellte Flächen hier anzeigenl

        var flaechenID = 0;
        var coordinates = []; // Hier werden die Koordinaten für die aktuelle Fläche gesammelt

        const filterNminValue = document.querySelector('[name="filterNmin"]');
        const filterminValue = document.querySelector('[name="filterSmin"]');
        const filterHumusValue = document.querySelector('[name="filterHumus"]');
        const filterCNValue = document.querySelector('[name="filterCN"]');

        filterNminValue.addEventListener('change', function() {
                updateFunction();
        });

        filterminValue.addEventListener('change', function() {
                updateFunction();
        });

        filterHumusValue.addEventListener('change', function() {
                updateFunction();
        });

        filterCNValue.addEventListener('change', function() {
                updateFunction();
        });





        coordinatesArray.forEach(function (fleachenStueck) {
            if (flaechenID === fleachenStueck[0]) {
                coordinates.push([fleachenStueck[1], fleachenStueck[2]]);
            } else {
                if (coordinates.length > 2) {
                    polygon = L.polygon(coordinates, { color: 'blue', fillColor: 'red', fillOpacity: 0.4 });
                    polygon.addTo(map);

                    polygon.on('click', function () {
                        // Zeigen Sie einen Alert an, wenn auf das Polygon geklickt wird.
                        alert('Polygon wurde geklickt!');
                    });

                }
                flaechenID = fleachenStueck[0];
                coordinates = [[fleachenStueck[1], fleachenStueck[2]]];
            }
        });

        // Zum Schluss das letzte Polygon zeichnen (falls vorhanden)
        if (coordinates.length > 2) {
            L.polygon(coordinates, { color: 'red', fillColor: 'red', fillOpacity: 0.4 }).addTo(map);
        }

        //coordinatesArray = fetchFleachenData();
        //coordinatesArray = !{JSON.stringify(Fleachen)};
        flaechenID = 0;
        coordinates = []; // Hier werden die Koordinaten für die aktuelle Fläche gesammelt

        updateFunction();


        function updateFunction(){

            map.eachLayer(function (layer) {
                if (layer instanceof L.Polygon) {
                    map.removeLayer(layer);
                }
            });

            if(filterNminValue.checked){
                coordinatesArray.forEach(function (fleachenStueck) {
                    if (flaechenID === fleachenStueck[0]) {
                        coordinates.push([fleachenStueck[1], fleachenStueck[2]]);
                    } else {
                        if (coordinates.length > 2) {
                            L.polygon(coordinates, { color: 'blue', fillColor: 'blue', fillOpacity: 0.4 }).addTo(map);
                        }
                        flaechenID = fleachenStueck[0];
                        coordinates = [[fleachenStueck[1], fleachenStueck[2]]];
                    }
                });
                if (coordinates.length > 2) {
                    L.polygon(coordinates, { color: 'blue', fillColor: 'blue', fillOpacity: 0.4 }).addTo(map);
                }
                coordinates = [];
            } else if(!filterNminValue.checked && filterminValue.checked &&  filterHumusValue.checked &&  filterCNValue.checked ){
                coordinatesArray.forEach(function (fleachenStueck) {
                    if(fleachenStueck[5]==1 || fleachenStueck[6]==1 || fleachenStueck[7]==1){
                        if (flaechenID === fleachenStueck[0]) {
                            coordinates.push([fleachenStueck[1], fleachenStueck[2]]);
                        } else {
                            if (coordinates.length > 2) {
                                L.polygon(coordinates, { color: 'blue', fillColor: 'blue', fillOpacity: 0.4 }).addTo(map);
                            }
                            flaechenID = fleachenStueck[0];
                            coordinates = [[fleachenStueck[1], fleachenStueck[2]]];
                        }
                    }
                });
                if (coordinates.length > 2) {
                    L.polygon(coordinates, { color: 'blue', fillColor: 'blue', fillOpacity: 0.4 }).addTo(map);
                }
                coordinates = [];
            } else if(!filterNminValue.checked && !filterminValue.checked &&  filterHumusValue.checked &&  filterCNValue.checked ){
                coordinatesArray.forEach(function (fleachenStueck) {
                    if(fleachenStueck[6]==1 || fleachenStueck[7]==1){
                        if (flaechenID === fleachenStueck[0]) {
                            coordinates.push([fleachenStueck[1], fleachenStueck[2]]);
                        } else {
                            if (coordinates.length > 2) {
                                L.polygon(coordinates, { color: 'blue', fillColor: 'blue', fillOpacity: 0.4 }).addTo(map);
                            }
                            flaechenID = fleachenStueck[0];
                            coordinates = [[fleachenStueck[1], fleachenStueck[2]]];
                        }
                    }
                });
                if (coordinates.length > 2) {
                    L.polygon(coordinates, { color: 'blue', fillColor: 'blue', fillOpacity: 0.4 }).addTo(map);
                }
                coordinates = [];
            } else if(!filterNminValue.checked && filterminValue.checked &&  !filterHumusValue.checked &&  filterCNValue.checked ){
                coordinatesArray.forEach(function (fleachenStueck) {
                    if(fleachenStueck[5]==1 || fleachenStueck[7]==1){
                        if (flaechenID === fleachenStueck[0]) {
                            coordinates.push([fleachenStueck[1], fleachenStueck[2]]);
                        } else {
                            if (coordinates.length > 2) {
                                L.polygon(coordinates, { color: 'blue', fillColor: 'blue', fillOpacity: 0.4 }).addTo(map);
                            }
                            flaechenID = fleachenStueck[0];
                            coordinates = [[fleachenStueck[1], fleachenStueck[2]]];
                        }
                    }
                });
                if (coordinates.length > 2) {
                    L.polygon(coordinates, { color: 'blue', fillColor: 'blue', fillOpacity: 0.4 }).addTo(map);
                }
                coordinates = [];
            } else if(!filterNminValue.checked && filterminValue.checked &&  filterHumusValue.checked &&  !filterCNValue.checked ){
                coordinatesArray.forEach(function (fleachenStueck) {
                    if(fleachenStueck[5]==1 || fleachenStueck[6]==1){
                        if (flaechenID === fleachenStueck[0]) {
                            coordinates.push([fleachenStueck[1], fleachenStueck[2]]);
                        } else {
                            if (coordinates.length > 2) {
                                L.polygon(coordinates, { color: 'blue', fillColor: 'blue', fillOpacity: 0.4 }).addTo(map);
                            }
                            flaechenID = fleachenStueck[0];
                            coordinates = [[fleachenStueck[1], fleachenStueck[2]]];
                        }
                    }
                });
                if (coordinates.length > 2) {
                    L.polygon(coordinates, { color: 'blue', fillColor: 'blue', fillOpacity: 0.4 }).addTo(map);
                }
                coordinates = [];
            } else if(!filterNminValue.checked && !filterminValue.checked &&  !filterHumusValue.checked &&  filterCNValue.checked ){
                coordinatesArray.forEach(function (fleachenStueck) {
                    if(fleachenStueck[7]==1){
                        if (flaechenID === fleachenStueck[0]) {
                            coordinates.push([fleachenStueck[1], fleachenStueck[2]]);
                        } else {
                            if (coordinates.length > 2) {
                                L.polygon(coordinates, { color: 'blue', fillColor: 'blue', fillOpacity: 0.4 }).addTo(map);
                            }
                            flaechenID = fleachenStueck[0];
                            coordinates = [[fleachenStueck[1], fleachenStueck[2]]];
                        }
                    }
                });
                if (coordinates.length > 2) {
                    L.polygon(coordinates, { color: 'blue', fillColor: 'blue', fillOpacity: 0.4 }).addTo(map);
                }
                coordinates = [];
            } else if(!filterNminValue.checked && !filterminValue.checked &&  filterHumusValue.checked &&  !filterCNValue.checked ){
                coordinatesArray.forEach(function (fleachenStueck) {
                    if(fleachenStueck[6]==1){
                        if (flaechenID === fleachenStueck[0]) {
                            coordinates.push([fleachenStueck[1], fleachenStueck[2]]);
                        } else {
                            if (coordinates.length > 2) {
                                L.polygon(coordinates, { color: 'blue', fillColor: 'blue', fillOpacity: 0.4 }).addTo(map);
                            }
                            flaechenID = fleachenStueck[0];
                            coordinates = [[fleachenStueck[1], fleachenStueck[2]]];
                        }
                    }
                });
                if (coordinates.length > 2) {
                    L.polygon(coordinates, { color: 'blue', fillColor: 'blue', fillOpacity: 0.4 }).addTo(map);
                }
                coordinates = [];
            } else if(!filterNminValue.checked && filterminValue.checked &&  !filterHumusValue.checked &&  !filterCNValue.checked ){
                coordinatesArray.forEach(function (fleachenStueck) {
                    if(fleachenStueck[5]==1){
                        if (flaechenID === fleachenStueck[0]) {
                            coordinates.push([fleachenStueck[1], fleachenStueck[2]]);
                        } else {
                            if (coordinates.length > 2) {
                                L.polygon(coordinates, { color: 'blue', fillColor: 'blue', fillOpacity: 0.4 }).addTo(map);
                            }
                            flaechenID = fleachenStueck[0];
                            coordinates = [[fleachenStueck[1], fleachenStueck[2]]];
                        }
                    }
                });
                if (coordinates.length > 2) {
                    L.polygon(coordinates, { color: 'blue', fillColor: 'blue', fillOpacity: 0.4 }).addTo(map);
                }
                coordinates = [];
            }
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

        map.addControl(drawControl);

        map.on('draw:created', function (e) {
        var layer = e.layer;
        drawnItems.addLayer(layer);
        
        var area = L.GeometryUtil.geodesicArea(layer.getLatLngs()[0])/10000;
        document.querySelector('.namep').innerHTML = area.toFixed(2) + ' h²';

            var bounds = layer.getBounds();
            var center = bounds.getCenter();

            var formattedCoordinates = center.lat + ', ' + center.lng;

            document.querySelector('.nettop').innerHTML = formattedCoordinates;

            coordinates = layer.getLatLngs()[0]; // Je nach Geometrie möglicherweise anders

            const coordinatesArray = [];

            for (let i = 0; i < coordinates.length; i++) {
                const latitude = coordinates[i].lat;
                const longitude = coordinates[i].lng;
                coordinatesArray.push([latitude, longitude]);
            }

            setKoordinates(coordinatesArray);
            createImg(coordinatesArray);

            var modal = document.querySelector('.products-preview');
            modal.style.display = "block";
        });

        function createImg(coordinatesArrayIMG){

            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');

            const minLatitude = Math.min(...coordinatesArrayIMG.map(coord => coord[1]));
            const maxLatitude = Math.max(...coordinatesArrayIMG.map(coord => coord[1]));
            const minLongitude = Math.min(...coordinatesArrayIMG.map(coord => coord[0]));
            const maxLongitude = Math.max(...coordinatesArrayIMG.map(coord => coord[0]));

            var canvasHeight = (maxLongitude - minLongitude) * 1.660268738; //y     //(maxLongitude - minLongitude) * (800 / 0.1); // Hier musst du den Wert 0.1 anpassen
            var canvasWidth = maxLatitude - minLatitude;

            var runde = 0;

            while(canvasHeight*2 < 80){
                canvasHeight = canvasHeight*2;
                canvasWidth = canvasWidth*2;
                runde = runde +1;
            }

            // Setze die Breite und Höhe des Canvas
            canvas.width = canvasWidth;
            canvas.height = canvasHeight;

            const transformedCoordinates = coordinatesArrayIMG.map(coordinate => {
                var y = ((maxLongitude- coordinate[0]) * 1.660268738);
                var x = (coordinate[1] - minLatitude) ;

                var i = 0;
                while(i < runde){
                    y = y*2;
                    x = x*2
                    i = i+1;
                }

                return [y, x];
            });

            // Zeichne die Fläche auf dem Canvas
            context.beginPath();
            context.moveTo(transformedCoordinates[0][1], transformedCoordinates[0][0]);
            for (let i = 1; i < transformedCoordinates.length; i++) {
                context.lineTo(transformedCoordinates[i][1], transformedCoordinates[i][0]);
            }
            context.closePath();
            context.fillStyle = 'blue';
            context.fill();

            // Exportiere das Canvas als Bilddatei
            const dataURL = canvas.toDataURL('image/png'); // Hier kannst du 'image/png' oder 'image/jpeg' wählen

            // Erstelle ein HTML-Element (z.B. ein Bild) und setze die Daten-URL als Quelle
            const imageElement = document.querySelector('#imgFlaeche');
            //imageElement.style.backgroundColor = 'red';
            imageElement.src = dataURL;
        }