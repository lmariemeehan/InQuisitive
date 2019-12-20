const express = require("express");
const router = express.Router();
const validation = require("./validation");
const userController = require("../controllers/userController");

  router.get("/users/sign_up", userController.signUp);
  router.post("/users", validation.validateUsers, userController.create);
  router.get("/users/sign_in", userController.signInForm);
  router.post("/users/sign_in", validation.validateUsers, userController.signIn);
  router.get("/users/sign_out", userController.signOut);
  router.get("/users/:id", userController.show);
  router.get("/users/:id/upgrade", userController.upgradeForm);
  router.post("/users/:id/upgrade", userController.upgrade);
  router.post("/users/:id/downgrade", userController.downgrade);
  router.get("/users/:id/profile", userController.profile);
  router.post("/users/:id/profile", userController.upgrade);
  router.post("/users/:id/profile", userController.downgrade);

module.exports = router;
