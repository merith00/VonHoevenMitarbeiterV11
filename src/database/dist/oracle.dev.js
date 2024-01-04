"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var config = require('./conf');

var mysql = require('mysql2/promise');

function ProbeWurdeGezogen(productIDs) {
  var connection, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, id, _ref, _ref2, existingProbeStatusRows;

  return regeneratorRuntime.async(function ProbeWurdeGezogen$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(mysql.createConnection(config));

        case 2:
          connection = _context.sent;
          _context.prev = 3;
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context.prev = 7;
          _iterator = productIDs[Symbol.iterator]();

        case 9:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context.next = 37;
            break;
          }

          id = _step.value;
          _context.next = 13;
          return regeneratorRuntime.awrap(connection.execute("SELECT PROBENSTATUS FROM PRODUKT_ENTHAELT_PROBE WHERE ARTIKELNR = ? AND PROBENSTATUS = 3", [id.productId]));

        case 13:
          _ref = _context.sent;
          _ref2 = _slicedToArray(_ref, 1);
          existingProbeStatusRows = _ref2[0];

          if (!(existingProbeStatusRows.length === 0)) {
            _context.next = 34;
            break;
          }

          _context.next = 19;
          return regeneratorRuntime.awrap(connection.execute("DELETE FROM PRODUKT_ENTHAELT_PROBE WHERE ARTIKELNR = ?", [id.productId]));

        case 19:
          console.log(id.dateValue);
          _context.next = 22;
          return regeneratorRuntime.awrap(connection.execute("UPDATE PRODUKT SET STARTDATUM = STR_TO_DATE(?, '%Y-%m-%d') WHERE ARTIKELNR = ?", [id.dateValue, id.productId]));

        case 22:
          if (!(id.NminValue == 'j')) {
            _context.next = 25;
            break;
          }

          _context.next = 25;
          return regeneratorRuntime.awrap(connection.execute("INSERT INTO PRODUKT_ENTHAELT_PROBE(ArtikelNr, PROBENARTID, PROBENSTATUS) VALUES (?, 1, 3)", [id.productId]));

        case 25:
          if (!(id.SminValue == 'j')) {
            _context.next = 28;
            break;
          }

          _context.next = 28;
          return regeneratorRuntime.awrap(connection.execute("INSERT INTO PRODUKT_ENTHAELT_PROBE(ArtikelNr, PROBENARTID, PROBENSTATUS) VALUES (?, 2, 3)", [id.productId]));

        case 28:
          if (!(id.HumusValue == 'j')) {
            _context.next = 31;
            break;
          }

          _context.next = 31;
          return regeneratorRuntime.awrap(connection.execute("INSERT INTO PRODUKT_ENTHAELT_PROBE(ArtikelNr, PROBENARTID, PROBENSTATUS) VALUES (?, 3, 3)", [id.productId]));

        case 31:
          if (!(id.CnValue == 'j')) {
            _context.next = 34;
            break;
          }

          _context.next = 34;
          return regeneratorRuntime.awrap(connection.execute("INSERT INTO PRODUKT_ENTHAELT_PROBE(ArtikelNr, PROBENARTID, PROBENSTATUS) VALUES (?, 4, 3)", [id.productId]));

        case 34:
          _iteratorNormalCompletion = true;
          _context.next = 9;
          break;

        case 37:
          _context.next = 43;
          break;

        case 39:
          _context.prev = 39;
          _context.t0 = _context["catch"](7);
          _didIteratorError = true;
          _iteratorError = _context.t0;

        case 43:
          _context.prev = 43;
          _context.prev = 44;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 46:
          _context.prev = 46;

          if (!_didIteratorError) {
            _context.next = 49;
            break;
          }

          throw _iteratorError;

        case 49:
          return _context.finish(46);

        case 50:
          return _context.finish(43);

        case 51:
          _context.next = 53;
          return regeneratorRuntime.awrap(connection.commit());

        case 53:
          _context.next = 58;
          break;

        case 55:
          _context.prev = 55;
          _context.t1 = _context["catch"](3);
          console.log('Ouch!', _context.t1);

        case 58:
          _context.prev = 58;

          if (!connection) {
            _context.next = 62;
            break;
          }

          _context.next = 62;
          return regeneratorRuntime.awrap(connection.end());

        case 62:
          return _context.finish(58);

        case 63:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[3, 55, 58, 63], [7, 39, 43, 51], [44,, 46, 50]]);
}

function funktionFleacheSollBearbeitetWerden(productIDs) {
  var connection, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, id, _ref3, _ref4, existingProbeStatusRows, dateValue, sysdate;

  return regeneratorRuntime.async(function funktionFleacheSollBearbeitetWerden$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(mysql.createConnection(config));

        case 2:
          connection = _context2.sent;
          _context2.prev = 3;
          _iteratorNormalCompletion2 = true;
          _didIteratorError2 = false;
          _iteratorError2 = undefined;
          _context2.prev = 7;
          _iterator2 = productIDs[Symbol.iterator]();

        case 9:
          if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
            _context2.next = 39;
            break;
          }

          id = _step2.value;
          _context2.next = 13;
          return regeneratorRuntime.awrap(connection.execute("SELECT PROBENSTATUS FROM PRODUKT_ENTHAELT_PROBE WHERE ARTIKELNR = ? AND PROBENSTATUS = 1", [id.productId]));

        case 13:
          _ref3 = _context2.sent;
          _ref4 = _slicedToArray(_ref3, 1);
          existingProbeStatusRows = _ref4[0];
          dateValue = productIDs[0].dateValue;
          sysdate = new Date(); // Hier wird das aktuelle Datum erstellt

          if (!(existingProbeStatusRows.length === 0)) {
            _context2.next = 36;
            break;
          }

          _context2.next = 21;
          return regeneratorRuntime.awrap(connection.execute("DELETE FROM PRODUKT_ENTHAELT_PROBE WHERE ARTIKELNR = ?", [id.productId]));

        case 21:
          if (dateValue === '1') {
            dateValue = sysdate.getFullYear() + '-01-01';
          } else if (dateValue === '2') {
            dateValue = sysdate.getFullYear() + '-02-15';
          } else if (dateValue === '3') {
            dateValue = sysdate.getFullYear() + '-03-15';
          }

          _context2.next = 24;
          return regeneratorRuntime.awrap(connection.execute("UPDATE PRODUKT SET STARTDATUM = STR_TO_DATE(?, '%Y-%m-%d') WHERE ARTIKELNR = ?", [dateValue, id.productId]));

        case 24:
          if (!(id.NminValue == 'j')) {
            _context2.next = 27;
            break;
          }

          _context2.next = 27;
          return regeneratorRuntime.awrap(connection.execute("INSERT INTO PRODUKT_ENTHAELT_PROBE(ArtikelNr, PROBENARTID, PROBENSTATUS) VALUES (?, 1, 1)", [id.productId]));

        case 27:
          if (!(id.SminValue == 'j')) {
            _context2.next = 30;
            break;
          }

          _context2.next = 30;
          return regeneratorRuntime.awrap(connection.execute("INSERT INTO PRODUKT_ENTHAELT_PROBE(ArtikelNr, PROBENARTID, PROBENSTATUS) VALUES (?, 2, 1)", [id.productId]));

        case 30:
          if (!(id.HumusValue == 'j')) {
            _context2.next = 33;
            break;
          }

          _context2.next = 33;
          return regeneratorRuntime.awrap(connection.execute("INSERT INTO PRODUKT_ENTHAELT_PROBE(ArtikelNr, PROBENARTID, PROBENSTATUS) VALUES (?, 3, 1)", [id.productId]));

        case 33:
          if (!(id.CnValue == 'j')) {
            _context2.next = 36;
            break;
          }

          _context2.next = 36;
          return regeneratorRuntime.awrap(connection.execute("INSERT INTO PRODUKT_ENTHAELT_PROBE(ArtikelNr, PROBENARTID, PROBENSTATUS) VALUES (?, 4, 1)", [id.productId]));

        case 36:
          _iteratorNormalCompletion2 = true;
          _context2.next = 9;
          break;

        case 39:
          _context2.next = 45;
          break;

        case 41:
          _context2.prev = 41;
          _context2.t0 = _context2["catch"](7);
          _didIteratorError2 = true;
          _iteratorError2 = _context2.t0;

        case 45:
          _context2.prev = 45;
          _context2.prev = 46;

          if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
            _iterator2["return"]();
          }

        case 48:
          _context2.prev = 48;

          if (!_didIteratorError2) {
            _context2.next = 51;
            break;
          }

          throw _iteratorError2;

        case 51:
          return _context2.finish(48);

        case 52:
          return _context2.finish(45);

        case 53:
          _context2.next = 55;
          return regeneratorRuntime.awrap(connection.commit());

        case 55:
          _context2.next = 60;
          break;

        case 57:
          _context2.prev = 57;
          _context2.t1 = _context2["catch"](3);
          console.log('Ouch!', _context2.t1);

        case 60:
          _context2.prev = 60;

          if (!connection) {
            _context2.next = 64;
            break;
          }

          _context2.next = 64;
          return regeneratorRuntime.awrap(connection.end());

        case 64:
          return _context2.finish(60);

        case 65:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[3, 57, 60, 65], [7, 41, 45, 53], [46,, 48, 52]]);
}

function getfleachenFromAllUser() {
  var connection, flaechen, _ref5, _ref6, result;

  return regeneratorRuntime.async(function getfleachenFromAllUser$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(mysql.createConnection(config));

        case 3:
          connection = _context3.sent;
          _context3.next = 6;
          return regeneratorRuntime.awrap(connection.execute("\n    SELECT DISTINCT fc.ARTIKELNR, fc.FKOORDINATENIDLAT, fc.FKOORDINATENIDLNG, fc.POSITIONSPUNKT, b.ABDATUM,\n    CASE WHEN PP.PROBENARTID IS NOT NULL THEN 1 ELSE 0 END AS enth\xE4lt_nmin,\n    CASE WHEN PSmin.PROBENARTID IS NOT NULL THEN 1 ELSE 0 END AS enth\xE4lt_smin,\n    CASE WHEN PHumus.PROBENARTID IS NOT NULL THEN 1 ELSE 0 END AS enth\xE4lt_humus,\n    CASE WHEN PCN.PROBENARTID IS NOT NULL THEN 1 ELSE 0 END AS enth\xE4lt_cn,\n    P.FLAECHENNAME, P.STARTDATUM, P.FLEACHENART, P.KUNDENNUMMER, P.BEARBEITUNGSARTID,\n    PEP.PROBENSTATUS\n    FROM FLEACHENKOORDINATE fc\n    JOIN PRODUKT p ON p.ARTIKELNR = fc.ARTIKELNR AND p.KUNDENNUMMER = fc.KUNDENNUMMER\n    JOIN bearbeitungsart b on p.BEARBEITUNGSARTID = b.BEARBEITUNGSARTID\n    JOIN PRODUKT_ENTHAELT_PROBE PEP ON p.ARTIKELNR = PEP.ARTIKELNR AND p.KUNDENNUMMER = PEP.KUNDENNUMMER\n    JOIN BESTELLUNG_ENTHAELT_PRODUKT wp ON wp.ARTIKELNR = p.ARTIKELNR and wp.KUNDENNUMMER = wp.KUNDENNUMMER\n    JOIN BESTELLUNG w ON w.KUNDENNUMMER = wp.KUNDENNUMMER\n    JOIN KUNDE k ON k.KUNDENNUMMER = w.KUNDENNUMMER\n    LEFT JOIN PRODUKT_ENTHAELT_PROBE PP ON P.ARTIKELNR = PP.ARTIKELNR AND P.KUNDENNUMMER = PP.KUNDENNUMMER AND PP.PROBENARTID = 1\n    LEFT JOIN PRODUKT_ENTHAELT_PROBE PSmin ON P.ARTIKELNR = PSmin.ARTIKELNR AND P.KUNDENNUMMER = PP.KUNDENNUMMER AND PSmin.PROBENARTID = 2\n    LEFT JOIN PRODUKT_ENTHAELT_PROBE PHumus ON P.ARTIKELNR = PHumus.ARTIKELNR AND P.KUNDENNUMMER = PP.KUNDENNUMMER AND PHumus.PROBENARTID = 3\n    LEFT JOIN PRODUKT_ENTHAELT_PROBE PCN ON P.ARTIKELNR = PCN.ARTIKELNR AND P.KUNDENNUMMER = PP.KUNDENNUMMER AND PCN.PROBENARTID = 4\n    ORDER BY P.KUNDENNUMMER, fc.ARTIKELNR, fc.POSITIONSPUNKT\n    "));

        case 6:
          _ref5 = _context3.sent;
          _ref6 = _slicedToArray(_ref5, 1);
          result = _ref6[0];
          return _context3.abrupt("return", result);

        case 12:
          _context3.prev = 12;
          _context3.t0 = _context3["catch"](0);
          console.error('Fehler bei der MySQL-Abfrage:', _context3.t0);

        case 15:
          _context3.prev = 15;

          if (!connection) {
            _context3.next = 19;
            break;
          }

          _context3.next = 19;
          return regeneratorRuntime.awrap(connection.end());

        case 19:
          return _context3.finish(15);

        case 20:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 12, 15, 20]]);
}

function getFleachenFromUserBestellt(userID) {
  var conn, fleachen;
  return regeneratorRuntime.async(function getFleachenFromUserBestellt$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return regeneratorRuntime.awrap(mysql.createConnection(config));

        case 3:
          conn = _context4.sent;
          _context4.next = 6;
          return regeneratorRuntime.awrap(conn.execute("\n    SELECT DISTINCT fc.ARTIKELNR, fc.FKOORDINATENIDLAT, fc.FKOORDINATENIDLNG, fc.POSITIONSPUNKT, PEP.PROBENSTATUS\n    FROM FLEACHENKOORDINATE fc\n    JOIN PRODUKT p ON p.ARTIKELNR = fc.ARTIKELNR AND p.KUNDENNUMMER = fc.KUNDENNUMMER\n    JOIN PRODUKT_ENTHAELT_PROBE PEP ON p.ARTIKELNR = PEP.ARTIKELNR AND p.KUNDENNUMMER = PEP.KUNDENNUMMER\n    JOIN BESTELLUNG_ENTHAELT_PRODUKT wp ON wp.ARTIKELNR = p.ARTIKELNR and wp.KUNDENNUMMER = wp.KUNDENNUMMER\n    JOIN BESTELLUNG w ON w.KUNDENNUMMER = wp.KUNDENNUMMER\n    JOIN KUNDE k ON k.KUNDENNUMMER = w.KUNDENNUMMER\n    WHERE fc.KUNDENNUMMER = ?\n    ORDER BY fc.ARTIKELNR, fc.POSITIONSPUNKT\n    ", [userID]));

        case 6:
          fleachen = _context4.sent;
          return _context4.abrupt("return", fleachen[0]);

        case 10:
          _context4.prev = 10;
          _context4.t0 = _context4["catch"](0);
          console.log('Ouch!', _context4.t0);

        case 13:
          _context4.prev = 13;

          if (!conn) {
            _context4.next = 17;
            break;
          }

          _context4.next = 17;
          return regeneratorRuntime.awrap(conn.end());

        case 17:
          return _context4.finish(13);

        case 18:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 10, 13, 18]]);
}

function getInformationsForGenerateKmlFile(productIDs) {
  var connection, infoProductIDs, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, id, _ref7, _ref8, infoProdukt, _ref9, _ref10, infoFlaechenkoordinate, _ref11, _ref12, infoFlaechenkoordinateErste, flaecheninfo, flaecheninfoErste, coordinates, _ref13, _ref14, _infoProdukt, _ref15, _ref16, _infoFlaechenkoordinate, _ref17, _ref18, _infoFlaechenkoordinateErste, _flaecheninfo, _flaecheninfoErste, _coordinates;

  return regeneratorRuntime.async(function getInformationsForGenerateKmlFile$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.next = 2;
          return regeneratorRuntime.awrap(mysql.createConnection(config));

        case 2:
          connection = _context5.sent;
          infoProductIDs = [];
          _context5.prev = 4;

          if (!Array.isArray(productIDs)) {
            _context5.next = 51;
            break;
          }

          _iteratorNormalCompletion3 = true;
          _didIteratorError3 = false;
          _iteratorError3 = undefined;
          _context5.prev = 9;
          _iterator3 = productIDs[Symbol.iterator]();

        case 11:
          if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
            _context5.next = 35;
            break;
          }

          id = _step3.value;
          _context5.next = 15;
          return regeneratorRuntime.awrap(connection.execute('SELECT ARTIKELNR, KUNDENNUMMER, STARTDATUM, FLEACHENART, FLAECHENNAME FROM PRODUKT WHERE ARTIKELNR = ?', [id]));

        case 15:
          _ref7 = _context5.sent;
          _ref8 = _slicedToArray(_ref7, 1);
          infoProdukt = _ref8[0];
          _context5.next = 20;
          return regeneratorRuntime.awrap(connection.execute('SELECT FKOORDINATENIDLNG, FKOORDINATENIDLAT FROM FLEACHENKOORDINATE WHERE ARTIKELNR = ? ORDER BY POSITIONSPUNKT', [id]));

        case 20:
          _ref9 = _context5.sent;
          _ref10 = _slicedToArray(_ref9, 1);
          infoFlaechenkoordinate = _ref10[0];
          _context5.next = 25;
          return regeneratorRuntime.awrap(connection.execute('SELECT FKOORDINATENIDLNG, FKOORDINATENIDLAT FROM FLEACHENKOORDINATE WHERE ARTIKELNR = ? AND POSITIONSPUNKT = 1', [id]));

        case 25:
          _ref11 = _context5.sent;
          _ref12 = _slicedToArray(_ref11, 1);
          infoFlaechenkoordinateErste = _ref12[0];
          flaecheninfo = infoFlaechenkoordinate.map(function (row) {
            return "".concat(row.FKOORDINATENIDLNG, ",").concat(row.FKOORDINATENIDLAT);
          });
          flaecheninfoErste = "".concat(infoFlaechenkoordinateErste[0].FKOORDINATENIDLNG, ",").concat(infoFlaechenkoordinateErste[0].FKOORDINATENIDLAT);
          coordinates = flaecheninfo.join(' ') + ' ' + flaecheninfoErste;
          infoProductIDs.push({
            id: id,
            produktinfo: [infoProdukt[0]],
            flaecheninfo: [coordinates]
          });

        case 32:
          _iteratorNormalCompletion3 = true;
          _context5.next = 11;
          break;

        case 35:
          _context5.next = 41;
          break;

        case 37:
          _context5.prev = 37;
          _context5.t0 = _context5["catch"](9);
          _didIteratorError3 = true;
          _iteratorError3 = _context5.t0;

        case 41:
          _context5.prev = 41;
          _context5.prev = 42;

          if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
            _iterator3["return"]();
          }

        case 44:
          _context5.prev = 44;

          if (!_didIteratorError3) {
            _context5.next = 47;
            break;
          }

          throw _iteratorError3;

        case 47:
          return _context5.finish(44);

        case 48:
          return _context5.finish(41);

        case 49:
          _context5.next = 70;
          break;

        case 51:
          _context5.next = 53;
          return regeneratorRuntime.awrap(connection.execute('SELECT ARTIKELNR, KUNDENNUMMER, STARTDATUM, FLEACHENART, FLAECHENNAME FROM PRODUKT WHERE ARTIKELNR = ?', [productIDs]));

        case 53:
          _ref13 = _context5.sent;
          _ref14 = _slicedToArray(_ref13, 1);
          _infoProdukt = _ref14[0];
          _context5.next = 58;
          return regeneratorRuntime.awrap(connection.execute('SELECT FKOORDINATENIDLNG, FKOORDINATENIDLAT FROM FLEACHENKOORDINATE WHERE ARTIKELNR = ? ORDER BY POSITIONSPUNKT', [productIDs]));

        case 58:
          _ref15 = _context5.sent;
          _ref16 = _slicedToArray(_ref15, 1);
          _infoFlaechenkoordinate = _ref16[0];
          _context5.next = 63;
          return regeneratorRuntime.awrap(connection.execute('SELECT FKOORDINATENIDLNG, FKOORDINATENIDLAT FROM FLEACHENKOORDINATE WHERE ARTIKELNR = ? AND POSITIONSPUNKT = 1', [productIDs]));

        case 63:
          _ref17 = _context5.sent;
          _ref18 = _slicedToArray(_ref17, 1);
          _infoFlaechenkoordinateErste = _ref18[0];
          _flaecheninfo = _infoFlaechenkoordinate.map(function (row) {
            return "".concat(row.FKOORDINATENIDLNG, ",").concat(row.FKOORDINATENIDLAT);
          });
          _flaecheninfoErste = "".concat(_infoFlaechenkoordinateErste[0].FKOORDINATENIDLNG, ",").concat(_infoFlaechenkoordinateErste[0].FKOORDINATENIDLAT);
          _coordinates = _flaecheninfo.join(' ') + ' ' + _flaecheninfoErste;
          infoProductIDs.push({
            id: productIDs,
            produktinfo: [_infoProdukt[0]],
            flaecheninfo: [_coordinates]
          });

        case 70:
          _context5.next = 75;
          break;

        case 72:
          _context5.prev = 72;
          _context5.t1 = _context5["catch"](4);
          console.log('Ouch!', _context5.t1);

        case 75:
          _context5.prev = 75;

          if (!connection) {
            _context5.next = 79;
            break;
          }

          _context5.next = 79;
          return regeneratorRuntime.awrap(connection.end());

        case 79:
          return _context5.finish(75);

        case 80:
          return _context5.abrupt("return", infoProductIDs);

        case 81:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[4, 72, 75, 80], [9, 37, 41, 49], [42,, 44, 48]]);
}

function getBestllungenFromUser(userID) {
  var connection, cart, _ref19, _ref20, result3;

  return regeneratorRuntime.async(function getBestllungenFromUser$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          cart = {
            gesamtsumme: null,
            mwst: null,
            products: []
          };
          _context6.prev = 1;
          _context6.next = 4;
          return regeneratorRuntime.awrap(mysql.createConnection(config));

        case 4:
          connection = _context6.sent;
          _context6.next = 7;
          return regeneratorRuntime.awrap(connection.execute("\n    SELECT\n    P.*,\n    B2.ABDATUM,\n    CASE WHEN PP.PROBENARTID IS NOT NULL THEN 'J' ELSE 'N' END AS enth\xE4lt_mangat,\n    CASE WHEN PP.PROBENARTID IS NOT NULL THEN PP.PROBENSTATUS ELSE 0 END AS statusmangat,\n    CASE WHEN PE.PROBENARTID IS NOT NULL THEN 'J' ELSE 'N' END AS enth\xE4lt_emin,\n    CASE WHEN PE.PROBENARTID IS NOT NULL THEN PE.PROBENSTATUS ELSE 0 END AS statusemin,\n    CASE WHEN PS.PROBENARTID IS NOT NULL THEN 'J' ELSE 'N' END AS enth\xE4lt_stickstoff,\n    CASE WHEN PS.PROBENARTID IS NOT NULL THEN PS.PROBENSTATUS ELSE 0 END AS statusstickstoff\n    FROM\n    PRODUKT P\n    JOIN\n    BESTELLUNG_ENTHAELT_PRODUKT B ON P.ARTIKELNR = B.ARTIKELNR AND P.KUNDENNUMMER = B.KUNDENNUMMER\n    JOIN\n    BESTELLUNG O ON B.KUNDENNUMMER = O.KUNDENNUMMER\n    JOIN BEARBEITUNGSART B2 on P.BEARBEITUNGSARTID = B2.BEARBEITUNGSARTID\n    LEFT JOIN\n    PRODUKT_ENTHAELT_PROBE PP ON P.ARTIKELNR = PP.ARTIKELNR AND P.KUNDENNUMMER = PP.KUNDENNUMMER AND PP.PROBENARTID = 1\n    LEFT JOIN\n    PRODUKT_ENTHAELT_PROBE PE ON P.ARTIKELNR = PE.ARTIKELNR AND P.KUNDENNUMMER = PP.KUNDENNUMMER AND PE.PROBENARTID = 2\n    LEFT JOIN\n    PRODUKT_ENTHAELT_PROBE PS ON P.ARTIKELNR = PS.ARTIKELNR AND P.KUNDENNUMMER = PP.KUNDENNUMMER AND PS.PROBENARTID = 3\n    WHERE\n    O.Kundennummer = ?\n    ", [userID]));

        case 7:
          _ref19 = _context6.sent;
          _ref20 = _slicedToArray(_ref19, 1);
          result3 = _ref20[0];
          cart.products = result3;
          return _context6.abrupt("return", cart);

        case 14:
          _context6.prev = 14;
          _context6.t0 = _context6["catch"](1);
          console.error('Ouch!', _context6.t0);

        case 17:
          _context6.prev = 17;

          if (!connection) {
            _context6.next = 21;
            break;
          }

          _context6.next = 21;
          return regeneratorRuntime.awrap(connection.end());

        case 21:
          return _context6.finish(17);

        case 22:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[1, 14, 17, 22]]);
}

function getKundenDatenMitGeoDatenDieZuZiehenSind(geoID) {
  var connection, _ref21, _ref22, rows;

  return regeneratorRuntime.async(function getKundenDatenMitGeoDatenDieZuZiehenSind$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          _context7.next = 3;
          return regeneratorRuntime.awrap(mysql.createConnection(config));

        case 3:
          connection = _context7.sent;
          _context7.next = 6;
          return regeneratorRuntime.awrap(connection.execute("\n      SELECT \n        KUNDE.KUNDENNUMMER,\n        KUNDE.VORNAME,\n        KUNDE.NACHNAME,\n        KUNDE.E_MAIL,\n        KUNDE.TELEFONNUMMER,\n        ADRESSE.ORT,\n        BESTELLUNG.ANZAHLPOSITIONEN AS AnzahlFlaechen\n      FROM\n        KUNDE\n        JOIN KUNDE_HAT_ADRESSE ON KUNDE.KUNDENNUMMER = KUNDE_HAT_ADRESSE.KUNDENNUMMER\n        JOIN ADRESSE ON KUNDE_HAT_ADRESSE.STRASSE = ADRESSE.STRASSE\n          AND KUNDE_HAT_ADRESSE.ORT = ADRESSE.ORT\n          AND KUNDE_HAT_ADRESSE.POSTLEITZAHL = ADRESSE.POSTLEITZAHL\n          AND KUNDE_HAT_ADRESSE.HAUSNUMMER = ADRESSE.HAUSNUMMER\n        LEFT JOIN BESTELLUNG ON KUNDE.KUNDENNUMMER = BESTELLUNG.KUNDENNUMMER\n        LEFT JOIN BESTELLUNG_ENTHAELT_PRODUKT B ON BESTELLUNG.KUNDENNUMMER = B.KUNDENNUMMER\n        LEFT JOIN PRODUKT P ON B.ARTIKELNR = P.ARTIKELNR\n        LEFT JOIN PRODUKT_ENTHAELT_PROBE PEP ON P.ARTIKELNR = PEP.ARTIKELNR\n      WHERE\n        GEODATENGEBERID = ?\n        AND PEP.PROBENSTATUS = 1\n      GROUP BY\n        KUNDE.KUNDENNUMMER, ADRESSE.ORT, KUNDE.TELEFONNUMMER, KUNDE.VORNAME, KUNDE.NACHNAME, KUNDE.E_MAIL\n      ORDER BY\n        KUNDENNUMMER\n    ", [geoID]));

        case 6:
          _ref21 = _context7.sent;
          _ref22 = _slicedToArray(_ref21, 1);
          rows = _ref22[0];
          return _context7.abrupt("return", rows);

        case 12:
          _context7.prev = 12;
          _context7.t0 = _context7["catch"](0);
          console.error('Ouch!', _context7.t0);

        case 15:
          _context7.prev = 15;

          if (!connection) {
            _context7.next = 19;
            break;
          }

          _context7.next = 19;
          return regeneratorRuntime.awrap(connection.end());

        case 19:
          return _context7.finish(15);

        case 20:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 12, 15, 20]]);
}

function getKundendatenDieZuZiehenSind() {
  var connection, resultsKundendaten, resultLufa, resultclaas, resultgsagri, resultlwkniedersachsen, resultmaehlmann, resultsonsttiges;
  return regeneratorRuntime.async(function getKundendatenDieZuZiehenSind$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          resultsKundendaten = {
            lufa: [],
            claas: [],
            gsagri: [],
            lwkniedersachsen: [],
            maehlmann: [],
            sonstiges: []
          };
          _context8.prev = 1;
          _context8.next = 4;
          return regeneratorRuntime.awrap(mysql.createConnection(config));

        case 4:
          connection = _context8.sent;
          _context8.next = 7;
          return regeneratorRuntime.awrap(getKundenDatenMitGeoDatenDieZuZiehenSind(1, connection));

        case 7:
          resultLufa = _context8.sent;
          _context8.next = 10;
          return regeneratorRuntime.awrap(getKundenDatenMitGeoDatenDieZuZiehenSind(2, connection));

        case 10:
          resultclaas = _context8.sent;
          _context8.next = 13;
          return regeneratorRuntime.awrap(getKundenDatenMitGeoDatenDieZuZiehenSind(3, connection));

        case 13:
          resultgsagri = _context8.sent;
          _context8.next = 16;
          return regeneratorRuntime.awrap(getKundenDatenMitGeoDatenDieZuZiehenSind(4, connection));

        case 16:
          resultlwkniedersachsen = _context8.sent;
          _context8.next = 19;
          return regeneratorRuntime.awrap(getKundenDatenMitGeoDatenDieZuZiehenSind(5, connection));

        case 19:
          resultmaehlmann = _context8.sent;
          _context8.next = 22;
          return regeneratorRuntime.awrap(getKundenDatenMitGeoDatenDieZuZiehenSind(6, connection));

        case 22:
          resultsonsttiges = _context8.sent;
          resultsKundendaten.lufa = resultLufa;
          resultsKundendaten.claas = resultclaas;
          resultsKundendaten.gsagri = resultgsagri;
          resultsKundendaten.lwkniedersachsen = resultlwkniedersachsen;
          resultsKundendaten.maehlmann = resultmaehlmann;
          resultsKundendaten.sonstiges = resultsonsttiges;
          return _context8.abrupt("return", resultsKundendaten);

        case 32:
          _context8.prev = 32;
          _context8.t0 = _context8["catch"](1);
          console.error('Ouch!', _context8.t0);

        case 35:
          _context8.prev = 35;

          if (!connection) {
            _context8.next = 39;
            break;
          }

          _context8.next = 39;
          return regeneratorRuntime.awrap(connection.end());

        case 39:
          return _context8.finish(35);

        case 40:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[1, 32, 35, 40]]);
}

function getKundendaten() {
  var connection, resultsKundendaten, resultLufa, resultclaas, resultgsagri, resultlwkniedersachsen, resultmaehlmann, resultsonsttiges;
  return regeneratorRuntime.async(function getKundendaten$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          resultsKundendaten = {
            lufa: [],
            claas: [],
            gsagri: [],
            lwkniedersachsen: [],
            maehlmann: [],
            sonstiges: []
          };
          _context9.prev = 1;
          _context9.next = 4;
          return regeneratorRuntime.awrap(mysql.createConnection(config));

        case 4:
          connection = _context9.sent;
          _context9.next = 7;
          return regeneratorRuntime.awrap(getKundenDatenMitGeoDaten(1, connection));

        case 7:
          resultLufa = _context9.sent;
          _context9.next = 10;
          return regeneratorRuntime.awrap(getKundenDatenMitGeoDaten(2, connection));

        case 10:
          resultclaas = _context9.sent;
          _context9.next = 13;
          return regeneratorRuntime.awrap(getKundenDatenMitGeoDaten(3, connection));

        case 13:
          resultgsagri = _context9.sent;
          _context9.next = 16;
          return regeneratorRuntime.awrap(getKundenDatenMitGeoDaten(4, connection));

        case 16:
          resultlwkniedersachsen = _context9.sent;
          _context9.next = 19;
          return regeneratorRuntime.awrap(getKundenDatenMitGeoDaten(5, connection));

        case 19:
          resultmaehlmann = _context9.sent;
          _context9.next = 22;
          return regeneratorRuntime.awrap(getKundenDatenMitGeoDaten(6, connection));

        case 22:
          resultsonsttiges = _context9.sent;
          resultsKundendaten.lufa = resultLufa;
          resultsKundendaten.claas = resultclaas;
          resultsKundendaten.gsagri = resultgsagri;
          resultsKundendaten.lwkniedersachsen = resultlwkniedersachsen;
          resultsKundendaten.maehlmann = resultmaehlmann;
          resultsKundendaten.sonstiges = resultsonsttiges;
          return _context9.abrupt("return", resultsKundendaten);

        case 32:
          _context9.prev = 32;
          _context9.t0 = _context9["catch"](1);
          console.error('Ouch!', _context9.t0);

        case 35:
          _context9.prev = 35;

          if (!connection) {
            _context9.next = 39;
            break;
          }

          _context9.next = 39;
          return regeneratorRuntime.awrap(connection.end());

        case 39:
          return _context9.finish(35);

        case 40:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[1, 32, 35, 40]]);
}

function getKundenDatenMitGeoDaten(geoID) {
  var connection, _ref23, _ref24, rows;

  return regeneratorRuntime.async(function getKundenDatenMitGeoDaten$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _context10.prev = 0;
          _context10.next = 3;
          return regeneratorRuntime.awrap(mysql.createConnection(config));

        case 3:
          connection = _context10.sent;
          _context10.next = 6;
          return regeneratorRuntime.awrap(connection.execute("\n    SELECT KUNDE.KUNDENNUMMER,\n    KUNDE.VORNAME,\n    KUNDE.NACHNAME,\n    KUNDE.E_MAIL,\n    KUNDE.TELEFONNUMMER,\n    ADRESSE.ORT, BESTELLUNG.ANZAHLPOSITIONEN AS AnzahlFlaechen\n    FROM KUNDE\n    Join BESTELLUNG  on kunde.KUNDENNUMMER = BESTELLUNG.KUNDENNUMMER\n      JOIN\n    KUNDE_HAT_ADRESSE ON KUNDE.KUNDENNUMMER = KUNDE_HAT_ADRESSE.KUNDENNUMMER\n    JOIN\n    ADRESSE ON KUNDE_HAT_ADRESSE.STRASSE = ADRESSE.STRASSE\n    AND KUNDE_HAT_ADRESSE.ORT = ADRESSE.ORT\n    AND KUNDE_HAT_ADRESSE.POSTLEITZAHL = ADRESSE.POSTLEITZAHL\n    AND KUNDE_HAT_ADRESSE.HAUSNUMMER = ADRESSE.HAUSNUMMER\n    LEFT JOIN\n    BESTELLUNG_ENTHAELT_PRODUKT B ON BESTELLUNG.KUNDENNUMMER = B.KUNDENNUMMER\n    LEFT JOIN\n    PRODUKT P ON B.ARTIKELNR = P.ARTIKELNR\n    WHERE\n    GEODATENGEBERID = ?\n    GROUP BY\n    KUNDE.KUNDENNUMMER, ADRESSE.ORT, KUNDE.TELEFONNUMMER, KUNDE.VORNAME, KUNDE.NACHNAME, KUNDE.E_MAIL\n    ORDER BY\n    KUNDENNUMMER;\n    ", [geoID]));

        case 6:
          _ref23 = _context10.sent;
          _ref24 = _slicedToArray(_ref23, 1);
          rows = _ref24[0];
          return _context10.abrupt("return", rows);

        case 12:
          _context10.prev = 12;
          _context10.t0 = _context10["catch"](0);
          console.error('Ouch!', _context10.t0);

        case 15:
          _context10.prev = 15;

          if (!connection) {
            _context10.next = 19;
            break;
          }

          _context10.next = 19;
          return regeneratorRuntime.awrap(connection.end());

        case 19:
          return _context10.finish(15);

        case 20:
        case "end":
          return _context10.stop();
      }
    }
  }, null, null, [[0, 12, 15, 20]]);
}

function getMitarbeiterdaten() {
  var connection, results, _ref25, _ref26, rows;

  return regeneratorRuntime.async(function getMitarbeiterdaten$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          results = [];
          _context11.prev = 1;
          _context11.next = 4;
          return regeneratorRuntime.awrap(mysql.createConnection(config));

        case 4:
          connection = _context11.sent;
          _context11.next = 7;
          return regeneratorRuntime.awrap(connection.execute('SELECT * FROM MITARBEITER'));

        case 7:
          _ref25 = _context11.sent;
          _ref26 = _slicedToArray(_ref25, 1);
          rows = _ref26[0];
          results = rows;
          return _context11.abrupt("return", results);

        case 14:
          _context11.prev = 14;
          _context11.t0 = _context11["catch"](1);
          console.error('Ouch!', _context11.t0);

        case 17:
          _context11.prev = 17;

          if (!connection) {
            _context11.next = 21;
            break;
          }

          _context11.next = 21;
          return regeneratorRuntime.awrap(connection.end());

        case 21:
          return _context11.finish(17);

        case 22:
        case "end":
          return _context11.stop();
      }
    }
  }, null, null, [[1, 14, 17, 22]]);
}

function createBestellung(userID, anzahlpositionen) {
  var connection, _ref27, _ref28, hatBestellung;

  return regeneratorRuntime.async(function createBestellung$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          _context12.prev = 0;
          _context12.next = 3;
          return regeneratorRuntime.awrap(mysql.createConnection(config));

        case 3:
          connection = _context12.sent;
          _context12.next = 6;
          return regeneratorRuntime.awrap(connection.execute("SELECT KUNDENNUMMER FROM BESTELLUNG WHERE Kundennummer = ?", [userID]));

        case 6:
          _ref27 = _context12.sent;
          _ref28 = _slicedToArray(_ref27, 1);
          hatBestellung = _ref28[0];
          _context12.prev = 9;

          if (!(hatBestellung.length === 0)) {
            _context12.next = 15;
            break;
          }

          _context12.next = 13;
          return regeneratorRuntime.awrap(connection.execute('INSERT INTO BESTELLUNG(KUNDENNUMMER, ANZAHLPOSITIONEN, ZEITSTEMPEL) VALUES (?, ?, NOW())', [userID, anzahlpositionen]));

        case 13:
          _context12.next = 15;
          return regeneratorRuntime.awrap(connection.commit());

        case 15:
          _context12.next = 20;
          break;

        case 17:
          _context12.prev = 17;
          _context12.t0 = _context12["catch"](9);
          console.error('Fehler beim Einfügen: BESTELLUNG ' + _context12.t0.message);

        case 20:
          _context12.next = 25;
          break;

        case 22:
          _context12.prev = 22;
          _context12.t1 = _context12["catch"](0);
          console.log('Ouch!', _context12.t1);

        case 25:
          _context12.prev = 25;

          if (!connection) {
            _context12.next = 29;
            break;
          }

          _context12.next = 29;
          return regeneratorRuntime.awrap(connection.end());

        case 29:
          return _context12.finish(25);

        case 30:
        case "end":
          return _context12.stop();
      }
    }
  }, null, null, [[0, 22, 25, 30], [9, 17]]);
}

function anderPasswort(userID, passwordNewInput) {
  var connection;
  return regeneratorRuntime.async(function anderPasswort$(_context13) {
    while (1) {
      switch (_context13.prev = _context13.next) {
        case 0:
          _context13.prev = 0;
          _context13.next = 3;
          return regeneratorRuntime.awrap(mysql.createConnection(config));

        case 3:
          connection = _context13.sent;
          _context13.next = 6;
          return regeneratorRuntime.awrap(connection.execute('UPDATE MITARBEITER SET PASSWORD = ? WHERE PERSONALNUMMER = ?', [passwordNewInput, userID]));

        case 6:
          _context13.next = 8;
          return regeneratorRuntime.awrap(connection.commit());

        case 8:
          _context13.next = 13;
          break;

        case 10:
          _context13.prev = 10;
          _context13.t0 = _context13["catch"](0);
          console.log('Ouch!', _context13.t0);

        case 13:
          _context13.prev = 13;

          if (!connection) {
            _context13.next = 17;
            break;
          }

          _context13.next = 17;
          return regeneratorRuntime.awrap(connection.end());

        case 17:
          return _context13.finish(13);

        case 18:
        case "end":
          return _context13.stop();
      }
    }
  }, null, null, [[0, 10, 13, 18]]);
}

function registerUserWithFleachen(kundennummer, email, telefonnummer, password, vorname, nachname, geburtsdatum, ort, plz, strasse, hausnummer, selectedOption) {
  var connection, maxKundennummer, result, result4, statusCode;
  return regeneratorRuntime.async(function registerUserWithFleachen$(_context14) {
    while (1) {
      switch (_context14.prev = _context14.next) {
        case 0:
          _context14.next = 2;
          return regeneratorRuntime.awrap(mysql.createConnection(config));

        case 2:
          connection = _context14.sent;
          _context14.prev = 3;

          if (!(selectedOption > 1 && kundennummer === undefined)) {
            _context14.next = 9;
            break;
          }

          _context14.next = 7;
          return regeneratorRuntime.awrap(connection.execute('SELECT MAX(KUNDENNUMMER) AS MAXKUNDENNUMMER FROM KUNDE WHERE GEODATENGEBERID  != 1'));

        case 7:
          maxKundennummer = _context14.sent;
          kundennummer = maxKundennummer[0][0].MAXKUNDENNUMMER + 1;

        case 9:
          _context14.next = 11;
          return regeneratorRuntime.awrap(connection.execute("INSERT INTO KUNDE (Kundennummer, E_MAIL, Telefonnummer, PASSWORD, VORNAME, NACHNAME, KundeSeit, GEODATENGEBERID) VALUES (?, ?, ?, ?, ?, ?, NOW(), ?)", [kundennummer, email, telefonnummer, password, vorname, nachname, selectedOption]));

        case 11:
          result = _context14.sent;
          ort = ort || 'null';
          plz = plz || 0;
          strasse = strasse || 'null';
          hausnummer = hausnummer || 0; // Check if ADRESSE schon vorhanden

          _context14.next = 18;
          return regeneratorRuntime.awrap(connection.execute('SELECT * FROM ADRESSE WHERE STRASSE = ? AND POSTLEITZAHL = ? AND HAUSNUMMER = ? AND ORT = ?', [strasse, plz, hausnummer, ort]));

        case 18:
          result4 = _context14.sent;

          if (!(result4[0].length > 0)) {
            _context14.next = 24;
            break;
          }

          _context14.next = 22;
          return regeneratorRuntime.awrap(connection.execute('UPDATE ADRESSE SET ISTRECHNUNGSADRESSE = 1, ISTLIEFERADRESSE = 1 WHERE STRASSE = ? AND POSTLEITZAHL = ? AND HAUSNUMMER = ? AND ORT = ?', [strasse, plz, hausnummer, ort]));

        case 22:
          _context14.next = 26;
          break;

        case 24:
          _context14.next = 26;
          return regeneratorRuntime.awrap(connection.execute("INSERT INTO ADRESSE (STRASSE, POSTLEITZAHL, HAUSNUMMER, ORT, ISTWOHNADRESSE, ISTRECHNUNGSADRESSE, ISTLIEFERADRESSE, ISTSTANDORTSADRESSE) VALUES (?, ?, ?, ?, 0, 1, 1, 0)", [strasse, plz, hausnummer, ort]));

        case 26:
          _context14.next = 28;
          return regeneratorRuntime.awrap(connection.execute("INSERT INTO KUNDE_HAT_ADRESSE (KUNDENNUMMER, STRASSE, POSTLEITZAHL, HAUSNUMMER, ORT) VALUES (?, ?, ?, ?, ?)", [kundennummer, strasse, plz, hausnummer, ort]));

        case 28:
          _context14.next = 30;
          return regeneratorRuntime.awrap(connection.commit());

        case 30:
          return _context14.abrupt("return", {
            kundennummer: kundennummer
          });

        case 33:
          _context14.prev = 33;
          _context14.t0 = _context14["catch"](3);
          console.log('User could not be registered', _context14.t0);
          statusCode = 123;
          return _context14.abrupt("return", {
            kundennummer: kundennummer,
            statusCode: statusCode
          });

        case 38:
          _context14.prev = 38;

          if (!connection) {
            _context14.next = 42;
            break;
          }

          _context14.next = 42;
          return regeneratorRuntime.awrap(connection.end());

        case 42:
          return _context14.finish(38);

        case 43:
        case "end":
          return _context14.stop();
      }
    }
  }, null, null, [[3, 33, 38, 43]]);
}

function getUserByEmail(email) {
  var conn, user, connection, _ref29, _ref30, rows, fields, _user;

  return regeneratorRuntime.async(function getUserByEmail$(_context15) {
    while (1) {
      switch (_context15.prev = _context15.next) {
        case 0:
          user = {
            email: null,
            password: null,
            id: null
          };
          _context15.prev = 1;
          _context15.next = 4;
          return regeneratorRuntime.awrap(mysql.createConnection(config));

        case 4:
          connection = _context15.sent;
          _context15.next = 7;
          return regeneratorRuntime.awrap(connection.execute('SELECT E_MAIL, PASSWORD, Personalnummer FROM MITARBEITER WHERE E_MAIL = ?', [email]));

        case 7:
          _ref29 = _context15.sent;
          _ref30 = _slicedToArray(_ref29, 2);
          rows = _ref30[0];
          fields = _ref30[1];
          _user = {};

          if (rows.length > 0) {
            _user.email = rows[0].E_MAIL;
            _user.password = rows[0].PASSWORD;
            _user.id = rows[0].Personalnummer;
          }

          return _context15.abrupt("return", _user);

        case 16:
          _context15.prev = 16;
          _context15.t0 = _context15["catch"](1);
          console.log('Error Reading User', _context15.t0);
          throw _context15.t0;

        case 20:
          _context15.prev = 20;

          if (!conn) {
            _context15.next = 24;
            break;
          }

          _context15.next = 24;
          return regeneratorRuntime.awrap(conn.close());

        case 24:
          return _context15.finish(20);

        case 25:
        case "end":
          return _context15.stop();
      }
    }
  }, null, null, [[1, 16, 20, 25]]);
}

function getUserById(id) {
  var connection, _ref31, _ref32, rows, fields, user;

  return regeneratorRuntime.async(function getUserById$(_context16) {
    while (1) {
      switch (_context16.prev = _context16.next) {
        case 0:
          _context16.next = 2;
          return regeneratorRuntime.awrap(mysql.createConnection(config));

        case 2:
          connection = _context16.sent;
          _context16.prev = 3;
          _context16.next = 6;
          return regeneratorRuntime.awrap(connection.execute('SELECT E_MAIL, PASSWORD, KUNDENNUMMER FROM KUNDE WHERE Kundennummer = ?', [id]));

        case 6:
          _ref31 = _context16.sent;
          _ref32 = _slicedToArray(_ref31, 2);
          rows = _ref32[0];
          fields = _ref32[1];
          // Hier kannst du deine Logik für die Verarbeitung der MySQL-Ergebnisse implementieren
          user = {};

          if (rows.length > 0) {
            user.email = rows[0].E_MAIL;
            user.password = rows[0].PASSWORD;
            user.id = rows[0].KUNDENNUMMER;
          }

          return _context16.abrupt("return", user);

        case 15:
          _context16.prev = 15;
          _context16.t0 = _context16["catch"](3);
          console.log('Error Reading User', _context16.t0);
          throw _context16.t0;

        case 19:
          _context16.prev = 19;
          _context16.next = 22;
          return regeneratorRuntime.awrap(connection.end());

        case 22:
          return _context16.finish(19);

        case 23:
        case "end":
          return _context16.stop();
      }
    }
  }, null, null, [[3, 15, 19, 23]]);
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


function beiEinemKundenDieFleachenHinzufügen(uebergebeneInformation) {
  var connection, _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, fleachenInformationen, result, j, position;

  return regeneratorRuntime.async(function beiEinemKundenDieFleachenHinzufügen$(_context17) {
    while (1) {
      switch (_context17.prev = _context17.next) {
        case 0:
          _context17.prev = 0;
          _context17.next = 3;
          return regeneratorRuntime.awrap(mysql.createConnection(config));

        case 3:
          connection = _context17.sent;
          _iteratorNormalCompletion4 = true;
          _didIteratorError4 = false;
          _iteratorError4 = undefined;
          _context17.prev = 7;
          _iterator4 = uebergebeneInformation[Symbol.iterator]();

        case 9:
          if (_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done) {
            _context17.next = 48;
            break;
          }

          fleachenInformationen = _step4.value;

          if (!(fleachenInformationen.productid === 'undefinedundefinedundefined')) {
            _context17.next = 16;
            break;
          }

          _context17.next = 14;
          return regeneratorRuntime.awrap(connection.execute('SELECT MAX(ARTIKELNR) FROM PRODUKT WHERE Kundennummer = ?', [fleachenInformationen.USERID]));

        case 14:
          result = _context17.sent;
          fleachenInformationen.productid = result[0][0] + 1;

        case 16:
          _context17.next = 18;
          return regeneratorRuntime.awrap(connection.execute("INSERT INTO PRODUKT (ARTIKELNR, FLAECHENNAME, preis, FOTO, FLEACHENART, Kundennummer, BEARBEITUNGSARTID) VALUES (?, ?, 7, ?, ?, ?, ?)", [fleachenInformationen.productid, fleachenInformationen.flaechenname, fleachenInformationen.imageElement, fleachenInformationen.fleachenart, fleachenInformationen.USERID, fleachenInformationen.selectedOptionWinterung]));

        case 18:
          _context17.next = 20;
          return regeneratorRuntime.awrap(connection.execute("INSERT INTO PRODUKT_ENTHAELT_TIEFE (ARTIKELNR, TIEFENID, KUNDENNUMMER) VALUES (?, ?, ?)", [fleachenInformationen.productid, fleachenInformationen.tiefenValue, fleachenInformationen.USERID]));

        case 20:
          if (!(fleachenInformationen.MangatValue === 'j')) {
            _context17.next = 23;
            break;
          }

          _context17.next = 23;
          return regeneratorRuntime.awrap(connection.execute("INSERT INTO PRODUKT_ENTHAELT_PROBE (ArtikelNr, PROBENARTID, PROBENSTATUS, Kundennummer) VALUES (?, 1, 1, ?)", [fleachenInformationen.productid, fleachenInformationen.USERID]));

        case 23:
          if (!(fleachenInformationen.EminValue === 'j')) {
            _context17.next = 26;
            break;
          }

          _context17.next = 26;
          return regeneratorRuntime.awrap(connection.execute("INSERT INTO PRODUKT_ENTHAELT_PROBE (ArtikelNr, PROBENARTID, PROBENSTATUS, Kundennummer) VALUES (?, 1, 1, ?)", [fleachenInformationen.productid, fleachenInformationen.USERID]));

        case 26:
          if (!(fleachenInformationen.StickstoffValue >= 2 && fleachenInformationen.StickstoffValue <= 4)) {
            _context17.next = 29;
            break;
          }

          _context17.next = 29;
          return regeneratorRuntime.awrap(connection.execute("INSERT INTO PRODUKT_ENTHAELT_PROBE (ArtikelNr, PROBENARTID, PROBENSTATUS, Kundennummer) VALUES (?, ?, 1, ?)", [fleachenInformationen.productid, fleachenInformationen.StickstoffValue, fleachenInformationen.USERID]));

        case 29:
          j = 0;

        case 30:
          if (!(j < fleachenInformationen.coordinates.length)) {
            _context17.next = 43;
            break;
          }

          _context17.prev = 31;
          position = j + 1;
          _context17.next = 35;
          return regeneratorRuntime.awrap(connection.execute("INSERT INTO FLEACHENKOORDINATE (FKOORDINATENIDLAT, FKOORDINATENIDLNG, ARTIKELNR, POSITIONSPUNKT, Kundennummer) VALUES (?, ?, ?, ?, ?)", [fleachenInformationen.coordinates[j][0], fleachenInformationen.coordinates[j][1], fleachenInformationen.productid, position, fleachenInformationen.USERID]));

        case 35:
          _context17.next = 40;
          break;

        case 37:
          _context17.prev = 37;
          _context17.t0 = _context17["catch"](31);
          return _context17.abrupt("break", 43);

        case 40:
          j++;
          _context17.next = 30;
          break;

        case 43:
          _context17.next = 45;
          return regeneratorRuntime.awrap(connection.execute('INSERT INTO BESTELLUNG_ENTHAELT_PRODUKT (KUNDENNUMMER, ARTIKELNR) VALUES (?, ?)', [fleachenInformationen.USERID, fleachenInformationen.productid]));

        case 45:
          _iteratorNormalCompletion4 = true;
          _context17.next = 9;
          break;

        case 48:
          _context17.next = 54;
          break;

        case 50:
          _context17.prev = 50;
          _context17.t1 = _context17["catch"](7);
          _didIteratorError4 = true;
          _iteratorError4 = _context17.t1;

        case 54:
          _context17.prev = 54;
          _context17.prev = 55;

          if (!_iteratorNormalCompletion4 && _iterator4["return"] != null) {
            _iterator4["return"]();
          }

        case 57:
          _context17.prev = 57;

          if (!_didIteratorError4) {
            _context17.next = 60;
            break;
          }

          throw _iteratorError4;

        case 60:
          return _context17.finish(57);

        case 61:
          return _context17.finish(54);

        case 62:
          _context17.next = 64;
          return regeneratorRuntime.awrap(connection.commit());

        case 64:
          _context17.next = 69;
          break;

        case 66:
          _context17.prev = 66;
          _context17.t2 = _context17["catch"](0);
          console.log('Ouch!', _context17.t2);

        case 69:
          _context17.prev = 69;

          if (!connection) {
            _context17.next = 73;
            break;
          }

          _context17.next = 73;
          return regeneratorRuntime.awrap(connection.end());

        case 73:
          return _context17.finish(69);

        case 74:
        case "end":
          return _context17.stop();
      }
    }
  }, null, null, [[0, 66, 69, 74], [7, 50, 54, 62], [31, 37], [55,, 57, 61]]);
}

function beiMehrerenKundenDieFleachenHinzufügen(res, uebergebeneInformation) {
  var connection, _iteratorNormalCompletion5, _didIteratorError5, _iteratorError5, _iterator5, _step5, einzelneInformationen, _result, result1, ort, plz, strasse, hausnummer, result4, result3, result, _iteratorNormalCompletion6, _didIteratorError6, _iteratorError6, _iterator6, _step6, fleachenInformationen, _result2, j, position;

  return regeneratorRuntime.async(function beiMehrerenKundenDieFleachenHinzufügen$(_context18) {
    while (1) {
      switch (_context18.prev = _context18.next) {
        case 0:
          _context18.prev = 0;
          _context18.next = 3;
          return regeneratorRuntime.awrap(mysql.createConnection(config));

        case 3:
          connection = _context18.sent;
          _iteratorNormalCompletion5 = true;
          _didIteratorError5 = false;
          _iteratorError5 = undefined;
          _context18.prev = 7;
          _iterator5 = uebergebeneInformation[Symbol.iterator]();

        case 9:
          if (_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done) {
            _context18.next = 116;
            break;
          }

          einzelneInformationen = _step5.value;

          if (!(einzelneInformationen[0].selectedOption > 1)) {
            _context18.next = 16;
            break;
          }

          _context18.next = 14;
          return regeneratorRuntime.awrap(connection.execute('SELECT MAX(KUNDENNUMMER) FROM KUNDE WHERE GEODATENGEBERID  != 1'));

        case 14:
          _result = _context18.sent;
          einzelneInformationen[0].USERID = _result[0]['MAX(KUNDENNUMMER)'] + 1;

        case 16:
          _context18.next = 18;
          return regeneratorRuntime.awrap(connection.execute("INSERT INTO KUNDE (Kundennummer, KundeSeit, GEODATENGEBERID) VALUES (?, NOW(), ?)", [einzelneInformationen[0].USERID, einzelneInformationen[0].selectedOption]));

        case 18:
          result1 = _context18.sent;
          ort = 'null';
          plz = 0;
          strasse = 'null';
          hausnummer = 0;
          _context18.next = 25;
          return regeneratorRuntime.awrap(connection.execute('SELECT * FROM ADRESSE WHERE STRASSE = ? AND POSTLEITZAHL = ? AND HAUSNUMMER = ? AND ORT = ?', [strasse, plz, hausnummer, ort]));

        case 25:
          result4 = _context18.sent;

          if (!(result4.length > 0)) {
            _context18.next = 31;
            break;
          }

          _context18.next = 29;
          return regeneratorRuntime.awrap(connection.execute('UPDATE ADRESSE SET ISTRECHNUNGSADRESSE=1, ISTLIEFERADRESSE=1'));

        case 29:
          _context18.next = 33;
          break;

        case 31:
          _context18.next = 33;
          return regeneratorRuntime.awrap(connection.execute("INSERT INTO ADRESSE (STRASSE, POSTLEITZAHL, HAUSNUMMER, ORT, ISTWOHNADRESSE, ISTRECHNUNGSADRESSE, ISTLIEFERADRESSE, ISTSTANDORTSADRESSE) VALUES (?, ?, ?, ?, 0, 1, 1, 0)", [strasse, plz, hausnummer, ort]));

        case 33:
          _context18.next = 35;
          return regeneratorRuntime.awrap(connection.execute("INSERT INTO KUNDE_HAT_ADRESSE (KUNDENNUMMER, STRASSE, POSTLEITZAHL, HAUSNUMMER, ORT) VALUES (?, ?, ?, ?, ?)", [einzelneInformationen[0].USERID, strasse, plz, hausnummer, ort]));

        case 35:
          result3 = _context18.sent;
          _context18.next = 38;
          return regeneratorRuntime.awrap(connection.execute("SELECT KUNDENNUMMER FROM BESTELLUNG WHERE Kundennummer = ?", [einzelneInformationen[0].USERID]));

        case 38:
          result = _context18.sent;

          if (!(result[0].length === 0)) {
            _context18.next = 42;
            break;
          }

          _context18.next = 42;
          return regeneratorRuntime.awrap(connection.execute('INSERT INTO BESTELLUNG(KUNDENNUMMER, ZEITSTEMPEL) VALUES (?, NOW())', [einzelneInformationen[0].USERID]));

        case 42:
          _iteratorNormalCompletion6 = true;
          _didIteratorError6 = false;
          _iteratorError6 = undefined;
          _context18.prev = 45;
          _iterator6 = einzelneInformationen[Symbol.iterator]();

        case 47:
          if (_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done) {
            _context18.next = 99;
            break;
          }

          fleachenInformationen = _step6.value;
          fleachenInformationen.USERID = einzelneInformationen[0].USERID;

          if (!(fleachenInformationen.productid === 'undefinedundefinedundefined')) {
            _context18.next = 57;
            break;
          }

          _context18.next = 53;
          return regeneratorRuntime.awrap(connection.execute('SELECT MAX(ARTIKELNR) FROM PRODUKT WHERE Kundennummer = ?', [fleachenInformationen.USERID]));

        case 53:
          _result2 = _context18.sent;
          fleachenInformationen.productid = _result2[0]['MAX(ARTIKELNR)'];

          if (fleachenInformationen.productid === null) {
            fleachenInformationen.productid = 0;
          }

          fleachenInformationen.productid = '' + fleachenInformationen.USERID + '' + (fleachenInformationen.productid + 1) + '';

        case 57:
          _context18.next = 59;
          return regeneratorRuntime.awrap(connection.execute("INSERT INTO PRODUKT (ARTIKELNR, FLAECHENNAME, preis, FOTO, FLEACHENART, Kundennummer, BEARBEITUNGSARTID) VALUES (?, ?, 7, ?, ?, ?, ?)", [fleachenInformationen.productid, fleachenInformationen.flaechenname, fleachenInformationen.imageElement, fleachenInformationen.fleachenart, fleachenInformationen.USERID, fleachenInformationen.selectedOptionWinterung]));

        case 59:
          _context18.next = 61;
          return regeneratorRuntime.awrap(connection.execute("INSERT INTO PRODUKT_ENTHÄLT_TIEFE(ARTIKELNR, TIEFENID) VALUES (?, ?)", [fleachenInformationen.productid, fleachenInformationen.tiefenValue]));

        case 61:
          if (!(fleachenInformationen.MangatValue == 'j')) {
            _context18.next = 64;
            break;
          }

          _context18.next = 64;
          return regeneratorRuntime.awrap(connection.execute("INSERT INTO PRODUKT_ENTHAELT_PROBE(ArtikelNr, PROBENARTID, PROBENSTATUS) VALUES (?, 1, 1)", [fleachenInformationen.productid]));

        case 64:
          if (!(fleachenInformationen.EminValue == 'j')) {
            _context18.next = 67;
            break;
          }

          _context18.next = 67;
          return regeneratorRuntime.awrap(connection.execute("INSERT INTO PRODUKT_ENTHAELT_PROBE(ArtikelNr, PROBENARTID, PROBENSTATUS) VALUES (?, 1, 1)", [fleachenInformationen.productid]));

        case 67:
          if (!(fleachenInformationen.StickstoffValue == 2)) {
            _context18.next = 72;
            break;
          }

          _context18.next = 70;
          return regeneratorRuntime.awrap(connection.execute("INSERT INTO PRODUKT_ENTHAELT_PROBE(ArtikelNr, PROBENARTID, PROBENSTATUS) VALUES (?, 2, 1)", [fleachenInformationen.productid]));

        case 70:
          _context18.next = 80;
          break;

        case 72:
          if (!(fleachenInformationen.StickstoffValue == 3)) {
            _context18.next = 77;
            break;
          }

          _context18.next = 75;
          return regeneratorRuntime.awrap(connection.execute("INSERT INTO PRODUKT_ENTHAELT_PROBE(ArtikelNr, PROBENARTID, PROBENSTATUS) VALUES (?, 3, 1)", [fleachenInformationen.productid]));

        case 75:
          _context18.next = 80;
          break;

        case 77:
          if (!(fleachenInformationen.StickstoffValue == 4)) {
            _context18.next = 80;
            break;
          }

          _context18.next = 80;
          return regeneratorRuntime.awrap(connection.execute("INSERT INTO PRODUKT_ENTHAELT_PROBE(ArtikelNr, PROBENARTID, PROBENSTATUS) VALUES (?, 4, 1)", [fleachenInformationen.productid]));

        case 80:
          j = 0;

        case 81:
          if (!(j <= fleachenInformationen.coordinates.length)) {
            _context18.next = 94;
            break;
          }

          _context18.prev = 82;
          position = j + 1;
          _context18.next = 86;
          return regeneratorRuntime.awrap(connection.execute("INSERT INTO FLEACHENKOORDINATE(FKOORDINATENIDLAT, FKOORDINATENIDLNG, ARTIKELNR, POSITIONSPUNKT) VALUES (?, ?, ?, ?)", [fleachenInformationen.coordinates[j][0], fleachenInformationen.coordinates[j][1], fleachenInformationen.productid, position]));

        case 86:
          _context18.next = 91;
          break;

        case 88:
          _context18.prev = 88;
          _context18.t0 = _context18["catch"](82);
          return _context18.abrupt("break", 94);

        case 91:
          j++;
          _context18.next = 81;
          break;

        case 94:
          _context18.next = 96;
          return regeneratorRuntime.awrap(connection.execute('INSERT INTO BESTELLUNG_ENTHAELT_PRODUKT (KUNDENNUMMER, ARTIKELNR) VALUES (?, ?)', [fleachenInformationen.USERID, fleachenInformationen.productid]));

        case 96:
          _iteratorNormalCompletion6 = true;
          _context18.next = 47;
          break;

        case 99:
          _context18.next = 105;
          break;

        case 101:
          _context18.prev = 101;
          _context18.t1 = _context18["catch"](45);
          _didIteratorError6 = true;
          _iteratorError6 = _context18.t1;

        case 105:
          _context18.prev = 105;
          _context18.prev = 106;

          if (!_iteratorNormalCompletion6 && _iterator6["return"] != null) {
            _iterator6["return"]();
          }

        case 108:
          _context18.prev = 108;

          if (!_didIteratorError6) {
            _context18.next = 111;
            break;
          }

          throw _iteratorError6;

        case 111:
          return _context18.finish(108);

        case 112:
          return _context18.finish(105);

        case 113:
          _iteratorNormalCompletion5 = true;
          _context18.next = 9;
          break;

        case 116:
          _context18.next = 122;
          break;

        case 118:
          _context18.prev = 118;
          _context18.t2 = _context18["catch"](7);
          _didIteratorError5 = true;
          _iteratorError5 = _context18.t2;

        case 122:
          _context18.prev = 122;
          _context18.prev = 123;

          if (!_iteratorNormalCompletion5 && _iterator5["return"] != null) {
            _iterator5["return"]();
          }

        case 125:
          _context18.prev = 125;

          if (!_didIteratorError5) {
            _context18.next = 128;
            break;
          }

          throw _iteratorError5;

        case 128:
          return _context18.finish(125);

        case 129:
          return _context18.finish(122);

        case 130:
          _context18.next = 132;
          return regeneratorRuntime.awrap(connection.commit());

        case 132:
          return _context18.abrupt("return", 100);

        case 135:
          _context18.prev = 135;
          _context18.t3 = _context18["catch"](0);
          console.log('Ouch!', _context18.t3);
          return _context18.abrupt("return", 123);

        case 139:
          _context18.prev = 139;

          if (!connection) {
            _context18.next = 143;
            break;
          }

          _context18.next = 143;
          return regeneratorRuntime.awrap(connection.end());

        case 143:
          return _context18.finish(139);

        case 144:
        case "end":
          return _context18.stop();
      }
    }
  }, null, null, [[0, 135, 139, 144], [7, 118, 122, 130], [45, 101, 105, 113], [82, 88], [106,, 108, 112], [123,, 125, 129]]);
}

function getkundenDatenVomAusgewaehltenUser(userID) {
  var connection, _ref33, _ref34, result;

  return regeneratorRuntime.async(function getkundenDatenVomAusgewaehltenUser$(_context19) {
    while (1) {
      switch (_context19.prev = _context19.next) {
        case 0:
          _context19.prev = 0;
          _context19.next = 3;
          return regeneratorRuntime.awrap(mysql.createConnection(config));

        case 3:
          connection = _context19.sent;
          _context19.next = 6;
          return regeneratorRuntime.awrap(connection.execute("\n      SELECT\n        KUNDE.KUNDENNUMMER,\n        KUNDE.VORNAME,\n        KUNDE.NACHNAME,\n        KUNDE.E_MAIL,\n        KUNDE.TELEFONNUMMER,\n        KUNDE.GEBURTSDATUM,\n        KUNDE.PASSWORD,\n        ADRESSE.ORT,\n        ADRESSE.POSTLEITZAHL,\n        ADRESSE.STRASSE,\n        ADRESSE.HAUSNUMMER\n      FROM\n        KUNDE\n      JOIN\n        KUNDE_HAT_ADRESSE ON KUNDE.KUNDENNUMMER = KUNDE_HAT_ADRESSE.KUNDENNUMMER\n      JOIN\n        ADRESSE ON KUNDE_HAT_ADRESSE.STRASSE = ADRESSE.STRASSE\n        AND KUNDE_HAT_ADRESSE.ORT = ADRESSE.ORT\n        AND KUNDE_HAT_ADRESSE.POSTLEITZAHL = ADRESSE.POSTLEITZAHL\n        AND KUNDE_HAT_ADRESSE.HAUSNUMMER = ADRESSE.HAUSNUMMER\n      WHERE\n        KUNDE.KUNDENNUMMER = ?\n    ", [userID]));

        case 6:
          _ref33 = _context19.sent;
          _ref34 = _slicedToArray(_ref33, 1);
          result = _ref34[0];
          return _context19.abrupt("return", result[0]);

        case 12:
          _context19.prev = 12;
          _context19.t0 = _context19["catch"](0);
          console.error('Ouch!', _context19.t0);

        case 15:
          _context19.prev = 15;

          if (!connection) {
            _context19.next = 19;
            break;
          }

          _context19.next = 19;
          return regeneratorRuntime.awrap(connection.end());

        case 19:
          return _context19.finish(15);

        case 20:
        case "end":
          return _context19.stop();
      }
    }
  }, null, null, [[0, 12, 15, 20]]);
}

function getUpdateDatenVomKunden(kundennummer, vorname, nachname, email, telefonnummer, ort, plz, strasse, hausnummer, password, geburtsdatum) {
  var connection, _ref35, _ref36, result, _ref37, _ref38, result2, _ref39, _ref40, result3, _ref41, _ref42, result4, _ref43, _ref44, result5;

  return regeneratorRuntime.async(function getUpdateDatenVomKunden$(_context20) {
    while (1) {
      switch (_context20.prev = _context20.next) {
        case 0:
          _context20.prev = 0;
          _context20.next = 3;
          return regeneratorRuntime.awrap(mysql.createConnection(config));

        case 3:
          connection = _context20.sent;
          _context20.next = 6;
          return regeneratorRuntime.awrap(connection.execute('SELECT * FROM KUNDE WHERE KUNDENNUMMER = ?', [kundennummer]));

        case 6:
          _ref35 = _context20.sent;
          _ref36 = _slicedToArray(_ref35, 1);
          result = _ref36[0];
          _context20.next = 11;
          return regeneratorRuntime.awrap(connection.execute('UPDATE KUNDE SET VORNAME = ?, NACHNAME = ?, TELEFONNUMMER = ?, E_MAIL = ?, PASSWORD = ? WHERE KUNDENNUMMER = ?', [vorname, nachname, telefonnummer, email, password, kundennummer]));

        case 11:
          _ref37 = _context20.sent;
          _ref38 = _slicedToArray(_ref37, 1);
          result2 = _ref38[0];
          _context20.prev = 14;
          _context20.next = 17;
          return regeneratorRuntime.awrap(connection.execute('INSERT INTO ADRESSE (STRASSE, POSTLEITZAHL, HAUSNUMMER, ORT) VALUES (?, ?, ?, ?)', [strasse, plz, hausnummer, ort]));

        case 17:
          _ref39 = _context20.sent;
          _ref40 = _slicedToArray(_ref39, 1);
          result3 = _ref40[0];
          _context20.next = 24;
          break;

        case 22:
          _context20.prev = 22;
          _context20.t0 = _context20["catch"](14);

        case 24:
          _context20.next = 26;
          return regeneratorRuntime.awrap(connection.execute('DELETE FROM KUNDE_HAT_ADRESSE WHERE KUNDENNUMMER = ?', [kundennummer]));

        case 26:
          _ref41 = _context20.sent;
          _ref42 = _slicedToArray(_ref41, 1);
          result4 = _ref42[0];
          _context20.next = 31;
          return regeneratorRuntime.awrap(connection.execute('INSERT INTO KUNDE_HAT_ADRESSE(KUNDENNUMMER, STRASSE, POSTLEITZAHL, HAUSNUMMER, ORT) VALUES (?, ?, ?, ?, ?)', [kundennummer, strasse, plz, hausnummer, ort]));

        case 31:
          _ref43 = _context20.sent;
          _ref44 = _slicedToArray(_ref43, 1);
          result5 = _ref44[0];
          _context20.next = 36;
          return regeneratorRuntime.awrap(connection.commit());

        case 36:
          _context20.next = 41;
          break;

        case 38:
          _context20.prev = 38;
          _context20.t1 = _context20["catch"](0);
          console.log('Ouch!', _context20.t1);

        case 41:
          _context20.prev = 41;

          if (!connection) {
            _context20.next = 45;
            break;
          }

          _context20.next = 45;
          return regeneratorRuntime.awrap(connection.end());

        case 45:
          return _context20.finish(41);

        case 46:
        case "end":
          return _context20.stop();
      }
    }
  }, null, null, [[0, 38, 41, 46], [14, 22]]);
}

function kundenzumloeschen(kundennummer) {
  var connection;
  return regeneratorRuntime.async(function kundenzumloeschen$(_context21) {
    while (1) {
      switch (_context21.prev = _context21.next) {
        case 0:
          _context21.prev = 0;
          _context21.next = 3;
          return regeneratorRuntime.awrap(mysql.createConnection(config));

        case 3:
          connection = _context21.sent;
          _context21.next = 6;
          return regeneratorRuntime.awrap(connection.execute('delete from KUNDE where KUNDENNUMMER= ?', [kundennummer]));

        case 6:
          _context21.next = 8;
          return regeneratorRuntime.awrap(connection.commit());

        case 8:
          _context21.next = 13;
          break;

        case 10:
          _context21.prev = 10;
          _context21.t0 = _context21["catch"](0);
          console.log('Ouch!', _context21.t0);

        case 13:
          _context21.prev = 13;

          if (!connection) {
            _context21.next = 17;
            break;
          }

          _context21.next = 17;
          return regeneratorRuntime.awrap(connection.end());

        case 17:
          return _context21.finish(13);

        case 18:
        case "end":
          return _context21.stop();
      }
    }
  }, null, null, [[0, 10, 13, 18]]);
}

module.exports = {
  getUserByEmail: getUserByEmail,
  getUserById: getUserById,
  getfleachenFromAllUser: getfleachenFromAllUser,
  getKundendaten: getKundendaten,
  getKundendatenDieZuZiehenSind: getKundendatenDieZuZiehenSind,
  getMitarbeiterdaten: getMitarbeiterdaten,
  anderPasswort: anderPasswort,
  getInformationsForGenerateKmlFile: getInformationsForGenerateKmlFile,
  funktionFleacheSollBearbeitetWerden: funktionFleacheSollBearbeitetWerden,
  registerUserWithFleachen: registerUserWithFleachen,
  getBestllungenFromUser: getBestllungenFromUser,
  beiEinemKundenDieFleachenHinzufügen: beiEinemKundenDieFleachenHinzufügen,
  //getfleachenFromUser,
  getkundenDatenVomAusgewaehltenUser: getkundenDatenVomAusgewaehltenUser,
  getFleachenFromUserBestellt: getFleachenFromUserBestellt,
  createBestellung: createBestellung,
  beiMehrerenKundenDieFleachenHinzufügen: beiMehrerenKundenDieFleachenHinzufügen,
  ProbeWurdeGezogen: ProbeWurdeGezogen,
  getUpdateDatenVomKunden: getUpdateDatenVomKunden,
  kundenzumloeschen: kundenzumloeschen
};