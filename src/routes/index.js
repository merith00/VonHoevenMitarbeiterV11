var express = require('express');
const passport = require('passport');
var router = express.Router();
const bcrypt = require('bcrypt');
const anderPasswort = require('../database/oracle').anderPasswort;
const getMitarbeiterdaten = require('../database/oracle').getMitarbeiterdaten;

/* GET users listing. */
router.get('/', async function(req, res, next) {
  var userId = null;
  try {
    userId = req.session.passport.user;
  } catch (error) {}

  if (req.isAuthenticated()) {
    const MitarbeiterdatenUebergabe = await getMitarbeiterdaten();
    res.render('myAccount', {
      title: 'MyAccount',
      USERID: userId,
      MitarbeiterDaten: MitarbeiterdatenUebergabe,
      login: true,
    });
    return;
  }
  res.render('index', { title: 'Bodenproben', login: false });
});

// Neuer Code: Hinzufügen des Logout-Event-Listeners
router.get('/logout', function(req, res, next) {
  // Hier kannst du zusätzliche Aktionen für das Abmelden durchführen, wenn das Tab geschlossen wird
  console.info('Benutzer wird abgemeldet...');

  req.logout(function(err) {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

router.post('/login', passport.authenticate('local', {
  failureRedirect: '/',
  failureFlash: true,
}), (req, res) => {
  res.redirect('/products/9202');
});

router.delete('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

router.put('/passworteandern', async (req, res) => {
  const { neuesPasswort, passwortWiederholen, USERID } = req.body;
  if (neuesPasswort === passwortWiederholen) {
    try {
      const hashedPassword = await bcrypt.hash(passwortWiederholen, 10);
      await anderPasswort(USERID, hashedPassword);
      res.sendStatus(200);
    } catch (error) {
      res.sendStatus(404);
    }
  } else {
    res.sendStatus(404);
  }
});

module.exports = router;
