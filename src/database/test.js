const mysql = require('mysql2')

const config = {
    host: 'localhost', // oder die IP-Adresse deiner MySQL-Datenbank
    user: 'root',
    password: 'Malte.116',
    database: 'vonhoven',
};



const connection = mysql.createConnection(config);


connection.connect((err) => {
  if (err) {
    console.error('Fehler beim Verbinden zur MySgQL-Datenbank: ' + err.stack);
    return;
  }

  console.log('Erfolgreich mit der MySQL-Datenbank verbunden');
});



