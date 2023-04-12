const express = require("express");
const routes = express.Router();
const userController = require("../app/controller/UserController");
routes
  .post("/register", userController.register)
  .post("/update", userController.update)
  .post("/login", userController.login);
module.exports = routes;
