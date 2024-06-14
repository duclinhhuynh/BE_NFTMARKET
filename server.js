const dotenv = require("dotenv");
const mongoose = require("mongoose");
const app = require("./app");
dotenv.config({path: "./config.env"})

process.on("unhandledRejection", err => {
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    })
})
const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.DATABASE_PASSWORD);

mongoose.connect(DB, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,  // Added for better compatibility with the latest MongoDB driver
})
.then(() => {
    console.log("DB Connection Successfully"); 
})
.catch((err) => {
    console.log("Error", err);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`app runnig  on port ${port}....`);
})

process.on("uncaughtException", err => {
    console.log("unhandleRecjection shutting down");
    console.log(err);
    server.close(() => {
        process.exit(1);
    })
})

