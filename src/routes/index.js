const getAllProducts = require('../database/oracle').getAllProducts
var express = require('express');
const passport = require('passport');
var router = express.Router();
const bcrypt = require('bcrypt')
const registerUser = require('../database/oracle').registerUser
const KundendatenGET = require('../database/oracle').getKundendaten
const anderPasswort = require('../database/oracle').anderPasswort
const MitarbeiterdatenGET = require('../database/oracle').getMitarbeiterdaten


/* GET users listing. */
router.get('/', async function(req, res, next) {
    if(req.isAuthenticated()){
      var MitarbeiterdatenUebergabe = await MitarbeiterdatenGET()
      res.render('myAccount',{title: 'MyAccount',  MitarbeiterDaten: MitarbeiterdatenUebergabe, login: true})
    }
    res.render('index', { title: 'Bodenproben', login: false})
});

router.post('/login',passport.authenticate('local',{
    failureRedirect: '/',
    failureFlash: true,
}   ),(req,res)=>{
  req.flash('success', 'Erfolgreich eingeloggt')
  res.redirect('/cart')
})

router.delete('/logout', function(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      req.flash('success','Erfolgreich Ausgelogt')
      res.redirect('/');
    });
  });

router.put('/add', async (req,res) => {
  if(req.isAuthenticated()){
      const userID = req.user.id
      const passwordNewInput = req.body.passwordNewInput
      const passwordWiederholtInput = req.body.passwordWiederholtInput

      if(passwordNewInput === passwordWiederholtInput){

        const hashedPassword = await bcrypt.hash(passwordNewInput, 10)

        await anderPasswort(userID,hashedPassword)
        res.send(200)
      }
  }
})

module.exports = router;
