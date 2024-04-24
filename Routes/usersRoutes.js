const express = require('express');
const usersController = require('../Controllers/usersController');
const router = express.Router();



// * ROUTES *
router.route('/')
  .post(usersController.createUser)
  .get(usersController.getAllUsers)

router.route('/:id')
  .patch(usersController.updateUser)
  .get(usersController.getUser)
  .delete(usersController.deleteUser)


module.exports = router;
