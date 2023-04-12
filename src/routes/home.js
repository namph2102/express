const express = require("express");
const router = express.Router();
const homeController = require("../app/controller/homeController");

router.get("/", homeController.init);
router.get("/home", homeController.init);

module.exports = router;
