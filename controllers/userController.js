const catchAsyncError = require("../utils/catchAsyncErrors");

exports.getUser = catchAsyncError(async (req, res, next) => {
  const user = req.user;

  res.status(200).json({
    status: "success",
    data: user,
  });
});
