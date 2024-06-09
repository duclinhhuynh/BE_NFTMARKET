const fs = require("fs")
const express = require("express"); 
const usersRouter = express.Router();

const users = JSON.parse(fs.readFileSync(`${__dirname}/../nft-data/data/nft-users.json`)); 
// get all users
const getAllUsers = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "internal server error",
    });
 };
 const getSingleUsers = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "internal server error",
    });
 };
 const createUsers = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "internal server error",
    });
 };
 const updateUsers = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "internal server error",
    });
 };
 const deleteUsers = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "internal server error",
    });
 };
// Routers users
usersRouter.route("/").get(getAllUsers).post(createUsers);
usersRouter.route("/:id").get(getSingleUsers).patch(updateUsers).delete(deleteUsers);
module.exports = usersRouter;