const fs = require("fs");
const express = require("express");
const app = express();
app.use(express.json());
// const nfts = JSON.parse(fs.readFileSync(`${__dirname}/../nft-data/data/nft-simple.json`));
const NFT = require("./../models/nftsModel");
const catchAsync = require("../utils/catchAsync");
const APIFeatures = require("./../utils/apiFeatures");
const AppError = require("../utils/appError");
exports.checkId = (req, res, next, value) => {
  console.log(`ID: ${value}`);
  // if(req.params.id * 1 > nfts.length) {
  //     return res.status(404).json({
  //         status: "fail",
  //         message: "Invalid ID",
  //     })
  // }
  next();
};

exports.aliasTopNFTs = (req, res, next) => {
  (req.limit = "5"), (req.query.sort = "-ratingsAverage, price");
  req.query.fields = "name, price,ratingsAverage,difficulty";
  next();
};

exports.getAllNfts = catchAsync(async (req, res) => {
  const features = new APIFeatures(NFT.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .pagination();
  const nfts = await features.query;

  // const nfts = await query;
  res.status(200).json({
    status: "success",
    requestTime: req.requestTime,
    results: nfts.length,
    data: {
      nfts,
    },
  });
});

// Get single NFT
exports.getSingle = catchAsync(async (req, res, next) => {
  const nft = await NFT.findById(req.params.id);
  if (!nft) {
    return next(new AppError("No nft found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      nft,
    },
  });
});

// create nft
exports.createNFT = catchAsync(async (req, res, next) => {
  const newNFT = await NFT.create(req.body);
  if (!nft) {
    return next(new AppError("No nft found with that ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      nft: newNFT,
    },
  });
  // try {
  //     const newNFT = await NFT.create(req.body);
  //     res.status(200).json({
  //         status: "success",
  //         data: {
  //             nft: newNFT,
  //         },
  //     });
  // } catch (error) {
  //     res.status(400).json({
  //         status: "fail",
  //         message: error,
  //     });
  // }
});

// path nft
exports.updateNFTs = catchAsync(async (req, res, next) => {
  const nft = await NFT.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!nft) {
    return next(new AppError("No nft found with that ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      nft,
    },
  });
});

// Delete NFT
exports.deleteNFTs = catchAsync(async (req, res, next) => {
  const nft = await NFT.findByIdAndDelete(req.params.id);
  if (!nft) {
    return next(new AppError("No nft found with that ID", 404));
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});

// Aggregation Pipeline

exports.getNFTsStats = catchAsync(async (req, res, next) => {
  const stats = await NFT.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: "$difficulty",
        num: { $sum: 1 },
        numRatings: { $sum: "$ratingsQuantity" },
        avgRating: { $avg: "$ratingsAverage" },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
      },
    },
    {
      $sort: {
        avgRating: 1,
      },
    },
    {
      $match: {
        _id: { $ne: "EASY" },
      },
    },
  ]);
  res.status(200).json({
    status: "success",
    data: {
      stats,
    },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const plan = await NFT.aggregate([
    {
      $unwind: "$startDates",
    },
    // set up day start,day end
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    // group numNFTStarts and date
    {
      $group: {
        _id: { $month: "$startDates" },
        numNFTStarts: { $sum: 1 },
        nfts: { $push: "$name" },
      },
    },
    // field of month
    {
      $addFields: {
        month: "$_id",
      },
    },
    // hidden id
    {
      $project: {
        _id: 0,
      },
    },
    // sort d
    {
      $sort: {
        numNFTStarts: -1,
      },
    },
    // limit data
    {
      $limit: 6,
    },
  ]);
  res.status(200).json({
    status: "success",
    data: {
      plan,
    },
  });
});
