const express = require("express");
const routes = express.Router();
const api = require("../app/api");

routes.get("/v2/products", api.productApi);

module.exports = routes;
