const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const app = express();
const mongoose = require('mongoose');
var users = require('./schema/user_schema');
var routes = require('./routes/route');
const http = require('http');
const server = http.Server(app);
require('./dbconfig');

app.use(cors())
app.use(bodyParser.json({ limit: '2mb' }))
app.use(bodyParser.urlencoded({ limit: '2mb', extended: true }))

const io = require("socket.io")(server, {
    cors: {
        origin: "http://localhost:4200",
        methods: ["GET", "POST"]
    }
});

app.use(process.env.MIDDLEWARE, routes);

require('./dataServices/socket_services')(io);

server.listen(process.env.PORT, function () {
    console.log('Server is running on http://' + process.env.HOST + ':' + process.env.PORT)
})