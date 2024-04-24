const mongoose = require('mongoose')
const validator = require('validator');


//* GAME SCHEMA
const gameSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    unique: [true, 'Game with this name already exists'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    minlength: [5, 'Description must be at least 5 characters'],
    maxlength: [200, 'Description must not exceed 200 characters']
  },
  price: {
    type: Number,
    required: [true, "Price must be declared"],
    min: [1, "Price limits are 1 and 500"],
    max: [500, "Price limits are 1 and 500"]
  },
  discount: {
    type: Number,
    min: [1, "Discount must be at least 1"],
    max: [99, "Discount must not exceed 99"]
  },
  gameType: {
    type: [String],
    enum: ["RPG", "Racing", "Shooter", "Action", "Sports", "Adventure", "Simulation", "Fighting", "Strategy", "Battle Royale", "Retro"],
    default: 'unknown'
  },
  platform: {
    type: [String], // Change to an array to allow multiple platforms
    required: [true, "At least one platform must be selected"],
    validate: {
      validator: function (value) {
        // Custom validator to check that at least one platform is selected
        return value.length >= 1;
      },
      message: "At least one platform must be selected",
    },
    enum: ["PC", "Playstation", "Xbox", "Nintendo"],
  },
  stock: {
    type: Number,
    required: [true, "Stock must be declared"],
    min: [1, "Stock limits are 1 and 20"],
    max: [20, "Stock limits are 1 and 20"]
  },
  createdAt: {
    type: Date,
    default: Date.now,
    select: false //note: true == display, false != display
  },
},
  {
    toJSON: {
      virtuals: true,
      versionKey: false, //! This hides the '__v' field
      transform: function (doc, ret) {
        delete ret.id; //! This removes the 'id' field      
        // delete ret._id; //! This removes the '_id' field      
      }
    },
    toObject: { virtuals: true }
  }
);

gameSchema.virtual('discountedPrice').get(function () {
  let discountedPrice = Math.abs(this.price * (this.discount / 100) - this.price);
  return discountedPrice
});

const Game = mongoose.model('Game', gameSchema)
module.exports = Game