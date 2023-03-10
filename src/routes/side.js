const express = require("express");
const router = express.Router();

const sideController = require("../app/controllers/SideController");
router.use("/search", sideController.search);
router.use("/homne", sideController.home);
router.use("/", sideController.home);

module.exports = router;
