const Order = require('../Models/orderModel')
const User = require('../Models/userModel')
const Game = require('../Models/gameModel')
const ApiFeatures = require('../Utils/ApiFeatures')


exports.createOrder = async (req, res, next) => {
  try {
    const creatorId = req.params.id

    const orderToAdd = {
      creatorId,
      ...req.body
    }

    //! Check and update game stock
    const products = req.body.productsOrdered;

    for (const product of products) {
      const gameId = product._id;
      const quantityOrdered = product.quantity;

      //! Update game stock
      await Game.findOneAndUpdate(
        { _id: gameId, stock: { $gte: quantityOrdered } },
        { $inc: { stock: -quantityOrdered } }
      );
    }

    const order = await Order.create(orderToAdd)

    await User.findByIdAndUpdate(creatorId, {
      $push: {
        orders: {
          _id: order._id,
          // ciuciu : "ciuciu"  //!if i want to add something here , i ALSO need to add in User model       
        }
      }
    })
    res.status(201).json({
      status: 'created',
      order
    });

  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message
    });
  }
}


exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)

    if (!order) {
      return res.status(404).json({
        status: 'fail',
        data: {
          message: `Order with that ID does not exist`
        }
      })
    } else {
      res.status(200).json({
        status: "succes",
        data: {
          order
        }
      })
      console.log('Order gasit');
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal Server Error'
    });
  }
}


exports.getAllOrders = async (req, res, next) => {
  const features = new ApiFeatures(Order.find(), req.query).filter().sort().limitFields().paginate();

  let orders = await features.query
  res.status(200).json({
    status: "success",
    count: orders.length,
    data: {
      orders
    }
  })
}


exports.getAllUserOrders = async (req, res, next) => {
  try {
    let userId = req.params.id

    const orders = await Order.find({ creatorId: userId })

    if (!orders) {
      return res.status(404).json({
        status: "fail",
        message: "This user don't have any orders"
      })
    } else {
      res.status(200).json({
        status: "succes",
        count: orders.length,
        data: {
          orders
        }
      })
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Internal Server Error'
    });
  }
}


exports.updateOrder = async (req, res, next) => {
  const originalOrder = await Order.findById(req.params.id);
  try {
    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    if (!updatedOrder) {
      res.status(404).json({
        status: 'fail',
        message: "Order with that ID does not exist!"
      })
    }

    //* Recalculate the totalPrice based on the updated products & Save the updated totalPrice
    updatedOrder.totalPrice = updatedOrder.productsOrdered.reduce((total, product) => {
      return total + product.quantity * product.price;
    }, 0);
    await updatedOrder.save();

    //. Iterate over each product in the updatedOrder.productsOrdered and update the corresponding game stock
    for (const product of updatedOrder.productsOrdered) {
      const { _id, quantity } = product;

      //* Retrieve the new quantity from req.body
      const newQuantity = quantity;

      //* Retrieve the old quantity from the original document
      const originalProduct = originalOrder.productsOrdered.find(p => p._id.equals(_id));
      const oldQuantity = originalProduct ? originalProduct.quantity : 0;
      console.log(`Old Quantity:${oldQuantity}`, `New Quantity : ${newQuantity}`);


      let diff = newQuantity - oldQuantity; //! diff = numar pozitiv sau negativ 
      let updatedGame;

      if (newQuantity > oldQuantity) {
        updatedGame = await Game.findByIdAndUpdate(_id, { $inc: { stock: -diff } }, { new: true, runValidators: true }); //! example : if diff = 3 , scadere cu numar pozitiv
      } else {
        updatedGame = await Game.findByIdAndUpdate(_id, { $inc: { stock: -diff } }, { new: true, runValidators: true }); //! example : if diff = -3 ,  scadere cu numar negativ -> rezulta adunare
      }
      //note: $inc = increment

      // Handle cases where the game is not found or stock is not sufficient (optional)
      if (!updatedGame) {
        console.log(`Game with ID ${_id} not found.`);
      } else if (updatedGame.stock < 0) {
        console.log(`Stoc indisponibil.`);
      }
    }
    res.status(200).json({
      status: 'success',
      data: {
        updatedOrder,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      message: 'Internal Server Error',
    });
  }
};


exports.deleteOrder = async (req, res, next) => {
  try {
    //*1) Delete the order
    let orderToDeleteId = req.params.id
    const deletedOrder = await Order.findByIdAndDelete(orderToDeleteId)

    if (!deletedOrder) {
      return res.status(404).json({
        status: 'fail',
        data: `Order with id: ${orderToDeleteId} not found`
      });
    }
    //*2) Delete the order from user.orders[]
    await User.updateMany(
      { "orders._id": orderToDeleteId },
      { $pull: { orders: { _id: orderToDeleteId } } }
    );

    //*3) Update game stock by adding back the quantity
    // Just keep in mind that using `forEach` with asynchronous operations inside can lead to unexpected behavior because it won't wait for all promises to complete. If order of execution or synchronization is crucial, you might want to use `for...of` or other methods that ensure proper asynchronous handling.
    for (const product of deletedOrder.productsOrdered) {
      const gameId = product._id;
      const quantity = product.quantity;

      await Game.findByIdAndUpdate(gameId, { $inc: { stock: quantity } }, { new: true, runValidators: true });
    }

    res.status(204).json({
      status: "success",
      data: "Order Deleted!"
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      message: 'Internal Server Error',
    });
  }
}



//note -> logica CALCUL stock
// let stock = 20
// let newQuantity = 5
// let oldQuantity = 4
// let diff = newQuantity - oldQuantity
// console.log(stock - diff)



