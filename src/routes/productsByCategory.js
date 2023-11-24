var express = require('express');
const passport = require('passport');
var router = express.Router();
const bcrypt = require('bcrypt')
const registerUser = require('../database/oracle').registerUser
const putToCart = require('../database/oracle').putToCart
const getCartFromUser = require('../database/oracle').getCartFromUser
const getBestllungenFromUser = require('../database/oracle').getBestllungenFromUser
const getFleachenFromUserBestellt = require('../database/oracle').getFleachenFromUserBestellt
const getCartSuggestions = require('../database/oracle').getCartSuggestions
const deleteFromCart = require('../database/oracle').deleteFromCart
const initiateOrderNew = require('../database/oracle').initiateOrderNew
const getClobHier = require('../database/oracle').getClob
const KundendatenGET = require('../database/oracle').getKundendaten


//TODO: getCLUBMIT userID verbinden --> sonst ewiges Laden

router.get('/', async function(req, res, next) {
    if(req.isAuthenticated()){
        const userID = req.user.id
        var kundendaten = await KundendatenGET(userID)
        const cartFromUser = await getBestllungenFromUser(userID)
        const FleachenFromUserBestellt = await getFleachenFromUserBestellt(userID)
        const Clob = await getClobHier(userID)
        artikelNrFromCart = []
        const kundendatenUebergabe = kundendaten
        console.log(kundendatenUebergabe.anzahl)
        res.render('products', { title: 'Express', Daten: kundendatenUebergabe, login:true})
    }
    res.render('', { title: 'Express',login:false});
});


router.get('/:category', async (req,res)=>{
    if(req.isAuthenticated()){
        const userID = req.params.category
        const cartFromUser = await getBestllungenFromUser(userID)
        const FleachenFromUserBestellt = await getFleachenFromUserBestellt(userID)
        const Clob = await getClobHier(userID)
        artikelNrFromCart = []




        res.render('productsByCategory',{title: 'Webshop',  UserCart: cartFromUser, Fleachen: FleachenFromUserBestellt.rows, login: true}) // mit CategoryRequested kann man evtl. die Kategorie in der Auswahlleiste farbig hinterlegen
    }else{
        res.redirect('/')
    }


})


router.post('upload', async (req,res)=>{
    console.log('HIER')
})


module.exports = router;