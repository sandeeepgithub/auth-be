const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");
const AppError = require("../utils/AppError.js");
const catchAsyncError = require("../utils/catchAsyncErrors.js");
const { generateOtp, jwtToken } = require("../utils/commonFunctions.js");

const { messages } = require("../utils/messages");

exports.protect = catchAsyncError(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else {
    return next(
      new AppError(404, `You're not logged in. Please login to access.`)
    );
  }

  const { id } = jwt.verify(token, process.env.JWT_SECRET_KEY);

  const user = await User.findById(id).select("+otp password isActive");

  req.user = user;
  next();
});

/* ------------------- */
exports.signUp = catchAsyncError(async (req, res, next) => {
  const incomingData = { ...req.body };

  let otp = generateOtp();

  let user = await User.findOne({ email: incomingData.email });

  if (user) {
    return next(new AppError(409, messages.error.userExists));
  }

  incomingData.otp = otp;
  incomingData.otpCreatedAt = Date.now();

  if (!user) {
    user = await User.create(incomingData);
  }

  delete user._doc.otp;
  delete user._doc.otpCreatedAt;
  delete user._doc.password;

  const token = jwtToken(user._id);

  res.status(200).json({
    status: "success",
    message: "Signup success. You will receive otp on your email or phone",
    data: user,
    token,
  });
});

/* ------------------- */
exports.signIn = catchAsyncError(async (req, res, next) => {
  let user;

  if (req.body.email) {
    const { email, password } = req.body;

    user = await User.findOne({ email }).select("+password");

    if (!user || !user.isActive) {
      return next(new AppError(409, messages.error.userNotFound));
    }

    if (!(await user.checkPassword(password))) {
      return next(new AppError(409, messages.error.wrongEmailPwd));
    }
  }

  delete user._doc.password;

  const token = jwtToken(user._id);

  res.status(200).json({
    status: "success",
    data: user,
    token,
  });
});

/* ------------------- */

exports.changePassword = catchAsyncError(async (req, res, next) => {
  const user = req.user;

  console.log({ user });

  if (!user.isActive) {
    return next(new AppError(401, messages.error.userNotFound));
  }

  const { oldPassword, newPassword } = req.body;

  if (oldPassword === newPassword) {
    return next(new AppError(401, messages.error.diffPwd));
  }

  if (!(await user.checkPassword(oldPassword))) {
    return next(new AppError(401, messages.error.wrongPwd));
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({
    status: "success",
    message: "Password updated successfully.",
  });
});

/* ------------------- */

exports.sendOtp = catchAsyncError(async (req, res, next) => {
  let otp = generateOtp();

  const smsText = `Forgot your password? Here is your reset code: ${otp}. The code will be valid only for 5 minutes`;

  const { email } = req.body;

  const user = await User.findOneAndUpdate(
    { email },
    { otp: otp, otpCreatedAt: Date.now() },
    { new: true }
  );

  if (!user) {
    return next(new AppError(404, "No user found with this email id"));
  }

  console.log({ smsText });
  const token = jwtToken(user._id);

  res.status(200).json({
    status: "success",
    token,
  });
});

/* ------------------- */

exports.verifyOtp = catchAsyncError(async (req, res, next) => {
  const userDetails = await User.findById(req.user.id).select(
    "+otp +otpCreatedAt +password"
  );

  const otpCreatedAt = userDetails.otpCreatedAt;

  if (Date.now() > new Date(`${otpCreatedAt}`).getTime() + 1000 * 60 * 5) {
    await User.findByIdAndUpdate(
      userDetails._id,
      {
        otp: null,
      },
      {
        new: true,
      }
    );
    return next(new AppError(401, messages.error.otpExpired));
  }

  if (parseInt(req.body.otp) !== userDetails.otp) {
    return next(new AppError(401, messages.error.invalidOtp));
  }

  await User.findByIdAndUpdate(
    userDetails._id,
    {
      isActive: true,
      otp: null,
    },
    {
      new: true,
    }
  );

  if (req.body.newPassword) {
    delete req.body.otp;
    return next();
  }

  res.status(200).json({
    status: "success",
  });
});

/* ------------------- */

exports.resetPassword = catchAsyncError(async (req, res, next) => {
  const { newPassword } = req.body;

  const user = await User.findById(req.user._id).select("+password");

  console.log({ user });

  if (!user) {
    return next(new AppError(404, messages.error.userNotFound));
  }

  if (await user.checkPasswordOnReset(newPassword, user.password)) {
    return next(new AppError(401, messages.error.diffPwd));
  }

  delete user._doc.password;

  user.otp = null;
  user.otpCreatedAt = null;

  user.password = newPassword;
  await user.save();

  res.status(200).json({
    status: "success",
  });
});
