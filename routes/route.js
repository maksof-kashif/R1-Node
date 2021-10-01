const express = require('express');
const app = express();

var userRoutes = require('./user_route');
var riderRoutes = require('./rider_route');

app.use('/user', userRoutes);
app.use('/rider', riderRoutes);

module.exports = app;