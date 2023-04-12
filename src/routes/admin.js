const express = require("express");
const adminController = require("../app/controller/AdminController");
const userController = require("../app/controller/UserController");
const Authorization = require("../app/auth");
const path = require("path");
const casual = require("casual");
// stoges
const multer = require("multer");
// SET STORAGE
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join("src", "public", "image", "cakes"));
  },
  filename: function (req, file, cb) {
    cb(null, casual.unix_time + "" + file.originalname);
  },
});
const upload = multer({ storage: storage });

const router = express.Router();
function adminRouter(app, engine) {
  app.engine(".hbs", engine({ extname: ".hbs", layout: "admin" }));
  app.get("/admin", adminController.init);
  app.post("/admin/data", adminController.getdata);
  app.post("/admin", Authorization, adminController.init);
  app.get("/admin/product", adminController.showProduct);

  app.get("/admin/product/add", adminController.showform);
  app.post(
    "/admin/product/add",
    upload.single("myFile"),
    adminController.handleAddproduct
  );
  app.get("/admin/product/delete/:id", adminController.handleDeleteProduct);
  app.get("/admin/product/edit/:id", adminController.handleEditPrroduct);
  app.post("/admin/product/edit/:id", adminController.handleEditPostProduct);

  app.get("/admin/user", userController.init);
  app.get("/admin/user/:id", userController.init);
}
module.exports = adminRouter;
