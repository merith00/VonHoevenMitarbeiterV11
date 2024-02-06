const config = require('./conf')
const mysql = require('mysql2/promise'); 

async function ProbeWurdeGezogen(productIDs) {
  const connection = await mysql.createConnection(config);

  try {
    for (const id of productIDs) {
      // Check if PROBENSTATUS is not already 3 for the given ID
      const [existingProbeStatusRows] = await connection.execute("SELECT PROBENSTATUS FROM PRODUKT_ENTHAELT_PROBE WHERE ARTIKELNR = ? AND PROBENSTATUS = 3  AND KUNDENNUMMER = ?", [id.productId,id.kundennummer]);

      if (existingProbeStatusRows.length === 0) {
        // Update only if PROBENSTATUS is not already 3

        await connection.execute("DELETE FROM PRODUKT_ENTHAELT_PROBE WHERE ARTIKELNR = ? AND KUNDENNUMMER = ?", [id.productId,id.kundennummer]);


        await connection.execute("UPDATE PRODUKT SET STARTDATUM = STR_TO_DATE(?, '%Y-%m-%d') WHERE ARTIKELNR = ? AND KUNDENNUMMER = ?", [id.dateValue, id.productId, id.kundennummer]);

        

        if (id.NminValue == 'j') {
          await connection.execute("INSERT INTO PRODUKT_ENTHAELT_PROBE(ArtikelNr, PROBENARTID, PROBENSTATUS, KUNDENNUMMER) VALUES (?, 1, 3,?)", [id.productId,id.kundennummer]);
        }

        if (id.SminValue == 'j') {
          await connection.execute("INSERT INTO PRODUKT_ENTHAELT_PROBE(ArtikelNr, PROBENARTID, PROBENSTATUS, KUNDENNUMMER) VALUES (?, 2, 3,?)", [id.productId,id.kundennummer]);
        }

        if (id.HumusValue == 'j') {
          await connection.execute("INSERT INTO PRODUKT_ENTHAELT_PROBE(ArtikelNr, PROBENARTID, PROBENSTATUS, KUNDENNUMMER) VALUES (?, 3, 3,?)", [id.productId,id.kundennummer]);
        }

        if (id.CnValue == 'j') {
          await connection.execute("INSERT INTO PRODUKT_ENTHAELT_PROBE(ArtikelNr, PROBENARTID, PROBENSTATUS, KUNDENNUMMER) VALUES (?, 4, 3,?)", [id.productId,id.kundennummer]);
        }
      }
    }

    await connection.commit();
  } catch (error) {
    console.log('Ouch!', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}



async function funktionFleacheSollBearbeitetWerden(productIDs) {
  const connection = await mysql.createConnection(config);

  try {
    for (const id of productIDs) {

      const [existingProbeStatusRows] = await connection.execute("SELECT PROBENSTATUS FROM PRODUKT_ENTHAELT_PROBE WHERE ARTIKELNR = ? AND PROBENSTATUS = 1  AND KUNDENNUMMER = ?", [id.productId,id.kundennummer]);
      var dateValue = productIDs[0].dateValue;
      var sysdate = new Date(); // Hier wird das aktuelle Datum erstellt
      
      if (existingProbeStatusRows.length === 0) {      
        await connection.execute("DELETE FROM PRODUKT_ENTHAELT_PROBE WHERE ARTIKELNR = ? AND KUNDENNUMMER = ?", [id.productId,id.kundennummer]);



        
        await connection.execute("UPDATE PRODUKT SET BEARBEITUNGSARTID = ? WHERE ARTIKELNR = ? AND KUNDENNUMMER = ?",
        [dateValue, id.productId, id.kundennummer]);
          

        if (id.NminValue == 'j') {
          await connection.execute("INSERT INTO PRODUKT_ENTHAELT_PROBE(ArtikelNr, PROBENARTID, PROBENSTATUS, KUNDENNUMMER) VALUES (?, 1, 1,?)", [id.productId,id.kundennummer]);
        }

        if (id.SminValue == 'j') {
          await connection.execute("INSERT INTO PRODUKT_ENTHAELT_PROBE(ArtikelNr, PROBENARTID, PROBENSTATUS, KUNDENNUMMER) VALUES (?, 2, 1,?)", [id.productId,id.kundennummer]);
        }

        if (id.HumusValue == 'j') {
          await connection.execute("INSERT INTO PRODUKT_ENTHAELT_PROBE(ArtikelNr, PROBENARTID, PROBENSTATUS, KUNDENNUMMER) VALUES (?, 3, 1,?)", [id.productId,id.kundennummer]);
        }

        if (id.CnValue == 'j') {
          await connection.execute("INSERT INTO PRODUKT_ENTHAELT_PROBE(ArtikelNr, PROBENARTID, PROBENSTATUS, KUNDENNUMMER) VALUES (?, 4, 1,?)", [id.productId,id.kundennummer]);
        }
      }


















    }

    await connection.commit();
  } catch (error) {
    console.log('Ouch!', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}


async function getfleachenFromAllUser() {
  let connection;

  try {
    let connection;
    let resultsFleachenDaten = {
      winterung: [],
      fSommerung: [],
      sSommerung: []
    };
  
    connection = await mysql.createConnection(config);
    const resultWinterung = await getFlächenNachBearbeitungsID(1, connection);
    const resultFSommerung = await getFlächenNachBearbeitungsID(2, connection);
    const resultSSommerung = await getFlächenNachBearbeitungsID(3, connection);

    resultsFleachenDaten.winterung = resultWinterung;
    resultsFleachenDaten.fSommerung = resultFSommerung;
    resultsFleachenDaten.sSommerung = resultSSommerung;

    return resultsFleachenDaten;

  } catch (error) {
    console.error('Ouch!', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

async function getFleachenFromUserBestellt(userID) {
  let conn;
  let fleachen;

  try {
    conn = await mysql.createConnection(config);

    fleachen = await conn.execute(`
    SELECT DISTINCT fc.ARTIKELNR, fc.FKOORDINATENIDLAT, fc.FKOORDINATENIDLNG, fc.POSITIONSPUNKT, PEP.PROBENSTATUS
    FROM FLEACHENKOORDINATE fc
    JOIN PRODUKT p ON p.ARTIKELNR = fc.ARTIKELNR AND p.KUNDENNUMMER = fc.KUNDENNUMMER
    JOIN PRODUKT_ENTHAELT_PROBE PEP ON p.ARTIKELNR = PEP.ARTIKELNR AND p.KUNDENNUMMER = PEP.KUNDENNUMMER
    JOIN BESTELLUNG_ENTHAELT_PRODUKT wp ON wp.ARTIKELNR = p.ARTIKELNR and wp.KUNDENNUMMER = wp.KUNDENNUMMER
    JOIN BESTELLUNG w ON w.KUNDENNUMMER = wp.KUNDENNUMMER
    JOIN KUNDE k ON k.KUNDENNUMMER = w.KUNDENNUMMER
    WHERE fc.KUNDENNUMMER = ?
    ORDER BY fc.ARTIKELNR, fc.POSITIONSPUNKT
    `, [userID]);

    return fleachen[0];
  } catch (err) {
    console.log('Ouch!', err);
  } finally {
    if (conn) {
      await conn.end();
    }
  }
}

async function getInformationsForGenerateKmlFile(productIDs,nurEinKML) {
  const connection = await mysql.createConnection(config);
  const infoProductIDs = [];


  try {
    if (Array.isArray(productIDs) && !  nurEinKML) {
      for (const id of productIDs) {
        const [infoProdukt] = await connection.execute('SELECT PRODUKT.ARTIKELNR, PRODUKT.KUNDENNUMMER, PRODUKT.STARTDATUM, PRODUKT.FLEACHENART, PRODUKT.FLAECHENNAME, TIEFE.TIEFE, ABDATUM FROM PRODUKT JOIN PRODUKT_ENTHAELT_TIEFE ON PRODUKT.ARTIKELNR = PRODUKT_ENTHAELT_TIEFE.ARTIKELNR AND PRODUKT.KUNDENNUMMER = PRODUKT_ENTHAELT_TIEFE.KUNDENNUMMER JOIN TIEFE ON PRODUKT_ENTHAELT_TIEFE.TIEFENID = TIEFE.TIEFENID JOIN BEARBEITUNGSART B ON B.BEARBEITUNGSARTID = PRODUKT.BEARBEITUNGSARTID WHERE PRODUKT.ARTIKELNR = ? AND PRODUKT.KUNDENNUMMER = ? ', [id[0], id[1]]);
        const [infoFlaechenkoordinate] = await connection.execute('SELECT FKOORDINATENIDLNG, FKOORDINATENIDLAT FROM FLEACHENKOORDINATE WHERE ARTIKELNR = ? AND KUNDENNUMMER = ? ORDER BY POSITIONSPUNKT', [id[0], id[1]]);
        const [infoFlaechenkoordinateErste] = await connection.execute('SELECT FKOORDINATENIDLNG, FKOORDINATENIDLAT FROM FLEACHENKOORDINATE WHERE ARTIKELNR = ? AND POSITIONSPUNKT = 1  AND KUNDENNUMMER = ?', [id[0], id[1]]);

        const flaecheninfo = infoFlaechenkoordinate.map(row => `${row.FKOORDINATENIDLNG},${row.FKOORDINATENIDLAT}`);

        const flaecheninfoErste = `${infoFlaechenkoordinateErste[0].FKOORDINATENIDLNG},${infoFlaechenkoordinateErste[0].FKOORDINATENIDLAT}`;
        const coordinates = flaecheninfo.join(' ') + ' ' + flaecheninfoErste;

        infoProductIDs.push({
          id: id,
          produktinfo: [infoProdukt[0]],
          flaecheninfo: [coordinates]
        });
      }
    } else {
      const [infoProdukt] = await connection.execute('SELECT PRODUKT.ARTIKELNR, PRODUKT.KUNDENNUMMER, PRODUKT.STARTDATUM, PRODUKT.FLEACHENART, PRODUKT.FLAECHENNAME, TIEFE.TIEFE FROM PRODUKT JOIN PRODUKT_ENTHAELT_TIEFE ON PRODUKT.ARTIKELNR = PRODUKT_ENTHAELT_TIEFE.ARTIKELNR AND PRODUKT.KUNDENNUMMER = PRODUKT_ENTHAELT_TIEFE.KUNDENNUMMER JOIN TIEFE ON PRODUKT_ENTHAELT_TIEFE.TIEFENID = TIEFE.TIEFENID WHERE PRODUKT.ARTIKELNR = ? AND PRODUKT.KUNDENNUMMER = ? ', [productIDs[0], productIDs[1]]);
      const [infoFlaechenkoordinate] = await connection.execute('SELECT FKOORDINATENIDLNG, FKOORDINATENIDLAT FROM FLEACHENKOORDINATE WHERE ARTIKELNR = ? AND KUNDENNUMMER = ? ORDER BY POSITIONSPUNKT', [productIDs[0], productIDs[1]]);
      const [infoFlaechenkoordinateErste] = await connection.execute('SELECT FKOORDINATENIDLNG, FKOORDINATENIDLAT FROM FLEACHENKOORDINATE WHERE ARTIKELNR = ? AND POSITIONSPUNKT = 1  AND KUNDENNUMMER = ?', [productIDs[0], productIDs[1]]);

      const flaecheninfo = infoFlaechenkoordinate.map(row => `${row.FKOORDINATENIDLNG},${row.FKOORDINATENIDLAT}`);

      const flaecheninfoErste = `${infoFlaechenkoordinateErste[0].FKOORDINATENIDLNG},${infoFlaechenkoordinateErste[0].FKOORDINATENIDLAT}`;
      const coordinates = flaecheninfo.join(' ') + ' ' + flaecheninfoErste;

      infoProductIDs.push({
        id: productIDs,
        produktinfo: [infoProdukt[0]],
        flaecheninfo: [coordinates]
      });

    }
  } catch (error) {
    console.log('Ouch!', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
  return infoProductIDs;
}

async function getBestllungenFromUser(userID) {
  let connection;
  let cart = {
    gesamtsumme: null,
    mwst: null,
    products: []
  }

  try {
    connection = await mysql.createConnection(config);

    // Alle Produkte des Warenkorbs des Users auslesen
    const [result3] = await connection.execute(`
    SELECT
    P.*,
    B2.ABDATUM,
    CASE WHEN PP.PROBENARTID IS NOT NULL THEN 'J' ELSE 'N' END AS enthält_mangat,
    CASE WHEN PP.PROBENARTID IS NOT NULL THEN PP.PROBENSTATUS ELSE 0 END AS statusmangat,
    CASE WHEN PE.PROBENARTID IS NOT NULL THEN 'J' ELSE 'N' END AS enthält_emin,
    CASE WHEN PE.PROBENARTID IS NOT NULL THEN PE.PROBENSTATUS ELSE 0 END AS statusemin,
    CASE WHEN PS.PROBENARTID IS NOT NULL THEN 'J' ELSE 'N' END AS enthält_stickstoff,
    CASE WHEN PS.PROBENARTID IS NOT NULL THEN PS.PROBENSTATUS ELSE 0 END AS statusstickstoff,
    P.KUNDENNUMMER,
    TIEFENID
    FROM
    PRODUKT P
    JOIN
    BESTELLUNG_ENTHAELT_PRODUKT B ON P.ARTIKELNR = B.ARTIKELNR AND P.KUNDENNUMMER = B.KUNDENNUMMER
    JOIN
    BESTELLUNG O ON B.KUNDENNUMMER = O.KUNDENNUMMER
    JOIN
    PRODUKT_ENTHAELT_TIEFE PT ON P.ARTIKELNR = PT.ARTIKELNR AND P.KUNDENNUMMER = PT.KUNDENNUMMER
    JOIN BEARBEITUNGSART B2 on P.BEARBEITUNGSARTID = B2.BEARBEITUNGSARTID
    LEFT JOIN
    PRODUKT_ENTHAELT_PROBE PP ON P.ARTIKELNR = PP.ARTIKELNR AND P.KUNDENNUMMER = PP.KUNDENNUMMER AND PP.PROBENARTID = 1
    LEFT JOIN
    PRODUKT_ENTHAELT_PROBE PE ON P.ARTIKELNR = PE.ARTIKELNR AND P.KUNDENNUMMER = PP.KUNDENNUMMER AND PE.PROBENARTID = 2
    LEFT JOIN
    PRODUKT_ENTHAELT_PROBE PS ON P.ARTIKELNR = PS.ARTIKELNR AND P.KUNDENNUMMER = PP.KUNDENNUMMER AND PS.PROBENARTID = 3

    WHERE
    O.Kundennummer = ?
    ORDER BY P.ARTIKELNR
    `, [userID]);
    cart.products = result3;



    return cart;
  } catch (err) {
    console.error('Ouch!', err);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}


async function getFlächenNachBearbeitungsID(BEARBEITUNGSARTID) {
  let connection;
  try {
    connection = await mysql.createConnection(config);

    const [rows] = await connection.execute(`
    SELECT  DISTINCT  fc.ARTIKELNR, fc.KUNDENNUMMER, fc.FKOORDINATENIDLAT, fc.FKOORDINATENIDLNG, fc.POSITIONSPUNKT, b.ABDATUM,
    CASE WHEN PP.PROBENARTID IS NOT NULL THEN 1 ELSE 0 END AS enthält_nmin,
    CASE WHEN PSmin.PROBENARTID IS NOT NULL THEN 1 ELSE 0 END AS enthält_smin,
    CASE WHEN PHumus.PROBENARTID IS NOT NULL THEN 1 ELSE 0 END AS enthält_humus,
    CASE WHEN PCN.PROBENARTID IS NOT NULL THEN 1 ELSE 0 END AS enthält_cn,
    P.FLAECHENNAME, P.STARTDATUM, P.FLEACHENART, P.KUNDENNUMMER, P.BEARBEITUNGSARTID,
    PEP.PROBENSTATUS
    FROM FLEACHENKOORDINATE fc
    JOIN PRODUKT P ON P.ARTIKELNR = fc.ARTIKELNR AND P.KUNDENNUMMER = fc.KUNDENNUMMER
    JOIN BEARBEITUNGSART b on P.BEARBEITUNGSARTID = b.BEARBEITUNGSARTID
    JOIN PRODUKT_ENTHAELT_PROBE PEP ON P.ARTIKELNR = PEP.ARTIKELNR AND P.KUNDENNUMMER = PEP.KUNDENNUMMER
    JOIN BESTELLUNG_ENTHAELT_PRODUKT wp ON wp.ARTIKELNR = P.ARTIKELNR and wp.KUNDENNUMMER = wp.KUNDENNUMMER
    JOIN BESTELLUNG w ON w.KUNDENNUMMER = wp.KUNDENNUMMER
    JOIN KUNDE k ON k.KUNDENNUMMER = w.KUNDENNUMMER
    LEFT JOIN PRODUKT_ENTHAELT_PROBE PP ON P.ARTIKELNR = PP.ARTIKELNR AND P.KUNDENNUMMER = PP.KUNDENNUMMER AND PP.PROBENARTID = 1
    LEFT JOIN PRODUKT_ENTHAELT_PROBE PSmin ON P.ARTIKELNR = PSmin.ARTIKELNR AND P.KUNDENNUMMER = PP.KUNDENNUMMER AND PSmin.PROBENARTID = 2
    LEFT JOIN PRODUKT_ENTHAELT_PROBE PHumus ON P.ARTIKELNR = PHumus.ARTIKELNR AND P.KUNDENNUMMER = PP.KUNDENNUMMER AND PHumus.PROBENARTID = 3
    LEFT JOIN PRODUKT_ENTHAELT_PROBE PCN ON P.ARTIKELNR = PCN.ARTIKELNR AND P.KUNDENNUMMER = PP.KUNDENNUMMER AND PCN.PROBENARTID = 4
    WHERE b.BEARBEITUNGSARTID = ?
    ORDER BY P.KUNDENNUMMER, fc.ARTIKELNR, fc.POSITIONSPUNKT
    `, [BEARBEITUNGSARTID]);

    return rows;
  } catch (error) {
    console.error('Ouch!', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}


async function getKundenDatenMitGeoDatenDieZuZiehenSind(geoID) {
  let connection;
  try {
    connection = await mysql.createConnection(config);

    resultAbdatum = {
      alle: [],
      winterung: [],
      fSommerung: [],
      sSommerung: []
    }
    
    const resultAlle = await getKundenDatenMitGeoDatenDieZuZiehenSindAbdatumAlle(geoID, connection);
    const resultWinterung = await getKundenDatenMitGeoDatenDieZuZiehenSindAbdatum(geoID, 1, connection);
    const resultFSommerung = await getKundenDatenMitGeoDatenDieZuZiehenSindAbdatum(geoID, 2, connection);
    const resultSSommerung = await getKundenDatenMitGeoDatenDieZuZiehenSindAbdatum(geoID, 3, connection);

    resultAbdatum.alle = resultAlle;
    resultAbdatum.winterung = resultWinterung;
    resultAbdatum.fSommerung = resultFSommerung;
    resultAbdatum.sSommerung = resultSSommerung;

    return resultAbdatum;
  } catch (err) {
    console.error('Ouch!', err);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

async function getKundenDatenMitGeoDatenDieZuZiehenSindAbdatumAlle(geoID) {
  let connection;
  try {
    connection = await mysql.createConnection(config);
    const [rows] = await connection.execute(`
    SELECT
    KUNDE.KUNDENNUMMER,
    KUNDE.VORNAME,
    KUNDE.NACHNAME,
    KUNDE.E_MAIL,
    KUNDE.TELEFONNUMMER,
    ADRESSE.ORT,
    COUNT(P.ARTIKELNR) AS AnzahlFlaechen
FROM
    KUNDE
    JOIN KUNDE_HAT_ADRESSE ON KUNDE.KUNDENNUMMER = KUNDE_HAT_ADRESSE.KUNDENNUMMER
    JOIN ADRESSE ON KUNDE_HAT_ADRESSE.STRASSE = ADRESSE.STRASSE
      AND KUNDE_HAT_ADRESSE.ORT = ADRESSE.ORT
      AND KUNDE_HAT_ADRESSE.POSTLEITZAHL = ADRESSE.POSTLEITZAHL
      AND KUNDE_HAT_ADRESSE.HAUSNUMMER = ADRESSE.HAUSNUMMER
    LEFT JOIN PRODUKT P ON KUNDE.KUNDENNUMMER = P.KUNDENNUMMER
    JOIN PRODUKT_ENTHAELT_PROBE PEP ON P.ARTIKELNR = PEP.ARTIKELNR
      AND P.KUNDENNUMMER = PEP.KUNDENNUMMER
      AND PEP.PROBENSTATUS = 1
WHERE GEODATENGEBERID = ?  
GROUP BY
    KUNDE.KUNDENNUMMER,
    KUNDE.VORNAME,
    KUNDE.NACHNAME,
    KUNDE.E_MAIL,
    KUNDE.TELEFONNUMMER,
    ADRESSE.ORT
    `, [geoID]);

    return rows;
  } catch (err) {
    console.error('Ouch!', err);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

async function getKundenDatenMitGeoDatenDieZuZiehenSindAbdatum(geoID,bearbeitungsid) {
  let connection;
  try {
    connection = await mysql.createConnection(config);

    const [rows] = await connection.execute(`
        SELECT
        KUNDE.KUNDENNUMMER,
        KUNDE.VORNAME,
        KUNDE.NACHNAME,
        KUNDE.E_MAIL,
        KUNDE.TELEFONNUMMER,
        ADRESSE.ORT,
        COUNT(P.ARTIKELNR) AS AnzahlFlaechen
    FROM
        KUNDE
        JOIN KUNDE_HAT_ADRESSE ON KUNDE.KUNDENNUMMER = KUNDE_HAT_ADRESSE.KUNDENNUMMER
        JOIN ADRESSE ON KUNDE_HAT_ADRESSE.STRASSE = ADRESSE.STRASSE
          AND KUNDE_HAT_ADRESSE.ORT = ADRESSE.ORT
          AND KUNDE_HAT_ADRESSE.POSTLEITZAHL = ADRESSE.POSTLEITZAHL
          AND KUNDE_HAT_ADRESSE.HAUSNUMMER = ADRESSE.HAUSNUMMER
        LEFT JOIN PRODUKT P ON KUNDE.KUNDENNUMMER = P.KUNDENNUMMER
        JOIN PRODUKT_ENTHAELT_PROBE PEP ON P.ARTIKELNR = PEP.ARTIKELNR
          AND P.KUNDENNUMMER = PEP.KUNDENNUMMER
          AND PEP.PROBENSTATUS = 1
    WHERE GEODATENGEBERID = ? AND BEARBEITUNGSARTID = ?
    GROUP BY
        KUNDE.KUNDENNUMMER,
        KUNDE.VORNAME,
        KUNDE.NACHNAME,
        KUNDE.E_MAIL,
        KUNDE.TELEFONNUMMER,
        ADRESSE.ORT
    `, [geoID,bearbeitungsid]);

    return rows;
  } catch (err) {
    console.error('Ouch!', err);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

async function getKundendatenDieZuZiehenSind() {
  let connection;
  let resultsKundendaten = {
    lufa: {
      alle: [],
      winterung: [],
      fSommerung: [],
      sSommerung: []
    },
    claas: {
      alle: [],
      winterung: [],
      fSommerung: [],
      sSommerung: []
    },
    gsagri: {
      alle: [],
      winterung: [],
      fSommerung: [],
      sSommerung: []
    },
    lwkniedersachsen: {
      alle: [],
      winterung: [],
      fSommerung: [],
      sSommerung: []
    },
    maehlmann: {
      alle: [],
      winterung: [],
      fSommerung: [],
      sSommerung: []
    },
    sonstiges: {
      alle: [],
      winterung: [],
      fSommerung: [],
      sSommerung: []
    },
  };


  try {
    connection = await mysql.createConnection(config);

    const resultLufa = await getKundenDatenMitGeoDatenDieZuZiehenSind(1, connection);
    const resultclaas = await getKundenDatenMitGeoDatenDieZuZiehenSind(2, connection);
    const resultgsagri = await getKundenDatenMitGeoDatenDieZuZiehenSind(3, connection);
    const resultlwkniedersachsen = await getKundenDatenMitGeoDatenDieZuZiehenSind(4, connection);
    const resultmaehlmann = await getKundenDatenMitGeoDatenDieZuZiehenSind(5, connection);
    const resultsonsttiges = await getKundenDatenMitGeoDatenDieZuZiehenSind(6, connection);

    resultsKundendaten.lufa = resultLufa;
    resultsKundendaten.claas = resultclaas;
    resultsKundendaten.gsagri = resultgsagri;
    resultsKundendaten.lwkniedersachsen = resultlwkniedersachsen;
    resultsKundendaten.maehlmann = resultmaehlmann;
    resultsKundendaten.sonstiges = resultsonsttiges;

    return resultsKundendaten;
  } catch (error) {
    console.error('Ouch!', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

async function getKundendaten() {
  let connection;
  let resultsKundendaten = {
    lufa: {
      alle: [],
      winterung: [],
      fSommerung: [],
      sSommerung: []
    },
    claas: {
      alle: [],
      winterung: [],
      fSommerung: [],
      sSommerung: []
    },
    gsagri: {
      alle: [],
      winterung: [],
      fSommerung: [],
      sSommerung: []
    },
    lwkniedersachsen: {
      alle: [],
      winterung: [],
      fSommerung: [],
      sSommerung: []
    },
    maehlmann: {
      alle: [],
      winterung: [],
      fSommerung: [],
      sSommerung: []
    },
    sonstiges: {
      alle: [],
      winterung: [],
      fSommerung: [],
      sSommerung: []
    },
  };

  try {
    connection = await mysql.createConnection(config);

    const resultLufa = await getKundenDatenMitGeoDaten(1, connection);
    const resultclaas = await getKundenDatenMitGeoDaten(2, connection);
    const resultGsagri = await getKundenDatenMitGeoDaten(3, connection);
    const resultlwkniedersachsen = await getKundenDatenMitGeoDaten(4, connection);
    const resultmaehlmann = await getKundenDatenMitGeoDaten(5, connection);
    const resultsonsttiges = await getKundenDatenMitGeoDaten(6, connection);

    resultsKundendaten.lufa = resultLufa;
    resultsKundendaten.claas = resultclaas;
    resultsKundendaten.gsagri = resultGsagri;
    resultsKundendaten.lwkniedersachsen = resultlwkniedersachsen;
    resultsKundendaten.maehlmann = resultmaehlmann;
    resultsKundendaten.sonstiges = resultsonsttiges;

    return resultsKundendaten;
  } catch (error) {
    console.error('Ouch!', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

async function getKundenDatenMitGeoDaten(geoID) {
  let connection;
  try {
    connection = await mysql.createConnection(config);

    resultAbdatum = {
      alle: [],
      winterung: [],
      fSommerung: [],
      sSommerung: []
    }
    
    const resultAlle = await getKundenDatenMitGeoDatenAbdatumAlle(geoID, connection);
    const resultWinterung = await getKundenDatenMitGeoDatenAbdatum(geoID, 1, connection);
    const resultFSommerung = await getKundenDatenMitGeoDatenAbdatum(geoID, 2, connection);
    const resultSSommerung = await getKundenDatenMitGeoDatenAbdatum(geoID, 3, connection);

    resultAbdatum.alle = resultAlle;
    resultAbdatum.winterung = resultWinterung;
    resultAbdatum.fSommerung = resultFSommerung;
    resultAbdatum.sSommerung = resultSSommerung;

    return resultAbdatum;
  } catch (err) {
    console.error('Ouch!', err);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

async function getKundenDatenMitGeoDatenAbdatumAlle(geoID) {
  let connection;
  try {
    connection = await mysql.createConnection(config);
    const [rows] = await connection.execute(`
    SELECT
    KUNDE.KUNDENNUMMER,
    KUNDE.VORNAME,
    KUNDE.NACHNAME,
    KUNDE.E_MAIL,
    KUNDE.TELEFONNUMMER,
    ADRESSE.ORT,
    COUNT(P.ARTIKELNR) AS AnzahlFlaechen
FROM
    KUNDE
    JOIN KUNDE_HAT_ADRESSE ON KUNDE.KUNDENNUMMER = KUNDE_HAT_ADRESSE.KUNDENNUMMER
    JOIN ADRESSE ON KUNDE_HAT_ADRESSE.STRASSE = ADRESSE.STRASSE
      AND KUNDE_HAT_ADRESSE.ORT = ADRESSE.ORT
      AND KUNDE_HAT_ADRESSE.POSTLEITZAHL = ADRESSE.POSTLEITZAHL
      AND KUNDE_HAT_ADRESSE.HAUSNUMMER = ADRESSE.HAUSNUMMER
    LEFT JOIN PRODUKT P ON KUNDE.KUNDENNUMMER = P.KUNDENNUMMER
    JOIN PRODUKT_ENTHAELT_PROBE PEP ON P.ARTIKELNR = PEP.ARTIKELNR
      AND P.KUNDENNUMMER = PEP.KUNDENNUMMER
WHERE GEODATENGEBERID = ? 
GROUP BY
    KUNDE.KUNDENNUMMER,
    KUNDE.VORNAME,
    KUNDE.NACHNAME,
    KUNDE.E_MAIL,
    KUNDE.TELEFONNUMMER,
    ADRESSE.ORT
    `, [geoID]);

    return rows;
  } catch (err) {
    console.error('Ouch!', err);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

async function getKundenDatenMitGeoDatenAbdatum(geoID,bearbeitungsid) {
  let connection;
  try {
    connection = await mysql.createConnection(config);

    const [rows] = await connection.execute(`
    SELECT
    KUNDE.KUNDENNUMMER,
    KUNDE.VORNAME,
    KUNDE.NACHNAME,
    KUNDE.E_MAIL,
    KUNDE.TELEFONNUMMER,
    ADRESSE.ORT,
    COUNT(P.ARTIKELNR) AS AnzahlFlaechen
FROM
    KUNDE
    JOIN KUNDE_HAT_ADRESSE ON KUNDE.KUNDENNUMMER = KUNDE_HAT_ADRESSE.KUNDENNUMMER
    JOIN ADRESSE ON KUNDE_HAT_ADRESSE.STRASSE = ADRESSE.STRASSE
      AND KUNDE_HAT_ADRESSE.ORT = ADRESSE.ORT
      AND KUNDE_HAT_ADRESSE.POSTLEITZAHL = ADRESSE.POSTLEITZAHL
      AND KUNDE_HAT_ADRESSE.HAUSNUMMER = ADRESSE.HAUSNUMMER
    LEFT JOIN PRODUKT P ON KUNDE.KUNDENNUMMER = P.KUNDENNUMMER
    JOIN PRODUKT_ENTHAELT_PROBE PEP ON P.ARTIKELNR = PEP.ARTIKELNR
      AND P.KUNDENNUMMER = PEP.KUNDENNUMMER
WHERE GEODATENGEBERID = ? AND BEARBEITUNGSARTID = ?
GROUP BY
    KUNDE.KUNDENNUMMER,
    KUNDE.VORNAME,
    KUNDE.NACHNAME,
    KUNDE.E_MAIL,
    KUNDE.TELEFONNUMMER,
    ADRESSE.ORT
    `, [geoID,bearbeitungsid]);

    return rows;
  } catch (err) {
    console.error('Ouch!', err);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

async function getMitarbeiterdaten() {
  let connection;
  let results = [];

  try {
    connection = await mysql.createConnection(config);

    const [rows] = await connection.execute('SELECT * FROM MITARBEITER');

    results = rows;

    return results;
  } catch (err) {
    console.error('Ouch!', err);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

async function createBestellung(userID, anzahlpositionen) {
  let connection;


  try {
    connection = await mysql.createConnection(config);

    const [hatBestellung] = await connection.execute("SELECT KUNDENNUMMER FROM BESTELLUNG WHERE Kundennummer = ?", [userID]);

    try {
      if (hatBestellung.length === 0) {
        await connection.execute('INSERT INTO BESTELLUNG(KUNDENNUMMER, ANZAHLPOSITIONEN, ZEITSTEMPEL) VALUES (?, ?, NOW())', [userID,anzahlpositionen]);
        await connection.commit();
      }
    } catch (error) {
      console.error('Fehler beim Einfügen: BESTELLUNG ' + error.message);
    }
  } catch (err) {
    console.log('Ouch!', err);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

async function anderPasswort(userID, passwordNewInput) {
  let connection;
  try {
    connection = await mysql.createConnection(config);
    await connection.execute('UPDATE MITARBEITER SET PASSWORD = ? WHERE PERSONALNUMMER = ?', [passwordNewInput, userID]);
    await connection.commit();
  } catch (err) {
    console.log('Ouch!', err);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

async function registerUserWithFleachen(kundennummer, email, telefonnummer, hashedPassword, password, vorname, nachname, geburtsdatum, ort, plz, strasse, hausnummer, selectedOption) {
  const connection = await mysql.createConnection(config);


  try {
    if (selectedOption > 1 && kundennummer === undefined) {
      const maxKundennummer = await connection.execute('SELECT MAX(KUNDENNUMMER) AS MAXKUNDENNUMMER FROM KUNDE WHERE GEODATENGEBERID  != 1');

      kundennummer = maxKundennummer[0][0].MAXKUNDENNUMMER + 1;
    }

    const result = await connection.execute(
      "INSERT INTO KUNDE (Kundennummer, E_MAIL, Telefonnummer, PASSWORDUNHASHED, PASSWORD, VORNAME, NACHNAME, KundeSeit, GEODATENGEBERID) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), ?)",
      [kundennummer, email, telefonnummer, password, hashedPassword, vorname, nachname, selectedOption]
    );

    ort = ort || 'null';
    plz = plz || 0;
    strasse = strasse || 'null';
    hausnummer = hausnummer || 0;

    // Check if ADRESSE schon vorhanden
    const result4 = await connection.execute('SELECT * FROM ADRESSE WHERE STRASSE = ? AND POSTLEITZAHL = ? AND HAUSNUMMER = ? AND ORT = ?', [strasse, plz, hausnummer, ort]);

    if (result4[0].length > 0) {
      await connection.execute('UPDATE ADRESSE SET ISTRECHNUNGSADRESSE = 1, ISTLIEFERADRESSE = 1 WHERE STRASSE = ? AND POSTLEITZAHL = ? AND HAUSNUMMER = ? AND ORT = ?', [strasse, plz, hausnummer, ort]);
    } else {
      await connection.execute("INSERT INTO ADRESSE (STRASSE, POSTLEITZAHL, HAUSNUMMER, ORT, ISTWOHNADRESSE, ISTRECHNUNGSADRESSE, ISTLIEFERADRESSE, ISTSTANDORTSADRESSE) VALUES (?, ?, ?, ?, 0, 1, 1, 0)", [strasse, plz, hausnummer, ort]);
    }

    await connection.execute(
      "INSERT INTO KUNDE_HAT_ADRESSE (KUNDENNUMMER, STRASSE, POSTLEITZAHL, HAUSNUMMER, ORT) VALUES (?, ?, ?, ?, ?)",
      [kundennummer, strasse, plz, hausnummer, ort]
    );

    await connection.commit();

    return { kundennummer };
  } catch (error) {
    console.log('User could not be registered', error);
    const statusCode = 123;
    return { kundennummer, statusCode };
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

async function getUserByEmail(email) {
  let conn
  const user = {
    email: null,
    password: null,
    id: null
  }
  try {
    const connection = await mysql.createConnection(config);

    const [rows, fields] = await connection.execute(
      'SELECT E_MAIL, PASSWORD, Personalnummer FROM MITARBEITER WHERE E_MAIL = ?',
      [email]
    );
  

    const user = {};
    if (rows.length > 0) {
      user.email = rows[0].E_MAIL;
      user.password = rows[0].PASSWORD;
      user.id = rows[0].Personalnummer;
    }

    return user;
  




    /*const result = await conn.execute(
      'SELECT E_MAIL, PASSWORD, KUNDENNUMMER FROM KUNDE WHERE E_MAIL = :email',[email]
    )*/
    /*  if(result.rows.length > 0){
        user.email = result.rows[0][0]
        user.password = result.rows[0][1]
        user.id = result.rows[0][2]
    }
      return user*/
      
  } catch (err) {
    console.log('Error Reading User', err)
    throw err
  } finally {
    if (conn) { // conn assignment worked, need to close
      await conn.close()
    }
  }
}

async function getUserById(id) {
  const connection = await mysql.createConnection(config);

  try {
    // MySQL-Abfrage ausführen
    const [rows, fields] = await connection.execute(
      'SELECT E_MAIL, PASSWORD, KUNDENNUMMER FROM KUNDE WHERE Kundennummer = ?',
      [id]
    );

    // Hier kannst du deine Logik für die Verarbeitung der MySQL-Ergebnisse implementieren
    const user = {};
    if (rows.length > 0) {
      user.email = rows[0].E_MAIL;
      user.password = rows[0].PASSWORD;
      user.id = rows[0].KUNDENNUMMER;
    }

    return user;
      
  } catch (err) {
    console.log('Error Reading User', err)
    throw err
  } finally {
    // Verbindung schließen, wenn du fertig bist
    await connection.end();
  }
}

/*async function getfleachenFromUser(userID) {
  let connection;
  let fleachen;

  try {
    connection = await mysql.createConnection(config);

    fleachen = await connection.execute(`
      SELECT DISTINCT fc.ARTIKELNR, fc.FKOORDINATENIDLAT, fc.FKOORDINATENIDLNG, fc.POSITIONSPUNKT
      FROM FLEACHENKOORDINATE fc
      JOIN PRODUKT p ON p.ARTIKELNR = fc.ARTIKELNR
      JOIN WARENKORB_ENTHÄLT_PRODUKT wp ON wp.ARTIKELNR = p.ARTIKELNR
      JOIN WARENKORB w ON w.KUNDENNUMMER = wp.KUNDENNUMMER
      JOIN KUNDE k ON k.KUNDENNUMMER = w.KUNDENNUMMER
      WHERE k.KUNDENNUMMER = ?
      ORDER BY fc.ARTIKELNR, fc.POSITIONSPUNKT
    `, [userID]);
 
    return fleachen[0];
  } catch (err) {
    console.error('Ouch!', err); 
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}*/

async function beiEinemKundenDieFleachenHinzufügen(uebergebeneInformation) {
  let connection;

  try {
    connection = await mysql.createConnection(config);


    //console.log(JSON.stringify(uebergebeneInformation,null,2))

    

    for (const fleachenInformationen of uebergebeneInformation) {
        if (fleachenInformationen.productid === 'undefinedundefinedundefined' || fleachenInformationen.productid ==='undefinedundefined') {
          const result = await connection.execute('SELECT MAX(ARTIKELNR) AS MAXARTIKELNUMMER FROM PRODUKT WHERE Kundennummer = ?', [fleachenInformationen.USERID]);

          if ( result[0][0].MAXARTIKELNUMMER !== null && result[0][0].MAXARTIKELNUMMER !== undefined) {
            fleachenInformationen.productid = result[0][0].MAXARTIKELNUMMER +1; 
          } else {
            fleachenInformationen.productid = 1;
          }
        }





          await connection.execute("INSERT INTO PRODUKT (ARTIKELNR, FLAECHENNAME, preis, FOTO, FLEACHENART, Kundennummer, BEARBEITUNGSARTID) VALUES (?, ?, 7, ?, ?, ?, ?)",
            [fleachenInformationen.productid, fleachenInformationen.flaechenname, fleachenInformationen.imageElement, fleachenInformationen.fleachenart, fleachenInformationen.USERID, fleachenInformationen.selectedOptionWinterung]);


            try{
  
            await connection.execute("INSERT INTO PRODUKT_ENTHAELT_TIEFE (ARTIKELNR, TIEFENID, KUNDENNUMMER) VALUES (?, ?, ?)",
            [fleachenInformationen.productid, fleachenInformationen.tiefenValue, fleachenInformationen.USERID]);


          if (fleachenInformationen.MangatValue === 'j') {
            await connection.execute("INSERT INTO PRODUKT_ENTHAELT_PROBE (ArtikelNr, PROBENARTID, PROBENSTATUS, Kundennummer) VALUES (?, 1, 1, ?)", [fleachenInformationen.productid, fleachenInformationen.USERID]);
          }
          
          if (fleachenInformationen.EminValue === 'j') {
              await connection.execute("INSERT INTO PRODUKT_ENTHAELT_PROBE (ArtikelNr, PROBENARTID, PROBENSTATUS, Kundennummer) VALUES (?, 1, 1, ?)", [fleachenInformationen.productid, fleachenInformationen.USERID]);
          }

    
        
        if (fleachenInformationen.StickstoffValue >= 2 && fleachenInformationen.StickstoffValue <= 4) {
            await connection.execute("INSERT INTO PRODUKT_ENTHAELT_PROBE (ArtikelNr, PROBENARTID, PROBENSTATUS, Kundennummer) VALUES (?, ?, 1, ?)", [fleachenInformationen.productid, fleachenInformationen.StickstoffValue, fleachenInformationen.USERID]);
        }
        
        for (let j = 0; j < fleachenInformationen.coordinates.length; j++) {
            try {
                const position = j + 1;
                await connection.execute(
                    "INSERT INTO FLEACHENKOORDINATE (FKOORDINATENIDLAT, FKOORDINATENIDLNG, ARTIKELNR, POSITIONSPUNKT, Kundennummer) VALUES (?, ?, ?, ?, ?)",
                    [fleachenInformationen.coordinates[j][0], fleachenInformationen.coordinates[j][1], fleachenInformationen.productid, position, fleachenInformationen.USERID]
                );
            } catch (error) {
                break;
            }
        }
        
        await connection.execute('INSERT INTO BESTELLUNG_ENTHAELT_PRODUKT (KUNDENNUMMER, ARTIKELNR) VALUES (?, ?)', [
            fleachenInformationen.USERID,
            fleachenInformationen.productid,
        ]);

      }  catch (error){
        console.log('HIER ')
      }
    
    } 



    await connection.commit();

  } catch (error) {
    

    console.log('Ouch!', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}


async function beiMehrerenKundenDieFleachenHinzufügen(res, uebergebeneInformation) {
  let connection;

  try {
    connection = await mysql.createConnection(config);

    for (const einzelneInformationen of uebergebeneInformation) {

      if (einzelneInformationen[0].selectedOption > 1) {
        const result = await connection.execute('SELECT MAX(KUNDENNUMMER) FROM KUNDE WHERE GEODATENGEBERID  != 1');
        einzelneInformationen[0].USERID = result[0]['MAX(KUNDENNUMMER)'] + 1;
      }

      const result1 = await connection.execute(
        "INSERT INTO KUNDE (Kundennummer, KundeSeit, GEODATENGEBERID) VALUES (?, NOW(), ?)",
        [einzelneInformationen[0].USERID, einzelneInformationen[0].selectedOption]
      );

      const ort = 'null';
      const plz = 0;
      const strasse = 'null';
      const hausnummer = 0;

      const result4 = await connection.execute(
        'SELECT * FROM ADRESSE WHERE STRASSE = ? AND POSTLEITZAHL = ? AND HAUSNUMMER = ? AND ORT = ?',
        [strasse, plz, hausnummer, ort]
      );

      if (result4.length > 0) {
        await connection.execute('UPDATE ADRESSE SET ISTRECHNUNGSADRESSE=1, ISTLIEFERADRESSE=1');
      } else {
        await connection.execute(
          "INSERT INTO ADRESSE (STRASSE, POSTLEITZAHL, HAUSNUMMER, ORT, ISTWOHNADRESSE, ISTRECHNUNGSADRESSE, ISTLIEFERADRESSE, ISTSTANDORTSADRESSE) VALUES (?, ?, ?, ?, 0, 1, 1, 0)",
          [strasse, plz, hausnummer, ort]
        );
      }

      const result3 = await connection.execute(
        "INSERT INTO KUNDE_HAT_ADRESSE (KUNDENNUMMER, STRASSE, POSTLEITZAHL, HAUSNUMMER, ORT) VALUES (?, ?, ?, ?, ?)",
        [einzelneInformationen[0].USERID, strasse, plz, hausnummer, ort]
      );

      const result = await connection.execute("SELECT KUNDENNUMMER FROM BESTELLUNG WHERE Kundennummer = ?", [
        einzelneInformationen[0].USERID,
      ]);


      

      if (result[0].length === 0) {
        await connection.execute('INSERT INTO BESTELLUNG(KUNDENNUMMER, ANZAHLPOSITIONEN, ZEITSTEMPEL) VALUES (?, ?, NOW())', [einzelneInformationen[0].USERID,einzelneInformationen.length]);


      }

      for (const fleachenInformationen of einzelneInformationen) {
        fleachenInformationen.USERID = einzelneInformationen[0].USERID;


        if (fleachenInformationen.productid === 'undefinedundefinedundefined') {
          const result = await connection.execute(
            'SELECT MAX(ARTIKELNR) FROM PRODUKT WHERE Kundennummer = ?',
            [fleachenInformationen.USERID]
          );
          fleachenInformationen.productid = result[0]['MAX(ARTIKELNR)'];

          if (fleachenInformationen.productid === null) {
            fleachenInformationen.productid = 0;
          }

          fleachenInformationen.productid = '' + fleachenInformationen.USERID + '' + (fleachenInformationen.productid + 1) + '';
        }

        await connection.execute("INSERT INTO PRODUKT (ARTIKELNR, FLAECHENNAME, preis, FOTO, FLEACHENART, Kundennummer, BEARBEITUNGSARTID) VALUES (?, ?, 7, ?, ?, ?, ?)",
        [fleachenInformationen.productid, fleachenInformationen.flaechenname, fleachenInformationen.imageElement, fleachenInformationen.fleachenart, fleachenInformationen.USERID, fleachenInformationen.selectedOptionWinterung]);


        await connection.execute("INSERT INTO PRODUKT_ENTHAELT_TIEFE (ARTIKELNR, TIEFENID, KUNDENNUMMER) VALUES (?, ?, ?)",
        [fleachenInformationen.productid, fleachenInformationen.tiefenValue, fleachenInformationen.USERID]);
      
  
        if (fleachenInformationen.MangatValue === 'j') {
          await connection.execute("INSERT INTO PRODUKT_ENTHAELT_PROBE (ArtikelNr, PROBENARTID, PROBENSTATUS, Kundennummer) VALUES (?, 1, 1, ?)", [fleachenInformationen.productid, fleachenInformationen.USERID]);
        }
        
        if (fleachenInformationen.EminValue === 'j') {
            await connection.execute("INSERT INTO PRODUKT_ENTHAELT_PROBE (ArtikelNr, PROBENARTID, PROBENSTATUS, Kundennummer) VALUES (?, 1, 1, ?)", [fleachenInformationen.productid, fleachenInformationen.USERID]);
        }
        
        if (fleachenInformationen.StickstoffValue >= 2 && fleachenInformationen.StickstoffValue <= 4) {
            await connection.execute("INSERT INTO PRODUKT_ENTHAELT_PROBE (ArtikelNr, PROBENARTID, PROBENSTATUS, Kundennummer) VALUES (?, ?, 1, ?)", [fleachenInformationen.productid, fleachenInformationen.StickstoffValue, fleachenInformationen.USERID]);
        }
        
        for (let j = 0; j < fleachenInformationen.coordinates.length; j++) {
            try {
                const position = j + 1;
                await connection.execute(
                    "INSERT INTO FLEACHENKOORDINATE (FKOORDINATENIDLAT, FKOORDINATENIDLNG, ARTIKELNR, POSITIONSPUNKT, Kundennummer) VALUES (?, ?, ?, ?, ?)",
                    [fleachenInformationen.coordinates[j][0], fleachenInformationen.coordinates[j][1], fleachenInformationen.productid, position, fleachenInformationen.USERID]
                );
            } catch (error) {
                break;
            }
        }
        




        await connection.execute('INSERT INTO BESTELLUNG_ENTHAELT_PRODUKT (KUNDENNUMMER, ARTIKELNR) VALUES (?, ?)', [
          fleachenInformationen.USERID,
          fleachenInformationen.productid,
        ]);
      }
    }

    await connection.commit();

    return 100; // Erfolg HTTP-Statuscode
  } catch (err) {
    console.log('Ouch!', err);
    return 123; // Interner Serverfehler HTTP-Statuscode
  } finally {
    if (connection) {
      await connection.end();
    } 
  }
}

async function getkundenDatenVomAusgewaehltenUser(userID) {
  let connection;

  try {
    connection = await mysql.createConnection(config);

    const [result] = await connection.execute(`
      SELECT
        KUNDE.KUNDENNUMMER,
        KUNDE.VORNAME,
        KUNDE.NACHNAME,
        KUNDE.E_MAIL,
        KUNDE.TELEFONNUMMER,
        KUNDE.GEBURTSDATUM,
        KUNDE.PASSWORD,
        ADRESSE.ORT,
        ADRESSE.POSTLEITZAHL,
        ADRESSE.STRASSE,
        ADRESSE.HAUSNUMMER
      FROM
        KUNDE
      JOIN
        KUNDE_HAT_ADRESSE ON KUNDE.KUNDENNUMMER = KUNDE_HAT_ADRESSE.KUNDENNUMMER
      JOIN
        ADRESSE ON KUNDE_HAT_ADRESSE.STRASSE = ADRESSE.STRASSE
        AND KUNDE_HAT_ADRESSE.ORT = ADRESSE.ORT
        AND KUNDE_HAT_ADRESSE.POSTLEITZAHL = ADRESSE.POSTLEITZAHL
        AND KUNDE_HAT_ADRESSE.HAUSNUMMER = ADRESSE.HAUSNUMMER
      WHERE
        KUNDE.KUNDENNUMMER = ?
    `, [userID]);

    return result[0];
  } catch (err) {
    console.error('Ouch!', err);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

async function getUpdateDatenVomKunden(kundennummer, vorname, nachname, email, telefonnummer, ort, plz, strasse, hausnummer) {
  let connection;

  try {
    connection = await mysql.createConnection(config);

    const [result] = await connection.execute('SELECT * FROM KUNDE WHERE KUNDENNUMMER = ?', [kundennummer]);

    const [result2] = await connection.execute(
      'UPDATE KUNDE SET VORNAME = ?, NACHNAME = ?, TELEFONNUMMER = ?, E_MAIL = ? WHERE KUNDENNUMMER = ?',
      [vorname, nachname, telefonnummer, email, kundennummer]
    );

    try {
      const [result3] = await connection.execute('INSERT INTO ADRESSE (STRASSE, POSTLEITZAHL, HAUSNUMMER, ORT) VALUES (?, ?, ?, ?)', [strasse, plz, hausnummer, ort]);
    } catch (err) {}

    const [result4] = await connection.execute('DELETE FROM KUNDE_HAT_ADRESSE WHERE KUNDENNUMMER = ?', [kundennummer]);
    const [result5] = await connection.execute('INSERT INTO KUNDE_HAT_ADRESSE(KUNDENNUMMER, STRASSE, POSTLEITZAHL, HAUSNUMMER, ORT) VALUES (?, ?, ?, ?, ?)', [kundennummer, strasse, plz, hausnummer, ort]);

    await connection.commit();
  } catch (err) {
    console.log('Ouch!', err);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}


async function kundenzumloeschen(kundennummerArray) {
  let connection;

  try {
    connection = await mysql.createConnection(config);
    for (let i = 0; i < kundennummerArray.length; i++) {
      const kundennummer = kundennummerArray[i];
      await connection.execute('DELETE FROM KUNDE WHERE KUNDENNUMMER = ?', [kundennummer]);

    }
    await connection.commit();
  } catch (err) {
    console.log('Ouch!', err);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}




async function changeNeunzigCm(productId,kundennummer,checkedNeunzig) {
  let connection;

  try {
    connection = await mysql.createConnection(config);
    await connection.execute('delete from PRODUKT_ENTHAELT_TIEFE where KUNDENNUMMER= ? and ARTIKELNR= ?', [kundennummer,productId]);

    if(checkedNeunzig){
      await connection.execute('insert into PRODUKT_ENTHAELT_TIEFE (ARTIKELNR, TIEFENID, KUNDENNUMMER) VALUE  (?,2,?)', [productId,kundennummer]);
    } else {
      await connection.execute('insert into PRODUKT_ENTHAELT_TIEFE (ARTIKELNR, TIEFENID, KUNDENNUMMER) VALUE  (?,1,?)', [productId,kundennummer]);
    }

    await connection.commit();
  } catch (err) {
    console.log('Ouch!', err);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}



module.exports = {
  getUserByEmail,
  getUserById,
  getfleachenFromAllUser,
  getKundendaten,
  getKundendatenDieZuZiehenSind,
  getMitarbeiterdaten,
  anderPasswort,
  getInformationsForGenerateKmlFile,
  funktionFleacheSollBearbeitetWerden,
  registerUserWithFleachen,
  getBestllungenFromUser,
  beiEinemKundenDieFleachenHinzufügen,
  changeNeunzigCm,
  //getfleachenFromUser,
  getkundenDatenVomAusgewaehltenUser,
  getFleachenFromUserBestellt,
  createBestellung,
  beiMehrerenKundenDieFleachenHinzufügen,
  ProbeWurdeGezogen,
  getUpdateDatenVomKunden,
  kundenzumloeschen
}