const fs = require("fs")
const express = require("express"); 
const app = express();
app.use(express.json());
const nfts = JSON.parse(fs.readFileSync(`${__dirname}/../nft-data/data/nft-simple.json`)); 
const NFT = require("./../models/nftsModel");
const APIFeatures = require("./../utils/apiFeatures");
const { match } = require("assert");
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

exports.aliasTopNFTs = (req, res, next) => {
    req.limit = '5',
    req.query.sort = "-ratingsAverage, price";
    req.query.fields = "name, price,ratingsAverage,difficulty";
    next();
}

exports.getAllNfts = async(req, res) => {
    try {
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
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'fail',
            message: "Server error"
        });
    }
};

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

// Aggregation Pipeline

exports.getNFTsStats = async (req, res) => {
    try {
            const stats = await NFT.aggregate([
            {
                $match: { ratingsAverage: { $gte: 4.5 } },
            },
            {
                $group: {
                    _id: "$difficulty",
                    num: {$sum: 1},
                    numRatings: {$sum: "$ratingsQuantity"},
                    avgRating: {$avg: "$ratingsAverage"},
                    avgPrice: {$avg: "$price"},
                    minPrice: {$min: "$price"},
                    maxPrice: {$max: "$price"},
                }
            },
            {
                $sort: {
                    avgRating:1
                }
            },
            {
                $match: {
                    _id: {$ne: "EASY"}
                }
            }
        ])
        res.status(200).json({
            status: "success",
            data: {
                stats,
            },
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: error,
        });
    }
}

exports.getMonthlyPlan = async (req, res) => {
    try {
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
                    }
                }
            },
            // group numNFTStarts and date
            {
                $group: {
                    _id: { $month: "$startDates"},
                    numNFTStarts: {$sum: 1},
                    nfts: {$push: "$name"},
                }
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
                }
            },
            // sort d
            {
                $sort: {
                    numNFTStarts: -1,
                }
            },
            // limit data
            {
                $limit: 6,
            }
        ]);
        res.status(200).json({
            status: "success",
            data: {
                plan,
            },
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: error,
        });
    }
} 

