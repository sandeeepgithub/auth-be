const express = require("express");
const authController = require("../controllers/authController");
const validators = require("../utils/validator");

const router = express.Router();

router.post("/signup", validators.validateSignup, authController.signUp);

router.post("/signin", validators.validateSignin, authController.signIn);

router.post("/sendOtp", authController.sendOtp);

router.use(authController.protect); // protect routes below this

router.patch("/verifyotp", authController.verifyOtp);

router.patch(
  "/changepassword",
  validators.validatePassword,
  authController.changePassword
);

router.post(
  "/resetPassword",
  authController.verifyOtp,
  validators.validatePassword,
  authController.resetPassword
);

module.exports = router;
