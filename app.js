const express = require('express');
const PORT = process.env.port || 3000;
const job = require('./schedule/job');
const schedule = require('node-schedule');
const server = express();

var productJob = schedule.scheduleJob('1 0 * * *', job.getProductList)
var brandJob = schedule.scheduleJob('0 0 * * *', job.getBrandList)

server.listen(PORT, function() {
    console.log("Example skill server listening on port " + PORT);
});

module.exports = server;