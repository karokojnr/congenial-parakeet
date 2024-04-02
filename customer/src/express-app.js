const express = require("express");
const cors = require("cors");
const { customer, appEvents } = require("./api");
const HandleErrors = require("./utils/error-handler");
const appEvent = require("./api/app-event");

module.exports = async (app) => {
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));
  app.use(cors());
  app.use(express.static(__dirname + "/public"));

  const channel = await CreateChannel();

  appEvents(app);
  customer(app, channel);
  app.use(HandleErrors);
};
