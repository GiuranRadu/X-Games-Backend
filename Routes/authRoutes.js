const express = require('express');
const router = express.Router();

const authController = require('../Controllers/authController');



//* ROUTES *
router.route('/register')
  .post(authController.register)

router.route('/login')
  .post(authController.login)

router.route('/login/forgotPassword')
  .post(authController.forgotPassword)

router.route('/login/resetPassword/:token')
  .patch(authController.resetPassword)


module.exports = router;