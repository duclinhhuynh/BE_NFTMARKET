const User = require("../models/usersModel");
const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");
// signup 
exports.signup = catchAsync( async(req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    });
    const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
    res.status(201).json({
        status: "Success",
        token,
        data: {
            user: newUser,
        },
    });
    next();
});