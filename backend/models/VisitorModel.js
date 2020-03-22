var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var VisitorSchema = new Schema({
	visitorName: {type: String, required: true},
	description: {type: String, required: true},
	email: {type:String, required: true},
	time: {type: String, required: true},
	phone: {type: Number, required: true},
	startup_email: {type: String, required: true},
	user: { type: Schema.ObjectId, ref: "User", required: false },
	status: { type: String, required: false, default:"Applied"}
}, {timestamps: true});

module.exports = mongoose.model("Visitor", VisitorSchema);