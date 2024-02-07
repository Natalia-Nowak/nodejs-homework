const express = require("express");
const { login, register, logout, current } = require("./auth.controller");
const { auth } = require("../auth/auth.middleware");

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/logout", auth, logout);
router.get("/current", auth, current);

module.exports = router;
