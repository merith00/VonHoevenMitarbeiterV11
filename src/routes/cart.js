var express = require('express');
const passport = require('passport');
var router = express.Router();
const getfleachenFromAllUser = require('../database/oracle').getfleachenFromAllUser




router.get('/fleachen', async (req,res)=>{
    if(req.isAuthenticated()){
        const userID = req.user.id
        const fleachenFromUser = await getfleachenFromUser(userID)
        return fleachenFromUser
    }else{
      res.sendStatus(401)
    }
})






router.get('/', async function(req, res) {
    if(req.isAuthenticated()){
        const userID = req.user.id
        var fleachenFromUser = await getfleachenFromAllUser()
        if(fleachenFromUser.length > 0){
            return res.render('cart', { title: 'Express', dieUserID: userID, Fleachen: fleachenFromUser, login: true })
        } else {
            return res.render('cart', { title: 'Express', dieUserID: userID, Fleachen: -1, login: true })
        }
    }
    return res.render('', { title: 'Express', login: false });
});




router.post('/login',passport.authenticate('local',{
    failureRedirect: '/',
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






module.exports = router;