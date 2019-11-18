const express=  require('express');
const pool = require('../pool.js');
var router = express.Router();
router.get('/Product/GetProductBaseInfo',(req,res)=>{
    console.log(req.query.Id);
   // "Id": ProductParms.Id 
   res.send("123");
   
});

module.exports = router;