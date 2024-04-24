const User = require('../Models/userModel')
const ApiFeatures = require('./../Utils/ApiFeatures')


exports.createUser = async (req, res, next) => {
  try {
    const user = await User.create(req.body)
    res.status(201).json({
      status: "success",
      data: {
        user
      }
    })
  } catch (err) {
    res.status(404).json({
      message: err.message
    })
    console.log(err.message);
  }
}


exports.updateUser = async (req, res, next) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    if (!updatedUser) {
      const error = new Error('User with that id not found', 404);
      return next(error);
    }
    res.status(200).json({
      status: 'success',
      data: {
        updatedUser
      }
    })
  } catch (err) {
    res.status(404).json({
      message: err.message
    })
    console.log(err.message);
  }
}


exports.deleteUser = async (req, res, next) => {
  try {
    let userToDeleteId = req.params.id;
    const deletedUser = await User.findByIdAndDelete(userToDeleteId);

    if (!deletedUser) {
      //* If user not found, send a 404 response
      return res.status(404).json({
        status: 'fail',
        data: `User with id: ${userToDeleteId} not found`
      });
    }

    //* If user is successfully deleted, send a 204 response
    res.status(204).json({
      status: "success",
      data: "User Deleted!"
    });
    console.log('User deleted: ', deletedUser.name);

  } catch (error) {
    // Handle unexpected errors
    console.error('Error deleting user:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal Server Error'
    });
  }
}


exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)

    if (!user) {
      return res.status(404).json({
        status: 'fail',
        data: {
          message: 'User with that ID does not exist'
        }
      })
    } else {
      res.status(200).json({
        status: 'success',
        data: {
          user
        }
      })
      console.log('User gasit');
    }
  } catch (error) {
    // Handle unexpected errors
    console.error('Error deleting user:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal Server Error'
    });
  }
}


exports.getAllUsers = async (req, res, next) => {
  const features = new ApiFeatures(User.find(), req.query).filter().sort().limitFields().paginate();

  let users = await features.query
  res.status(200).json({
    status: 'success',
    count: users.length,
    data: {
      users
    }
  })
}