const User = require("../models/usersModel");
const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");
const AppError = require("../Utils/appError");
// CREATE TOKEN
const signToken = (id)=> {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn:process.env.JWT_EXPIRES_IN,
    })
}

// signup 
exports.signup = catchAsync( async(req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
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

exports.login = catchAsync(async(req, res, next) => {
    const {email, password} = req.body;
    if(!email || !password){
        next(new AppError("Please provide your email & password"));
    }   
    const user = await User.findOne({email}).select("+password");
    if(!user || !(await user.correctPassword(password, user.password))){
        return next(new AppError("Incorrect email and password", 401));
    }
    console.log(user);
    const token = signToken(user.id);
    res.status(200).json({
        status: "success",
        token,
    })
})