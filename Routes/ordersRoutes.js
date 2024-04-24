const express = require('express');
const router = express.Router();
const ordersControllers = require('./../Controllers/ordersController')
const authController = require('../Controllers/authController')


//* PROTECT ALL BELOW ROUTES  *
//note: pt ca linia este scrisa deasupra `ROUTES`, va trece mai intai prin aceasta, apoi prin celelalte
//! GLOBAL
router.use(authController.protect)


//* ROUTES * 
router.route('/')
  .get(ordersControllers.getAllOrders)

router.route('/:id')
  .post(ordersControllers.createOrder)
  .get(ordersControllers.getOrder)
  .patch(ordersControllers.updateOrder)
  .delete(ordersControllers.deleteOrder)

  
router.route('/userOrders/:id')
  .get(ordersControllers.getAllUserOrders)




module.exports = router;
