const express = require('express');
const port = process.env.PORT || 3000;
const job = require('./schedule/job');
const schedule = require('node-schedule');
const server = express();

var productJob = schedule.scheduleJob('5 0 * * *', job.getProductList)
var brandJob = schedule.scheduleJob('* * * * *', job.getBrandList)
var updateLeaderBoardJob = schedule.scheduleJob("15 0 * * *", job.updateLeaderBoard)
var updateCouponSatatus = schedule.scheduleJob("30 0 * * *", job.updateCouponStatus);

server.listen(port, function() {
    console.log("Example skill server listening on port " + port);
});

module.exports = server;