var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt')
const getfleachenFromUser = require('../database/oracle').getfleachenFromUser
const getBestllungenFromUser = require('../database/oracle').getBestllungenFromUser
const getFleachenFromUserBestellt = require('../database/oracle').getFleachenFromUserBestellt
const registerUserWithFleachen = require('../database/oracle').registerUserWithFleachen
const getKundendaten = require('../database/oracle').getKundendaten
const createBestellung = require('../database/oracle').createBestellung 
const ProbeWurdeGezogen = require('../database/oracle').ProbeWurdeGezogen
const beiEinemKundenDieFleachenHinzufügen = require('../database/oracle').beiEinemKundenDieFleachenHinzufügen
const beiMehrerenKundenDieFleachenHinzufügen = require('../database/oracle').beiMehrerenKundenDieFleachenHinzufügen
const getKundendatenDieZuZiehenSind = require('../database/oracle').getKundendatenDieZuZiehenSind
const getkundenDatenVomAusgewaehltenUser = require('../database/oracle').getkundenDatenVomAusgewaehltenUser
const getUpdateDatenVomKunden = require('../database/oracle').getUpdateDatenVomKunden
const kundenzumloeschen = require('../database/oracle').kundenzumloeschen
const changeNeunzigCm = require('../database/oracle').changeNeunzigCm
const getProductIDs = require('../database/oracle').getProductIDs
const getDocumentInformation = require('../database/oracle').getDocumentInformation
const getZweitanschrift = require('../database/oracle').getZweitanschrift
const getZweitanschriftInformationLetsGo = require('../database/oracle').getZweitanschriftInformationLetsGo
const getChangeColor = require('../database/oracle').getChangeColor



const pdfService = require('../service/pdf-service')





var path = require('path');
const tokml = require('tokml');

//const { PDFDocument, rgb } = require('pdf-lib');

const getInformationsForGenerateKmlFile = require('../database/oracle').getInformationsForGenerateKmlFile
const funktionFleacheSollBearbeitetWerden = require('../database/oracle').funktionFleacheSollBearbeitetWerden

var getNoticitcation = ''

const shapefile = require('shapefile'); // Diese Bibliothek kann Shapefiles lesen
const { DOMParser } = require('xmldom');
const togeojson = require('@tmcw/togeojson');
const fileUpload = require('express-fileupload');
const JSZip = require('jszip');
const proj4 = require('proj4');
const { createCanvas, loadImage } = require('canvas');
const fs = require('fs').promises;
const multer = require('multer');
const { log } = require('console');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

var theKundenID = 0;
var bearbeiteteDatei = 1;
var ProduktIDFORIFNOPRODUKTIDVorgegeben = 0

router.use(fileUpload()); // Middleware hinzufügen

router.post('/upload', async (req, res) => {
  try{
    // file, res, req, register, anzahl der hochgeladenen dateien
    handleReadFile(req.files.sampleFile,res,req,false,0)
  } catch (error) {
    console.error(error)
    handleResponse(123,res)
  }
});

router.post('/uploadFormRegister', async (req, res) => {
  try{
    handleReadFile(req.files.sampleFile,res,req,true,0)
  } catch (error) {
    console.error(error)
    handleResponse(123,res,0)
  }
});

var mehrereKundenAlleFlaechenInformationen = []


router.post('/uploadMehrereKunden', async (req, res) => {
  const zipFiles = req.files.zipFiles;

  mehrereKundenAlleFlaechenInformationen = []

  if (!zipFiles || zipFiles.length === 0) {
      return res.status(400).send('Es wurden keine ZIP-Dateien hochgeladen.');
  }

  if (zipFiles.length > 1) {

    zipFiles.forEach(zipFile => {
      handleReadFile(zipFile,res,req,true,zipFiles.length)
    });
  } else {
    handleReadFile(zipFiles, res, req, true,0);
  }
});

function setBearbeiteteDateiEinenHoeher(){
  bearbeiteteDatei = bearbeiteteDatei+1;
}

function setBearbeiteteDateiWiederAufEins(){
  bearbeiteteDatei = 1
}

function getBearbeiteteDateiEinenHoeher(){
  return bearbeiteteDatei;
}

function handleReadFile(file,res,req,register,anzahldateien) {
  const ext = file.name.split('.').pop().toLowerCase(); // Erweiterung der Datei
  const selectedOption = req.body.selectedOption;
  if (file) {
    switch (ext) {
      case "geojson":
        readDataFromGeojsonFile(file,res,req,selectedOption,register);
        break;
      case "kml":
        readDataFromKMLFile(file, res,req,selectedOption,register);
        break;
      case "shp":
        readDataFromShpFile(file, res,req,selectedOption,register);
        break;
      case "zip":
        readDataFromZipFile(file, res, req, selectedOption,register,anzahldateien);
        break;
      default:
        alert("Invalid file ");
    }
  }
}

//TODO IDS AN DIE KUNDEN KNÜPFEN UND DIE RICHTIGEN IDS EINFÜGEN
function readDataFromKMLFile(file, res,req, selectedOption, register) {
  const kmlData = file.data.toString('utf8');
  const xmlDoc = new DOMParser().parseFromString(kmlData);
  const geoJSON = togeojson.kml(xmlDoc);
 

  onHightLight(geoJSON, res,req,selectedOption, register)
}

router.get('/', async function(req, res, next) {
  if (req.isAuthenticated()) {
      const userID = req.user.id
      var kundendaten = await getKundendaten()


      var kundendatenDieZuZiehenSind = await getKundendatenDieZuZiehenSind()
      artikelNrFromCart = []
      const kundendatenUebergabe = kundendaten
      res.render('products', { title: 'Express', Daten: kundendatenUebergabe, Notification: getNoticitcation, DatenZuZiehen: kundendatenDieZuZiehenSind, login: true })
      getNoticitcation = '';
      return; // Frühzeitig aus der Funktion zurückkehren
  }

  res.render('', { title: 'Express', login: false });
});

function setKundenID(KundenID){
  theKundenID = KundenID;
}

function getKundenID(){
  return theKundenID;
}

function setProduktIDFORIFNOPRODUKTIDVorgegeben(uebergabe){
  ProduktIDFORIFNOPRODUKTIDVorgegeben = ProduktIDFORIFNOPRODUKTIDVorgegeben +  uebergabe;
}

function getProduktIDFORIFNOPRODUKTIDVorgegeben(){
  return ProduktIDFORIFNOPRODUKTIDVorgegeben;
}

function setProduktIDFORIFNOPRODUKTIDVorgegebenWiederAufNull(uebergabe){
  ProduktIDFORIFNOPRODUKTIDVorgegeben = uebergabe;
}

router.get('/pdf/:zweitanschrift/:kundennummer/:flaechen', async (req, res, next) => {
  try {
    const zweitanschrift = req.params.zweitanschrift;
    const kundennummer = req.params.kundennummer;
    const flaechen = req.params.flaechen;
    var flaechenArray = flaechen;
    if(flaechen.includes('_')){
      flaechenArray = flaechen.split('_');
    }
    const selectedProducts = [];
    if(Array.isArray(flaechenArray)){
      flaechenArray.forEach((flaeche) => {
        selectedProducts.push([kundennummer, flaeche]);
      });
    } else {
      selectedProducts.push([kundennummer, flaechenArray]);
    }

    const documentInformation = await getDocumentInformationLetsGo(selectedProducts, res);
    var zweitanschriftInformation = 0;
    if(zweitanschrift != 0 ){
      var zweitanschriftInformation = await getZweitanschriftInformationLetsGo(zweitanschrift);
    }



    const stream = res.writeHead(200, {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment;filename='+documentInformation.kundenInformation.KUNDENNUMMER+'_Untersuchungsauftrag.pdf'
    });

    pdfService.buildPDF(
      (chunk) => stream.write(chunk),
      () => stream.end(),
      documentInformation, zweitanschriftInformation
    );
  } catch (error) {
    console.error(error);
  }
});

async function getDocumentInformationLetsGo(selectedProducts, res) {
  try {
    const documentInformation = await getDocumentInformation(selectedProducts, res);
    return documentInformation;
  } catch (error) {
    console.error(error);
  }
}



router.get('/:category', async (req,res)=>{
    if(req.isAuthenticated()){
      const userID = req.params.category
      const cartFromUser = await getBestllungenFromUser(userID)
      const kundenDatenVomAusgewaehltenUser = await getkundenDatenVomAusgewaehltenUser(userID)
      const zweitanschrift = await getZweitanschrift(); 
      var hatkeinenWarenkorb = false;


      setKundenID(userID)
      const FleachenFromUserBestellt = await getFleachenFromUserBestellt(userID)
      artikelNrFromCart = []
      res.render('productsByCategory',{title: 'Webshop', dieUserID: userID, kundenDatenVomAusgewaehltenUser: kundenDatenVomAusgewaehltenUser, hatkeinenWarenkorb: hatkeinenWarenkorb, zweitanschrift: zweitanschrift, UserCart: cartFromUser, FleachenBestellt: FleachenFromUserBestellt, login: true}) // mit CategoryRequested kann man evtl. die Kategorie in der Auswahlleiste farbig hinterlegen
    } else {
      res.redirect('/')
    }
})



async function InfoToKMLFile(infoProductIDs, res) {
  const currentDate = new Date(); // Aktuelles Datum und Uhrzeit
  const formattedDate = currentDate.toISOString().split('T')[0]; // Formatieren des Datums im ISO-Format (YYYY-MM-DD)


  var xmlString = `<?xml version="1.0" encoding="utf-8" ?>
  <kml xmlns="http://www.opengis.net/kml/2.2">
    <Document id="root_doc">
      <Schema name="`+formattedDate+`" id="`+formattedDate+`">
          <SimpleField name="PROBEN_NR" type="float"></SimpleField>
          <SimpleField name="KUNDEN_NR" type="float"></SimpleField>
          <SimpleField name="BEPROBENAB" type="string"></SimpleField>
          <SimpleField name="NUTZUNG" type="string"></SimpleField>
          <SimpleField name="SCHLAGBEZ" type="string"></SimpleField>
      </Schema>`;

  var aktKundennummer = "";
  var firstRunde = true;

  for (const info of infoProductIDs) {
    const produktinfo = info.produktinfo[0];
    const flaecheninfo = info.flaecheninfo;
    var ersteZeile = produktinfo.FLAECHENNAME;
    if(produktinfo.TIEFE === 60){
      ersteZeile = ersteZeile + "= 60cm" 
    } 
    if(aktKundennummer != produktinfo.KUNDENNUMMER && firstRunde){
      xmlString = xmlString + `
      <Folder><name>`+produktinfo.KUNDENNUMMER+`_`+produktinfo.VORNAME+`_`+produktinfo.NACHNAME+`</name>`;
      firstRunde = false;
      aktKundennummer = produktinfo.KUNDENNUMMER;
    } else if(aktKundennummer != produktinfo.KUNDENNUMMER && !firstRunde){
      xmlString = xmlString + `
      </Folder>
      <Folder><name>`+produktinfo.KUNDENNUMMER+`_`+produktinfo.VORNAME+`_`+produktinfo.NACHNAME+`</name>`;
      aktKundennummer = produktinfo.KUNDENNUMMER;
    }
    xmlString = xmlString + `
        <Placemark>
          <name>`+ ersteZeile  +`</name>
          <Style><LineStyle><color>ff0000ff</color></LineStyle><PolyStyle><fill>0</fill></PolyStyle></Style>
          <ExtendedData><SchemaData schemaUrl="#SELECT">
              <SimpleData name="PROBEN_NR">`+produktinfo.ARTIKELNR+`</SimpleData>
              <SimpleData name="KUNDEN_NR">`+produktinfo.KUNDENNUMMER+`</SimpleData>
              <SimpleData name="BEPROBENAB">`+produktinfo.STARTDATUM+`</SimpleData>
              <SimpleData name="NUTZUNG">`+produktinfo.FLEACHENART+`</SimpleData>
              <SimpleData name="SCHLAGBZ">`+ersteZeile+`</SimpleData>
          </SchemaData></ExtendedData>
          <Polygon>
            <outerBoundaryIs>
              <LinearRing>
                <coordinates>
                  `+flaecheninfo+`
                </coordinates>
              </LinearRing>
            </outerBoundaryIs>
          </Polygon>
        </Placemark>`;
  }

  xmlString = xmlString + `
      </Folder>
    </Document>
  </kml>`;
  
  return xmlString
}

router.put('/generateKmlFileByProducts', async (req,res) => {
  if(req.isAuthenticated()){
    const customerNames = req.body.customerNames;
    const nurEinKML = false;
    var xmlString;
    try {

      const productIDs = await getProductIDs(customerNames)
      const infoProductIDs = await getInformationsForGenerateKmlFile(productIDs,nurEinKML)
      xmlString = await InfoToKMLFile(infoProductIDs, res);
      res.setHeader('Content-Disposition', 'attachment; filename=output.kml');
      res.setHeader('Content-Type', 'application/vnd.google-earth.kml+xml');
      res.status(200).send(xmlString);
    } catch (error) {
      console.error('Fehler:', error);
      res.status(500).send('Fehler beim Hinzufügen zuWarenkorb.');
    }
  }
});



router.put('/generateKmlFile', async (req,res) => {
  if(req.isAuthenticated()){
    const productIDs = req.body.productIDs;
    const nurEinKML = req.body.nurEinKML;
    var xmlString;
    try {

      const infoProductIDs = await getInformationsForGenerateKmlFile(productIDs,nurEinKML)
      xmlString = await InfoToKMLFile(infoProductIDs, res);
      res.setHeader('Content-Disposition', 'attachment; filename=output.kml');
      res.setHeader('Content-Type', 'application/vnd.google-earth.kml+xml');
      res.status(200).send(xmlString);
    } catch (error) {
      console.error('Fehler:', error);
      res.status(500).send('Fehler beim Hinzufügen zuWarenkorb.');
    }
  }
});

router.put('/setUpdateDatenVomKunden', async (req,res) => {
  if(req.isAuthenticated()){
    const kundennummer = req.body.kundennummer;
    const vorname = req.body.vorname;
    const nachname = req.body.nachname;
    const email = req.body.email;
    const telefonnummer = req.body.telefonnummer;
    const ort = req.body.ort;
    const plz = req.body.plz;
    const strasse = req.body.strasse;
    const hausnummer = req.body.hausnummer;
    try {
      await getUpdateDatenVomKunden(kundennummer,vorname,nachname,email,telefonnummer,ort,plz,strasse,hausnummer)
      res.sendStatus(200)
    } catch (error) {
      console.error('Fehler:', error);
      res.status(404).send('Fehler beim Hinzufügen der neuen Informatioenen.');
    }
  } 
});



router.put('/changeNeunzigCm', async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      await changeNeunzigCm(req.body.productId, req.body.kundennummer,req.body.checkedNeunzig);

      res.sendStatus(330); // Erfolgreiche Antwort senden
    } catch (error) {
      console.error('Fehler:', error);
      res.status(500).send('Internal Server Error'); // Fehlerantwort senden
    }
  } else {
    res.status(401).send('Unauthorized'); // Nicht authentifiziert, Fehlerantwort senden
  }
});

router.put('/funktionFleacheSollBearbeitetWerden', async (req,res) => {
  if(req.isAuthenticated()){
    try {
      await funktionFleacheSollBearbeitetWerden(req.body.productIDs)
      res.sendStatus(200)
    } catch (error) {
      console.error('Fehler:', error);
    }
  }
});

router.put('/ProbeWurdeGezogen', async (req,res) => {
  if(req.isAuthenticated()){
    const productIDs = req.body.productIDs;
    try {
      await ProbeWurdeGezogen(productIDs)
      res.sendStatus(200)
    } catch (error) {
      console.error('Fehler:', error);
    }
  } 
});

router.put('/changeColor', async (req,res) => {
  if(req.isAuthenticated()){
    const userID = req.body.userID;
    try {
      await getChangeColor(userID)
      res.sendStatus(200)
    } catch (error) {
      console.error('Fehler:', error);
    }
  } 
});

router.put('/gerateAllInformations', async (req,res) => {
  if(req.isAuthenticated()){
    const file = req.body.file
    handleReadFile(file)
  }
});

router.put('/deleteCustomer', async (req,res) => {
  if(req.isAuthenticated()){
    try{
      const { kundeloeschen} = req.body;
      await kundenzumloeschen(kundeloeschen)
      res.sendStatus(200)
    }catch(error){
      console.error(error)
      res.sendStatus(404)
    }
  }
});

function readDataFromGeojsonFile(file,res,req,selectedOption,register) {
  onHightLight(file,res,req,selectedOption,register);
}

function convertTOWGS(geojson){
  const gaussKrueger = '+proj=tmerc +lat_0=0 +lon_0=9 +k=1 +x_0=3500000 +y_0=0 +ellps=bessel +towgs84=598.1,73.7,418.2,0.202,0.045,-2.455,6.7 +units=m +no_defs';
  const wgs84 = '+proj=longlat +datum=WGS84 +no_defs';

    geojson.features.forEach((feature, index) => {
      if (feature.geometry && feature.geometry.coordinates && feature.geometry.coordinates[0]) {

        feature.geometry.coordinates.forEach((ring, ringIndex) => {
          ring.forEach((coordinate, coordIndex) => {
            // Überprüfen, ob die Koordinaten gültige Zahlen sind
            if (!isNaN(coordinate[0]) && !isNaN(coordinate[1])) {
              const transformedCoordinates = proj4(gaussKrueger, wgs84, coordinate);
              feature.geometry.coordinates[ringIndex][coordIndex] = transformedCoordinates;
            } else {
              console.warn(`Skipping invalid coordinates at Ring ${ringIndex + 1}, Coordinate ${coordIndex + 1}`);
            }
          });
        });
      } else {
        console.error('Fehler: feature.geometry oder feature.geometry.coordinates sind nicht definiert ' + geojson.features[0].properties.KUNDEN_NR);
        return geojson;
      }
    });
   

  return geojson;
}

function convertTOWGSTransverseMercator(geojson) {
  const etrsUtmZone32 = '+proj=utm +zone=32 +ellps=GRS80 +datum=ETRS89 +units=m +no_defs';
  const wgs84 = '+proj=longlat +datum=WGS84 +no_defs';

  geojson.features.forEach((feature, index) => {
    if (feature.geometry && feature.geometry.coordinates && feature.geometry.coordinates[0]) {

      feature.geometry.coordinates.forEach((ring, ringIndex) => {
        ring.forEach((coordinate, coordIndex) => {
          // Überprüfen, ob die Koordinaten gültige Zahlen sind
          if (!isNaN(coordinate[0]) && !isNaN(coordinate[1])) {
            const transformedCoordinates = proj4(etrsUtmZone32, wgs84, coordinate);
            feature.geometry.coordinates[ringIndex][coordIndex] = transformedCoordinates;
          } else {
            console.warn(`Skipping invalid coordinates at Ring ${ringIndex + 1}, Coordinate ${coordIndex + 1}`);
          }
        });
      });
    } else {
      console.error('Fehler: feature.geometry oder feature.geometry.coordinates sind nicht definiert ' + geojson.features[0].properties.KUNDEN_NR);
      return geojson;
    }
  });

  return geojson;
}

async function readDataFromZipFile(file, res, req, selectedOption, register, anzahldateien) {
  try {
    const zip = new JSZip();
    
    const zipData = await zip.loadAsync(file.data);

    const shpFileZip = Object.values(zipData.files).find((file) =>
      file.name.toLowerCase().endsWith('.shp')
    );

    const dbfFileZip = Object.values(zipData.files).find((file) =>
      file.name.toLowerCase().endsWith('.dbf')
    );

    const prjFileZip = Object.values(zipData.files).find((file) =>
      file.name.toLowerCase().endsWith('.prj')
    );

    /*const cpgFileZip = Object.values(zipData.files).find((file) =>
      file.name.toLowerCase().endsWith('.cpg')
    );*/

    const shpBuffer = await shpFileZip.async('nodebuffer');
    const prjBuffer = await prjFileZip.async('nodebuffer');
    const dbfBuffer = await dbfFileZip.async('nodebuffer');
    //const cpgBuffer = await cpgFileZip.async('nodebuffer');

    var geojson = await shapefile.read(shpBuffer, dbfBuffer);


    if(isGaus(prjBuffer)){
      geojson = convertTOWGS(geojson);
    } else if(isTransverseMercator(prjBuffer)){
      geojson = convertTOWGSTransverseMercator(geojson);
    }

    onHightLight(geojson, res, req, selectedOption, register, anzahldateien)

  } catch (error) {
    console.error('Error processing shapefile:', error);
    handleResponse(400, res,0)
  }

}

async function readDataFromShpFile(file, res,req,selectedOption, register) {
  const shapefileBuffer = file.data;
  const geoJSON = await shapefile.read(shapefileBuffer);
  onHightLight(geoJSON, res,req,selectedOption, register)
}

function isGaus(prjContent){
  if (prjContent.includes('PROJECTION["Gauss_Kruger"]')) {
    return true;
  } else {
      return false;
  }
}

function isTransverseMercator(prjContent){
  if (prjContent.includes('PROJECTION["Transverse_Merca')) {
    return true;
  } else {
      return false;
  }
}

async function onHightLight(data, res,req,selectedOption,register , anzahldateien) {
  var password = '';
  if (!req.body.password) {
    password = 's';
  } else {
    password = req.body.password;
  }



  if(anzahldateien>1){
    var uebergebeneDaten = []

    data.features.forEach(feature => {

          
      var SCHLAG_NR = null, SCHLAG_NAME = null

      try{
        SCHLAG_NAME = getDataFromDiscription(feature.properties.description.value, 'SCHLAG=' , '<BR>' , '-')
        SCHLAG_NR = getDataFromDiscription(feature.properties.description.value, 'SCHLAG=' , '-', null)
      }catch(error){}


      var schlagBez = getFirstNonNull(feature.properties.name, feature.properties.SCHLNAME, feature.properties.name, feature.properties.SCHLAGBEZ, feature.properties.FL_NAME, feature.properties.SCHLAG_NAM,SCHLAG_NAME);
      var FleachenID = getFirstNonNull(SCHLAG_NR, feature.properties.SCHLNR+''+feature.properties.PRNR_ZAHL,feature.properties.BU_Schlnr,feature.properties.SCHLAGNR, feature.properties.SCHLAG_NR, feature.properties.FL_ID);

      var dateValue = feature.properties.BEPROBENAB;
      var NUTZUNG = feature.properties.NUTZUNG

      var KUNDEN_NR = data.features[0].properties.KUNDEN_NR;
      if (KUNDEN_NR === undefined || KUNDEN_NR === null) {
        KUNDEN_NR = data.features[0].properties.AUFTRAGGEB;
      }

      if(KUNDEN_NR === undefined && selectedOption > 1){
        KUNDEN_NR = req.body.kundenid
      }      

      if (NUTZUNG) {
      } else {
        NUTZUNG='0';
      }
    
      if (schlagBez) {
      } else {
        schlagBez=null;
      }

      if (dateValue) {
      } else {
        dateValue='0';
      }

      const parsedDate = new Date(dateValue);
      dateValue = `${parsedDate.getFullYear()}-${(parsedDate.getMonth() + 1).toString().padStart(2, '0')}-${parsedDate.getDate().toString().padStart(2, '0')} ${parsedDate.getHours().toString().padStart(2, '0')}:${parsedDate.getMinutes().toString().padStart(2, '0')}:${parsedDate.getSeconds().toString().padStart(2, '0')}`;
      const coordinatesArray = [];
      var image = '';


      if (feature.geometry && feature.geometry.coordinates && feature.geometry.coordinates[0]) {
        for (i = 0; i < feature.geometry.coordinates[0].length; i++) {
          const latitude = feature.geometry.coordinates[0][i][1];
          const longitude = feature.geometry.coordinates[0][i][0];
          coordinatesArray.push([latitude, longitude]);
        }
        image = createImg(coordinatesArray)
      } else {
        //console.error('Fehler: feature.geometry oder feature.geometry.coordinates sind nicht definiert zwqeitee stellse');
      
      }


      
      const requestData = {
        USERID: KUNDEN_NR,
        productid: FleachenID,
        flaechenname: schlagBez,
        dateValue: dateValue,
        EminValue: 'j',
        MangatValue: 'n',
        StickstoffValue: 'n',
        coordinates: coordinatesArray,
        imageElement: image,
        fleachenart: NUTZUNG,
        tiefenValue: 1,
        selectedOption : selectedOption,
        selectedOptionWinterung : req.body.selectedOptionWinterung
       
      };
      uebergebeneDaten.push(requestData)
    });


    mehrereKundenAlleFlaechenInformationen.push(uebergebeneDaten)

  
    if(getBearbeiteteDateiEinenHoeher() === anzahldateien){
      setBearbeiteteDateiWiederAufEins()
      var statusCode = await beiMehrerenKundenDieFleachenHinzufügen(res, mehrereKundenAlleFlaechenInformationen)
      mehrereKundenAlleFlaechenInformationen = []
      handleResponse(statusCode, res, data.features[0].properties.KUNDEN_NR)
    } else {

      setBearbeiteteDateiEinenHoeher()

    }
  } else {
    var statuscodeEinKunde = 100;

    if(register){
      try {
        var KUNDEN_NR = data.features[0].properties.KUNDEN_NR;
        if (KUNDEN_NR === undefined || KUNDEN_NR === null) {
          KUNDEN_NR = data.features[0].properties.AUFTRAGGEB;
        }

        try{
          KUNDEN_NR = getDataFromDiscription(data.features[0].properties.description.value, 'INFO=', '_',null)
        } catch (error){}
      
        if(KUNDEN_NR === undefined && selectedOption > 1){
          KUNDEN_NR = req.body.kundenid
        }      

        const hashedPassword = await bcrypt.hash(password, 10)
        const result  = await registerUserWithFleachen(KUNDEN_NR, req.body.email, req.body.telefonnummer, hashedPassword, password,req.body.vorname, req.body.nachname,req.body.date,req.body.ort, req.body.plz, req.body.strasse, req.body.hausnummer, selectedOption)
        setKundenID(result.kundennummer)
        
        if(result.statusCode===123){
          statuscodeEinKunde = 123;
        }

       } catch (error) {
        console.error(error)
        res.sendStatus(400)   
       }
    }
    if(statuscodeEinKunde===123){
      handleResponse(statuscodeEinKunde, res, 0);
    } else {
      if (data.features[0].properties.KUNDEN_NR === parseInt(getKundenID(), 10) || !data.features[0].properties.KUNDEN_NR) {
        createTheBestellung(parseInt(getKundenID(), 10), data.features.length)

        var uebergebeneDaten = []

        data.features.forEach(feature => {          
          var SCHLAG_NR = null; var SCHLAG_NAME;

          try {
            SCHLAG_NAME = feature.properties.description
          } catch(error){"Discription war nicht richtig"}

          console.log('nur discripton ' + SCHLAG_NAME)


          try {
            if(SCHLAG_NAME === null || SCHLAG_NAME === undefined){
              SCHLAG_NAME = getDataFromDiscription(feature.properties.description.value, 'SCHLAG=' , '<BR>' , '-')
            }
          } catch(error){}

          try {
            SCHLAG_NR = getDataFromDiscription(feature.properties.description.value, 'SCHLAG=' , '-', null)
          } catch(error){}


          try {
            if(SCHLAG_NAME === null || SCHLAG_NAME === undefined){
              SCHLAG_NAME = feature.description
            }
          } catch(error){}

          if(SCHLAG_NAME === null || SCHLAG_NAME === undefined){
            var schlagBez = getFirstNonNull([feature.properties.SCHLNAME, feature.properties.name, feature.properties.SCHLAGBEZ, feature.properties.FL_NAME, feature.properties.SCHLAG_NAM, SCHLAG_NAME,feature.properties.name],'NAME');
          } else {
            schlagBez = SCHLAG_NAME
          }

          console.log('nicht discripton ' + SCHLAG_NAME)


          var FleachenID = getFirstNonNull([feature.properties.PRNR_ZEICH ,feature.properties.PRNR_ZAHL,feature.properties.SCHLNR+''+feature.properties.PRNR_ZAHL,feature.properties.BU_Schlnr,feature.properties.SCHLAGNR, feature.properties.SCHLAG_NR, feature.properties.FL_ID, SCHLAG_NR],'ID');
          
          try{
            schlagBez = decodeURIComponent(escape(schlagBez));
          } catch (error){}
          
          var dateValue = feature.properties.BEPROBENAB;
          var Kundennummer = getKundenID();
          var NUTZUNG = feature.properties.NUTZUNG


          if (!FleachenID) {
            FleachenID=getKundenID() + '' + getProduktIDFORIFNOPRODUKTIDVorgegeben()
            setProduktIDFORIFNOPRODUKTIDVorgegeben(1);
          }

          if (NUTZUNG) {
          } else {
            NUTZUNG='0';
          }
        

          if (dateValue) {
          } else {
            dateValue='0';
          }

          const parsedDate = new Date(dateValue);
          dateValue = `${parsedDate.getFullYear()}-${(parsedDate.getMonth() + 1).toString().padStart(2, '0')}-${parsedDate.getDate().toString().padStart(2, '0')} ${parsedDate.getHours().toString().padStart(2, '0')}:${parsedDate.getMinutes().toString().padStart(2, '0')}:${parsedDate.getSeconds().toString().padStart(2, '0')}`;
          const coordinatesArray = [];

          var image = '';


          if (feature.geometry && feature.geometry.coordinates && feature.geometry.coordinates[0]) {
            for (i = 0; i < feature.geometry.coordinates[0].length; i++) {
              const latitude = feature.geometry.coordinates[0][i][1];
              const longitude = feature.geometry.coordinates[0][i][0];
              coordinatesArray.push([latitude, longitude]);
            }
            image = createImg(coordinatesArray)
          } else {
            console.error('Fehler: feature.geometry oder feature.geometry.coordinates sind nicht definiert zwqeitee stellse');
          }


          console.log('vor request ' + SCHLAG_NAME)

          
          const requestData = {
            USERID: Kundennummer,
            productid: FleachenID,
            flaechenname: schlagBez,
            dateValue: dateValue,
            EminValue: 'j',
            MangatValue: 'n',
            StickstoffValue: 'n',
            coordinates: coordinatesArray,
            imageElement: image,
            fleachenart: NUTZUNG,
            tiefenValue: 1,
            selectedOption : selectedOption,
            selectedOptionWinterung : req.body.selectedOptionWinterung
          };
          uebergebeneDaten.push(requestData)
        });
        
        try {
          await beiEinemKundenDieFleachenHinzufügen(uebergebeneDaten)
        } catch (error) {
          console.error('Fehler:', error);
        }

        setProduktIDFORIFNOPRODUKTIDVorgegebenWiederAufNull(0);
        handleResponse(100, res, getKundenID())
    
      } else {
        handleResponse(400, res,0)
      }
    }
  }
}


function getDataFromDiscription(discriptionData,firstCut,lastCut,middelCut){
  var inputString = discriptionData
  var startIndex = inputString.indexOf(firstCut);
  if (startIndex !== -1) {
      startIndex += firstCut.length;
      var endIndex = inputString.indexOf(lastCut, startIndex);
      if (endIndex !== -1) {
        if(middelCut===null){
          return inputString.substring(startIndex, endIndex);
        } else {
          return inputString.substring(startIndex, endIndex).split(middelCut)[1];
        }
      }

    }
    return undefined;
}

function getFirstNonNull(values,art) {
  for (var value of values) {
    if (value !== undefined && value !== null && value !== 'undefinedundefined') {
      if(art==='ID'){
        if (typeof value === 'string') {
          if (value.includes("-")) {
            value = value.replace("-", "");
            value = parseInt(value)
          } 
        }
      }

      if(hatDoppelteEintraege){
        if(art==='NAME'){
          if(isNaN(parseInt(value))){
            return value;
          }
        } else {
          return value;
        }
      }
    }
  }
  return null;
}

function hatDoppelteEintraege(array) {
  var zähler = {};

  for (var i = 0; i < array.length; i++) {
      var eintrag = array[i];
      if (zähler[eintrag]) {
          return false;
      }
      zähler[eintrag] = true;
  }
  return true;
}

async function createTheBestellung(userid,anzahlpositionen){
  try {
    const maxProduktnummerVomKunden = await createBestellung(userid,anzahlpositionen);
    setProduktIDFORIFNOPRODUKTIDVorgegeben(7)//maxProduktnummerVomKunden.productID)
    return maxProduktnummerVomKunden
  } catch (error) {
    console.error('Fehler:', error);
  }
}

function handleResponse(status, res, userID) {
  try{
    if (status === 200) {
      res.redirect('/products');
      location.reload(); // Hier die Seite neu laden
    } else if(status === 400){
      res.redirect('/products');
    } else if(status === 123 ||status === 500){
      getNoticitcation = 'Es wurde eine falsche Datei eingefügt'
      res.redirect('/products');
    } else if(status === 100){
      try{
        res.redirect('/products/'+ userID);
      } catch (error) {
        res.redirect('/products')
      }
    } else {
        const div = document.createElement('div');
        div.classList.add('notificationred');
        const p = document.createElement('p');
        p.textContent = 'Fehler!';
        div.appendChild(p);
        document.body.appendChild(div);
        location.reload()
    }
  } catch (error) {
    console.error('Es gab wohl einen Fehler: ' + error)
    res.redirect('/products')
  }
}

function createImg(coordinatesArrayIMG){
  const canvas = createCanvas();
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
  //const imageElement = document.querySelector('#imgFlaeche');
  //imageElement.style.backgroundColor = 'red';
  //imageElement.src = dataURL;
  return dataURL;
}

module.exports = router;