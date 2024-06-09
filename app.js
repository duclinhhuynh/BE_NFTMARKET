const fs = require("fs");
const express = require("express");
const morgan = require("morgan");
const nftsRouter = require("./routes/nftsRouter");
const usersRouter = require("./routes/usersRouter");

const app = express()

app.use(express.json())
app.use(morgan("dev"))
app.use((req, res, next) => {
    // convert to string
    req.requestTime = new Date().toISOString();
    next();
})
// custom middle ware
app.use((req, res, next) => {
    console.log("HEY I am from to middle ware");
    next();
});

app.use("/api/v1/nfts", nftsRouter);
app.use("/api/v1/users", usersRouter);

module.exports = app