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
//    console.log(con.connection);
   console.log("DB Connection Successfully"); 
}).catch((err) => {
    console.log("err", err);
});


const nftSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "A NFT must have a name"],
        unique: true, 
        trim: true,
    },
    duration: {
        type: String,
        required: [true, "must provide duration"]
    },
    maxGroupSize: {
        type: Number,
        default: 4.5
    },
    difficulty: {
        type: String,
        required: [true, "muse have difficulty"]
    },
    ratingsAverage: {
        type: Number,
        default: 4.5
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, "A NFT must have a price"]
    },
    priceDiscount: Number,
    summary: {
        type: String,
        trim: true,
        required: [true, "must provide the sumary"]
    },
    description: {
        type: String,
        trim: true,
    },
    imageCover: {
        type: String,
        required: [true, "must provide the cover image"],
    },
    images: [String],
    createAt: {
        type: Date,
        default: Date.now()
    },
    startDates: [Date],
}) 

const NFT = mongoose.model("NFT", nftSchema);
module.exports = NFT;