const fs = require("fs")
const express = require("express"); 
const app = express();
app.use(express.json());
const nfts = JSON.parse(fs.readFileSync(`${__dirname}/../nft-data/data/nft-simple.json`)); 
exports.checkId = (req, res, next, value) => {
    console.log(`ID: ${value}`);
    if(req.params.id * 1 > nfts.length) {
        return res.status(404).json({
            status: "fail",
            message: "Invalid ID",
        })
    }
    next()
}

exports.checkBody = (req, res, next) => {
    console.log('checkbody')
    if(!req.body.name || !req.body.price){
        return res.status(400).json({
            status: "fail",
            message:"missing name and price",
        });
    }
    next();
}

// getAll nft
exports.getAllNfts = (req, res)=> {
    console.log("hello");
    console.log(req.requestTime);
    res.status(201).json({
        status: "success",
        requestTime: req.requestTime,
        results: nfts.length,
        data:{
            nfts,
        }
    });
}

// Get single NFT
exports.getSingle = (req, res) => {
    console.log("req", req.params);
    const id = req.params.id * 1;
    const nft = nfts.find((el) => el.id === id);
    if (!nft) {
        return res.status(404).json({
            status: "fail",
            message: "Invalid ID"
        });
    }
    res.status(200).json({
        status: "success",
        data: {
            nft,
        }
    });
};

// create nft 
exports.createNFT = (req, res) => {
    console.log("req", req.body);
    const newId = nfts[nfts.length-1].id + 1;
    const newNFTs = Object.assign({id : newId}, req.body);
    nfts.push(newNFTs);
    fs.writeFile(`${__dirname}/../nft-data/data/nft-simple.json`, JSON.stringify(nfts), err => {
        res.status(201).json({
            status: "success",
            nft: newNFTs,
        })
   })
}

// path nft
exports.updateNFTs = (req, res) => {
    if(req.params.id * 1 > nfts.json({
        status: "fail",
        message: "invalid ID",
    }));
    res.status(200).json({
        status: "success",
        data: {
            nft: "updating nft",
        }
    })
}

// Delete NFT
exports.deleteNFTs = (req, res) => {
    console.log(req.params);
    const id = req.params.id * 1;
    const nft = nfts.find((el) => el.id === id);
    if (!nft) {
        return res.status(404).json({
            status: "fail",
            message: "Invalid ID"
        });
    }
    // Here, you would add your delete logic
    res.status(204).json({
        status: "success",
        data: null,
    });
}
