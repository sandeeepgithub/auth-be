const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name cannot be empty"],
    },
    lastName: {
      type: String,
      required: [true, "Last name cannot be empty"],
    },
    countryCode: {
      type: Number,
      required: [true, "Country code cannot be empty"],
      default: null,
    },
    contact: {
      type: Number,
      required: [true, "Contact information cannot be empty"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Email information cannot be empty"],
      default: "",
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password cannot be empty"],
      select: false,
    },
    dob: {
      type: String,
      required: [true, "Date of birth cannot be empty"],
      default: "",
    },
    otp: {
      type: Number,
      default: null,
      select: false,
    },
    otpCreatedAt: {
      type: Date,
      default: null,
      select: false,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

UserSchema.pre("save", function (next) {
  if (this.dob && typeof this.dob === "string") {
    this.dob = new Date(this.dob).toISOString();
  } else if (this.dob instanceof Date) {
    this.dob = this.dob.toISOString();
  }

  next();
});

UserSchema.methods.checkPassword = async function (loginPassword) {
  return await bcrypt.compare(loginPassword, this.password).then((res) => res);
};

UserSchema.methods.checkPasswordOnReset = async function (
  loginPassword,
  oldHashedPassword
) {
  return await bcrypt
    .compare(loginPassword, oldHashedPassword)
    .then((res) => res);
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
