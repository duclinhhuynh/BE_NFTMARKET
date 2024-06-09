const dotenv = require("dotenv");
const mongoose = require("mongoose");
const app = require("./app");
dotenv.config({path: "./config.env"});
const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.DATABASE_PASSWORD)

mongoose.connect(DB, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
})
.then((con) => {
   console.log(con.connection);
   console.log("DB Connection Successfully"); 
}).catch((err) => {
    console.log("err", err);
});

dotenv.config({path: "./config.env"})
console.log(process.env);
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`app runnig  on port ${port}....`);
})