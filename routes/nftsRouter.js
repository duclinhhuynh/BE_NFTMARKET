const express = require("express"); 
const nftsRouter = express.Router();
const controllers = require("./../controllers/nftsController");
const catchAsync = require("../utils/catchAsync");
// nftsRouter.param("id", controllers.checkId)

// TOP ROUTER NFTS
nftsRouter.route('/top-5-nfts')
.get(controllers.aliasTopNFTs, controllers.getAllNfts);

// STATS ROUTER
nftsRouter.route("/nfts-stats").get(controllers.getNFTsStats);

// MONTH ROUTER
nftsRouter.route("/monthly-plan/:year").get(controllers.getMonthlyPlan);

// ROUTER NFTS
nftsRouter.route("/").get(controllers.getAllNfts).post(controllers.createNFT);
nftsRouter.route("/:id").get(controllers.getSingle).patch(controllers.updateNFTs).delete(controllers.deleteNFTs);

module.exports = nftsRouter;