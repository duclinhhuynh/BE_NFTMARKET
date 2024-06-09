const express = require("express"); 
const usersRouter = express.Router();
const {getAllUsers,getSingleUsers,createUsers,updateUsers,deleteUsers} = require("./../controllers/usersController");
// Routers users
usersRouter.route("/").get(getAllUsers).post(createUsers);
usersRouter.route("/:id").get(getSingleUsers).patch(updateUsers).delete(deleteUsers);
module.exports = usersRouter;