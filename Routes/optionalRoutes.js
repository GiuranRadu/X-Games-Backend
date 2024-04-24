const express = require('express');
const router = express.Router();
const optionalController = require('./../Controllers/optionalController')
const authController = require('../Controllers/authController')


//* PROTECT ALL BELOW ROUTES  *
//note: pt ca linia este scrisa deasupra `ROUTES`, va trece mai intai prin aceasta, apoi prin celelalte
//! GLOBAL
router.use(authController.protect)


//* ROUTES * 
router.route('/sortGamesByType')
  .get(optionalController.sortGamesByType)


router.route('/gamesWithDiscount')
  .get(optionalController.gamesWithDiscount)


router.route('/topFiveCheapGames')
  .get(optionalController.topFiveCheapGames)
  

router.route('/sortGameByPlatform')
  .get(optionalController.sortGameByPlatform)




module.exports = router;
