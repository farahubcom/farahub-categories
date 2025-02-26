const mongoose = require("mongoose");
const mongooseLeanVirtuals = require('mongoose-lean-virtuals');

const { Schema } = mongoose;
const { ObjectId } = mongoose.Types;


const CategorySchema = new Schema({
    identifier: { type: String, unique: true, lowercase: true, sparse: true },
    name: { type: Map, of: String },
    label: String,
    parent: { type: ObjectId, ref: 'Category' },
    children: [{ type: ObjectId, ref: 'Category' }]
}, {
    
    /**
     * Name of the collection
     * 
     * @var string
     */
    collection: "categories:categories",
});

CategorySchema.pre('save', function (next) {
    this.wasNew = this.isNew;
    next();
});

CategorySchema.plugin(mongooseLeanVirtuals);

module.exports = CategorySchema;