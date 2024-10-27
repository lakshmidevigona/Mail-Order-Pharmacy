const mongoose = require("mongoose");


const drugSchema = new mongoose.Schema({
    drugName: { type:String, required:true},
    location : { type:[String], required:true},
    Cost : { type:Number, required:true},
    CapsulesPerPack: { type:Number, required:true},
    Company : { type:String, required:true},
    image: { type:String, require:true }
});

const Drug = mongoose.model("drugs",drugSchema)

module.exports = Drug