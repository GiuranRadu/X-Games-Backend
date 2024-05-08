const express = require('express');
const cors = require('cors');
const usersRoutes = require('./Routes/usersRoutes')
const gamesRoutes = require('./Routes/gamesRoutes')
const ordersRoutes = require('./Routes/ordersRoutes')
const authRoutes = require('./Routes/authRoutes')
const optionalRoutes = require('./Routes/optionalRoutes')



let app = express();
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"))


app.use((req, res, next) => { 
  req.requestedAt = new Date().toISOString();  
  next();
})


//* ROUTES * 
app.use("/", authRoutes);
app.use("/users", usersRoutes)
app.use("/games", gamesRoutes)
app.use('/orders', ordersRoutes);
app.use('/optionalRoutes', optionalRoutes);

//* TEST ROUTE *
app.get('/', (req, res, next) => {
  res.status(200).json({
    status: 'Success',
    message: 'Online'
  })
  console.log('App has been accessed! ✅');
})

module.exports = app