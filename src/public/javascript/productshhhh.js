
$(document).ready(function (){
  $('#example').DataTable();
});


function changeNeunzigCm(productId, kundennummer, checkedNeunzig) {

  fetch('/products/changeNeunzigCm', {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ productId: productId, kundennummer: kundennummer, checkedNeunzig: checkedNeunzig })
  })
  .then(response => response.status)
  .then(status => handleResponse(status))
  .catch(error => console.error('Error:', error));

}


var infos = "lufa"

//TODO: RELOAD ERSR NACHDEM DURCHGELAUFEN IST
function checkSelectedOption() {
  var selectedOption = document.getElementById('selectedOption');
  var kundenIdInput = document.getElementById('kundenid');

  if (selectedOption.value === '1') {
    kundenIdInput.disabled = true;
  } else {
    kundenIdInput.disabled = false;
  }
}


function createAndDownloadPDF(zweitanschrift, kundennummer) { 
  document.getElementById('loadingIndicator').style.display = 'block';
 
  const selectedProducts = [];
  const rows = document.querySelectorAll('tr');

  var path ="/products/pdf/"+zweitanschrift+"/"+kundennummer+"/"

  for (let index = 1; index < rows.length; index++) {
    const row = rows[index];
    const productNameCell = row.querySelector('td');
    const productIdRow = productNameCell.getAttribute('name');
    const neuBeantragenCheckbox = document.querySelector('input[name="neuBeantragen' + productIdRow + '"]');
    if (neuBeantragenCheckbox.checked) {
      path += productIdRow+'_';
      selectedProducts.push([productIdRow,kundennummer])
    }
  }

  path = path.slice(0, -1);
  window.location.href = path;
  document.getElementById('loadingIndicator').style.display = 'none';

}


function createPDF() {

  fetch('/products/createLUFADocument', {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({})
  })

  .then(response => response.text())
  .then()
  .catch(error => console.error('Error:', error));
}

function getKundenNummer(){
  return 'invoice'
}



//wird genutzt
function kmlerstellen(kundennummer) {
  const selectedProducts = [];
  const rows = document.querySelectorAll('tr');



  for (let index = 1; index < rows.length; index++) {
    const row = rows[index];
    const productNameCell = row.querySelector('td');
    const productIdRow = productNameCell.getAttribute('name');
    const neuBeantragenCheckbox = document.querySelector('input[name="neuBeantragen' + productIdRow + '"]');
    if (neuBeantragenCheckbox.checked) {
      selectedProducts.push([productIdRow,kundennummer])
    }
  }



  fetch('/products/generateKmlFile', {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ productIDs: selectedProducts})
  })

  .then(response => response.text())
  .then(url => {
    var blob = new Blob([url], { type: 'application/vnd.google-earth.kml+xml' });

    // Erstelle einen "a" HTML-Element mit einem "download"-Attribut
    var link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Fleachen"+kundennummer+".kml";
  
    // Füge den Link zum DOM hinzu und simuliere einen Klick
    document.body.appendChild(link);
    link.click();
  
    // Entferne den Link aus dem DOM
    document.body.removeChild(link);
  })
  .catch(error => console.error('Error:', error));
}

    

//wird genutzt
function ProbeWurdeGezogen(dateValue,userID) {
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
        CnValue: CheckboxCnValue,
        kundennummer: userID
      };

      selectedProducts.push(productInfo)

    }
  }

  document.getElementById('loadingIndicator').style.display = 'block';



  fetch('/products/ProbeWurdeGezogen', {
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
}


document.getElementById('uploadFormRegister').addEventListener('submit', function(event) {
  event.preventDefault(); // Verhindert das normale Verhalten des Formular-Submits

  var formData = new FormData(this);

  fetch('/products/setUpdateDatenVomKunden', {
    method: 'PUT',
    body: formData
  })

  location.reload()

});

    

function funktionFleacheSollBearbeitetWerden(dateValue, userid) {
  const selectedProducts = [];
  const rows = document.querySelectorAll('tr');
  document.getElementById('loadingIndicatorProbeMussGezogenWerden').style.display = 'block';


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
        kundennummer: userid,
        productId: productIdRow,
        dateValue: dateValue,
        //flaechenname: flaechennameValue,
        NminValue: MangatValue,
        SminValue: EminValue,
        HumusValue: StickstoffValue,
        CnValue: CheckboxCnValue

      };

      selectedProducts.push(productInfo)

    }
  }



  fetch('/products/funktionFleacheSollBearbeitetWerden', {
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

}


var map = L.map('map').setView([52.849226, 7.913939], 13); // Startpunkt-Koordinaten einstellen
var flaechenID = 0;
var coordinates = []; // Hier werden die Koordinaten für die aktuelle Fläche gesammelt

if(coordinatesArrayBestellt.length > 0){ 

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


function handleResponse(status) {
  if (status === 200) {
    location.reload(); // Hier die Seite neu laden
  } else if (status === 404) {
    console.error('ERROR')
  }
}





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

