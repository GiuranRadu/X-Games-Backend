const dotenv = require('dotenv'); //!astea trebuie sa fie inaintea constantei `app`
dotenv.config({ path: './config.env' }); //!astea trebuie sa fie inaintea constantei `app`

//-> SAFETY NET error handlers -> must be on the top level of the page, before `app`
process.on('uncaughtException', (err) => {
  console.log(err.stack);
  // console.log(err.name, err.message);
  console.log('❌ Uncaught exception occured! Shutting down... ❌');
});

const app = require('./app');
const port = process.env.PORT || 4000;
const mongoose = require('mongoose');


mongoose.connect(process.env.CONN_STR, {
  useNewUrlParser: true,
}).then((conn) => {
  console.log('🎮 X-Games 🎮 -> DB connection established... ✅');
})

const server = app.listen(port, () => {
  console.log(`Server has started on port: ${port}... ✅ `);
});
