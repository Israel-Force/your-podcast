const express = require("express");
const router = express.Router();

const adminController = require("../controller/admin");

router.post("/login", adminController.admin_login);

router.get("/login", adminController.get_admin_login_error);

router.post("/signup", adminController.admin_signup);

module.exports = router;
