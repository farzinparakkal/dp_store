const express = require('express');
const router = express.Router();
const { signup, login, logout } = require("../controllers/authController");

router.post("/register", signup);
router.post("/login", login);
router.post("/logout", logout); // not mandatory, can be handled on frontend

module.exports = router;