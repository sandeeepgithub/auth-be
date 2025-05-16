const jwt = require("jsonwebtoken");

exports.jwtToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// generate otp
exports.generateOtp = () => {
  return Math.floor(Math.random() * 9000 + 1000);
};
