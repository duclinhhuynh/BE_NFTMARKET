const express = require("express"); 
const nftsRouter = express.Router();
const {getAllNfts,getSingle,creatNFT,updateNFTs,deleteNFTs} = require("./../controllers/nftsController");

// ROUTER NFTS
nftsRouter.route("/").get(getAllNfts).post(creatNFT);
nftsRouter.route("/:id").get(getSingle).patch(updateNFTs).delete(deleteNFTs);

module.exports = nftsRouter;