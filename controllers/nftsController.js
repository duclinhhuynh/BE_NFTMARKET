const fs = require("fs")
const nfts = JSON.parse(fs.readFileSync(`${__dirname}/../nft-data/data/nft-simple.json`)); 
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
exports.creatNFT = (req, res) => {
    const newId = nfts[nfts.length-1].id + 1;
    const newNFTs = Object.assign({id : newId}, req.body);
    nfts.push(newNFTs);
    fs.writeFile(`${__dirname}/nft-data/data/nft-simple.json`, JSON.stringify(nfts), err => {
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
};
