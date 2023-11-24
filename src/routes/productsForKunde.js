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






/* GET users listing. */
router.get('/', async function(req, res, next) {
    if(req.isAuthenticated()){
        const userID = req.user.id
        var kundendaten = await KundendatenGET(userID)
        const cartFromUser = await getBestllungenFromUser(userID)
        const FleachenFromUserBestellt = await getFleachenFromUserBestellt(userID)
        const Clob = await getClobHier(userID)
        artikelNrFromCart = []


        //const result = await getCartSuggestions(artikelNrFromCart)

        res.render('products', { title: 'Express'})

        /*if(cartFromUser.products.length === 0){
            req.flash('info', 'Keine Produkte im Warenkorb')
            res.redirect('cart')
        } else{
            res.render('products', { title: 'Express', UserCart: cartFromUser,  ClobFoto: Clob, Fleachen: FleachenFromUserBestellt.rows, login:true }) //products: result.rows
        }*/
    }
    res.render('account', { title: 'Express',login: false});
});


router.delete('/', async (req,res) =>{
    if(req.isAuthenticated()){
        await deleteFromCart(req.user.id, req.body.productid)
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


router.post('/', async (req,res) => {
    if(req.isAuthenticated()){
        userID = req.user.id
        const productId = req.body.productId
        //fleachenname = req.body.productID
        //const flaechenname = req.body.flaechenname
        //const dateValue = req.body.dateValue

        const EminValue = req.body.EminValue
        const MangatValue = req.body.MangatValue
        const StickstoffValue = req.body.StickstoffValue

        await initiateOrderNew(userID,productId,EminValue,MangatValue,StickstoffValue)
    }
    console.log(req.user);
})


function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
}







module.exports = router;