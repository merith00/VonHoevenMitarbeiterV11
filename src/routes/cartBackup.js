var express = require('express');
var router = express.Router();
const putToCart = require('../database/oracle').putToCart
const getCartFromUser = require('../database/oracle').getCartFromUser
const deleteFromCart = require('../database/oracle').deleteFromCart
const initiateOrder = require('../database/oracle').initiateOrder
const getAllProducts = require('../database/oracle').getAllProducts
const getCartSuggestions = require('../database/oracle').getCartSuggestions


/* GET users listing. */
router.get('/', async function(req, res, next) {
    if(req.isAuthenticated()){
        const userID = req.user.id
        const cartFromUser = await getCartFromUser(userID)

        artikelNrFromCart = []

        for (let index = 0; index < cartFromUser.products.length; index++) {
            artikelNrFromCart.push(cartFromUser.products[index][0])
        
        }

        const result = await getCartSuggestions(artikelNrFromCart)

        if(cartFromUser.products.length === 0){
            req.flash('info', 'Keine Produkte im Warenkorb')
            res.redirect('/products')
        } else{
            res.render('cart', { title: 'Express', UserCart: cartFromUser, products: result.rows, login:true })
        }
    }else{
        res.redirect('/account')
    }
    
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

router.put('/add', async (req,res) => {
    if(req.isAuthenticated()){
        userID = req.user.id
        productID = req.body.productid
        await putToCart(userID,productID)
        res.send(200)
    }
    console.log(req.user);
})
module.exports = router;
