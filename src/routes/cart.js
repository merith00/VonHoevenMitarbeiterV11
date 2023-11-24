var express = require('express');
const passport = require('passport');
var router = express.Router();
const bcrypt = require('bcrypt')
const registerUser = require('../database/oracle').registerUser
const putToCart = require('../database/oracle').putToCart
const getCartFromUser = require('../database/oracle').getCartFromUser
const getfleachenFromAllUser = require('../database/oracle').getfleachenFromAllUser
const getCartSuggestions = require('../database/oracle').getCartSuggestions
const deleteFromCart = require('../database/oracle').deleteFromCart
const initiateOrder = require('../database/oracle').initiateOrder
const getFleachenFromUserBestellt = require('../database/oracle').getFleachenFromUserBestellt
const getClobHier = require('../database/oracle').getClobWaren  




router.get('/fleachen', async (req,res)=>{
    if(req.isAuthenticated()){
        const userID = req.user.id
        const fleachenFromUser = await getfleachenFromUser(userID)
        return fleachenFromUser
    }else{
      res.sendStatus(401)
    }
})






router.get('/', async function(req, res, next) {
    if(req.isAuthenticated()){
        const userID = req.user.id
        var fleachenFromUser = await getfleachenFromAllUser()
        if(fleachenFromUser.length > 0){
            res.render('cart', { title: 'Express', dieUserID: userID, Fleachen: fleachenFromUser, login: true })
        } else {
            res.render('cart', { title: 'Express', dieUserID: userID, Fleachen: -1, login: true })
        }
    }
    res.render('', { title: 'Express', login: false});
});


router.delete('/', async (req,res) =>{
    if(req.isAuthenticated()){
        await deleteFromCart(req.user.id, req.body.productid)
        res.sendStatus(200)
    }else{
        res.sendStatus(401)
    }
})

router.post('/', async (req,res)=>{
    if(req.isAuthenticated()){
       await initiateOrder(req.user.id)
        res.sendStatus(200)
    }else{
      res.sendStatus(401)
    }
})



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


router.post('/add', async (req,res) => {

    if(req.isAuthenticated()){
        userID = req.user.id
        productID = req.body.productid
        await putToCart(userID,productID,req.body.flaechenname)
        res.redirect('/cart')
        status=200;
    }
    res.redirect('/cart')

    .then(response => response.status)
    .then(status => handleResponse(status))
    .catch(error => console.error('Error:', error));

})


router.put('/add', async (req,res) => {
    if(req.isAuthenticated()){
        userID = req.user.id
        productID = req.body.productid
        fleachenname = req.body.productID
        const flaechenname = req.body.flaechenname
        const dateValue = req.body.dateValue
        const coordinates = req.body.coordinates
        const imageElement = req.body.imageElement
        const EminValue = req.body.EminValue
        const MangatValue = req.body.MangatValue
        const StickstoffValue = req.body.StickstoffValue
        const fleachenartValue = req.body.fleachenart
        const gettiefenValue = req.body.tiefenValue


        await putToCart(userID,productID,flaechenname, dateValue,EminValue,MangatValue,StickstoffValue,coordinates,imageElement,fleachenartValue,gettiefenValue)
        res.send(200)
    }
})


module.exports = router;