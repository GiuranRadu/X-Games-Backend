const express = require('express');
const router = express.Router();
const gamesController = require('../Controllers/gamesController')
const authController = require('../Controllers/authController')


//* PROTECT ALL BELOW ROUTES  *
//note: pt ca linia este scrisa deasupra `ROUTES`, va trece mai intai prin aceasta, apoi prin celelalte
//! GLOBAL
router.use(authController.protect)


// * ROUTES *
router.route('/')
  .get(gamesController.getAllGames)
  .post(authController.permission, gamesController.createGame)


router.route('/:id')
  .get(gamesController.getGame)
  .patch(authController.permission, gamesController.updateGame)
  .delete(authController.permission, gamesController.deleteGame)


module.exports = router;
