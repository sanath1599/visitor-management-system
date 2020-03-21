var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var VisitorSchema = new Schema({
	visitor: {type: String, required: true},
	description: {type: String, required: true},
	time: {type: String, required: true},
	phone: {type: Number, required: true},
	contact: {type: String, require: true},
	user: { type: Schema.ObjectId, ref: "User", required: true },
}, {timestamps: true});

module.exports = mongoose.model("Visitor", VisitorSchema);