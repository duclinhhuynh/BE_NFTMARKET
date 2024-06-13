const AppError = require("../utils/appError");

const handleDuplicateFieldsBD = (err) => {
    const value = err.errmsg.match(/(?<=")(?:\\.|[^\\])*(?=")/)
    console.log(value);
    const message = `Duplicate field values H. please use another value`;
    return new AppError(message, 400);
}
const handleCastError = err => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new AppError(message, 400);
}

const handleValidationError = (err) => {
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `Invalid input Data. ${errors.join(". ")}`;
    return new AppError(message, 400);
}

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        error: err,
        stack: err.stack
    });
};
const sendErrorPro = (err, res) => {
    if (err.isOperational){
        res.status(err.statusCode).json({
            status:err.status,
            message: err.message,
        })
    }else {
        res.status(500).json({
            status: "error",
            message: "something went very wrong",
        })
    }
};

module.exports = (err, req, res, next) => {
    console.log(err, stack);
    err.status = err.status || 500,
    err.status = err.status || "error"
    if(process.env.NODE_ENV === "development"){
        sendErrorDev(err, res);
    } else if (process.env.NODE_ENV === "production"){
        let error = {...err};
        if(error.name === "CastError") error = handleCastError(error);
        if(error.code === 11000) error = handleDuplicateFieldsBD(error);
        if(error.name === "ValidationError") error = handleValidationError(error);
        sendErrorPro(err, res)
    }
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
    });
}