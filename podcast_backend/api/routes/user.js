require("dotenv").config();
const express = require("express");
const router = express.Router();

const userController = require("../controller/user");
const authCheck = require("../../authCheck");


router.get("/podcast", authCheck, userController.get_related_user_podcasts);

router.get("/signup", userController.get_user_signup_error);

router.post("/signup", userController.user_signup);

router.get("/login", userController.get_user_login_error);

router.post("/login", userController.user_login);

router.delete("/:user_id", authCheck, userController.delete_user);

router.get("/", authCheck, userController.get_all_user);

router.post("/google", userController.google_login);

module.exports = router;
