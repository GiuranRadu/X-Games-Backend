const dotenv = require('dotenv'); //!astea trebuie sa fie inaintea constantei `app`
dotenv.config({ path: './config.env' }); //!astea trebuie sa fie inaintea constantei `app`

//-> SAFETY NET error handlers -> must be on the top level of the page, before `app`
process.on('uncaughtException' , (err) => {
  // console.log(err.name, err.message);
  // console.log('❌ Uncaught exception occured! Shutting down... ❌');
  // server.close(() => {
  //   process.exit(1)
  // });
});

const app = require('./app');
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');


mongoose.connect(process.env.CONN_STR, {
  useNewUrlParser: true,
}).then((conn) => {
  console.log('🎮 X-Games 🎮 -> DB connection established... ✅');
})

const server = app.listen(port, () => {
  console.log(`Server has started on port: ${port}... ✅ ` );
});
