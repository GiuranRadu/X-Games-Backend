const Game = require('../Models/gameModel')
const ApiFeatures = require('./../Utils/ApiFeatures')


exports.createGame = async (req, res, next) => {
  try {
    const game = await Game.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        game
      }
    })
  } catch (err) {
    res.status(404).json({
      message: err.message
    })
    console.log(err.message);
  }
}


exports.updateGame = async (req, res, next) => {
  try {
    const updatedGame = await Game.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    if (!updatedGame) {
      const error = new Error('User with that id not found', 404);
      return next(error);
    }
    res.status(200).json({
      status: 'success',
      data: {
        updatedGame
      }
    })
  } catch (err) {
    console.log(err.message);
    res.status(404).json({
      message: err.message
    })
  }
}


exports.deleteGame = async (req, res, next) => {
  try {
    let gameToDeleteId = req.params.id;

    const deletedGame = await Game.findByIdAndDelete(gameToDeleteId);

    if (!deletedGame) {
      return res.status(404).json({
        status: "fail",
        message: `Game with id: ${gameToDeleteId} not found`
      })
    }
    //* If game is successfully deleted, send a 204 response
    res.status(204).json({
      status: "success",
      data: "Game Deleted!"
    });
    console.log('Game deleted: ', deletedGame.name);

  } catch (error) {
    //! Handle unexpected errors
    console.error('Error deleting user:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal Server Error'
    });
  }
}


exports.getGame = async (req, res, next) => {
  try {
    const game = await Game.findById(req.params.id)

    if (!game) {
      return res.status(404).json({
        status: 'fail',
        data: {
          message: `Game with that ID does not exist`
        }
      })
    } else {
      res.status(200).json({
        status: 'success',
        data: {
          game
        }
      })
      console.log('Joc gasit');
    }
  } catch (error) {
    console.error('Error geting game:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal Server Error'
    });
  }
}


exports.getAllGames = async (req, res, next) => {
  const features = new ApiFeatures(Game.find(), req.query).filter().sort().limitFields().paginate();

  let games = await features.query
  res.status(200).json({
    status: 'success',
    count: games.length,
    data: {
      games
    }
  })

}