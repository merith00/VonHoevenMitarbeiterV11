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

    console.log(productNameCell)
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
    console.log(productNameCell)
    const productIdRow = productNameCell.getAttribute('name'); // Hier wird der Wert des "name"-Attributs extrahiert

    const neuBeantragenCheckbox = document.querySelector('input[name=neuBeantragen'+productIdRow+']');
    const MangatCheckbox = document.querySelector('input[name=CheckboxMangat'+productIdRow+']');
    const EminCheckbox = document.querySelector('input[name=CheckboxEmin'+productIdRow+']');
    const StickstoffCheckbox = document.querySelector('input[name=CheckboxStickstoff'+productIdRow+']');
    const CheckboxCn = document.querySelector('input[name=CheckboxCn'+productIdRow+']');

    console.log(productIdRow)

    console.log(EminCheckbox)





    



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

