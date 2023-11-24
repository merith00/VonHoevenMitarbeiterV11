const config = require('./conf')
//const oracledb = require('oracledb')
//const mysql = require('mysql')
//const oracledb = require('mysql2')

const mysql = require('mysql2/promise'); // Verwende die Promise-basierte Version von mysql2


const { query } = require('express')

//const connection = mysql.createConnection(config);

/*
connection.connect((err) => {
  if (err) {
    console.error('Fehler beim Verbinden zur MySQL-Datenbank: ' + err.stack);
    return;
  }

  console.log('Erfolgreich mit der MySQL-Datenbank verbunden');
});*/




async function mehrereKundenHochladen(userID) {
  let conn

  try {

    zipFiles.forEach(zipFile => {
      handleReadFile(zipFile,res,req,true,zipFiles.length)
    });

    
    conn.commit()
  } catch (err) {
    console.log('Ouch!', err)
  } finally {
    if (conn) { // conn assignment worked, need to close
      await conn.close()
    }
  }
}



async function initiateOrder(userID) {
  let conn

  try {
    conn = await oracledb.getConnection(config)


    const hatBestellung = await conn.execute("select KUNDENNUMMER from BESTELLUNG where Kundennummer = :userID",[userID])

    try {
      if (hatBestellung.rows.length === 0) {
        await conn.execute('INSERT INTO BESTELLUNG(KUNDENNUMMER, ZEITSTEMPEL) VALUES (:userID,sysdate)', [userID]);
        conn.commit
      }
    } catch (error) {
      console.error('Fehler beim Einfügen: Bestellung ' + error.message);
    }    



    const productsForBestellung = await conn.execute('SELECT PRODUKT.PREIS, PRODUKT.ARTIKELNR FROM PRODUKT,WARENKORB,WARENKORB_ENTHÄLT_PRODUKT where WARENKORB.KUNDENNUMMER = WARENKORB_ENTHÄLT_PRODUKT.KUNDENNUMMER AND WARENKORB_ENTHÄLT_PRODUKT.ARTIKELNR = PRODUKT.ARTIKELNR and WARENKORB.KUNDENNUMMER = :userID',[userID])
    let position = 1

    for (let productg in productsForBestellung.rows){
      await conn.execute('INSERT INTO BESTELLUNG_ENTHAELT_PRODUKT (ARTIKELNR, KUNDENNUMMER) VALUES (:artnr,:userID)',[productsForBestellung.rows[productg][1],userID])
      position = position + 1
    }

    await conn.execute('DELETE FROM WARENKORB_ENTHÄLT_PRODUKT WHERE KUNDENNUMMER = :userID', [userID])
    await conn.execute('UPDATE WARENKORB SET GESAMTSUMME = 0 WHERE KUNDENNUMMER = :userID',[userID])
    
    conn.commit()
  } catch (err) {
    console.log('Ouch!', err)
  } finally {
    if (conn) { // conn assignment worked, need to close
      await conn.close()
    }
  }
}



async function fleacheAufBearbeitetSetzen(productIDs) {
  const connection = await mysql.createConnection(config);


  try {
    for (const id of productIDs) {

      console.log('HIER')
      await connection.execute("DELETE FROM PRODUKT_ENTHAELT_PROBE WHERE ARTIKELNR = ?", [id.productId]);

      await connection.execute("UPDATE PRODUKT SET STARTDATUM = STR_TO_DATE(?, '%Y-%m-%d') WHERE ARTIKELNR = ?", [id.dateValue, id.productId]);

      if (id.NminValue == 'j') {
        await connection.execute("INSERT INTO PRODUKT_ENTHAELT_PROBE(ArtikelNr, PROBENARTID, PROBENSTATUS) VALUES (?, 1, 3)", [id.productId]);
      }

      if (id.SminValue == 'j') {
        await connection.execute("INSERT INTO PRODUKT_ENTHAELT_PROBE(ArtikelNr, PROBENARTID, PROBENSTATUS) VALUES (?, 2, 3)", [id.productId]);
      }

      if (id.HumusValue == 'j') {
        await connection.execute("INSERT INTO PRODUKT_ENTHAELT_PROBE(ArtikelNr, PROBENARTID, PROBENSTATUS) VALUES (?, 3, 3)", [id.productId]);
      }

      if (id.CnValue == 'j') {
        await connection.execute("INSERT INTO PRODUKT_ENTHAELT_PROBE(ArtikelNr, PROBENARTID, PROBENSTATUS) VALUES (?, 4, 3)", [id.productId]);
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

async function getaufBearbeitenStellen(productIDs) {
  const connection = await mysql.createConnection(config);

  try {
    for (const id of productIDs) {
      await connection.execute("DELETE FROM PRODUKT_ENTHAELT_PROBE WHERE ARTIKELNR = ?", [id.productId]);

      if (id.NminValue == 'j') {
        await connection.execute("INSERT INTO PRODUKT_ENTHAELT_PROBE(ArtikelNr, PROBENARTID, PROBENSTATUS) VALUES (?, 1, 1)", [id.productId]);
      }

      if (id.SminValue == 'j') {
        await connection.execute("INSERT INTO PRODUKT_ENTHAELT_PROBE(ArtikelNr, PROBENARTID, PROBENSTATUS) VALUES (?, 2, 1)", [id.productId]);
      }

      if (id.HumusValue == 'j') {
        await connection.execute("INSERT INTO PRODUKT_ENTHAELT_PROBE(ArtikelNr, PROBENARTID, PROBENSTATUS) VALUES (?, 3, 1)", [id.productId]);
      }

      if (id.CnValue == 'j') {
        await connection.execute("INSERT INTO PRODUKT_ENTHAELT_PROBE(ArtikelNr, PROBENARTID, PROBENSTATUS) VALUES (?, 4, 1)", [id.productId]);
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



async function initiateOrderNew(userID,productID,NminValue,MangatValue,StickstoffValue) {
  let conn

  try {
    conn = await oracledb.getConnection(config)

    //TODO eigentlich muss deletet und dann neu gemacht werden 

    await conn.execute("delete PRODUKT_ENTHAELT_PROBE where ARTIKELNR = :productID",[productID])





    if(MangatValue=='j'){
      await conn.execute("insert into PRODUKT_ENTHAELT_PROBE(ArtikelNr, PROBENARTID,PROBENSTATUS)  values (:productID,1,1)",[productID])
    } 
    
    if(NminValue=='j'){
      await conn.execute("insert into PRODUKT_ENTHAELT_PROBE(ArtikelNr, PROBENARTID,PROBENSTATUS)  values (:productID,2,1)",[productID])
    }

    if(StickstoffValue=='j'){
      await conn.execute("insert into PRODUKT_ENTHAELT_PROBE(ArtikelNr, PROBENARTID,PROBENSTATUS)  values (:productID,3,1)",[productID])
    }

 
    conn.commit()
  } catch (err) {
    console.log('Ouch!', err)
  } finally {
    if (conn) { // conn assignment worked, need to close
      await conn.close()
    }
  }
}


async function deleteFromCart(userID,productID){
  let conn

  try {
    conn = await oracledb.getConnection(config)

    console.error('gggg'+productID)


    const result = await conn.execute(
      'DELETE FROM WARENKORB_ENTHÄLT_PRODUKT where KUNDENNUMMER = :userID AND ARTIKELNR = :productID ',[userID,productID]
    )
    // Gesamtpreis muss Upgedatet werden
    await conn.execute('UPDATE WARENKORB SET GESAMTSUMME = GESAMTSUMME - (select PREIS from PRODUKT WHERE ARTIKELNR = :productID) ',[productID])
    await conn.execute('UPDATE WARENKORB SET ANZAHLPOSITIONEN = ANZAHLPOSITIONEN - 1 WHERE KUNDENNUMMER = :userID',[userID])  
    conn.commit()
  } catch (err) {
    console.log('Ouch!', err)
  } finally {
    if (conn) { // conn assignment worked, need to close
      await conn.close()  
    }
  }
}

async function getfleachenFromAllUser() {
  let connection;
  let flaechen;

  try {
    connection = await mysql.createConnection(config);

    const [result] = await connection.execute(`
      SELECT DISTINCT fc.ARTIKELNR, fc.FKOORDINATENIDLAT, fc.FKOORDINATENIDLNG, fc.POSITIONSPUNKT,
      CASE WHEN PP.PROBENARTID IS NOT NULL THEN 1 ELSE 0 END AS enthält_nmin,
      CASE WHEN PSmin.PROBENARTID IS NOT NULL THEN 1 ELSE 0 END AS enthält_smin,
      CASE WHEN PHumus.PROBENARTID IS NOT NULL THEN 1 ELSE 0 END AS enthält_humus,
      CASE WHEN PCN.PROBENARTID IS NOT NULL THEN 1 ELSE 0 END AS enthält_cn,
      P.FLAECHENNAME, P.STARTDATUM, P.FLEACHENART, P.KUNDENNUMMER, 
      PEP.PROBENSTATUS
      FROM FLEACHENKOORDINATE fc
      JOIN PRODUKT P ON P.ARTIKELNR = fc.ARTIKELNR
      JOIN PRODUKT_ENTHAELT_PROBE PEP ON P.ARTIKELNR = PEP.ARTIKELNR
      JOIN BESTELLUNG_ENTHAELT_PRODUKT WP ON WP.ARTIKELNR = P.ARTIKELNR
      JOIN BESTELLUNG W ON W.KUNDENNUMMER = WP.KUNDENNUMMER
      LEFT JOIN PRODUKT_ENTHAELT_PROBE PP ON P.ARTIKELNR = PP.ARTIKELNR AND PP.PROBENARTID = 1
      LEFT JOIN PRODUKT_ENTHAELT_PROBE PSmin ON P.ARTIKELNR = PSmin.ARTIKELNR AND PSmin.PROBENARTID = 2
      LEFT JOIN PRODUKT_ENTHAELT_PROBE PHumus ON P.ARTIKELNR = PHumus.ARTIKELNR AND PHumus.PROBENARTID = 3
      LEFT JOIN PRODUKT_ENTHAELT_PROBE PCN ON P.ARTIKELNR = PCN.ARTIKELNR AND PCN.PROBENARTID = 4
      ORDER BY ARTIKELNR, POSITIONSPUNKT
    `);

    return result;
  } catch (error) {
    console.error('Fehler bei der MySQL-Abfrage:', error);
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
      JOIN PRODUKT p ON p.ARTIKELNR = fc.ARTIKELNR
      JOIN PRODUKT_ENTHAELT_PROBE PEP ON p.ARTIKELNR = PEP.ARTIKELNR
      JOIN BESTELLUNG_ENTHAELT_PRODUKT wp ON wp.ARTIKELNR = p.ARTIKELNR
      JOIN BESTELLUNG w ON w.KUNDENNUMMER = wp.KUNDENNUMMER
      JOIN KUNDE k ON k.KUNDENNUMMER = w.KUNDENNUMMER
      WHERE K.KUNDENNUMMER = ? 
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



async function getCartFromUser(userID) {

  if (userID === null || userID === undefined) {
    console.error('userID ist null oder undefined.');
    return null; // Oder einen anderen Wert oder Fehlercode zurückgeben
  }


  let connection;
  let cart = {
    gesamtsummeInklMwst: null,
    gesamtsumme: null,
    mwst: null,
    products: []
  };

  try {
    connection = await mysql.createConnection(config);
    // Gesamtsumme inkl. MwSt ermitteln
    const [result1] = await connection.execute(
      'SELECT GESAMTSUMME FROM WARENKORB WHERE KUNDENNUMMER = ?',
      [userID]
    );

    if (result1.length > 0) {
      cart.gesamtsummeInklMwst = result1[0].GESAMTSUMME;
    }

    // Alle Produkte des Warenkorbs des Users auslesen
    const [result2] = await connection.execute(`
      SELECT * FROM Produkt 
      WHERE ARTIKELNR IN (
        SELECT ARTIKELNR FROM WARENKORB_ENTHÄLT_PRODUKT WHERE KUNDENNUMMER = ?
      )`,
      [userID]
    );

    cart.products = result2;

    // Gesamtsumme ohne MwSt Anteil berechnen
    const [result3] = await connection.execute(`
      SELECT SUM(PRODUKT.PREIS) AS gesamtsumme 
      FROM PRODUKT 
      JOIN WARENKORB_ENTHÄLT_PRODUKT ON PRODUKT.ARTIKELNR = WARENKORB_ENTHÄLT_PRODUKT.ARTIKELNR 
      WHERE WARENKORB_ENTHÄLT_PRODUKT.KUNDENNUMMER = ?
    `,
      [userID]
    );

    cart.gesamtsumme = result3[0].gesamtsumme;

    // MwSt berechnen
    cart.mwst = cart.gesamtsummeInklMwst - cart.gesamtsumme;

    return cart;

  } catch (error) {
    console.error('Fehler bei der MySQL-Abfrage:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}



async function getInformationsForGenerateKmlFile(productIDs) {

  const connection = await mysql.createConnection(config);

  const infoProductIDs = [];

  try {
    if (Array.isArray(productIDs)) {
      for (const id of productIDs) {

        const [infoProdukt] = await connection.execute('SELECT ARTIKELNR, KUNDENNUMMER, STARTDATUM, FLEACHENART, FLAECHENNAME FROM PRODUKT WHERE ARTIKELNR = ?', [id]);
        const [infoFlaechenkoordinate] = await connection.execute('SELECT FKOORDINATENIDLNG, FKOORDINATENIDLAT FROM FLEACHENKOORDINATE WHERE ARTIKELNR = ? ORDER BY POSITIONSPUNKT', [id]);
        const [infoFlaechenkoordinateErste] = await connection.execute('SELECT FKOORDINATENIDLNG, FKOORDINATENIDLAT FROM FLEACHENKOORDINATE WHERE ARTIKELNR = ? AND POSITIONSPUNKT = 1', [id]);

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
      const [infoProdukt] = await connection.execute('SELECT ARTIKELNR, KUNDENNUMMER, STARTDATUM, FLEACHENART, FLAECHENNAME FROM PRODUKT WHERE ARTIKELNR = ?', [productIDs]);
      const [infoFlaechenkoordinate] = await connection.execute('SELECT FKOORDINATENIDLNG, FKOORDINATENIDLAT FROM FLEACHENKOORDINATE WHERE ARTIKELNR = ? ORDER BY POSITIONSPUNKT', [productIDs]);
      const [infoFlaechenkoordinateErste] = await connection.execute('SELECT FKOORDINATENIDLNG, FKOORDINATENIDLAT FROM FLEACHENKOORDINATE WHERE ARTIKELNR = ? AND POSITIONSPUNKT = 1', [productIDs]);
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
    const [result2] = await connection.execute(
      'SELECT * FROM Produkt WHERE ARTIKELNR IN (SELECT ARTIKELNR FROM WARENKORB_ENTHÄLT_PRODUKT WHERE KUNDENNUMMER = ?)',
      [userID]
    );
    cart.products = result2;

    // Alle Produkte des Warenkorbs des Users auslesen
    const [result3] = await connection.execute(`
      SELECT
        P.*,
        CASE WHEN PP.PROBENARTID IS NOT NULL THEN 'J' ELSE 'N' END AS enthält_mangat,
        CASE WHEN PP.PROBENARTID IS NOT NULL THEN PP.PROBENSTATUS ELSE 0 END AS statusmangat,
        CASE WHEN PE.PROBENARTID IS NOT NULL THEN 'J' ELSE 'N' END AS enthält_emin,
        CASE WHEN PE.PROBENARTID IS NOT NULL THEN PE.PROBENSTATUS ELSE 0 END AS statusemin,
        CASE WHEN PS.PROBENARTID IS NOT NULL THEN 'J' ELSE 'N' END AS enthält_stickstoff,
        CASE WHEN PS.PROBENARTID IS NOT NULL THEN PS.PROBENSTATUS ELSE 0 END AS statusstickstoff
      FROM
        Produkt P
      JOIN
        BESTELLUNG_ENTHAELT_PRODUKT B ON P.ARTIKELNR = B.ARTIKELNR
      JOIN
        Bestellung O ON B.KUNDENNUMMER = O.KUNDENNUMMER
      LEFT JOIN
        PRODUKT_ENTHAELT_PROBE PP ON P.ARTIKELNR = PP.ARTIKELNR AND PP.PROBENARTID = 1
      LEFT JOIN
        PRODUKT_ENTHAELT_PROBE PE ON P.ARTIKELNR = PE.ARTIKELNR AND PE.PROBENARTID = 2
      LEFT JOIN
        PRODUKT_ENTHAELT_PROBE PS ON P.ARTIKELNR = PS.ARTIKELNR AND PS.PROBENARTID = 3
      WHERE
        O.Kundennummer = ?
    `, [userID]);
    cart.products = result3;

    // Gesamtsumme ohne MwSt Anteil berechnen
    const [result4] = await connection.execute(
      'SELECT SUM(PRODUKT.PREIS) FROM PRODUKT, WARENKORB_ENTHÄLT_PRODUKT WHERE PRODUKT.ARTIKELNR = WARENKORB_ENTHÄLT_PRODUKT.ARTIKELNR AND WARENKORB_ENTHÄLT_PRODUKT.KUNDENNUMMER = ?',
      [userID]
    );
    cart.gesamtsumme = result4[0]['SUM(PRODUKT.PREIS)'];

    // MwSt berechnen
    cart.mwst = cart.gesamtsummeInklMwst - cart.gesamtsumme;

    return cart;
  } catch (err) {
    console.error('Ouch!', err);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}



async function getKundenDatenMitGeoDaten(geoID){
  try {
    conn = await oracledb.getConnection(config)

    const result =  await conn.execute(`SELECT
    Kunde.KUNDENNUMMER,
    Kunde.VORNAME,
    Kunde.NACHNAME,
    Kunde.E_MAIL,
    Kunde.TELEFONNUMMER,
    Adresse.ORT,
    COALESCE(COUNT(P.ARTIKELNR), 0) AS AnzahlFlaechen
    FROM
        Kunde
    JOIN
        Kunde_Hat_Adresse ON Kunde.KUNDENNUMMER = Kunde_Hat_Adresse.KUNDENNUMMER
    JOIN
        Adresse ON Kunde_Hat_Adresse.STRASSE = Adresse.STRASSE
        AND Kunde_Hat_Adresse.ORT = Adresse.ORT
        AND Kunde_Hat_Adresse.POSTLEITZAHL = Adresse.POSTLEITZAHL
        AND Kunde_Hat_Adresse.HAUSNUMMER = Adresse.HAUSNUMMER
    LEFT JOIN
        Bestellung ON Kunde.KUNDENNUMMER = Bestellung.KUNDENNUMMER
    LEFT JOIN
    BESTELLUNG_ENTHAELT_PRODUKT B ON Bestellung.KUNDENNUMMER = B.KUNDENNUMMER
    LEFT JOIN
        Produkt P ON B.ARTIKELNR = P.ARTIKELNR
        where GEODATENGEBERID = :geoID
        GROUP BY
        Kunde.KUNDENNUMMER, Adresse.ORT, Kunde.TELEFONNUMMER, Kunde.VORNAME, Kunde.NACHNAME, Kunde.E_MAIL
    order by KUNDENNUMMER`,[geoID])
    
  
    return result.rows
  } catch (err) {
    console.log('Ouch!', err)
  } finally {
    if (conn) { // conn assignment worked, need to close
      await conn.close()
    }
  }
}


async function getKundenDatenMitGeoDatenDieZuZiehenSind(geoID) {
  let connection;
  try {
    connection = await mysql.createConnection(config);

    const [rows] = await connection.execute(`
      SELECT 
        Kunde.KUNDENNUMMER,
        Kunde.VORNAME,
        Kunde.NACHNAME,
        Kunde.E_MAIL,
        Kunde.TELEFONNUMMER,
        Adresse.ORT,
        COALESCE(COUNT(P.ARTIKELNR), 0) AS AnzahlFlaechen
      FROM
        Kunde
        JOIN Kunde_Hat_Adresse ON Kunde.KUNDENNUMMER = Kunde_Hat_Adresse.KUNDENNUMMER
        JOIN Adresse ON Kunde_Hat_Adresse.STRASSE = Adresse.STRASSE
          AND Kunde_Hat_Adresse.ORT = Adresse.ORT
          AND Kunde_Hat_Adresse.POSTLEITZAHL = Adresse.POSTLEITZAHL
          AND Kunde_Hat_Adresse.HAUSNUMMER = Adresse.HAUSNUMMER
        LEFT JOIN Bestellung ON Kunde.KUNDENNUMMER = Bestellung.KUNDENNUMMER
        LEFT JOIN BESTELLUNG_ENTHAELT_PRODUKT B ON Bestellung.KUNDENNUMMER = B.KUNDENNUMMER
        LEFT JOIN Produkt P ON B.ARTIKELNR = P.ARTIKELNR
        LEFT JOIN PRODUKT_ENTHAELT_PROBE PEP ON P.ARTIKELNR = PEP.ARTIKELNR
      WHERE
        GEODATENGEBERID = ?
        AND PEP.PROBENSTATUS = 1
      GROUP BY
        Kunde.KUNDENNUMMER, Adresse.ORT, Kunde.TELEFONNUMMER, Kunde.VORNAME, Kunde.NACHNAME, Kunde.E_MAIL
      ORDER BY
        KUNDENNUMMER
    `, [geoID]);

    return rows;
  } catch (error) {
    console.error('Ouch!', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}


async function getKundendatenDieZuZiehenSind() {
  let connection;
  let resultsKundendaten = {
    lufa: [],
    claas: [],
    gsagri: [],
    lwkniedersachsen: [],
    maehlmann: [],
    sonstiges: [],
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
    lufa: [],
    claas: [],
    gsagri: [],
    lwkniedersachsen: [],
    maehlmann: [],
    sonstiges: [],
  };

  try {
    connection = await mysql.createConnection(config);

    const resultLufa = await getKundenDatenMitGeoDaten(1, connection);
    const resultclaas = await getKundenDatenMitGeoDaten(2, connection);
    const resultgsagri = await getKundenDatenMitGeoDaten(3, connection);
    const resultlwkniedersachsen = await getKundenDatenMitGeoDaten(4, connection);
    const resultmaehlmann = await getKundenDatenMitGeoDaten(5, connection);
    const resultsonsttiges = await getKundenDatenMitGeoDaten(6, connection);

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

async function getKundenDatenMitGeoDaten(geoID) {
  let connection;
  try {
    connection = await mysql.createConnection(config);

    const [rows] = await connection.execute(`
      SELECT
        Kunde.KUNDENNUMMER,
        Kunde.VORNAME,
        Kunde.NACHNAME,
        Kunde.E_MAIL,
        Kunde.TELEFONNUMMER,
        Adresse.ORT,
        COALESCE(COUNT(P.ARTIKELNR), 0) AS AnzahlFlaechen
      FROM
        Kunde
      JOIN
        Kunde_Hat_Adresse ON Kunde.KUNDENNUMMER = Kunde_Hat_Adresse.KUNDENNUMMER
      JOIN
        Adresse ON Kunde_Hat_Adresse.STRASSE = Adresse.STRASSE
        AND Kunde_Hat_Adresse.ORT = Adresse.ORT
        AND Kunde_Hat_Adresse.POSTLEITZAHL = Adresse.POSTLEITZAHL
        AND Kunde_Hat_Adresse.HAUSNUMMER = Adresse.HAUSNUMMER
      LEFT JOIN
        Bestellung ON Kunde.KUNDENNUMMER = Bestellung.KUNDENNUMMER
      LEFT JOIN
        Bestellung_enthaelt_Produkt B ON Bestellung.KUNDENNUMMER = B.KUNDENNUMMER
      LEFT JOIN
        Produkt P ON B.ARTIKELNR = P.ARTIKELNR
      WHERE
        GEODATENGEBERID = ?
      GROUP BY
        Kunde.KUNDENNUMMER, Adresse.ORT, Kunde.TELEFONNUMMER, Kunde.VORNAME, Kunde.NACHNAME, Kunde.E_MAIL
      ORDER BY
        KUNDENNUMMER;
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



async function createCart(userID){
  let conn
  var productID = 0

  try {
    conn = await oracledb.getConnection(config)
    const hatWarenkorb = await conn.execute("select KUNDENNUMMER from WARENKORB where KUNDENNUMMER = :userID",[userID])

    try {
      if (hatWarenkorb.rows.length === 0) {
        // Es gibt keinen Warenkorb für diesen Benutzer, füge einen neuen Warenkorb hinzu
        await conn.execute('INSERT INTO WARENKORB (KUNDENNUMMER, ANZAHLPOSITIONEN, GESAMTSUMME) VALUES (:userID, 0, 0)', [userID]);
        conn.commit
      }

      productID = await conn.execute('select max(ARTIKELNR) from PRODUKT where Kundennummer  = :userID',[userID])
      productID = productID.rows[0][0];


    } catch (error) {
      console.error('Fehler beim Einfügen: Warenkorb ' + error.message);
    }    

    conn.commit()

    return { productID }; // otherData ist ein Platzhalter für andere Informationen, die du zurückgeben möchtest

  } catch (err) {
    console.log('Ouch!', err, productID,flaechenname,imageElement,fleachenartValue)
  } finally {
    if (conn) { // conn assignment worked, need to close
      await conn.close()
    }
  }
}


async function createBestellung(userID) {
  let connection;

  try {
    connection = await mysql.createConnection(config);

    const [hatBestellung] = await connection.execute("SELECT KUNDENNUMMER FROM BESTELLUNG WHERE Kundennummer = ?", [userID]);

    try {
      if (hatBestellung.length === 0) {
        await connection.execute('INSERT INTO BESTELLUNG(KUNDENNUMMER, ZEITSTEMPEL) VALUES (?, NOW())', [userID]);
        await connection.commit();
      }
    } catch (error) {
      console.error('Fehler beim Einfügen: Bestellung ' + error.message);
    }
  } catch (err) {
    console.log('Ouch!', err);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}



async function putToBestellung(selectedOption, userID,productID, flaechenname, dateValue,NminValue,MangatValue,StickstoffValue,coordinates,imageElement,fleachenartValue,gettiefenValue) {
  let conn


  try {
    conn = await oracledb.getConnection(config)    

    try {

      



      if(!productID){
        productID = await conn.execute('select max(ARTIKELNR) from PRODUKT where Kundennummer  = :userID',[userID])
        productID = productID.rows[0][0]+1;
      }


      await conn.execute("insert into PRODUKT (ARTIKELNR,FLAECHENNAME,preis,FOTO,FLEACHENART,Kundennummer) VALUES (:productID,:flaechenname,7,:imageElement,:fleachenartValue,:userID)",[productID,flaechenname,imageElement,fleachenartValue,userID])
      await conn.execute("insert into PRODUKT_ENTHÄLT_TIEFE(ARTIKELNR, TIEFENID) VALUES (:productID,:gettiefenValue)",[productID,gettiefenValue])

      if(MangatValue=='j'){
        await conn.execute("insert into PRODUKT_ENTHAELT_PROBE(ArtikelNr, PROBENARTID,PROBENSTATUS)  values (:productID,1,1)",[productID])
      } 
      
      if(NminValue=='j'){
        await conn.execute("insert into PRODUKT_ENTHAELT_PROBE(ArtikelNr, PROBENARTID,PROBENSTATUS)  values (:productID,1,1)",[productID])
      }
  
      if(StickstoffValue==2){
        await conn.execute("insert into PRODUKT_ENTHAELT_PROBE(ArtikelNr, PROBENARTID,PROBENSTATUS)  values (:productID,2,1)",[productID])
      } else if(StickstoffValue==3){
        await conn.execute("insert into PRODUKT_ENTHAELT_PROBE(ArtikelNr, PROBENARTID,PROBENSTATUS)  values (:productID,3,1)",[productID])
      } else if(StickstoffValue==4){
        await conn.execute("insert into PRODUKT_ENTHAELT_PROBE(ArtikelNr, PROBENARTID,PROBENSTATUS)  values (:productID,4,1)",[productID])
      }

      conn.commit
    } catch (error) {
      console.error('Fehler beim Einfügen FLEACHEN: ');
      // Hier kannst du Code hinzufügen, um mit dem nächsten Datensatz fortzufahren.
      
    }  
    
    for (let j = 0; j <= coordinates.length; j++) {
      var position = j+1;
      try {
        await conn.execute(
          "insert into FLEACHENKOORDINATE(FKOORDINATENIDLAT, FKOORDINATENIDLNG, ARTIKELNR,POSITIONSPUNKT) VALUES (:coordinateLAT, :coordinateLNG, :productID, :position)",
          {coordinateLAT: coordinates[j][0], coordinateLNG: coordinates[j][1], productID, position}
        );
      } catch (error) {
        //console.error('Fehler beim Einfügen FLEACHENKOORDINATE: ' + error.message, coordinates[j][0], coordinates[j][1], productID, position);
        break;
      }
    }
    await conn.execute('INSERT INTO BESTELLUNG_ENTHAELT_PRODUKT (KUNDENNUMMER,ARTIKELNR) VALUES(:userID,:productID)',[userID,productID])
    conn.commit()
  } catch (err) {
    console.log('Ouch!', err)
  } finally {
    if (conn) { // conn assignment worked, need to close
      await conn.close()
    }
  }
}


async function putToCart(selectedOption, userID,productID, flaechenname, dateValue,NminValue,MangatValue,StickstoffValue,coordinates,imageElement,fleachenartValue,gettiefenValue) {
  let conn


  try {
    conn = await oracledb.getConnection(config)
    
    
    try {

      if(productID === 'undefinedundefinedundefined'){
        productID = await conn.execute('select max(ARTIKELNR) from PRODUKT where Kundennummer  = :userID',[userID])
        productID = productID.rows[0][0]+1;
      }



      await conn.execute("insert into PRODUKT (ARTIKELNR,FLAECHENNAME,preis,FOTO,FLEACHENART,Kundennummer) VALUES (:productID,:flaechenname,7,:imageElement,:fleachenartValue,:userID)",[productID,flaechenname,imageElement,fleachenartValue,userID])
      await conn.execute("insert into PRODUKT_ENTHÄLT_TIEFE(ARTIKELNR, TIEFENID) VALUES (:productID,:gettiefenValue)",[productID,gettiefenValue])

      if(MangatValue=='j'){
        await conn.execute("insert into PRODUKT_ENTHAELT_PROBE(ArtikelNr, PROBENARTID,PROBENSTATUS)  values (:productID,1,1)",[productID])
      } 
      
      if(NminValue=='j'){
        await conn.execute("insert into PRODUKT_ENTHAELT_PROBE(ArtikelNr, PROBENARTID,PROBENSTATUS)  values (:productID,1,1)",[productID])
      }
  
      if(StickstoffValue==2){
        await conn.execute("insert into PRODUKT_ENTHAELT_PROBE(ArtikelNr, PROBENARTID,PROBENSTATUS)  values (:productID,2,1)",[productID])
      } else if(StickstoffValue==3){
        await conn.execute("insert into PRODUKT_ENTHAELT_PROBE(ArtikelNr, PROBENARTID,PROBENSTATUS)  values (:productID,3,1)",[productID])
      } else if(StickstoffValue==4){
        await conn.execute("insert into PRODUKT_ENTHAELT_PROBE(ArtikelNr, PROBENARTID,PROBENSTATUS)  values (:productID,4,1)",[productID])
      }

      conn.commit
    } catch (error) {
      console.error('Fehler beim Einfügen FLEACHEN: ' + error.message, productID, position);      
    }  


    
    
    for (let j = 0; j <= coordinates.length; j++) {
      var position = j+1;
    
      try {

        await conn.execute(
          "insert into FLEACHENKOORDINATE(FKOORDINATENIDLAT, FKOORDINATENIDLNG, ARTIKELNR,POSITIONSPUNKT) VALUES (:coordinateLAT, :coordinateLNG, :productID, :position)",
          {coordinateLAT: coordinates[j][0], coordinateLNG: coordinates[j][1], productID, position}
        );
      } catch (error) {
        //console.error('Fehler beim Einfügen FLEACHENKOORDINATE: ' + error.message, coordinates[j][0], coordinates[j][1], productID, position);
        // Hier kannst du Code hinzufügen, um mit dem nächsten Datensatz fortzufahren.
        break;
      }
    }

    



    

    await conn.execute('INSERT INTO WARENKORB_ENTHÄLT_PRODUKT (KUNDENNUMMER,ARTIKELNR) VALUES(:userID,:productID)',[userID,productID])
    conn.commit()

    //TODO GHET ES VOLLKOMMEN DURCH BZW WARUM NICHT
  } catch (err) {
    console.log('Ouch!', err)
  } finally {
    if (conn) { // conn assignment worked, need to close
      await conn.close()
    }
  }
}



async function anderPasswort(userID, passwordNewInput) {
  let connection;
  console.log('userID ' + userID)

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



async function getAllProducts () {
  let conn
  pageNumber = 2

  try {
    conn = await oracledb.getConnection(config)

    var pageNumber = 1

    const result = await conn.execute(
      "select * from Produkt where ARTIKELNR >= 8*(:pageNumber-1) AND ARTIKELNR < 8*:pageNumber order by ARTIKELNR",[pageNumber]
    )
    return(result)

  } catch (err) {
    console.log('Ouch!', err)
  } finally {
    if (conn) { // conn assignment worked, need to close
      await conn.close()
    }
  }
}

async function getBestseller () {
  let conn
  pageNumber = 2

  try {
    conn = await oracledb.getConnection(config)

    var pageNumber = 2

    const result = await conn.execute(      
      "SELECT p.ARTIKELNR, p.PREIS, p.PRODUKTBEZEICHNUNG, p.NAME, (SELECT COUNT(*) FROM BESTELLTUNG_ENTHÄLT_PRODUKT b WHERE b.ARTIKELNR = p.ARTIKELNR) as Anzahl FROM Produkt p ORDER BY (SELECT COUNT(*) FROM BESTELLTUNG_ENTHÄLT_PRODUKT b WHERE b.ARTIKELNR = p.ARTIKELNR) DESC FETCH FIRST 102 ROWS ONLY"
    )
    return(result)

  } catch (err) {
    console.log('Ouch!', err)
  } finally {
    if (conn) { // conn assignment worked, need to close
      await conn.close()
    }
  }
}


async function getResultPreis () {
  let conn
  pageNumber = 2

  try {
    conn = await oracledb.getConnection(config)

    var pageNumber = 2

    const result = await conn.execute(
      "SELECT * FROM PRODUKT WHERE PREIS > 1 AND PREIS <= 2 ORDER BY (CASE WHEN PRODUKTBEZEICHNUNG = 'dummy' THEN 1 ELSE 0 END), PREIS asc"
    )
    return(result)

  } catch (err) {
    console.log('Ouch!', err)
  } finally {
    if (conn) { // conn assignment worked, need to close
      await conn.close()
    }
  }
}

async function getResultLast () {
  let conn
  pageNumber = 2

  try {
    conn = await oracledb.getConnection(config)

    var pageNumber = 2

    const result = await conn.execute(
      "SELECT * FROM Produkt WHERE ARTIKELNR IN (SELECT t.ARTIKELNR FROM (select * from BESTELLTUNG_ENTHÄLT_PRODUKT order by BESTELLNUMMER desc FETCH FIRST 23 ROWS ONLY) t ) order by ARTIKELNR"      
    )
    return(result)

  } catch (err) {
    console.log('Ouch!', err)
  } finally {
    if (conn) { // conn assignment worked, need to close
      await conn.close()
    }
  }
}


async function getResultKategorien (artikelnr) {
  let conn
  pageNumber = 2

  try {
    conn = await oracledb.getConnection(config)

    var pageNumber = 2

    const result = await conn.execute(
      "SELECT p.*,(SELECT COUNT(*) FROM BESTELLTUNG_ENTHÄLT_PRODUKT bep WHERE bep.ARTIKELNR = p.ARTIKELNR) AS AnzahlBestellungen FROM Produkt p WHERE p.NAME = (select name from PRODUKT where ARTIKELNR = :artikelnr) AND p.ARTIKELNR != :artikelnr ORDER BY AnzahlBestellungen DESC",[artikelnr,artikelnr]
    )
    return(result)

  } catch (err) {
    console.log('Ouch!', err)
  } finally {
    if (conn) { // conn assignment worked, need to close
      await conn.close()
    }
  }
}


async function getProductDetails (productIdReq) {
  let conn

  try {
    conn = await oracledb.getConnection(config)

    const result = await conn.execute(
        'select * from PRODUKT where ARTIKELNR = :id',[productIdReq]
    )
    return(result.rows)

  } catch (err) {
    console.log('Ouch!', err)
  } finally {
    if (conn) { // conn assignment worked, need to close
      await conn.close()
    }
  }
}

async function getAllOberCategories () {
  let conn

  try {
    conn = await oracledb.getConnection(config)

    const result = await conn.execute(
      'select distinct NAME_1 from ENTHÄLT_SUBKATEGORIE where NAME_1 not in (select NAME_2 from ENTHÄLT_SUBKATEGORIE)'
    )
    return(result)

  } catch (err) {
    console.log('Ouch!', err)
  } finally {
    if (conn) { // conn assignment worked, need to close
      await conn.close()
    }
  }
}

async function getProductsByCategory(category) {
  let conn

  try {
    conn = await oracledb.getConnection(config)

    const result = await conn.execute(
      "SELECT * FROM produkt WHERE name = :cate ORDER BY (CASE WHEN PRODUKTBEZEICHNUNG = 'dummy' THEN 1 ELSE 0 END), PRODUKTBEZEICHNUNG ASC",[category]//'%' + category+ '%'
    )
    return(result)

  } catch (err) {
    console.log('Ouch!', err)
  } finally {
    if (conn) { // conn assignment worked, need to close
      await conn.close()
    }
  }
}

async function registerUser(email, telefonnummer, password, vorname, nachname, geburtsdatum, ort, plz, strasse, hausnummer) { //req.body.email, hashedPassword,req.body.vorname, req.body.nachname,req.body.date
  let conn
  try {
    conn = await oracledb.getConnection(config)

    const neuesteKundennummer = await conn.execute(
      'SELECT  max(KUNDENNUMMER) From KUNDE'
    )

    const neuesteKundennummerNEU = neuesteKundennummer.rows[0][0]+1;

    const result = await conn.execute(
      "INSERT INTO KUNDE (Kundennummer, E_MAIL,Telefonnummer,PASSWORD,VORNAME,NACHNAME,GEBURTSDATUM, KundeSeit) VALUES (:neuesteKundennummerNEU,:email,:telefonnummer,:password,:vorname,:nachname,TO_DATE(:geburtsdatum,'yyyy-mm-dd'),sysdate)",
      [neuesteKundennummerNEU,email,telefonnummer,password,vorname,nachname,geburtsdatum]
    )
      //Check if Adresse schon vorhanden
      result4 = await conn.execute('SELECT * FROM ADRESSE WHERE STRASSE = :strasse AND POSTLEITZAHL = :plz AND HAUSNUMMER = :hnr AND ORT = :ort',[strasse,plz,hausnummer,ort])
      
      if(result4.rows.length > 0){
        conn.execute('UPDATE ADRESSE SET ISTRECHNUNGSADRESSE=1, ISTLIEFERADRESSE=1')
      }else{
        conn.execute("INSERT INTO ADRESSE (STRASSE,POSTLEITZAHL,HAUSNUMMER,ORT,ISTWOHNADRESSE, ISTRECHNUNGSADRESSE, ISTLIEFERADRESSE, ISTSTANDORTSADRESSE) VALUES (:strasse,:plz,:hausnummer,:ort,0,1,1,0)",
        [strasse,plz,hausnummer,ort])
      }

    const result3 = await conn.execute(
      "INSERT INTO KUNDE_HAT_ADRESSE (KUNDENNUMMER,STRASSE,POSTLEITZAHL,HAUSNUMMER,ORT) VALUES (:neuesteKundennummer,:strasse,:plz,:hausnummer,:ort)",
      [neuesteKundennummerNEU,strasse,plz,hausnummer,ort]
    )

    conn.commit;




  } catch (err) {
    console.log('User could not be registered', err)
    throw err
  } finally {
    conn.commit()
    if (conn) { // conn assignment worked, need to close
      await conn.close()
    }
  }
}



async function registerUserWithFleachen(kundennummer, email, telefonnummer, password, vorname, nachname, geburtsdatum, ort, plz, strasse, hausnummer, selectedOption) {
  const connection = await mysql.createConnection(config);

  console.log('die selectect option ' + selectedOption)

  try {
    if (selectedOption > 1) {
      const maxKundennummer = await connection.execute('SELECT MAX(KUNDENNUMMER) AS MAXKUNDENNUMMER FROM Kunde WHERE GEODATENGEBERID  != 1');

      kundennummer = maxKundennummer[0][0].MAXKUNDENNUMMER + 1;
    }

    const result = await connection.execute(
      "INSERT INTO KUNDE (Kundennummer, E_MAIL, Telefonnummer, PASSWORD, VORNAME, NACHNAME, KundeSeit, GEODATENGEBERID) VALUES (?, ?, ?, ?, ?, ?, NOW(), ?)",
      [kundennummer, email, telefonnummer, password, vorname, nachname, selectedOption]
    );

    ort = ort || 'null';
    plz = plz || 0;
    strasse = strasse || 'null';
    hausnummer = hausnummer || 0;

    // Check if Adresse schon vorhanden
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
    /*conn = await oracledb.getConnection(config)    
    const result = await conn.execute(
      'SELECT E_MAIL, PASSWORD, Personalnummer FROM MITARBEITER WHERE E_MAIL = :email',[email]
    )*/

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

async function getSub(toGet){
  let conn

  try {
    conn = await oracledb.getConnection(config)

    const result = await conn.execute(
      'select NAME_2 from ENTHÄLT_SUBKATEGORIE WHERE NAME_1 = :cate',[toGet]
    )
    return(result)

  } catch (err) {
    console.log('Ouch!', err)
  } finally {
    if (conn) { // conn assignment worked, need to close
      await conn.close()
    }
  }
}


async function getSubs(searchForSubs){
  let conn
  try {
    conn = await oracledb.getConnection(config)
    let foundSubcategories = (await conn.execute('SELECT NAME_2 FROM ENTHÄLT_SUBKATEGORIE WHERE NAME_1 = :searchForSub',[searchForSubs])).rows

    return foundSubcategories
  } catch (error) {
    
  }finally{
    conn.close()
  }
}


async function getCategorys (){
  let conn
  try {
    conn = await oracledb.getConnection(config)
    let TopCategories = (await conn.execute('select distinct NAME_1 from ENTHÄLT_SUBKATEGORIE where NAME_1 not in (select NAME_2 from ENTHÄLT_SUBKATEGORIE)')).rows
    let finalHierarchie = []
    for (let index = 0; index < TopCategories.length; index++) {
      let subCategories = await getSubs(TopCategories[index][0])
      
      for (let j = 0; j < subCategories.length; j++) {

        finalHierarchie[index]= [TopCategories[index][0],]
        
      }
      
    }


    return finalHierarchie

  } catch (error) {
    
  }finally{
    if(conn){
      conn.close()
    }
  }


}



async function getClob(userID){
  let conn

  try {
    conn = await oracledb.getConnection(config)
    oracledb.fetchAsString = [ oracledb.CLOB ]
    const result = await conn.execute(
      `
      SELECT
      P.ARTIKELNR,P.FOTO
      FROM
      Produkt P
  JOIN
  BESTELLUNG_ENTHAELT_PRODUKT B ON P.ARTIKELNR = B.ARTIKELNR
  JOIN
      Bestellung O ON B.KUNDENNUMMER = O.KUNDENNUMMER
  WHERE
      O.Kundennummer = :userID`, [userID])
      //'select ARTIKELNR, foto from PRODUKT',
     // 'select JSON from KATEGORIEABFRAGE',
    //)
    return result

  } catch (err) {
    console.log('Ouch!', err)
  } finally {
    if (conn) { // conn assignment worked, need to close
      await conn.close()
    }
  }
}


async function getClobWaren(userID) {

  if (userID === null || userID === undefined) {
    console.error('userID ist null oder undefined.');
    return null; // Oder einen anderen Wert oder Fehlercode zurückgeben
  }


  let connection;

  try {
    connection = await mysql.createConnection(config);

    const [rows] = await connection.execute(
      `
      SELECT
        P.ARTIKELNR, P.FOTO
      FROM
        Produkt P
        JOIN BESTELLUNG_ENTHAELT_PRODUKT B ON P.ARTIKELNR = B.ARTIKELNR
        JOIN Bestellung O ON B.KUNDENNUMMER = O.KUNDENNUMMER
      WHERE
        O.KUNDENNUMMER = ?`,
      [userID]
    );

    return rows;
  } catch (error) {
    console.error('Ouch!', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}



async function getSuggestions(artikelnr){
  let conn
  bind = [artikelnr,artikelnr]


  try {
    conn = await oracledb.getConnection(config)
    const query = 'SELECT ARTIKELNR, PREIS, PRODUKTBEZEICHNUNG, HERSTELLER, NETTOGEWICHT, BRUTTOGEWICHT, RECYCLEBAREVERPACKUNG, NAME, SKU, KONFIDENZ, LIFT, SUPPORT, MAX(LIFTxKONFIDENZ) AS LIFTxKONFIDENZ2, MAX(LIFTxKONFIDENZxSUPPORT) AS LIFTxKONFIDENZxSUPPORT2    FROM ( SELECT p.ARTIKELNR, p.PREIS, p.PRODUKTBEZEICHNUNG, p.HERSTELLER, p.NETTOGEWICHT, p.BRUTTOGEWICHT, p.RECYCLEBAREVERPACKUNG, p.NAME, p.SKU, KONFIDENZ, LIFT, SUPPORT, (LIFT*KONFIDENZ) AS LIFTxKONFIDENZ, (LIFT*SUPPORT*KONFIDENZ) AS LIFTxKONFIDENZxSUPPORT FROM DEVSHOP2.PRODUKT p JOIN (                SELECT DISTINCT CONSEQUENCE, KONFIDENZ, LIFT, SUPPORT FROM (                    SELECT DISTINCT r.CONSEQUENCE, KONFIDENZ, r.LIFT, SUPPORT FROM DEVSHOP2.ALLGEMEINEARTIKELREGEL r JOIN (                        SELECT a.ITEMSET_ID, a.ARTIKELNR FROM DEVSHOP2.ALLGEMEINEARTIKELITEMS a JOIN DEVSHOP2.ALLGEMEINEARTIKELREGEL r ON a.ITEMSET_ID = r.ITEMSET_ID                            WHERE a.ARTIKELNR IN (:artikelnr)                            AND ITEM_COUNT = 2                            AND a.ARTIKELNR != r.CONSEQUENCE                            AND r.LIFT >= 1                            GROUP BY a.ITEMSET_ID, a.ARTIKELNR, LIFT                        ) ex ON r.ITEMSET_ID = ex.ITEMSET_ID AND r.CONSEQUENCE != ex.ARTIKELNR                        WHERE r.CONSEQUENCE NOT IN (:artikelnr) AND r.LIFT>=1                        GROUP BY r.CONSEQUENCE, r.LIFT, KONFIDENZ, SUPPORT                    )                GROUP BY CONSEQUENCE, LIFT, KONFIDENZ, SUPPORT                ) ON CONSEQUENCE = p.ARTIKELNR            group by LIFT, KONFIDENZ, SUPPORT, p.ARTIKELNR, p.PREIS, p.PRODUKTBEZEICHNUNG, p.HERSTELLER, p.NETTOGEWICHT, p.BRUTTOGEWICHT, p.RECYCLEBAREVERPACKUNG, p.NAME, p.SKU            UNION            SELECT p.ARTIKELNR, p.PREIS, p.PRODUKTBEZEICHNUNG, p.HERSTELLER, p.NETTOGEWICHT, p.BRUTTOGEWICHT, p.RECYCLEBAREVERPACKUNG, p.NAME, p.SKU, KONFIDENZ, LIFT, SUPPORT, (LIFT*KONFIDENZ) AS LIFTxKONFIDENZ, (LIFT*SUPPORT*KONFIDENZ) AS LIFTxKONFIDENZxSUPPORT FROM DEVSHOP2.PRODUKT p JOIN (                SELECT DISTINCT CONSEQUENCE, KONFIDENZ, LIFT, SUPPORT FROM (                    SELECT DISTINCT r.CONSEQUENCE, KONFIDENZ, r.LIFT, SUPPORT FROM DEVSHOP2.GENAUEARTIKELREGEL r JOIN (                        SELECT a.ITEMSET_ID, a.ARTIKELNR FROM DEVSHOP2.GENAUEARTIKELITEMS a JOIN DEVSHOP2.GENAUEARTIKELREGEL r ON a.ITEMSET_ID = r.ITEMSET_ID                            WHERE a.ARTIKELNR IN (:artikelnr)                            AND ITEM_COUNT = 2                            AND a.ARTIKELNR != r.CONSEQUENCE                            AND r.LIFT >= 3.2                            GROUP BY a.ITEMSET_ID, a.ARTIKELNR, LIFT                        ) ex ON r.ITEMSET_ID = ex.ITEMSET_ID AND r.CONSEQUENCE != ex.ARTIKELNR                        WHERE r.CONSEQUENCE NOT IN (:artikelnr) AND r.LIFT>=3.2                        GROUP BY r.CONSEQUENCE, r.LIFT, KONFIDENZ, SUPPORT                    )                GROUP BY CONSEQUENCE, LIFT, KONFIDENZ, SUPPORT                ) ON CONSEQUENCE = p.ARTIKELNR            group by LIFT, KONFIDENZ, SUPPORT, p.ARTIKELNR, p.PREIS, p.PRODUKTBEZEICHNUNG, p.HERSTELLER, p.NETTOGEWICHT, p.BRUTTOGEWICHT, p.RECYCLEBAREVERPACKUNG, p.NAME, p.SKU            )        group by ARTIKELNR, PREIS, PRODUKTBEZEICHNUNG, HERSTELLER, NETTOGEWICHT, BRUTTOGEWICHT, RECYCLEBAREVERPACKUNG, NAME, SKU, LIFT, KONFIDENZ, SUPPORT, LIFTxKONFIDENZ, LIFTxKONFIDENZxSUPPORT ORDER BY LIFTxKONFIDENZ2 desc'
    const result = await conn.execute(query, bind)

    return result.rows
   

  } catch (err) {
    console.log('Ouch!', err)
  }
}

async function getCartSuggestions(cartArtikelNumbers){
  let conn
  let searchNums = ''
  for (let index = 0; index < cartArtikelNumbers.length; index++) {
    searchNums = searchNums + cartArtikelNumbers[index]
    if(index != cartArtikelNumbers.length -1){
      searchNums=searchNums + ','
    }
  }
  try {
    conn = await oracledb.getConnection(config)
    //'+searchNums+'
    const query = 'SELECT ARTIKELNR, PREIS, PRODUKTBEZEICHNUNG, HERSTELLER, NETTOGEWICHT, BRUTTOGEWICHT, RECYCLEBAREVERPACKUNG, NAME, SKU, SUM(KONFIDENZ_SUMM) AS KONFIDENZ_SUMME, SUM(LIFT_SUMM) AS LIFT_SUMME, SUM(SUPPORT_SUMM) AS SUPPORT_SUMME, SUM(LIFTxKONFIDENZ) AS LIFTxKONFIDENZ2, SUM(LIFTxKONFIDENZxSUPPORT) AS LIFTxKONFIDENZxSUPPORT2    FROM (SELECT CONSEQUENCE AS ARTIKELNR, p.PREIS, p.PRODUKTBEZEICHNUNG, p.HERSTELLER, p.NETTOGEWICHT, p.BRUTTOGEWICHT, p.RECYCLEBAREVERPACKUNG, p.NAME, p.SKU, SUM(KONFIDENZ_SUM2) AS KONFIDENZ_SUMM, SUM(LIFT_SUM2) AS LIFT_SUMM, SUM(SUPPORT_SUM2) AS SUPPORT_SUMM, (LIFT_SUM2*KONFIDENZ_SUM2) AS LIFTxKONFIDENZ, (LIFT_SUM2*SUPPORT_SUM2*KONFIDENZ_SUM2) AS LIFTxKONFIDENZxSUPPORT FROM DEVSHOP2.PRODUKT p join (                    SELECT CONSEQUENCE, SUM(KONFIDENZ_SUM) as KONFIDENZ_SUM2, SUM(LIFT_SUM) as LIFT_SUM2, SUM(SUPPORT_SUM) as SUPPORT_SUM2                        FROM (SELECT r.CONSEQUENCE, SUM(r.KONFIDENZ) as KONFIDENZ_SUM, SUM(r.LIFT) as LIFT_SUM, SUM(r.SUPPORT) as SUPPORT_SUM                              FROM DEVSHOP2.ALLGEMEINEARTIKELREGEL r                                       JOIN (SELECT a.ITEMSET_ID, a.ARTIKELNR                                             FROM DEVSHOP2.ALLGEMEINEARTIKELITEMS a JOIN DEVSHOP2.ALLGEMEINEARTIKELREGEL r ON a.ITEMSET_ID = r.ITEMSET_ID                                             WHERE a.ARTIKELNR IN ('+searchNums+')                                                AND ITEM_COUNT = 2                                                AND a.ARTIKELNR != r.CONSEQUENCE AND LIFT >= 1                                             GROUP BY a.ITEMSET_ID, a.ARTIKELNR) ex                                            ON r.ITEMSET_ID = ex.ITEMSET_ID AND r.CONSEQUENCE != ex.ARTIKELNR                              WHERE r.CONSEQUENCE NOT IN ('+searchNums+') AND LIFT >= 1                              GROUP BY r.CONSEQUENCE                              UNION                              SELECT r.CONSEQUENCE, SUM(r.KONFIDENZ) as KONFIDENZ_SUM, SUM(r.LIFT) as LIFT_SUM, SUM(r.SUPPORT) as SUPPORT_SUM                              FROM DEVSHOP2.ALLGEMEINEARTIKELITEMS a                                       JOIN DEVSHOP2.ALLGEMEINEARTIKELREGEL r ON a.ITEMSET_ID = r.ITEMSET_ID                                       JOIN (SELECT a.ITEMSET_ID, COUNT(DISTINCT a.ARTIKELNR)                                             FROM DEVSHOP2.ALLGEMEINEARTIKELITEMS a                                             WHERE a.ARTIKELNR IN ('+searchNums+')                                             GROUP BY a.ITEMSET_ID                                             HAVING COUNT(DISTINCT a.ARTIKELNR) >= 2) ex                                            ON r.ITEMSET_ID = ex.ITEMSET_ID AND r.CONSEQUENCE NOT IN ('+searchNums+') AND r.ITEM_COUNT > 2                              WHERE a.ARTIKELNR IN ('+searchNums+') AND LIFT >= 1 AND ITEM_COUNT = 3                              GROUP BY r.CONSEQUENCE                              UNION                              SELECT r.CONSEQUENCE, SUM(r.KONFIDENZ) as KONFIDENZ_SUM, SUM(r.LIFT) as LIFT_SUM, SUM(r.SUPPORT) as SUPPORT_SUM                              FROM DEVSHOP2.ALLGEMEINEARTIKELITEMS a                                       JOIN DEVSHOP2.ALLGEMEINEARTIKELREGEL r ON a.ITEMSET_ID = r.ITEMSET_ID                                       JOIN (SELECT a.ITEMSET_ID, COUNT(DISTINCT a.ARTIKELNR)                                             FROM DEVSHOP2.ALLGEMEINEARTIKELITEMS a                                             WHERE a.ARTIKELNR IN ('+searchNums+')                                             GROUP BY a.ITEMSET_ID                                             HAVING COUNT(DISTINCT a.ARTIKELNR) >= 3) ex                                            ON r.ITEMSET_ID = ex.ITEMSET_ID AND r.CONSEQUENCE NOT IN ('+searchNums+') AND r.ITEM_COUNT > 3                              WHERE a.ARTIKELNR IN ('+searchNums+') AND r.LIFT >= 1 AND ITEM_COUNT = 4                              GROUP BY r.CONSEQUENCE)                    group by CONSEQUENCE)            on CONSEQUENCE= p.ARTIKELNR group by CONSEQUENCE, p.PREIS, p.PRODUKTBEZEICHNUNG, p.HERSTELLER, p.NETTOGEWICHT, p.BRUTTOGEWICHT, p.RECYCLEBAREVERPACKUNG, p.NAME, p.SKU, (LIFT_SUM2*KONFIDENZ_SUM2), (LIFT_SUM2*SUPPORT_SUM2*KONFIDENZ_SUM2)          UNION          SELECT CONSEQUENCE AS ARTIKELNR, p.PREIS, p.PRODUKTBEZEICHNUNG, p.HERSTELLER, p.NETTOGEWICHT, p.BRUTTOGEWICHT, p.RECYCLEBAREVERPACKUNG, p.NAME, p.SKU, SUM(KONFIDENZ_SUM2) AS KONFIDENZ_SUMM, SUM(LIFT_SUM2) AS LIFT_SUMM, SUM(SUPPORT_SUM2) AS SUPPORT_SUMM, (LIFT_SUM2*KONFIDENZ_SUM2) AS LIFTxKONFIDENZ, (LIFT_SUM2*SUPPORT_SUM2*KONFIDENZ_SUM2) AS LIFTxKONFIDENZxSUPPORT FROM DEVSHOP2.PRODUKT p join (                     SELECT CONSEQUENCE, SUM(KONFIDENZ_SUM) as KONFIDENZ_SUM2, SUM(LIFT_SUM) as LIFT_SUM2, SUM(SUPPORT_SUM) as SUPPORT_SUM2                        FROM (SELECT r.CONSEQUENCE, SUM(r.KONFIDENZ) as KONFIDENZ_SUM, SUM(r.LIFT) as LIFT_SUM, SUM(r.SUPPORT) as SUPPORT_SUM                              FROM DEVSHOP2.GENAUEARTIKELREGEL r                                       JOIN (SELECT a.ITEMSET_ID, a.ARTIKELNR                                             FROM DEVSHOP2.GENAUEARTIKELITEMS a JOIN DEVSHOP2.GENAUEARTIKELREGEL r ON a.ITEMSET_ID = r.ITEMSET_ID                                             WHERE a.ARTIKELNR IN ('+searchNums+')                                               AND ITEM_COUNT = 2                                               AND a.ARTIKELNR != r.CONSEQUENCE                                             GROUP BY a.ITEMSET_ID, a.ARTIKELNR) ex                                            ON r.ITEMSET_ID = ex.ITEMSET_ID AND r.CONSEQUENCE != ex.ARTIKELNR                              WHERE r.CONSEQUENCE NOT IN ('+searchNums+') AND r.LIFT >= 3.2                              GROUP BY r.CONSEQUENCE                              UNION                              SELECT r.CONSEQUENCE, SUM(r.KONFIDENZ) as KONFIDENZ_SUM, SUM(r.LIFT) as LIFT_SUM, SUM(r.SUPPORT) as SUPPORT_SUM                                FROM DEVSHOP2.GENAUEARTIKELITEMS a                                       JOIN DEVSHOP2.GENAUEARTIKELREGEL r ON a.ITEMSET_ID = r.ITEMSET_ID                                       JOIN (SELECT a.ITEMSET_ID, COUNT(DISTINCT a.ARTIKELNR)                                             FROM DEVSHOP2.GENAUEARTIKELITEMS a                                             WHERE a.ARTIKELNR IN ('+searchNums+')                                             GROUP BY a.ITEMSET_ID                                             HAVING COUNT(DISTINCT a.ARTIKELNR) >= 2) ex                                            ON r.ITEMSET_ID = ex.ITEMSET_ID AND r.CONSEQUENCE NOT IN ('+searchNums+') AND r.ITEM_COUNT > 2                              WHERE a.ARTIKELNR IN ('+searchNums+')  AND r.LIFT >= 3.2 AND ITEM_COUNT = 3                              GROUP BY r.CONSEQUENCE                              UNION                              SELECT r.CONSEQUENCE, SUM(r.KONFIDENZ) as KONFIDENZ_SUM, SUM(r.LIFT) as LIFT_SUM, SUM(r.SUPPORT) as SUPPORT_SUM                                FROM DEVSHOP2.GENAUEARTIKELITEMS a                                       JOIN DEVSHOP2.GENAUEARTIKELREGEL r ON a.ITEMSET_ID = r.ITEMSET_ID                                       JOIN (SELECT a.ITEMSET_ID, COUNT(DISTINCT a.ARTIKELNR)                                             FROM DEVSHOP2.GENAUEARTIKELITEMS a                                             WHERE a.ARTIKELNR IN ('+searchNums+')                                             GROUP BY a.ITEMSET_ID                                             HAVING COUNT(DISTINCT a.ARTIKELNR) >= 3) ex                                            ON r.ITEMSET_ID = ex.ITEMSET_ID AND r.CONSEQUENCE NOT IN ('+searchNums+') AND r.ITEM_COUNT > 3                              WHERE a.ARTIKELNR IN ('+searchNums+') AND r.LIFT >= 3.2 AND ITEM_COUNT = 4                              GROUP BY r.CONSEQUENCE)                    group by CONSEQUENCE, KONFIDENZ_SUM, LIFT_SUM, SUPPORT_SUM)          on CONSEQUENCE= p.ARTIKELNR group by CONSEQUENCE, (LIFT_SUM2*KONFIDENZ_SUM2), (LIFT_SUM2*SUPPORT_SUM2*KONFIDENZ_SUM2), p.PREIS, p.PRODUKTBEZEICHNUNG, p.HERSTELLER, p.NETTOGEWICHT, p.BRUTTOGEWICHT, p.RECYCLEBAREVERPACKUNG, p.NAME, p.SKU)    group by ARTIKELNR, ARTIKELNR, PREIS, PRODUKTBEZEICHNUNG, HERSTELLER, NETTOGEWICHT, BRUTTOGEWICHT, RECYCLEBAREVERPACKUNG, NAME, SKU ORDER BY LIFTxKONFIDENZxSUPPORT2 desc FETCH FIRST 13 ROWS ONLY'
    const result = await conn.execute(query)

    return result


  } catch (error) {
    console.log('Ouch!',error)
  }
}

//TODO WARENKORB LÖSCHEN!
async function getfleachenFromUser(userID) {
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
}




async function beiEinemKundenDieFleachenHinzufügen(uebergebeneInformation) {
  let connection;

  try {
    connection = await mysql.createConnection(config);

    

    for (const fleachenInformationen of uebergebeneInformation) {
      if (fleachenInformationen.productid === 'undefinedundefinedundefined') {
        const result = await connection.execute('SELECT MAX(ARTIKELNR) FROM PRODUKT WHERE Kundennummer = ?', [fleachenInformationen.USERID]);
        fleachenInformationen.productid = result[0][0] + 1;
      }

      await connection.execute("INSERT INTO PRODUKT (ARTIKELNR, FLAECHENNAME, preis, FOTO, FLEACHENART, Kundennummer) VALUES (?, ?, 7, ?, ?, ?)",
        [fleachenInformationen.productid, fleachenInformationen.flaechenname, fleachenInformationen.imageElement, fleachenInformationen.fleachenart, fleachenInformationen.USERID]);

      await connection.execute("INSERT INTO PRODUKT_ENTHÄLT_TIEFE (ARTIKELNR, TIEFENID) VALUES (?, ?)",
        [fleachenInformationen.productid, fleachenInformationen.tiefenValue]);

      if (fleachenInformationen.MangatValue === 'j') {
        await connection.execute("INSERT INTO PRODUKT_ENTHAELT_PROBE (ArtikelNr, PROBENARTID, PROBENSTATUS) VALUES (?, 1, 1)", [fleachenInformationen.productid]);
      }

      if (fleachenInformationen.EminValue === 'j') {
        await connection.execute("INSERT INTO PRODUKT_ENTHAELT_PROBE (ArtikelNr, PROBENARTID, PROBENSTATUS) VALUES (?, 1, 1)", [fleachenInformationen.productid]);
      }

      if (fleachenInformationen.StickstoffValue == 2) {
        await connection.execute("INSERT INTO PRODUKT_ENTHAELT_PROBE (ArtikelNr, PROBENARTID, PROBENSTATUS) VALUES (?, 2, 1)", [fleachenInformationen.productid]);
      } else if (fleachenInformationen.StickstoffValue == 3) {
        await connection.execute("INSERT INTO PRODUKT_ENTHAELT_PROBE (ArtikelNr, PROBENARTID, PROBENSTATUS) VALUES (?, 3, 1)", [fleachenInformationen.productid]);
      } else if (fleachenInformationen.StickstoffValue == 4) {
        await connection.execute("INSERT INTO PRODUKT_ENTHAELT_PROBE (ArtikelNr, PROBENARTID, PROBENSTATUS) VALUES (?, 4, 1)", [fleachenInformationen.productid]);
      }

      for (let j = 0; j < fleachenInformationen.coordinates.length; j++) {
        try {
          const position = j + 1;
          await connection.execute(
            "INSERT INTO FLEACHENKOORDINATE (FKOORDINATENIDLAT, FKOORDINATENIDLNG, ARTIKELNR, POSITIONSPUNKT) VALUES (?, ?, ?, ?)",
            [fleachenInformationen.coordinates[j][0], fleachenInformationen.coordinates[j][1], fleachenInformationen.productid, position]
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
        const result = await connection.execute('SELECT MAX(KUNDENNUMMER) FROM Kunde WHERE GEODATENGEBERID  != 1');
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
        await connection.execute('INSERT INTO BESTELLUNG(KUNDENNUMMER, ZEITSTEMPEL) VALUES (?, NOW())', [
          einzelneInformationen[0].USERID,
        ]);
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


        await connection.execute(
          "INSERT INTO PRODUKT (ARTIKELNR, FLAECHENNAME, preis, FOTO, FLEACHENART, Kundennummer) VALUES (?, ?, 7, ?, ?, ?)",
          [
            fleachenInformationen.productid,
            fleachenInformationen.flaechenname,
            fleachenInformationen.imageElement,
            fleachenInformationen.fleachenart,
            fleachenInformationen.USERID,
          ]
        );
        await connection.execute(
          "INSERT INTO PRODUKT_ENTHÄLT_TIEFE(ARTIKELNR, TIEFENID) VALUES (?, ?)",
          [fleachenInformationen.productid, fleachenInformationen.tiefenValue]
        );

        if (fleachenInformationen.MangatValue == 'j') {
          await connection.execute(
            "INSERT INTO PRODUKT_ENTHAELT_PROBE(ArtikelNr, PROBENARTID, PROBENSTATUS) VALUES (?, 1, 1)",
            [fleachenInformationen.productid]
          );
        }

        if (fleachenInformationen.EminValue == 'j') {
          await connection.execute(
            "INSERT INTO PRODUKT_ENTHAELT_PROBE(ArtikelNr, PROBENARTID, PROBENSTATUS) VALUES (?, 1, 1)",
            [fleachenInformationen.productid]
          );
        }

        if (fleachenInformationen.StickstoffValue == 2) {
          await connection.execute(
            "INSERT INTO PRODUKT_ENTHAELT_PROBE(ArtikelNr, PROBENARTID, PROBENSTATUS) VALUES (?, 2, 1)",
            [fleachenInformationen.productid]
          );
        } else if (fleachenInformationen.StickstoffValue == 3) {
          await connection.execute(
            "INSERT INTO PRODUKT_ENTHAELT_PROBE(ArtikelNr, PROBENARTID, PROBENSTATUS) VALUES (?, 3, 1)",
            [fleachenInformationen.productid]
          );
        } else if (fleachenInformationen.StickstoffValue == 4) {
          await connection.execute(
            "INSERT INTO PRODUKT_ENTHAELT_PROBE(ArtikelNr, PROBENARTID, PROBENSTATUS) VALUES (?, 4, 1)",
            [fleachenInformationen.productid]
          );
        }

        for (let j = 0; j <= fleachenInformationen.coordinates.length; j++) {
          try {
            const position = j + 1;
            await connection.execute(
              "INSERT INTO FLEACHENKOORDINATE(FKOORDINATENIDLAT, FKOORDINATENIDLNG, ARTIKELNR, POSITIONSPUNKT) VALUES (?, ?, ?, ?)",
              [fleachenInformationen.coordinates[j][0], fleachenInformationen.coordinates[j][1], fleachenInformationen.productid, position]
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
        Kunde.KUNDENNUMMER,
        Kunde.VORNAME,
        Kunde.NACHNAME,
        Kunde.E_MAIL,
        Kunde.TELEFONNUMMER,
        KUNDE.GEBURTSDATUM,
        KUNDE.PASSWORD,
        Adresse.ORT,
        Adresse.POSTLEITZAHL,
        Adresse.STRASSE,
        Adresse.HAUSNUMMER
      FROM
        Kunde
      JOIN
        Kunde_Hat_Adresse ON Kunde.KUNDENNUMMER = Kunde_Hat_Adresse.KUNDENNUMMER
      JOIN
        Adresse ON Kunde_Hat_Adresse.STRASSE = Adresse.STRASSE
        AND Kunde_Hat_Adresse.ORT = Adresse.ORT
        AND Kunde_Hat_Adresse.POSTLEITZAHL = Adresse.POSTLEITZAHL
        AND Kunde_Hat_Adresse.HAUSNUMMER = Adresse.HAUSNUMMER
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

async function getUpdateDatenVomKunden(kundennummer, vorname, nachname, email, telefonnummer, ort, plz, strasse, hausnummer, password, geburtsdatum) {
  let connection;

  try {
    connection = await mysql.createConnection(config);

    const [result] = await connection.execute('SELECT * FROM KUNDE WHERE KUNDENNUMMER = ?', [kundennummer]);

    const [result2] = await connection.execute(
      'UPDATE KUNDE SET VORNAME = ?, NACHNAME = ?, TELEFONNUMMER = ?, E_MAIL = ?, PASSWORD = ? WHERE KUNDENNUMMER = ?',
      [vorname, nachname, telefonnummer, email, password, kundennummer]
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


async function getKundenzumloeschen(kundennummer) {
  let connection;

  try {
    connection = await mysql.createConnection(config);
    await connection.execute('delete from kunde where KUNDENNUMMER= ?', [kundennummer]);
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
  getResultKategorien,
  getResultLast,
  getResultPreis,
  getBestseller,
  getAllProducts,
  getProductsByCategory,
  getProductDetails,
  registerUser,
  registerUserWithFleachen,
  getUserByEmail,
  getAllOberCategories,
  getUserById,
  createCart,
  createBestellung,
  putToCart,
  putToBestellung,
  anderPasswort,
  getCartFromUser,
  getfleachenFromAllUser,
  getfleachenFromUser,
  getFleachenFromUserBestellt,
  getBestllungenFromUser,
  getKundendaten,
  getMitarbeiterdaten,
  deleteFromCart,
  initiateOrder,
  initiateOrderNew,
  getClob,
  getClobWaren,
  getSuggestions,
  getCartSuggestions,
  getCategorys,
  getInformationsForGenerateKmlFile, 
  mehrereKundenHochladen,
  fleacheAufBearbeitetSetzen,
  getaufBearbeitenStellen,
  beiEinemKundenDieFleachenHinzufügen,
  beiMehrerenKundenDieFleachenHinzufügen,
  getKundendatenDieZuZiehenSind,
  getkundenDatenVomAusgewaehltenUser,
  getUpdateDatenVomKunden,
  getKundenzumloeschen
}