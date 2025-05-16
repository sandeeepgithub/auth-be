const Joi = require("joi");
const validator = require("express-joi-validation").createValidator({
  passError: true,
});

const validateSignup = validator.body(
  Joi.object({
    email: Joi.string().email().required().messages({
      "string.email": "Kindly provide a valid email address.",
      "string.empty": "Email cannot be empty.",
      "any.required": "Email is required.",
    }),

    password: Joi.string()
      .required()
      .min(8)
      .max(15)
      .regex(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/
      )
      .messages({
        "string.base": "Password must be a string.",
        "string.empty": "Password cannot be empty.",
        "string.min": "Password must be at least 8 characters long.",
        "string.max": "Password must be at most 15 characters long.",
        "any.required": "Password is required.",
      }),

    firstName: Joi.string().min(3).max(72).required().messages({
      "string.base": "First name must be a string.",
      "string.empty": "First name cannot be empty.",
      "string.min": "First name must be at least 3 characters long.",
      "string.max": "First name must be at most 72 characters long.",
      "any.required": "First name is required.",
    }),

    lastName: Joi.string().min(3).max(72).required().messages({
      "string.base": "Last name must be a string.",
      "string.empty": "Last name cannot be empty.",
      "string.min": "Last name must be at least 3 characters long.",
      "string.max": "Last name must be at most 72 characters long.",
      "any.required": "Last name is required.",
    }),

    dob: Joi.date().iso().required().messages({
      "date.base": "Date of birth must be a valid date.",
      "date.format": "Date of birth must be in ISO format.",
      "any.required": "Date of birth is required.",
    }),
    countryCode: Joi.number().integer().min(1).max(999).required().messages({
      "number.base": "Country code must be a valid number.",
      "number.empty": "Country code cannot be empty.",
      "number.min": "Country code must be at least 1.",
      "number.max": "Country code must be at most 999.",
      "any.required": "Country code is required.",
    }),

    contact: Joi.string()
      .min(6)
      .max(15)
      .regex(/^[0-9]+$/)
      .messages({
        "string.base": "Phone number must be a string.",
        "string.empty": "Phone number cannot be empty.",
        "string.min": "Phone number must be at least 6 characters.",
        "string.max": "Phone number must not be more than 15 characters.",
        "string.pattern.base": "Phone number must only contain digits.",
        "any.required": "Phone number is required.",
      }),
  })
);

const validateSignin = validator.body(
  Joi.object({
    email: Joi.string().email().required().messages({
      "string.email": "Kindly provide a valid email address.",
      "string.empty": "Email cannot be empty.",
      "any.required": "Email is required.",
    }),

    password: Joi.string().required().min(6).max(20).messages({
      "string.base": "Password must be a string.",
      "string.empty": "Password cannot be empty.",
      "string.min": "Password must be at least 6 characters long.",
      "string.max": "Password must be at most 20 characters long.",
      "any.required": "Password is required.",
    }),
  })
);

const validatePassword = validator.body(
  Joi.object({
    oldPassword: Joi.string().optional(),
    newPassword: Joi.string()
      .required()
      .min(8)
      .max(15)
      .regex(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/
      )
      .messages({
        "string.base": "Password must be a string.",
        "string.empty": "Password cannot be empty.",
        "string.min": "Password must be at least 8 characters long.",
        "string.max": "Password must be at most 15 characters long.",
        "any.required": "Password is required.",
        "string.pattern.base":
          "Password must contain at least one digit, one uppercase letter, one lowercase letter, and one special character, with no spaces.",
      }),
  })
);

module.exports = { validateSignup, validateSignin, validatePassword };
