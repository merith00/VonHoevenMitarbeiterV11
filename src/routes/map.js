const getAllProducts = require('../database/oracle').getAllProducts
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', async function(req, res, next) {
  if(req.isAuthenticated()){
    res.render('map', { title: 'BI Webshop', login: true})
  }else{
    res.render('map', { title: 'BI Webshop', login: false})
  }
});




module.exports = router;
