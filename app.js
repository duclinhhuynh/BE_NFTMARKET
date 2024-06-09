const usersRouter = require("./routes/usersRouter");
const nftsRouter = require("./routes/nftsRouter");
const morgan = require("morgan");
const express = require("express"); 
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
app.use((req, res, next) => {
    console.log("HEY I am from to middle ware");
    next();
});

app.use("/api/v1/nfts", nftsRouter);
app.use("/api/v1/users", usersRouter);

module.exports = app