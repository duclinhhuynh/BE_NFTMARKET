const fs = require("fs")
const users = JSON.parse(fs.readFileSync(`${__dirname}/../nft-data/data/nft-users.json`)); 
// get all users
exports.getAllUsers = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "internal server error",
    });
 };
exports.getSingleUsers = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "internal server error",
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