const mongoose = require("mongoose");
const mongooseLeanVirtuals = require('mongoose-lean-virtuals');


const { Schema } = mongoose;
const { ObjectId } = mongoose.Types;


const ProductSchema = new Schema({
    categories: [{ type: ObjectId, ref: 'Category' }],
}, { timestamps: true });

ProductSchema.pre('save', function (next) {
    this.wasNew = this.isNew;
    next();
});

ProductSchema.plugin(mongooseLeanVirtuals);

module.exports = ProductSchema;