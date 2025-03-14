const mongoose = require("mongoose");
const mongooseLeanVirtuals = require('mongoose-lean-virtuals');


const { Schema } = mongoose;
const { ObjectId } = mongoose.Types;


const PersonSchema = new Schema({
    categories: [{ type: ObjectId, ref: 'Category' }],
}, { timestamps: true });

PersonSchema.pre('save', function (next) {
    this.wasNew = this.isNew;
    next();
});

PersonSchema.plugin(mongooseLeanVirtuals);

module.exports = PersonSchema;