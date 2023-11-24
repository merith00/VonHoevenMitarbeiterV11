var express = require('express');
const passport = require('passport');
var router = express.Router();
const bcrypt = require('bcrypt')
const registerUser = require('../database/oracle').registerUser
const MitarbeiterdatenGET = require('../database/oracle').getMitarbeiterdaten
const anderPasswort = require('../database/oracle').anderPasswort


var getNoticitcation = ''



router.get('/', async function(req, res, next) {



  if (req.isAuthenticated()) {
      const userID = req.user.id;
      try {
          // Use the provided function getMitarbeiterdaten() instead of MitarbeiterdatenGET()
          const Mitarbeiterdaten = await getMitarbeiterdaten();
          res.render('myAccount', { title: 'MyAccount', MitarbeiterDaten: Mitarbeiterdaten, Notification: getNoticitcation, login: true });
          getNoticitcation = '';
      } catch (err) {
          console.error('Error fetching Mitarbeiterdaten:', err);
          res.status(500).send('Internal Server Error');
      }
  } else {
      res.render('account', { title: 'Express', login: false });
  }
});



const authenticate = (req, res, next) => {
  return new Promise((resolve, reject) => {
    passport.authenticate('local', {
      failureRedirect: '/',
      failureFlash: true,
    })(req, res, (err) => {
      if (err) {
        console.error('Fehler bei der Authentifizierung:', err);
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

router.post('/login', async (req, res) => {
  try {
    await authenticate(req, res);
    req.flash('success', 'Erfolgreich eingeloggt');
    res.redirect('/cart');
  } catch (err) {
    const errorMessages = req.flash('error');
    res.render('account', { title: 'Express', login: false, errors: errorMessages });
  }
});


router.delete('/logout', function(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      req.flash('success','Erfolgreich Ausgelogt')
      res.redirect('/');
    });
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


router.put('/passworteandern', async (req, res) => {
  const userID = 2 //req.user.id;
  const { neuesPasswort, passwortWiederholen } = req.body;

  console.log('Neues Passwort auf Serverseite: ', neuesPasswort);
  console.log('Passwort wiederholen auf Serverseite: ', passwortWiederholen);

  if (neuesPasswort === passwortWiederholen) {
    try {
      const hashedPassword = await bcrypt.hash(passwortWiederholen, 10);
      console.log('hashpasswort' + hashedPassword);
      await anderPasswort(userID, hashedPassword);
      res.sendStatus(200);
    } catch(error){
      res.sendStatus(404)
    }
  } else {
    res.sendStatus(404)
  }
});






router.put('/add', async (req,res) => {
  console.log('hallo ')
  if(req.isAuthenticated()){
      const userID = req.user.id
      const passwordNewInput = req.body.neuesPasswort
      const passwordWiederholtInput = req.body.passwordWiederholtInput


      if(passwordNewInput === passwordWiederholtInput){

        const hashedPassword = await bcrypt.hash(passwordNewInput, 10)

        await anderPasswort(userID,hashedPassword)
        res.send(200)
      }
  }
})



module.exports = router;