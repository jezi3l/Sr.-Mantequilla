const express = require("express");
const router = express.Router();
const authController = require('../controllers/auth');


//when running /auth/register it will run req and res functions
router.post("/register", authController.register)
router.post("/login", authController.login)



module.exports = router;