const express = require("express");
const categoryController = require("../app/controller/CategoryController");
const router = express.Router();
//#path parent categories
router
  .get("/api", categoryController.init)
  .get("/:slug", categoryController.getCategory);
module.exports = router;
