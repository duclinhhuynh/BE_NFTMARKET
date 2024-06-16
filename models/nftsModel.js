const mongoose = require("mongoose");
const slugify = require("slugify");
const validator = require("validator");
const nftSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A NFT must have a name"],
      unique: true,
      trim: true,
      maxlenght: [30, "nft must have 30 character"],
      minlenght: [10, "nft must have 10 character"],
      validate: [validator.isAlpha, "Nft name must only contain characters"],
    },
    slug: String,
    duration: {
      type: Number, // Changed to Number for calculation
      required: [true, "must provide duration"],
    },
    maxGroupSize: {
      type: Number,
      default: 4.5,
    },
    difficulty: {
      type: String,
      required: [true, "must have difficulty"],
      enum: ["easy", "medium", "difficulty"],
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "must have 1"],
      max: [5, "must have 5"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "A NFT must have a price"],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: "discount must < regular price ",
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, "must provide the summary"],
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
      default: Date.now(),
    },
    startDates: [Date],
    secretNFTs: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

nftSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});

// mongoose middleware
nftSchema.pre("save", function (next) {
  if (this.isModified("name") || this.isNew) {
    this.slug = slugify(this.name, {
      lower: true,
      replacement: "-", // Use underscore instead of dash
    });
    console.log("slug", this.slug);
  }
  console.log("document will save...");
  next();
});

nftSchema.post("save", function (doc, next) {
  console.log(doc);
  next();
});

// query middle ware
nftSchema.pre(/^find^/, function (next) {
  this.find({ secretNFTs: { $ne: true } });
  this.start = Date.now();
  next();
});

nftSchema.pre("findOne", function (next) {
  this.find({ secretNFTs: { $ne: true } });
  next();
});

nftSchema.pre(/^find^/, function (doc, next) {
  console.log(`query took time: ${Date.now() - this.start} times`);
  console.log(doc);

  next();
});
// AGGreation middleware
nftSchema.pre("aggregate", function (next) {
  console.log(
    this.pipleline() / unshift({ $match: { secretNFTs: { $ne: true } } })
  );
  next();
});

const NFT = mongoose.model("NFT", nftSchema);

module.exports = NFT;
