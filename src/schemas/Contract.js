const mongoose = require("mongoose");
const mongooseLeanVirtuals = require('mongoose-lean-virtuals');


const { Schema } = mongoose;
const { ObjectId } = mongoose.Types;


const ContractSampleSchema = new Schema({
    category: { type: ObjectId, ref: 'Category' },
}, { timestamps: true });

ContractSampleSchema.plugin(mongooseLeanVirtuals);

module.exports = ContractSampleSchema;