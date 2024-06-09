const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({path: "./config.env"})
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


const nftSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "A NFT must have a name"],
        unique: true, 
    },
    rating: {
        type: Number,
        default: 4.5
    },
    price: {
        type: Number,
        required: [true, "A NFT must have a price"]
    },
}) 

const NFT = mongoose.model("NFT", nftSchema);
module.exports = NFT;