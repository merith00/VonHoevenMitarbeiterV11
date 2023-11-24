const getBestseller = require('../database/oracle').getBestseller
const getAllProducts = require('../database/oracle').getAllProducts
const getResultPreis = require('../database/oracle').getResultPreis
const getResultLast = require('../database/oracle').getResultLast
const getResultKategorien = require('../database/oracle').getResultKategorien
const getProductsByCategory = require('../database/oracle').getProductsByCategory
const getClob = require('../database/oracle').getClob
const getProductDetails = require('../database/oracle').getProductDetails
const checkAuthenticated = require('../UserAuth/checkAuth')
const getSuggestions = require('../database/oracle').getSuggestions
const util = require('util');
var express = require('express');

var router = express.Router();




/* GET Products listing. */
router.get('/',checkAuthenticated, async function(req, res, next) { //checkAuthenticated
    //Alle Kategorien holen

    const categoriesOberSub = await getClob()
    const uebergabe = JSON.parse(categoriesOberSub.rows[0][0])
    const result=await getAllProducts()
    const resultBestseller=await getBestseller()
    const resultPreis=await getResultPreis()
    const resultLast= await getResultLast()
    const resultKategorien = await getResultKategorien()


    res.render('products', { login: true, title: 'Webshop', products: result.rows, bestseller: resultBestseller.rows, besterPreis: resultPreis.rows, lastProdukt: resultLast.rows, allCategories: uebergabe.categories , kategoriePassend: resultKategorien.rows})
   
});


router.get('/:category', async (req,res)=>{
    if(req.isAuthenticated()){
        const categoryRequested = req.params.category
        const catSubOber = await getClob()
        const ueber = JSON.parse(catSubOber.rows[0][0])
        const result = await getProductsByCategory(categoryRequested)
        res.render('productsByCategory',{title: 'Webshop',productsByCategory: result.rows, category: categoryRequested, allCategories: ueber.categories, login: true}) // mit CategoryRequested kann man evtl. die Kategorie in der Auswahlleiste farbig hinterlegen
    }else{
        res.redirect('/')
    }


})

router.post('/detail',async (req,res) =>{
    if(req.isAuthenticated()){
        const productToReturn = await getProductDetails(req.body.productid)

        const suggestions = await getSuggestions(req.body.productid)
        const suggestions2 = await getResultKategorien(req.body.productid)


        const productRet = {
            artikelnr: productToReturn[0][0],
            preis: productToReturn[0][1],
            bezeichnung: productToReturn[0][2],
            hersteller: productToReturn[0][3],
            nettogewicht: productToReturn[0][4] ,
            bruttogewicht: productToReturn[0][5],
            recycle: productToReturn[0][6],
            kategorie: productToReturn[0][7],
            suggestions: suggestions,
            suggestions2: suggestions2.rows
        }
        res.json(productRet)
    }else{
        res.sendStatus(401)
    }
})

/*router.get('/details/:produkt', async (req,res)=>{
    const productRequested = req.params.produkt
    const categoryRequested = req.params.produkt[7].trim()
    const categoryResult = await getAllCategories()

    const allCategories = create_group(null, categoryResult.rows).subCategories;
    const productResult = await getAllProducts(productRequested)
    const result = await getProductsByCategory(categoryRequested)

    const productDetails = await getProductDetails(productRequested)

    console.log('HIER')
    console.log(productDetails)

    res.render('productDetails', {title: 'Webshop', produkt: productResult, productsByCategory: result.rows, categories: categoryRequested, allCategories: allCategories, produktDetails: productDetails})

})*/

module.exports = router