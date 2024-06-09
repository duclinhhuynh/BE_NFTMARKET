const fs = require("fs")
const express = require("express"); 
const app = express();
app.use(express.json());
const nfts = JSON.parse(fs.readFileSync(`${__dirname}/../nft-data/data/nft-simple.json`)); 
const NFT = require("./../models/nftsModel");
exports.checkId = (req, res, next, value) => {
    console.log(`ID: ${value}`);
    // if(req.params.id * 1 > nfts.length) {
    //     return res.status(404).json({
    //         status: "fail",
    //         message: "Invalid ID",
    //     })
    // }
    next()
}

// exports.checkBody = (req, res, next) => {
//     console.log('checkbody')
//     if(!req.body.name || !req.body.price){
//         return res.status(400).json({
//             status: "fail",
//             message:"missing name and price",
//         });
//     }
//     next();
// }

// getAll nft
exports.getAllNfts = async(req, res)=> {
    try {
        const nfts = await NFT.find();
        console.log(req.requestTime);
        res.status(201).json({
            status: "success",
            requestTime: req.requestTime,
            results: nfts.length,
            data:{
                nfts,
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'fail',
            message: "server error"
        })
    }

}

// Get single NFT
exports.getSingle = async(req, res) => {
    try {
    const nft = await NFT.findById(req.params.id);
    res.status(200).json({
        status: "success",
        data: {
            nft,
        }
    });
   } catch (error) {
    res.status(404).json({
        status: "fail",
        message: "error"
    });
   }
  
};

// create nft 
exports.createNFT = async (req, res) => {
    try {
        const newNFT = await NFT.create(req.body);
        res.status(200).json({
            status: "success",
            data: {
                nft: newNFT,
            },
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: error,
        });
    }
};

// path nft
exports.updateNFTs = async (req, res) => {
    try {
        const nft = await NFT.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        })
        res.status(200).json({
            status: "success",
            data: {
                nft,
            }
        })
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: error,
        });
    }
}

// Delete NFT
exports.deleteNFTs = async (req, res) => {
    try {
        await NFT.findByIdAndDelete(req.params.id)
        res.status(204).json({
            status: "success",
            data: null,
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: error,
        });
    }
}
