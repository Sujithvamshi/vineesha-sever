const cors = require('cors');
const { json, urlencoded } = require('body-parser');
// Express Route
const express = require('express');
const mongoose = require('mongoose');
const employeeRoutes = require('./routes/empolyee.route');
const leaveRoutes = require('./routes/leaverequest.route');
const leaveBalanceRoutes = require('./routes/leavebalances.route');
// Connecting mongoDB Database
mongoose.connect('mongodb+srv://admin:admin@cluster0.dtdjnrs.mongodb.net/App?retryWrites=true&w=majority')
  .then((x) => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch((err) => {
    console.error('Error connecting to mongo', err.reason)
  })
const app = express();
app.use(json());
app.use(urlencoded({
  extended: true
}));
app.use(cors());
app.use('/employees', employeeRoutes);
app.use('/leave', leaveRoutes);
app.use('/leave-balance', leaveBalanceRoutes);
// PORT
const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
  console.log('Connected to port ' + port)
})
// 404 Error
app.use((req, res, next) => {
  next(createError(404));
});
app.use(function (err, req, res, next) {
  console.error(err.message);
  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).send(err.message);
});