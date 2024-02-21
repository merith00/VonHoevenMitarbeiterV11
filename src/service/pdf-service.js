const { PDFDocument } = require('pdf-lib');
const fs = require('fs')

async function buildPDF(dataCallback, endCallback, documentInformation, zweitanschriftInformation) {
    const mergedPdfDoc = await PDFDocument.create();
    var pdfBytes = fs.readFileSync('Untersuchungsauftrag.pdf');
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const form = pdfDoc.getForm();



    for (let i = 0; i < documentInformation.fleachenInformationen.length; i++) {
      form.getFields()[9].setText(documentInformation.kundenInformation.NACHNAME +', ' + documentInformation.kundenInformation.VORNAME);
      form.getFields()[8].setText(documentInformation.kundenInformation.STRASSE +', ' + documentInformation.kundenInformation.HAUSNUMMER);
      form.getFields()[7].setText(documentInformation.kundenInformation.POSTLEITZAHL +', ' + documentInformation.kundenInformation.ORT);
      form.getFields()[6].setText(''+(documentInformation.kundenInformation.TELEFONNUMMER)+'');
      form.getFields()[5].setText(documentInformation.kundenInformation.E_MAIL);
      form.getFields()[11].setText(''+documentInformation.kundenInformation.KUNDENNUMMER+'');

      if(zweitanschriftInformation != 0){
        form.getFields()[0].setText(zweitanschriftInformation.VORANSCHRIFT + ' ' + zweitanschriftInformation.NACHNAME +', ' +zweitanschriftInformation.VORNAME);
        form.getFields()[1].setText(zweitanschriftInformation.STRASSE +', ' +zweitanschriftInformation.HAUSNUMMER);
        form.getFields()[2].setText(zweitanschriftInformation.POSTLEITZAHL +', ' +zweitanschriftInformation.ORT);
        form.getFields()[4].setText(''+(zweitanschriftInformation.E_MAIL)+'');
      }

      if(documentInformation.kundenInformation.GEODATENGEBERID === 3){
        form.getCheckBox('Kontrollkästchen 20127').check()
        form.getCheckBox('Kontrollkästchen 20126').uncheck()
        form.getCheckBox('Kontrollkästchen 20120').check() //Nein Abrechnung Probenahme
        form.getCheckBox('Kontrollkästchen 20119').uncheck() //Ja Abrechnung Probenahme
      } else {
        form.getCheckBox('Kontrollkästchen 20127').uncheck()
        form.getCheckBox('Kontrollkästchen 20126').check()
        form.getCheckBox('Kontrollkästchen 20120').uncheck() //Nein Abrechnung Probenahme
        form.getCheckBox('Kontrollkästchen 20119').check() //Ja Abrechnung Probenahme
      }










      form.getFields()[31].setText(documentInformation.fleachenInformationen[i].ARTIKELNR+', '+ documentInformation.fleachenInformationen[i].FLAECHENNAME);

      if(documentInformation.fleachenInformationen[i].TIEFENID === 2){
        form.getCheckBox('Kontrollkästchen 20123').uncheck() //60-90cm tiefe
      } else{
        form.getCheckBox('Kontrollkästchen 20123').check() //60-90cm tiefe
      }

      await pdfDoc.save();
      const pages = await mergedPdfDoc.copyPages(pdfDoc, [0]);
      pages.forEach((page) => {
          mergedPdfDoc.addPage(page);
      });
    }

    pdfBytes = await mergedPdfDoc.save();
    dataCallback(pdfBytes);
    endCallback();
}

module.exports = { buildPDF };
