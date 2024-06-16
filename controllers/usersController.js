const fs = require("fs");
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/../nft-data/data/nft-users.json`)
);
const User = require("./../models/usersModel");
const APIFeatures = require("./../utils/apiFeatures");
const catchAsync = require("../utils/catchAsync");
// get all users
exports.getAllUsers = catchAsync(async (req, res) => {
  const features = new APIFeatures(User.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .pagination();
  const users = await features.query;
  res.status(200).json({
    status: "success",
    requestTime: req.requestTime,
    results: users.length,
    data: {
      users,
    },
  });
  res.status(500).json({
    status: "error",
    message: "internal server error",
  });
});
exports.getSingleUsers = async (req, res) => {
  const features = new APIFeatures(User.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .pagination();
  const users = await features.query;
  res.status(200).json({
    status: "success",
    requestTime: req.requestTime,
    results: nfts.length,
    data: {
      nfts,
    },
  });
};
exports.createUsers = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "internal server error",
  });
};
exports.updateUsers = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "internal server error",
  });
};
exports.deleteUsers = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "internal server error",
  });
};
