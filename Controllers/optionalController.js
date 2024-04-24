const Game = require('../Models/gameModel')


//* Optional routes * 
exports.sortGamesByType = async (req, res, next) => {
  try {
    const gameType = await Game.aggregate([
      {
        $unwind: '$gameType'
      },
      {
        $group: {
          _id: { $toUpper: '$gameType' },
          gamesLength: { $sum: 1 }, //! Calculate the length of the 'games' array
          // games: { $push: '$name' }, //! Push only the name of the game
          games: { $push: '$$ROOT' } //! Push the entire document/object
        }
      },
      {
        $sort: { gamesLength: -1 }
      }
    ])
    res.status(200).json({
      status: 'success',
      length: gameType.length,
      data: {
        gameType
      }
    })
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error
    });
  }
}

exports.gamesWithDiscount = async (req, res, next) => {
  try {
    const gamesWithDiscount = await Game.aggregate([
      {
        // $match: { discount: { $gte: 0.1 } } //! trick -> If discount exists
        $match: { discount: { $exists: true } } //! If discount exists
      },
      {
        $sort: { discount: -1 } //! To sort based on `discount`, make sort before  $group stage.
      },
      {
        $group: {
          _id: "Games With Discount",
          count: { $sum: 1 },
          games: { $push: '$$ROOT' }
        }
      },
    ])

    res.status(200).json({
      status: 'success',
      data: {
        gamesWithDiscount
      }
    })
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error
    });
  }
}

exports.topFiveCheapGames = async (req, res, next) => {
  try {
    const topFiveCheapGames = await Game.aggregate([
      {
        $sort: { price: 1 } //! Sort by price in ascending order
      },
      {
        $limit: 5 //! Limit the result to the top five games
      },
      {
        $sort: { price: -1 } //! Sort the remaining games by price in descending order
      }
    ])
    res.status(200).json({
      status: 'success',
      length: topFiveCheapGames.length,
      data: {
        topFiveCheapGames
      }
    })
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error
    });
  }
}

exports.sortGameByPlatform = async (req, res, next) => {
  try {
    const sortByPlatform = await Game.aggregate([
      {
        $unwind: '$platform'
      },
      {
        $group: {
          _id: { $toUpper: '$platform' },
          gamesLength: { $sum: 1 }, //! Calculate the length of the 'games' array
          // games: { $push: '$name' }, //! Push only the name of the game
          games: { $push: '$$ROOT' } //! Push the entire document/object
        }
      },
    ])

    res.status(200).json({
      status: 'success',
      length: sortByPlatform.length,
      data: {
        sortByPlatform
      }
    })
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error
    });
  }
}