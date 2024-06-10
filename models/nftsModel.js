const mongoose = require("mongoose");
const dotenv = require("dotenv");
const slugify = require('slugify');

dotenv.config({ path: "./config.env" });

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

const nftSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "A NFT must have a name"],
        unique: true, 
        trim: true,
    },
    slug: String,
    duration: {
        type: Number,  // Changed to Number for calculation
        required: [true, "must provide duration"]
    },
    maxGroupSize: {
        type: Number,
        default: 4.5
    },
    difficulty: {
        type: String,
        required: [true, "must have difficulty"]
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
        required: [true, "must provide the summary"]
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
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

nftSchema.virtual("durationWeeks").get(function() {
    return this.duration / 7;
});

// mongoose middleware
nftSchema.pre("save", function(next) {
    if (this.isModified('name') || this.isNew) {
        this.slug = slugify(this.name, {
            lower: true,
            replacement: '-', // Use underscore instead of dash
        });
        console.log("slug", this.slug);
    }
    console.log("document will save...");
    next();
});

nftSchema.post("save", function(doc, next) {
    console.log(doc);
    next();
});

const NFT = mongoose.model("NFT", nftSchema);

module.exports = NFT;
