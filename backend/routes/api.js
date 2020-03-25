var express = require("express");
var authRouter = require("./auth");
var visitorRouter = require("./visitor");

var app = express();

app.use("/auth/", authRouter);
app.use("/visitor/", visitorRouter);

module.exports = app;