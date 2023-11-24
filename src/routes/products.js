var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt')
const registerUser = require('../database/oracle').registerUser
const putToCart = require('../database/oracle').putToCart
const getfleachenFromUser = require('../database/oracle').getfleachenFromUser
const getBestllungenFromUser = require('../database/oracle').getBestllungenFromUser
const getFleachenFromUserBestellt = require('../database/oracle').getFleachenFromUserBestellt
const registerUserWithFleachen = require('../database/oracle').registerUserWithFleachen
const initiateOrder = require('../database/oracle').initiateOrder
const getClobHier = require('../database/oracle').getClob
const KundendatenGET = require('../database/oracle').getKundendaten
const createCart = require('../database/oracle').createCart
const createBestellung = require('../database/oracle').createBestellung 
const putToBestellung = require('../database/oracle').putToBestellung
const getaufBearbeitenStellen = require('../database/oracle').getaufBearbeitenStellen
const beiEinemKundenDieFleachenHinzufügen = require('../database/oracle').beiEinemKundenDieFleachenHinzufügen
const beiMehrerenKundenDieFleachenHinzufügen = require('../database/oracle').beiMehrerenKundenDieFleachenHinzufügen
const getKundendatenDieZuZiehenSind = require('../database/oracle').getKundendatenDieZuZiehenSind
const getkundenDatenVomAusgewaehltenUser = require('../database/oracle').getkundenDatenVomAusgewaehltenUser
const getUpdateDatenVomKunden = require('../database/oracle').getUpdateDatenVomKunden
const kundenzumloeschen = require('../database/oracle').getKundenzumloeschen







const mehrereKundenHochladen = require('../database/oracle').mehrereKundenHochladen
const tokml = require('tokml');

const getInformationsForGenerateKmlFile = require('../database/oracle').getInformationsForGenerateKmlFile
const fleacheAufBearbeitetSetzen = require('../database/oracle').fleacheAufBearbeitetSetzen

var getNoticitcation = ''


const shapefile = require('shapefile'); // Diese Bibliothek kann Shapefiles lesen
const { DOMParser } = require('xmldom');
const togeojson = require('@tmcw/togeojson');
const fileUpload = require('express-fileupload');
const JSZip = require('jszip');
const proj4 = require('proj4');
const { createCanvas, loadImage } = require('canvas');

//const togeojson = require('@mapbox/togeojson');
const fs = require('fs');


const multer = require('multer');
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
    console.log(error)
    handleResponse(400,res)
  }
});

router.post('/uploadFormRegister', async (req, res) => {
  try{
    handleReadFile(req.files.sampleFile,res,req,true,0)
  } catch (error) {
    console.log(error)
    handleResponse(400,res,0)
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

function readDataFromKMLFile(file, res,req, selectedOption, register) {
  const kmlData = file.data.toString('utf8');
  const xmlDoc = new DOMParser().parseFromString(kmlData);
  const geoJSON = togeojson.kml(xmlDoc);
  onHightLight(geoJSON, res,req,selectedOption, register)
}



//TODO: getCLUBMIT userID verbinden --> sonst ewiges Laden

router.get('/', async function(req, res, next) {
    if(req.isAuthenticated()){
        const userID = req.user.id
        var kundendaten = await KundendatenGET()
        var kundendatenDieZuZiehenSind = await getKundendatenDieZuZiehenSind()
        artikelNrFromCart = []
        const kundendatenUebergabe = kundendaten
        res.render('products', { title: 'Express', Daten: kundendatenUebergabe, Notification: getNoticitcation, DatenZuZiehen: kundendatenDieZuZiehenSind, login:true})
        getNoticitcation = '';
      }
    res.render('', { title: 'Express',login:false});
});

router.post('/register', async (req,res) => {

    try {
     const hashedPassword = await bcrypt.hash(req.body.password, 10)

     await registerUser(req.body.email, req.body.telefonnummer, hashedPassword,req.body.vorname, req.body.nachname,req.body.date,req.body.ort, req.body.plz, req.body.strasse, req.body.hausnummer)
    
     res.redirect('/account')

    } catch (error) {
    console.log(error)
     res.sendStatus(500)   
    }
})

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

router.get('/:category', async (req,res)=>{
    if(req.isAuthenticated()){
        const userID = req.params.category
        const cartFromUser = await getBestllungenFromUser(userID)
        const fleachenFromUser = await getfleachenFromUser(userID)
        const kundenDatenVomAusgewaehltenUser = await getkundenDatenVomAusgewaehltenUser(userID)



        var hatkeinenWarenkorb = false;



        if(cartFromUser.products.length == 0){
          hatkeinenWarenkorb = true;
        }



        setKundenID(userID)

        const FleachenFromUserBestellt = await getFleachenFromUserBestellt(userID)
        artikelNrFromCart = []


        res.render('productsByCategory',{title: 'Webshop', dieUserID: userID, kundenDatenVomAusgewaehltenUser: kundenDatenVomAusgewaehltenUser, hatkeinenWarenkorb: hatkeinenWarenkorb, UserCart: cartFromUser, FleachenBestellt: FleachenFromUserBestellt,  Fleachen: fleachenFromUser, login: true}) // mit CategoryRequested kann man evtl. die Kategorie in der Auswahlleiste farbig hinterlegen
    }else{
        res.redirect('/')
    }
})

router.post('/', async (req,res)=>{
  if(req.isAuthenticated()){
     await initiateOrder(getKundenID())
      res.sendStatus(100)
  }else{
    res.sendStatus(401)
  }
})

async function InfoToKMLFile(infoProductIDs, res) {
  const geojson = {
    type: 'FeatureCollection',
    features: infoProductIDs.map(info => {
      const produktinfo = info.produktinfo[0];
      const flaecheninfo = info.flaecheninfo;
      
      return {
        type: 'Feature',
        properties: {
          PROBEN_NR: produktinfo.ARTIKELNR,
          KUNDEN_NR: produktinfo.KUNDENNUMMER,
          BEPROBENAB: produktinfo.STARTDATUM,
          NUTZUNG: produktinfo.FLEACHENART,
          SCHLAGBEZ: produktinfo.FLAECHENNAME,
        },
        geometry: {
          type: 'Point',
          coordinates: flaecheninfo // Direkte Verwendung der Koordinaten, ohne ein zusätzliches Array
        }
      };
    })
  };
  
    
  const kmlOptions = {
    documentName: 'SELECT',
    documentDescription: 'My Data',
    simpleStyle: true,
    customStyles: {
      Schema: {
        name: 'SELECT',
        id: 'SELECT',
        SimpleField: [
          { name: 'PROBEN_NR', type: 'float' },
          { name: 'KUNDEN_NR', type: 'float' },
          { name: 'BEPROBENAB', type: 'string' },
          { name: 'NUTZUNG', type: 'string' },
          { name: 'SCHLAGBEZ', type: 'string' },
          // ...
        ]
      },
      Folder: {
        name: 'SELECT'
      }
    }
  };

  var xmlString = `<?xml version="1.0" encoding="utf-8" ?>
  <kml xmlns="http://www.opengis.net/kml/2.2">
    <Document id="root_doc">
      <Schema name="SELECT" id="SELECT">
          <SimpleField name="PROBEN_NR" type="float"></SimpleField>
          <SimpleField name="KUNDEN_NR" type="float"></SimpleField>
          <SimpleField name="BEPROBENAB" type="string"></SimpleField>
          <SimpleField name="NUTZUNG" type="string"></SimpleField>
          <SimpleField name="SCHLAGBEZ" type="string"></SimpleField>
      </Schema>
      <Folder><name>SELECT</name>`;

  for (const info of infoProductIDs) {
    const produktinfo = info.produktinfo[0];
    const flaecheninfo = info.flaecheninfo;
    xmlString = xmlString + `
        <Placemark>
          <Style><LineStyle><color>ff0000ff</color></LineStyle><PolyStyle><fill>0</fill></PolyStyle></Style>
          <ExtendedData><SchemaData schemaUrl="#SELECT">
              <SimpleData name="PROBEN_NR">`+produktinfo.ARTIKELNR+`</SimpleData>
              <SimpleData name="KUNDEN_NR">`+produktinfo.KUNDENNUMMER+`</SimpleData>
              <SimpleData name="BEPROBENAB">`+produktinfo.STARTDATUM+`</SimpleData>
              <SimpleData name="NUTZUNG">`+produktinfo.FLEACHENART+`</SimpleData>
              <SimpleData name="SCHLAGBZ">`+produktinfo.FLAECHENNAME+`</SimpleData>
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
        </Placemark> `
  }

  xmlString = xmlString + `
      </Folder>
    </Document>
  </kml>`;
  
  const kml = tokml(geojson, kmlOptions);
  

  fs.writeFileSync('output.kml', kml);

  res.setHeader('Content-Disposition', 'attachment; filename=output.kml');
  res.setHeader('Content-Type', 'application/vnd.google-earth.kml+xml');
  res.send(xmlString);
}


router.put('/generateKmlFile', async (req,res) => {
  if(req.isAuthenticated()){
    const productIDs = req.body.productIDs;
    try {
      const infoProductIDs = await getInformationsForGenerateKmlFile(productIDs)
      await InfoToKMLFile(infoProductIDs, res);
    } catch (error) {
      console.error('Fehler:', error);
      res.status(500).send('Fehler beim Hinzufügen zum Warenkorb.');
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
    const geburtsdatum = req.body.date;

    const password = await bcrypt.hash(req.body.password, 10)


    try {
      await getUpdateDatenVomKunden(kundennummer,vorname,nachname,email,telefonnummer,ort,plz,strasse,hausnummer,password,geburtsdatum)
      res.sendStatus(100)
    } catch (error) {
      console.error('Fehler:', error);
      res.status(500).send('Fehler beim Hinzufügen der neuen Informatioenen.');
    }
  } 
});

router.put('/fleachenAufBearbeitetStellen', async (req,res) => {
  if(req.isAuthenticated()){
    try {
      console.log(req.body.productIDs)
      await fleacheAufBearbeitetSetzen(req.body.productIDs)
      res.sendStatus(100)
    } catch (error) {
      console.error('Fehler:', error);
    }
  }
});

router.put('/getaufBearbeitenStellen', async (req,res) => {
  if(req.isAuthenticated()){
    const productIDs = req.body.productIDs;
    try {
      await getaufBearbeitenStellen(productIDs)
    } catch (error) {
      console.error('Fehler:', error);
    }
  }
});

router.put('/add', async (req,res) => {
  if(req.isAuthenticated()){
    userID = 7 // req.body.USERID
    const productID = req.body.productid
    const flaechenname = req.body.flaechenname
    const dateValue = req.body.dateValue
    const coordinates = req.body.coordinates
    const imageElement = req.body.imageElement
    const EminValue = req.body.EminValue
    const MangatValue = req.body.MangatValue
    const StickstoffValue = req.body.StickstoffValue
    const fleachenartValue = req.body.fleachenart
    const gettiefenValue = req.body.tiefenValue

    try {
      // Warte, bis putToCart vollständig abgeschlossen ist
      await putToCart(userID, productID, flaechenname, dateValue, EminValue, MangatValue, StickstoffValue, coordinates, imageElement, fleachenartValue, gettiefenValue);
      res.send(200);
    } catch (error) {
      console.error('Fehler:', error);
      res.status(500).send('Fehler beim Hinzufügen zum Warenkorb.');
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
      //handleResponse(400,res)
      console.log(kundeloeschen)
    }catch(error){
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
    //const zipData = await zip.loadAsync(req.files.sampleFile.data);
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

    const shpBuffer = await shpFileZip.async('nodebuffer');
    const prjBuffer = await prjFileZip.async('nodebuffer');
    const dbfBuffer = await dbfFileZip.async('nodebuffer');


    var geojson = await shapefile.read(shpBuffer, dbfBuffer);


    if(isGaus(prjBuffer)){
      geojson = convertTOWGS(geojson);
    } else if(isTransverseMercator(prjBuffer)){
      geojson = convertTOWGSTransverseMercator(geojson);
      console.log('ES handelt sich um transmecador')
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
  if (prjContent.includes('PROJECTION["Transverse_Mercator"]')) {
    return true;
  } else {
      return false;
  }
}



async function onHightLight(data, res,req,selectedOption,register , anzahldateien) {
  var password = '';

  if (!req.body.password) {
    // Wenn nicht definiert oder leer, setze password auf "s"
    password = 's';
  } else {
    // Andernfalls verwende das übergebene Passwort
    password = req.body.password;
  }


  if(anzahldateien>1){
    var uebergebeneDaten = []

    data.features.forEach(feature => {
      var schlagBez = feature.properties.SCHLAGBEZ; 
      var dateValue = feature.properties.BEPROBENAB;
      var FleachenID = feature.properties.KUNDEN_NR + '' +  feature.properties.PROBEN_NR + '' + feature.properties.SCHLAGNR;
      var Kundennummer = feature.properties.KUNDEN_NR;
      var NUTZUNG = feature.properties.NUTZUNG

  
      if (NUTZUNG) {
      } else {
        NUTZUNG='0';
      }
    
      if (schlagBez) {
      } else {
        schlagBez='0';
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
        selectedOption : selectedOption         
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

        const hashedPassword = await bcrypt.hash(password, 10)
        const result  = await registerUserWithFleachen(data.features[0].properties.KUNDEN_NR, req.body.email, req.body.telefonnummer, hashedPassword,req.body.vorname, req.body.nachname,req.body.date,req.body.ort, req.body.plz, req.body.strasse, req.body.hausnummer, selectedOption)
        setKundenID(result.kundennummer)
        
        if(result.statusCode===123){
          statuscodeEinKunde = 123;
        }
       } catch (error) {
        console.log(error)
        res.sendStatus(500)   
       }
    }


    if(statuscodeEinKunde===123){
      handleResponse(statuscodeEinKunde, res, 0);
    } else {
      if (data.features[0].properties.KUNDEN_NR === parseInt(getKundenID(), 10) || !data.features[0].properties.KUNDEN_NR) {
        createTheBestellung(parseInt(getKundenID(), 10))

        var uebergebeneDaten = []

        data.features.forEach(feature => {
          var schlagBez = feature.properties.SCHLAGBEZ; 
          var dateValue = feature.properties.BEPROBENAB;
          var FleachenID = feature.properties.KUNDEN_NR + '' +  feature.properties.PROBEN_NR + '' + feature.properties.SCHLAGNR;
          var Kundennummer = getKundenID();
          var NUTZUNG = feature.properties.NUTZUNG


          if (feature.properties.PROBEN_NR && feature.properties.SCHLAGNR ) {
          } else {
            FleachenID=getKundenID() + '' + getProduktIDFORIFNOPRODUKTIDVorgegeben()
            setProduktIDFORIFNOPRODUKTIDVorgegeben(1);
          }

          if (Kundennummer) {
          } else {
            Kundennummer=0;
          }

          if (NUTZUNG) {
          } else {
            NUTZUNG='0';
          }
        
          if (schlagBez) {
          } else {
            schlagBez='0';
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
            selectedOption : selectedOption         
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

async function createTheBestellung(userid){
  try {
    const maxProduktnummerVomKunden = await createBestellung(userid);
    setProduktIDFORIFNOPRODUKTIDVorgegeben(maxProduktnummerVomKunden.productID)
    return maxProduktnummerVomKunden
  } catch (error) {
    console.error('Fehler:', error);
  }
}


async function addToBestellung(requestData){
  const userID = requestData.USERID
  const productID = requestData.productid
  const flaechenname = requestData.flaechenname
  const dateValue = requestData.dateValue
  const coordinates = requestData.coordinates
  const imageElement = requestData.imageElement
  const EminValue = requestData.EminValue
  const MangatValue = requestData.MangatValue
  const StickstoffValue = requestData.StickstoffValue
  const fleachenartValue = requestData.fleachenart
  const gettiefenValue = requestData.tiefenValue
  const selectedOption = requestData.selectedOption

  try {
    await putToBestellung(selectedOption, userID, productID, flaechenname, dateValue, EminValue, MangatValue, StickstoffValue, coordinates, imageElement, fleachenartValue, gettiefenValue);
  } catch (error) {
    console.error('Fehler:', error);
  }


}

function handleResponse(status, res, userID) {
  try{
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
    } else if(status === 400){
      res.redirect('/products');
    } else if(status === 123){
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
    console.log('Es gab wohl einen Fehler: ' + error)
    const div = document.createElement('div');
    div.classList.add('notificationred');
    const p = document.createElement('p');
    p.textContent = 'Fehler!';
    div.appendChild(p);
    document.body.appendChild(div);
    window.location.href = '/products'; // Ändere die URL entsprechend deiner Seite 
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