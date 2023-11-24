








var express = require('express');
const passport = require('passport');
var router = express.Router();
const bcrypt = require('bcrypt')
const registerUser = require('../database/oracle').registerUser




const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));



/* GET users listing. */
router.get('/', function(req, res, next) {
    if(req.isAuthenticated()){
      res.render('myAccount',{title: 'MyAccount',login: true})
    }
    res.render('account', { title: 'Express',login: false}); //map
});

router.post('/login',passport.authenticate('local',{
    failureRedirect: '/account',
    failureFlash: true,
}),(req,res)=>{
  req.flash('success', 'Erfolgreich eingeloggt')
  res.redirect('/')
})

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

     await registerUser(req.body.email, hashedPassword,req.body.vorname, req.body.nachname,req.body.date,req.body.ort, req.body.plz, req.body.strasse, req.body.hausnummer)
    
     res.redirect('/account')

    } catch (error) {
    console.log(error)
     res.sendStatus(500)   
    }
})


function sendEmail() {
  // Hier AJAX-Anfrage senden
      var xhr = new XMLHttpRequest();
      xhr.open("POST", "/send-email", true);
      xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

      xhr.onload = function () {
        if (xhr.status === 200) {
          console.log("E-Mail gesendet.");
        } else {
          console.error("E-Mail konnte nicht gesendet werden.");
        }
      };

      xhr.onerror = function () {
        console.error("Fehler bei der Verbindung zum Server.");
      };

      xhr.send(JSON.stringify({
        to: "merithholtmann00@gmail.com",
        subject: "hallo",
        text: "hier ist die Email"
      }));
    }







app.listen(3567, () => {
  console.log('Server gestartet auf Port 3567');
});


app.post('/send-email', (req, res) => {
  const mailOptions = {
    from: 'DEINE_EMAIL@gmail.com',
    to: req.body.to,
    subject: req.body.subject,
    text: req.body.text
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      res.status(500).send('E-Mail konnte nicht gesendet werden.');
    } else {
      console.log('E-Mail gesendet:', info.response);
      res.status(200).send('E-Mail gesendet.');
    }
  });
});


module.exports = router;
