function showModal(){
  var modal = document.querySelector('.products-preview');
  modal.style.display = "block";
}

const neuBeantragen = document.querySelector('#neuBeantragen');
const CheckboxMangat = document.querySelector('#CheckboxMangat');
const CheckboxCn = document.querySelector('#CheckboxCn');
const neuBeantragenCheckboxes = document.querySelectorAll('#neuBeantragen');
const CheckboxEmin = document.querySelectorAll('#CheckboxEmin');
const CheckboxStickstoff = document.querySelectorAll('#CheckboxStickstoff');
const bestellButton = document.getElementById('kmlbutton');
const updatebutton = document.getElementById('updatebutton');
const aufBearbeitenStellen = document.getElementById('aufBearbeitenStellen');



neuBeantragenFunction();





function neuBeantragenFunction() {
  neuBeantragenCheckboxes.forEach(function(checkbox) {
    checkbox.addEventListener('change', function() {
      const numberPart = checkbox.name.replace('neuBeantragen', '');
      const neuBeantragenCheckbox = document.querySelector('input[name=neuBeantragen'+numberPart+']');
      const mangatCheckbox = document.querySelector('input[name=CheckboxMangat'+numberPart+']');
      const CheckboxEmin = document.querySelector('input[name=CheckboxEmin'+numberPart+']');
      const CheckboxStickstoff = document.querySelector('input[name=CheckboxStickstoff'+numberPart+']');
      const CheckboxCn = document.querySelector('input[name=CheckboxCn'+numberPart+']');

      const mindestensEineAusgewählt = Array.from(neuBeantragenCheckboxes).some(checkbox => checkbox.checked);

      
      if (mindestensEineAusgewählt) {
        bestellButton.style.display = 'block';
        updatebutton.style.display = 'block'
        aufBearbeitenStellen.style.display = 'block'
        
      } else {
        bestellButton.style.display = 'none';
        updatebutton.style.display = 'none';
        aufBearbeitenStellen.style.display = 'none';
      }


      if(neuBeantragenCheckbox.checked){


        mangatCheckbox.classList.add('redCheckbox');
        mangatCheckbox.classList.remove('normal');
        mangatCheckbox.disabled = false;


        CheckboxEmin.classList.add('redCheckbox');
        CheckboxEmin.classList.remove('normal');
        CheckboxEmin.disabled = false;
        

        CheckboxStickstoff.classList.add('redCheckbox');
        CheckboxStickstoff.classList.remove('normal');
        CheckboxStickstoff.disabled = false;

        CheckboxCn.classList.add('redCheckbox');
        CheckboxCn.classList.remove('normal');
        CheckboxCn.disabled = false;



      } else {

        mangatCheckbox.classList.remove('redCheckbox');
        mangatCheckbox.classList.add('normal');
        mangatCheckbox.disabled = true;

        CheckboxEmin.classList.remove('redCheckbox');
        CheckboxEmin.classList.add('normal');
        CheckboxEmin.disabled = true;

        CheckboxStickstoff.classList.remove('redCheckbox');
        CheckboxStickstoff.classList.add('normal');
        CheckboxStickstoff.disabled = true;


        CheckboxCn.classList.remove('redCheckbox');
        CheckboxCn.classList.add('normal');
        CheckboxCn.disabled = true;
      } 


/*

      if(neuBeantragenCheckbox.checked){


        mangatCheckbox.classList.add('redCheckbox');
        mangatCheckbox.classList.remove('normal');
        mangatCheckbox.disabled = false;

        if(mangatCheckbox.value == 3){
          mangatCheckbox.checked = true;
        } else {
          mangatCheckbox.checked = false;
        }

        CheckboxEmin.classList.add('redCheckbox');
        CheckboxEmin.classList.remove('normal');
        CheckboxEmin.disabled = false;
        
        if(CheckboxEmin.value == 3){
          CheckboxEmin.checked = true;
        } else {
          CheckboxEmin.checked = false;
        }

        CheckboxStickstoff.classList.add('redCheckbox');
        CheckboxStickstoff.classList.remove('normal');
        CheckboxStickstoff.disabled = false;

        if(CheckboxStickstoff.value == 3){
          CheckboxStickstoff.checked = true;
        } else {
          CheckboxStickstoff.checked = false;
        }

      } else {

        mangatCheckbox.classList.remove('redCheckbox');
        mangatCheckbox.classList.add('normal');
        mangatCheckbox.disabled = true;
        mangatCheckbox.checked = false;

        CheckboxEmin.classList.remove('redCheckbox');
        CheckboxEmin.classList.add('normal');
        CheckboxEmin.disabled = true;
        CheckboxEmin.checked = false;

        CheckboxStickstoff.classList.remove('redCheckbox');
        CheckboxStickstoff.classList.add('normal');
        CheckboxStickstoff.disabled = true;
        CheckboxStickstoff.checked = false;
      }    */ 
    });
  });
}



    function kmlerstellen(kundenummer) {
      const selectedProducts = [];
      const rows = document.querySelectorAll('tr');


    
      for (let index = 1; index < rows.length; index++) {
        const row = rows[index];
        const productNameCell = row.querySelector('td');
        const productIdRow = productNameCell.getAttribute('name');
        const neuBeantragenCheckbox = document.querySelector('input[name="neuBeantragen' + productIdRow + '"]');
        if (neuBeantragenCheckbox.checked) {
          selectedProducts.push(productIdRow)
        }
      }
    
      fetch('/products/generateKmlFile', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productIDs: selectedProducts })
      })

      .then(response => response.text())
      .then(url => {
        var blob = new Blob([url], { type: 'application/vnd.google-earth.kml+xml' });

        // Erstelle einen "a" HTML-Element mit einem "download"-Attribut
        var link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "Fleachen"+kundenummer+".kml";
      
        // Füge den Link zum DOM hinzu und simuliere einen Klick
        document.body.appendChild(link);
        link.click();
      
        // Entferne den Link aus dem DOM
        document.body.removeChild(link);
      })
      .catch(error => console.error('Error:', error));
    }
    


    function fleachwurdenBearbeitet(dateValue,userID) {
      const selectedProducts = [];
      const rows = document.querySelectorAll('tr');

      for (let index = 1; index < rows.length; index++) {
        var EminValue = 'n';
        var MangatValue = 'n';
        var StickstoffValue = 'n';
        var CheckboxCnValue = 'n';
        const row = rows[index];
        const productNameCell = row.querySelector('td'); // Hier wird das <td>-Element ausgewählt
        const productIdRow = productNameCell.getAttribute('name'); // Hier wird der Wert des "name"-Attributs extrahiert
  
        const neuBeantragenCheckbox = document.querySelector('input[name=neuBeantragen'+productIdRow+']');
        const MangatCheckbox = document.querySelector('input[name=CheckboxMangat'+productIdRow+']');
        const EminCheckbox = document.querySelector('input[name=CheckboxEmin'+productIdRow+']');
        const StickstoffCheckbox = document.querySelector('input[name=CheckboxStickstoff'+productIdRow+']');
        const CheckboxCn = document.querySelector('input[name=CheckboxCn'+productIdRow+']');
  
  
        if (EminCheckbox.checked) {
          EminValue = 'j';
        } 
  
        if (MangatCheckbox.checked) {
          MangatValue = 'j';
        } 
  
        if (StickstoffCheckbox.checked) {
          StickstoffValue = 'j';
        }
  
        if (CheckboxCn.checked) {
          CheckboxCnValue = 'j';
        }

  
  
        //TODO HIER EINTRAGEN WENN INPUT GEÄNDERT WIRD DATE MUSS AUCH!!!
    
        if (neuBeantragenCheckbox.checked) {
          const productInfo = {
            productId: productIdRow,
            //flaechenname: flaechennameValue,
            dateValue: dateValue,
            NminValue: MangatValue,
            SminValue: EminValue,
            HumusValue: StickstoffValue,
            CnValue: CheckboxCnValue
          };

          selectedProducts.push(productInfo)

        }
      }

    
      fetch('/products/fleachenAufBearbeitetStellen', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productIDs: selectedProducts })
      })
      .then(response => response.status)
      .then(status => handleResponse(status))
      .catch(error => console.error('Error:', error));

      location.reload()
      window.location.href = '/products/'+userID; // Ändere die URL entsprechend deiner Seite 


    }


    document.getElementById('uploadFormRegister').addEventListener('submit', function(event) {
      event.preventDefault(); // Verhindert das normale Verhalten des Formular-Submits
    
      var formData = new FormData(this);
    
      fetch('/products/setUpdateDatenVomKunden', {
        method: 'PUT',
        body: formData
      })
      .then(response => {
        if (response.ok) {
          console.log('Anfrage war erfolgreich');
          // Wenn die Anfrage erfolgreich war, zur ursprünglichen Seite zurückkehren
          window.location.replace('http://localhost:3000/products/500020');
        } else {
          console.error('Fehler beim Aktualisieren der Kundendaten');
        }
      })
      .catch(error => {
        console.error('Fehler beim Ausführen der Fetch-Anfrage:', error);
      });

      location.reload()

    });
    

    function funktionAufBearbeitenStellen(userid) {
      const selectedProducts = [];
      const rows = document.querySelectorAll('tr');

      for (let index = 1; index < rows.length; index++) {
        var EminValue = 'n';
        var MangatValue = 'n';
        var StickstoffValue = 'n';
        var CheckboxCnValue = 'n';
        const row = rows[index];
        const productNameCell = row.querySelector('td'); // Hier wird das <td>-Element ausgewählt
        const productIdRow = productNameCell.getAttribute('name'); // Hier wird der Wert des "name"-Attributs extrahiert
  
        const neuBeantragenCheckbox = document.querySelector('input[name=neuBeantragen'+productIdRow+']');
        const MangatCheckbox = document.querySelector('input[name=CheckboxMangat'+productIdRow+']');
        const EminCheckbox = document.querySelector('input[name=CheckboxEmin'+productIdRow+']');
        const StickstoffCheckbox = document.querySelector('input[name=CheckboxStickstoff'+productIdRow+']');
        const CheckboxCn = document.querySelector('input[name=CheckboxCn'+productIdRow+']');
  
  
        if (EminCheckbox.checked) {
          EminValue = 'j';
        } 
  
        if (MangatCheckbox.checked) {
          MangatValue = 'j';
        } 
  
        if (StickstoffCheckbox.checked) {
          StickstoffValue = 'j';
        }
  
        if (CheckboxCn.checked) {
          CheckboxCnValue = 'j';
        }

  
  
        //TODO HIER EINTRAGEN WENN INPUT GEÄNDERT WIRD DATE MUSS AUCH!!!
    
        if (neuBeantragenCheckbox.checked) {
          const productInfo = {
            productId: productIdRow,
            //flaechenname: flaechennameValue,
            NminValue: MangatValue,
            SminValue: EminValue,
            HumusValue: StickstoffValue,
            CnValue: CheckboxCnValue
          };

          selectedProducts.push(productInfo)

        }
      }

    
      fetch('/products/getaufBearbeitenStellen', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productIDs: selectedProducts })
      })
      .then(response => response.status)
      .then(status => handleResponse(status))
      .catch(error => console.error('Error:', error));


      location.reload()
      window.location.href = '/products/'+userid; // Ändere die URL entsprechend deiner Seite 
    }


    var map = L.map('map').setView([52.849226, 7.913939], 13); // Startpunkt-Koordinaten einstellen
    var flaechenID = 0;
    var coordinates = []; // Hier werden die Koordinaten für die aktuelle Fläche gesammelt

    if(coordinatesArrayBestellt.length > 0 || coordinatesArrayImWarenkorb.length > 0){ 

      var minLat = Number.POSITIVE_INFINITY;
      var maxLat = Number.NEGATIVE_INFINITY;
      var minLng = Number.POSITIVE_INFINITY;
      var maxLng = Number.NEGATIVE_INFINITY;

      for (var i = 0; i < coordinatesArrayBestellt.length; i++) {
          var latitude = coordinatesArrayBestellt[i].FKOORDINATENIDLAT;
          var longitude = coordinatesArrayBestellt[i].FKOORDINATENIDLNG;

          minLat = Math.min(minLat, latitude);
          maxLat = Math.max(maxLat, latitude);
          minLng = Math.min(minLng, longitude);
          maxLng = Math.max(maxLng, longitude);
      }

      for (var i = 0; i < coordinatesArrayImWarenkorb.length; i++) {
        var latitude = coordinatesArrayImWarenkorb[i].FKOORDINATENIDLAT;
        var longitude = coordinatesArrayImWarenkorb[i].FKOORDINATENIDLNG;

        minLat = Math.min(minLat, latitude);
        maxLat = Math.max(maxLat, latitude);
        minLng = Math.min(minLng, longitude);
        maxLng = Math.max(maxLng, longitude);
    }


      var centerLat = (minLat + maxLat) / 2;
      var centerLng = (minLng + maxLng) / 2;


      var bounds = L.latLngBounds(L.latLng(minLat, minLng), L.latLng(maxLat, maxLng));
      map.fitBounds(bounds);

  }

  L.tileLayer('https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3'],
    attribution: '© Google'
  }).addTo(map);


    var colorArt = '#b9f700'

    coordinatesArrayBestellt.forEach(function (fleachenStueck) {
      if (flaechenID === fleachenStueck.ARTIKELNR) {
          coordinates.push([fleachenStueck.FKOORDINATENIDLAT, fleachenStueck.FKOORDINATENIDLNG]);
          if(fleachenStueck.PROBENSTATUS === 1){
            colorArt = 'red'
          } else {
            colorArt = '#b9f700'
          }
      } else {                
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

          flaechenID = fleachenStueck.ARTIKELNR;
          coordinates = [
              [fleachenStueck.FKOORDINATENIDLAT, fleachenStueck.FKOORDINATENIDLNG],
          ];
      }
        });

    // Zum Schluss das letzte Polygon zeichnen (falls vorhanden)
    if (coordinates.length > 2) {
        L.polygon(coordinates, { color: colorArt, fillColor: colorArt, fillOpacity: 0.4 }).addTo(map);
    }

    flaechenID = 0;
    coordinates = []; // Hier werden die Koordinaten für die aktuelle Fläche gesammelt

    coordinatesArrayImWarenkorb.forEach(function (fleachenStueck) {
      if (flaechenID === fleachenStueck.ARTIKELNR) {
        coordinates.push([fleachenStueck.FKOORDINATENIDLAT, fleachenStueck.FKOORDINATENIDLNG]);
      } else {
        if (coordinates.length > 2) {
          L.polygon(coordinates, { color: 'blue', fillColor: 'blue', fillOpacity: 0.4 }).addTo(map);
        }

        // Zur nächsten Fläche wechseln und das Koordinaten-Array leeren
        flaechenID = fleachenStueck.ARTIKELNR;
        coordinates = [[fleachenStueck.FKOORDINATENIDLAT, fleachenStueck.FKOORDINATENIDLNG]];
      }
    });

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

    function openGoogleMaps() {
        //var coordinates = document.getElementById(".nettop#testid.tdR").value;

        var tdElement = document.querySelector(".nettop#testid.tdR"); // Wähle das td-Element aus
        var textInhalt = tdElement.textContent.trim(); // Extrahiere den Textinhalt und entferne Leerzeichen am Anfang und Ende

        console.error(textInhalt);

        //console.error(coordinates)
        coordinates = textInhalt; // Setze hier deine Koordinaten ein
        var mapsURL = 'https://www.google.com/maps?q=' + coordinates;
        window.open(mapsURL, '_blank');
    }

    function hideModal(){
        var modal = document.querySelector('.products-preview');
        modal.style.display = "none";
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    }


    function handleResponse(status) {
      if (status === 200) {
        const div = document.createElement('div');
        div.classList.add('notificationgreen');
        const p = document.createElement('p');
        p.textContent = 'Produkt erfolgreich hinzugefügt';
        div.appendChild(p);
        document.body.appendChild(div);
        location.reload()
      } if (status === 100) {
        const div = document.createElement('div');
        div.classList.add('notificationgreen');
        const p = document.createElement('p');
        p.textContent = 'Produkt erfolgreich hinzugefügt';
        div.appendChild(p);
        document.body.appendChild(div);
        location.reload()
      }
      
      else if (status === 300) {
        const div = document.createElement('div');
        div.classList.add('notificationgreen');
        const p = document.createElement('p');
        p.textContent = 'Produkt erfolgreich hinzugefügt';
        div.appendChild(p);
        document.body.appendChild(div);
        location.reload()
        window.location.href = '/products'; // Ändere die URL entsprechend deiner Seite 
      } else {
        const div = document.createElement('div');
        div.classList.add('notificationred');
        const p = document.createElement('p');
        p.textContent = 'Fehler!';
        div.appendChild(p);
        document.body.appendChild(div);
      }
    }

    function initiateOrder(){
      fetch('/products',{
          method: 'POST',
          credentials: 'include',
          headers:{
          'Content-Type': 'application/json',
          },
      })
          .then(response => response.status)
          .then(status => handleResponse(status))
          .catch(error => console.error('Error:', error));
  }
    
    
    function initiateOrderNew() {
      const selectedProducts = [];
      const rows = document.querySelectorAll('tr');

      for (let index = 1; index < rows.length - 1; index++) {
        var EminValue = 'n';
        var MangatValue = 'n';
        var StickstoffValue = 'n';
        const row = rows[index];
        const productNameCell = row.querySelector('td'); // Hier wird das <td>-Element ausgewählt
        const productIdRow = productNameCell.getAttribute('name'); // Hier wird der Wert des "name"-Attributs extrahiert

        const neuBeantragenCheckbox = document.querySelector('input[name=neuBeantragen'+productIdRow+']');
        const MangatCheckbox = document.querySelector('input[name=CheckboxMangat'+productIdRow+']');
        const EminCheckbox = document.querySelector('input[name=CheckboxEmin'+productIdRow+']');
        const StickstoffCheckbox = document.querySelector('input[name=CheckboxStickstoff'+productIdRow+']');
        const CheckboxCn = document.querySelector('input[name=CheckboxCn'+productIdRow+']');


        if (EminCheckbox.checked) {
          EminValue = 'j';
        } 

        if (MangatCheckbox.checked) {
          MangatValue = 'j';
        } 

        if (StickstoffCheckbox.checked) {
          StickstoffValue = 'j';
        }

        if (CheckboxCn.checked) {
          StickstoffValue = 'j';
        }


        //TODO HIER EINTRAGEN WENN INPUT GEÄNDERT WIRD DATE MUSS AUCH!!!
    
        if (neuBeantragenCheckbox.checked) {
          const productInfo = {
            productId: productIdRow,
            //flaechenname: flaechennameValue,
            //dateValue: dateValue,
            EminValue: EminValue,
            MangatValue: MangatValue,
            StickstoffValue: StickstoffValue
          };

          fetch('/products',{
            method: 'POST',
            credentials: 'include',
            headers:{
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(productInfo)
          })

          .then(response => response.status)
          .then(status => handleResponse(300))
          .catch(error => console.error('Error:', error));
          

        }

        
      }
      location.reload()
    }





function gotToSever (){
  fetch('/products/gerateAllInformations', {
    method: 'PUT',
    body: 'DAT',
  })
  .then(response => response.status)
  .catch(error => console.error('Error:', error));
}


function makeInformations(event) {
  let file = document.getElementById("fileSelect").files[0];
  if (file) {

    let ext = getExtension(file.name);
    switch (ext) {
      case "geojson":
        readDataFromGeojsonFile(file);
        break;
      case "":
        readDataFromKMLFile(file);
        break;
      case "shp":
        readDataFromShpFile(file);
        break;
      case "zip":
        readDataFromShpZipFile(file);
        break;
      default:
        alert("Invalid file ");
    }
  }
}



function handleReadFile(event) {
  let file = document.getElementById("fileSelect").files[0];
  if (file) {
    let ext = getExtension(file.name);
    switch (ext) {
      case "geojson":
        readDataFromGeojsonFile(file);
        break;
      case "kml":
        readDataFromKMLFile(file);
        break;
      case "shp":
        readDataFromShpFile(file);
        break;
      case "zip":
        readDataFromShpZipFile(file);
        break;
      default:
        alert("Invalid file ");
    }
  }
}

function getExtension(filename) {
  var parts = filename.split(".");
  return parts[parts.length - 1];
}


  
function readDataFromGeojsonFile(file) {
  const reader = new FileReader();
  reader.onload = () => {
    const fc = JSON.parse(reader.result.toString());
    if (fc && fc.features.length > 0) {
      onHightLight(fc);
    }
  };
  reader.readAsText(file);
}

function readDataFromKMLFile(file) {
  let fileReader = new FileReader();
  fileReader.onload = async (e) => {
    let parser = new DOMParser();
    let xmlDoc = parser.parseFromString(e.target.result, "text/xml");
    let kmlString = e.target.result; // Die KML-Datei als Zeichenfolge




    var information = kmlToGeoJSON(kmlString);
    //gotToSever();
    onHightLight(kmlToGeoJSON(kmlString));
  };
  fileReader.readAsText(file);
}


function kmlToGeoJSON(kmlString) {
  var parser = new DOMParser();
  var xmlDoc = parser.parseFromString(kmlString, 'text/xml');



  var placemarks = xmlDoc.querySelectorAll('Placemark');
  var features = [];

  placemarks.forEach(function (placemark) {
    var feature = {
      type: 'Feature',
      properties: {},
      geometry: {},
    };

    // Extrahiere die zusätzlichen Eigenschaften aus ExtendedData/SchemaData
    var schemaData = placemark.querySelector('ExtendedData > SchemaData');
    if (schemaData) {
      schemaData.querySelectorAll('SimpleData').forEach(function (simpleData) {
        var propertyName = simpleData.getAttribute('name');
        var propertyValue = simpleData.textContent;
        feature.properties[propertyName] = propertyValue;
      });
    }

    // Andere Eigenschaften, die du bereits verarbeitet hast
    var name = placemark.querySelector('name');
    if (name) {
      feature.properties.name = name.textContent;
    }

    var description = placemark.querySelector('description');
    if (description) {
      feature.properties.description = description.textContent;
    }

    var coordinates = placemark.querySelector('coordinates');
    if (coordinates) {
      var coordinatesArray = coordinates.textContent
        .trim()
        .split(/\s+/)
        .map(function (coord) {
          var [lon, lat] = coord.split(',').map(Number);
          return [lon, lat];
        });
      feature.geometry.type = 'Polygon'; // Ändere den Geometrietyp auf Polygon
      feature.geometry.coordinates = [coordinatesArray];
    }

    features.push(feature);
  });

  var geoJSON = {
    type: 'FeatureCollection',
    features: features,
  };

  return geoJSON;
}


function readDataFromShpFile(file) {
  var fc = []; // Initialisiere ein Array, um mehrere Flächen zu speichern
  const reader = new FileReader();
  const gaussKrueger = '+proj=tmerc +lat_0=0 +lon_0=9 +k=1 +x_0=3500000 +y_0=0 +ellps=bessel +towgs84=598.1,73.7,418.2,0.202,0.045,-2.455,6.7 +units=m +no_defs';
  const wgs84 = '+proj=longlat +datum=WGS84 +no_defs';
  reader.onload = (event) => {
    shapefile
      .openShp(reader.result)
      .then((source) => {
        source.read().then(function log(result) {
          if (result.done) {
            onHightLight(fc);
            return;
          }

          const polygon = result.value;

          // Extrahiere und gib die Koordinaten einzeln aus
          polygon.coordinates.forEach(coord => {
            const wgs84Coord = [];
            for (let i = 0; i < coord.length; i++) {
              const wgs84Coordinates = proj4(gaussKrueger, wgs84, coord[i]);
              wgs84Coord.push(wgs84Coordinates);
            }
            fc.push({ type: 'Polygon', coordinates: [wgs84Coord] }); // Füge die WGS84-Koordinaten als Polygon zum fc-Array hinzu
          });

          return source.read().then(log);
        });
      })
      .catch((error) => console.error(error.stack));
  };
  reader.readAsArrayBuffer(file);
}

function makeToShp(coordinatess){

  const coordinates = [
    { x: 1, y: 2 },
    { x: 3, y: 4 },
    //
  ]

  const shapefile = {
    type: 'FeatureCollection',
    features: coordinates.map(coord => ({
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Point',
        coordinates: [coord.x, coord.y],
      },
    })),
  };

  // Shapefile in eine SHP-Datei schreiben
  shpwrite.write(
    'output',  // Name der Ausgabedatei ohne Erweiterung
    shapefile  // Das Shapefile-Objekt
  );

}


function createNewShpFile(file) {
  var fc;
  const reader = new FileReader();
  const gaussKrueger = '+proj=tmerc +lat_0=0 +lon_0=9 +k=1 +x_0=3500000 +y_0=0 +ellps=bessel +towgs84=598.1,73.7,418.2,0.202,0.045,-2.455,6.7 +units=m +no_defs';
  const wgs84 = '+proj=longlat +datum=WGS84 +no_defs';
  var coordinates; 
  reader.onload = (event) => {
    shapefile
      .openShp(reader.result)
      .then((source) => {
        source.read().then(function log(result) {
          if (result.done) {
            makeToShp(fc)
            return;
          }
          
          // Extrahiere und gib die Koordinaten einzeln aus
          result.value.coordinates.forEach(coord => {
            for (let i = 0; i < coord.length; i++) {
              const wgs84Coordinates = proj4(gaussKrueger, wgs84, coord[i]);
              coord[i] = wgs84Coordinates;
            }
          });

          fc = result.value;

          return source.read().then(log);
        });
      })
      .catch((error) => console.error(error.stack));
  };
  reader.readAsArrayBuffer(file);
}

function isGaus(prjContent){
  if (prjContent.includes('PROJECTION["Gauss_Kruger"]')) {
    return true;
} else {
    return false;
}
}

function readDataFromShpZipFile(file) {
  const reader = new FileReader();
  reader.onload = (event) => {
    const zipData = event.target.result;

    // Verwenden Sie JSZip, um die Zip-Datei zu öffnen
    const zip = new JSZip();

    // Lesen Sie zuerst die PRJ-Datei aus der Zip-Datei
    zip.loadAsync(zipData).then((loadedZip) => {
      loadedZip.forEach((relativePath, zipEntry) => {
        if (relativePath.endsWith('.prj')) {
          zipEntry.async('string').then((prjContent) => {


            if (isGaus(prjContent)) {

              // Deklarieren Sie eine Variable für die SHP-Datei


              // Lesen Sie die Dateien in der Zip-Datei erneut
              zip.loadAsync(zipData).then((loadedZip2) => {
                loadedZip2.forEach((relativePath2, zipEntry2) => {
                  if (relativePath2.endsWith('.shp')) {
                    // Extrahieren Sie die SHP-Datei und lesen Sie die Daten
                    zipEntry2.async('uint8array').then((shpData) => {
                      // Hier haben Sie die SHP-Datei direkt aus zipEntry2.async() erhalten
                      
                      // Sie können jetzt die shpData verwenden oder speichern
                      const shpBlob = new Blob([shpData], { type: 'application/octet-stream' });
                      readDataFromShpFile(shpBlob)
                      //createNewShpFile(shpBlob)
                    }).catch((error) => {
                      console.error('Fehler beim Lesen der SHP-Datei:', error);
                    });
                  }
                });
              }).catch((error) => {
                console.error('Fehler beim Laden der Zip-Datei (zweite Iteration):', error);
              });
            } else {
              readDataFromNEWShpZipFile(file);
            }
          }).catch((error) => {
            console.error('Fehler beim Lesen der PRJ-Datei:', error);
          });
        }
      });
    }).catch((error) => {
      console.error('Fehler beim Laden der Zip-Datei (erste Iteration):', error);
    });
  };
  reader.readAsArrayBuffer(file);
}


function updateProjectionInPRJFile(prjContent) {
    // Überprüfen Sie, ob die PRJ-Datei "Gauss_Kruger" enthält
    if (prjContent.includes('PROJECTION["Gauss_Kruger"]')) {
        // Ändern Sie die Projektion auf "Transverse_Mercator"
        prjContent = prjContent.replace('PROJECTION["Gauss_Kruger"]', 'PROJECTION["Transverse_Mercator"]');
        //prjContent = prjContent.replace('PARAMETER["Scale_Factor",1.0]', 'PARAMETER["Scale_Factor",0.99996]');
        //prjContent = prjContent.replace('PARAMETER["False_Easting",3500000.0]', 'PARAMETER["False_Easting", 4000000.0]');
        //prjContent = prjContent.replace('PARAMETER["PARAMETER["Central_Meridian",9.0]', 'PARAMETER["Central_Meridian", 12.0]');
    } else {
    }
    return prjContent; // Geben Sie den aktualisierten PRJ-Inhalt zurück
}


function readDataFromNEWShpZipFile(file) {
  const reader = new FileReader();
  reader.onload = (event) => {
    shp(reader.result).then(function (fc) {

      const projection = fc;
      const sourceProjection = '+proj=tmerc +lat_0=0 +lon_0=9 +k=1 +x_0=3500000 +y_0=0 +ellps=bessel +units=m +no_defs';
      const targetProjection = '+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs';
  
      // Koordinaten umrechnen
      const coordinates = [3432421.3619976, 5849089.0995278];
      const transformedCoordinates = proj4(sourceProjection, targetProjection, coordinates);

      if (fc.features.length > 0) {
        onHightLight(fc);
      }
    });
  };
  reader.readAsArrayBuffer(file);
}

/*TODO KML EINLESEN!!!!*/ 


/*TODO ALLES INS BACKEND*/
/*ÜBERPRÜFEN; OB ES SICH HIER UM DIE RICHTIGE KUNDENNUMMER HANDELT; 
neuen Kunden erstellen für all die daten */


function updateDatenVomKunden(data){
  fetch('/products/setUpdateDatenVomKunden', {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ data: data })
  })
  .then(response => response.status)
  .then(status => handleResponse(status))
  .catch(error => console.error('Error:', error));

  location.reload()
  window.location.href = '/products/'+data[0][0];
}


function onHightLight(data) {


  data.features.forEach(feature => {


    var schlagBez = feature.properties.SCHLAGBEZ; // Greife auf die Eigenschaft "SCHLAGBEZ" zu
    var dateValue = feature.properties.BEPROBENAB;
    var FleachenID = feature.properties.KUNDEN_NR + feature.properties.PROBEN_NR + '' + feature.properties.SCHLAGNR;
    var Kundennummer = feature.properties.KUNDEN_NR;
    var NUTZUNG = feature.properties.NUTZUNG


    if (FleachenID) {
      console.log(`FleachenID: ${FleachenID}`);
    } else {
      FleachenID=0;
    }

    if (Kundennummer) {
      console.log(`Kundennummer: ${Kundennummer}`);
    } else {
      Kundennummer=0;
    }

    if (NUTZUNG) {
      console.log(`NUTZUNG: ${NUTZUNG}`);
    } else {
      NUTZUNG='0';
    }
  
    if (schlagBez) {
      console.log(`SCHLAGBEZ: ${schlagBez}`);
    } else {
      schlagBez='0';
    }

    if (dateValue) {
      console.log(`BEPROBENAB: ${dateValue}`);
    } else {
      dateValue='0';
    }


    const coordinatesArray = [];


    for (i=0; i<feature.geometry.coordinates[0].length; i++) {
      const latitude = feature.geometry.coordinates[0][i][1];
      const longitude = feature.geometry.coordinates[0][i][0];
      coordinatesArray.push([latitude, longitude]);
    }  
    
    


    const requestData = {
      USERID: Kundennummer,
      productid: FleachenID,
      flaechenname: schlagBez,
      dateValue: dateValue,
      EminValue: 'n',
      MangatValue: 'n',
      StickstoffValue: 'n',
      coordinates: coordinatesArray,
      imageElement: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAvCAYAAADw46qXAAAAAXNSR0IArs4c6QAAArtJREFUWEelmGuITVEUgL9VSpFkQiglI5RS0ghTUmoGoUiJPEpRMjKklBpvNSUZYYooGaGUkkdekchMSCnRGK+U1GgK+eMHW/s4dzr3OGfO2nftur/O+tZ39+rstfc+QtBwSwD/WwwyMAiNg6UYcotiiRcNSsSPA3lXzJdH5Ajd/IRkSE7SXSB7DUJX/69UUcmGKRJ1gYxXxJWFCLjjsWhkKAzMBbkVwnnhVWBBCJSIPQeyKoT1wvXAiRAoEeuAKpBvWt4LRwGftUBG3CaQY1o+fkvdA2CWFkrFdYDM0LIl4TbgoBbKiJsG8lTDl4QTgdcaICfmCEijhk8sfPccmKKBMmJ6QIZq2KTQd40mDZQTswLkQhGfFNYAT4qAPp5fBylcz6le6t4C1QZpNcj7vvi0sAXYbBDuBNkXIpwD3DUI34BMCBD6UNet3C3y8taD3M57mLEfutPAWsMs20BWhwj9nnjZIPwTN/TvWTmyZtgP+An0N0gbQPw++9/IO2JcApYahO0gM0OEa4AzBqFHa0CepXPkzbAK6DEKW0C2KIXR8vBnlTqD9CvI8BBhA3DUIPTocpCLyRx9HITdGOCDUXgNZKFSGJW1HZhulI4F6f3jBUd9twM4YBQ2gewv5SgSTgZeGIWdIP4IEw3NZeYlMMkorQO5oxU2A9uNwrMgvpmoZlgLPDIKf8cN/YeipNHb+gkYbZRuBGnVCluBDUbhY5BarXAecMMo9PhUpTAqq78hDTZKD4cI24CVRmF3iHAZUNaIK5C/ChEOiI8eAUzvX/oF7AZpDoTdFcB/RgkZp2JZdOkNFa4DTipt92LRw4DtKZ3ajQC+FAg/AntAMs9EgTOMlsd9YHaO1N8rvMy3ssxRiXArcCiV7Xxcvq6iclci9F+fOuPEHfGMbhaJSs8rEEZl9Rce/5r7Hhs0/gLxIJSq7QQwKgAAAABJRU5ErkJggg==',  
      fleachenart: NUTZUNG,
      tiefenValue: 1            
    };


    fetch('/products/add', {
      method: 'PUT',
      credentials: 'include',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData)
    })
    .catch(error => console.error('Error:', error));
  });


  //TODO SPEICHERBUTTON ERSTELLEN UND ALLES FLÄCHEN ANZEICHEN LASSEN 


  /*fetch('/products',{
    method: 'POST',
    credentials: 'include',
    headers:{
    'Content-Type': 'application/json',
    },
  })
    .then(response => response.status)
    //.then(status => handleResponse(300))
    .catch(error => console.error('Error:', error));*/

}


function handleResponse(status) {
  if (status === 200) {
      const div = document.createElement('div');
      div.classList.add('notificationgreen');
      const p = document.createElement('p');
      p.textContent = 'Produkt erfolgreich hinzugefügt';
      div.appendChild(p);
      document.body.appendChild(div);
      location.reload()
  } else if (status === 300) {
      const div = document.createElement('div');
      div.classList.add('notificationgreen');
      const p = document.createElement('p');
      p.textContent = 'Produkt erfolgreich hinzugefügt';
      div.appendChild(p);
      document.body.appendChild(div);
      location.reload()
      window.location.href = '/products'; // Ändere die URL entsprechend deiner Seite 
  } else {
      const div = document.createElement('div');
      div.classList.add('notificationred');
      const p = document.createElement('p');
      p.textContent = 'Fehler!';
      div.appendChild(p);
      document.body.appendChild(div);
      location.reload()

  }
}
