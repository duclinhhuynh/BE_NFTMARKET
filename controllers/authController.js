const User = require("../models/usersModel");
const catchAsync = require("../utils/catchAsync");
// signup 
exports.signup = catchAsync( async(req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    });
    res.status(201).json({
        status: "Success",
        data: {
            user: newUser,
        },
    });
    next();
});