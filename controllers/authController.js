const {promisify} = require("util");
const User = require("../models/usersModel");
const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");
// CREATE TOKEN
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// signup
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  const token = signToken(newUser._id);
  res.status(201).json({
    status: "Success",
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    next(new AppError("Please provide your email & password"));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email and password", 401));
  }
  console.log(user);
  const token = signToken(user.id);
  res.status(200).json({
    status: "success",
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  // check token
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Be")) {
    token = req.headers.authorization.split(" ")[1];
    // console.log(req.headers);
  }
  if (!token) {
    return next(new AppError("Your are not logged in to", 401));
  }
  // validate token
  const decoded = await promisify (jwt.verify)(token, process.env.JWT_SECRET);
  console.log(decoded);

  const freshUser = await User.findById(decoded);
  
  if(!freshUser){
    return next (
      new AppError("The error belonging to this token no longer exist", 401)
    );
  }
  freshUser.changedPasswordAfter(decoded.iat);
  next();
});
