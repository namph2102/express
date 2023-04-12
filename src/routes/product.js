const express = require("express");
const router = express.Router();
const productController = require("../app/controller/productController");
router.get("/", productController.init);
router.get("/:slug", productController.getProduct);
module.exports = router;
