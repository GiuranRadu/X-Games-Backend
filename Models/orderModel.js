const mongoose = require('mongoose');


//* ORDER SCHEMA *
const orderSchema = new mongoose.Schema({
  creatorId: {
    type: mongoose.Schema.ObjectId,
    ref: "Users"
  },
  creatorName: {
    type: String,
    required: true,
  },
  productsOrdered: [
    {
      _id: { type: mongoose.Schema.ObjectId, ref: "Games" },
      name: String,
      quantity: Number,
      price: Number
    }
  ],
  totalPrice: {
    type: Number
  },
  shippingAdress: {
    type: String,
    required: [true, "Shipping Adress mandatory "],
    minlength: [5, "Shipping Address should be between 5 and 50 characters"],
    maxlength: [50, "Shipping Address should be between 5 and 50 characters"],
  },
  paymentMethod: {
    type: String,
    enum: ["card", "cash", "bankTransfer"],
    default: 'card'
  },
  createdAt: {
    type: Date,
    default: Date.now,
    select: true //note: true == display, false != display
  },

})

//* PRE-SAVE HOOK -> we calculate the `totalPrice`
orderSchema.pre('save', function (next) {
  this.totalPrice = this.productsOrdered.reduce((total, product) => {
    return total + product.quantity * product.price;
  }, 0);
  next();
});




const Order = mongoose.model('Order', orderSchema)
module.exports = Order