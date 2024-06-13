const morgan = require("morgan");
const express = require("express");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController")
const usersRouter = require("./routes/usersRouter");
const nftsRouter = require("./routes/nftsRouter");
const app = express();
app.use(express.json());
if(process.env.NODE_ENV === "development") {
    app.use(morgan("dev"))
}

app.use(morgan("dev"))
// SERVING TEMPLATE DEMO
app.use(express.static(`${__dirname}/nft-data/img`));
// CUSTOM MIDDLE WARE
app.use((req, res, next) => {
    // convert to string
    req.requestTime = new Date().toISOString();
    next();
})
// custom middle ware
// app.use((req, res, next) => {
//     console.log("HEY I am from to middle ware");
//     next();
// });

app.use("/api/v1/nfts", nftsRouter);
app.use("/api/v1/users", usersRouter);
// ERROR
app.all("*", (req,res, next) => {
    // res.status(404).json({
    //     status: "fail",
    //     message: `Can't find ${req.originalUrl} on this server`,
    // });
    // const err = new Error(`Can't fint ${req.originalUrl} on this server`, 404);
    // err.status = "fail";
    // err.statusCode = 404;
    // next(err)
    next(new AppError(`can't find ${req.originalUrl} on this server`, 404));
});
// Global Error handeing
app.use(globalErrorHandler);

module.exports = app