const User = require("../models/UserModel");
const catchAsyncError = require("../utils/catchAsyncErrors");

exports.getUser = catchAsyncError(async (req, res, next) => {
  let user = req.user;

  user = await User.findById(user._id);

  res.status(200).json({
    status: "success",
    data: user,
  });
});
