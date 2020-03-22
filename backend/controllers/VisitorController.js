/* eslint-disable no-unused-vars */
const Visitor = require("../models/VisitorModel");
const { body,validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator");
const apiResponse = require("../helpers/apiResponse");
const auth = require("../middlewares/jwt");
var mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);
//helpers
const mailer = require("../helpers/mailer");
const { constants } = require("../helpers/constants");

// Visitor Schema
function VisitorData(data) {
	this.visitorName = data.visitorName;
	this.time = data.time;
	this.description = data.description;
	this.phone = data.phone;
	this.contact = data.contact;
	this.status = data.status;
	this.createdAt = data.createdAt;	
	this.email = data.email;
}

/**
 * Visitor List.
 * 
 * @returns {Object}
 */
exports.visitorList = [auth,	
	function (req, res) {
		try {
			Visitor.find({contact: req.user.email},"List for your user").then((visitors)=>{
				if(visitors.length > 0){
					return apiResponse.successResponseWithData(res, "Operation success", visitors);
				}else{
					return apiResponse.successResponseWithData(res, "Operation success", []);
				}
			});
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

/**
 * Visitor Detail.
 * 
 * @param {string}      id
 * 
 * @returns {Object}
 */
exports.visitorDetail = [
	auth,
	function (req, res) {
		if(!mongoose.Types.ObjectId.isValid(req.params.id)){
			return apiResponse.successResponseWithData(res, "Operation success", {});
		}
		try {
			Visitor.findOne({_id: req.params.id , contact: req.user.email},"_id visitorName description phone contact status time").then((visitor)=>{                
				if(visitor !== null){
					let visitorData = new VisitorData(visitor);
					return apiResponse.successResponseWithData(res, "Operation success", visitorData);
				}else{
					return apiResponse.successResponseWithData(res, "Operation success", {});
				}
			});
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

/**
 * Visitor store.
 * 
 * @param {string}      visitor 
 * @param {string}      description
 * @param {number}      phone
 * @param {string} 		contact
 * @param {string}		time
 * 
 * @returns {Object}
 */
exports.visitorStore = [
	body("visitor", "Title must not be empty.").isLength({ min: 1 }).trim(),
	body("description", "Description must not be empty.").isLength({ min: 1 }).trim(),
	body("time", "time must not be empty.").isLength({ min: 1 }).trim(),
	body("contact", "Contact must not be empty.").isLength({ min: 1 }).trim(),
	body("email").isLength({ min: 1 }).trim().withMessage("Email must be specified.")
		.isEmail().withMessage("Email must be a valid email address."),
	body("phone", "phone must not be empty").isLength({ min: 1 }).trim().custom((value,{req}) => {
		return Visitor.findOne({phone : value}).then(Visitor => {
			if (Visitor) {
				return Promise.reject("Visitor already exists");
			}
		});
	}),
	sanitizeBody("*").escape(),
	(req, res) => {
		try {
			
			const errors = validationResult(req);
			var visitor = new Visitor(
				{ 	
					visitorName: req.body.visitor,
					time: req.body.time,
					contact: req.body.contact,
					description: req.body.description,
					phone: req.body.phone,
					email: req.body.email
				});
			console.log("Validated Data");
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}
			else {
				//Save Visitor.
				// Html email body
				let html = "<img width=400 src='https://upload.wikimedia.org/wikipedia/commons/4/40/T-Hub_Logo-PNG.png' /><br/> <p>You have received a new request from  "+req.body.visitor+"<br/> phone number: "+req.body.phone+"<br/>for: "+req.body.description+"<br/> open the portal to approve or reject</p>";

				// Send new visitor email
				mailer.send(
					constants.admin.email, 
					req.body.contact,
					"new request",
					html
				).then(
					visitor.save(function (err) {
						if (err) { return apiResponse.ErrorResponse(res, err); }
						let visitorData = new VisitorData(visitor);
					
						return apiResponse.successResponseWithData(res,"Visitor add Success.", visitorData);
					}));
			}
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];
//update extra data
// visitor: req.body.visitor,
// time: req.body.time,
// contact: req.body.contact,
// description: req.body.description,
// phone: req.body.phone,
//extra data ends
/**
 * Visitor update.
 * 
//  * @param {string}      visitor 
//  * @param {string}      description
//  * @param {number}      phone
//  * @param {string} 		contact
//  * @param {string}		time
 * @param {string}		status
 * 
 * @returns {Object}
 */
exports.visitorUpdate = [
	auth,
	// body("visitor", "Title must not be empty.").isLength({ min: 1 }).trim(),
	// body("description", "Description must not be empty.").isLength({ min: 1 }).trim(),
	// body("time", "time must not be empty.").isLength({ min: 1 }).trim(),
	// body("contact", "Contact must not be empty.").isLength({ min: 1 }).trim(),
	// body("status", "status must not be empty.").isLength({ min: 1 }).trim(),
	body("status", "phone must not be empty").isLength({ min: 1 }).trim().custom((value,{req}) => {
		return Visitor.findOne({_id : req.params.id,contact: req.user.email}).then(Visitor => {
			if (!Visitor) {
				return Promise.reject("Visitor does not exist.");
			}
		});
	}),
	sanitizeBody("*").escape(),
	(req, res) => {
		console.log("Visitor found");
		try {
			const errors = validationResult(req);
			// var visitor = new Visitor(
			// 	{ 
			// 		status: req.body.status
			// 	});

			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}
			else {
				if(!mongoose.Types.ObjectId.isValid(req.params.id)){
					return apiResponse.validationErrorWithData(res, "Invalid Error.", "Invalid ID");
				}else{
					Visitor.findById(req.params.id, function (err, foundVisitor) {
						if(foundVisitor === null){
							return apiResponse.notFoundResponse(res,"Visitor not exists with this id");
						}else{
							//Check authorized user
							if(foundVisitor.contact.toString() !== req.user.email){
								return apiResponse.unauthorizedResponse(res, "You are not authorized to do this operation.");
							}else{
								//update Visitor.
								// Send new visitor email
								let html="<img width=400 src='https://upload.wikimedia.org/wikipedia/commons/4/40/T-Hub_Logo-PNG.png' /><br/>Dear "+foundVisitor.visitorName+"<br/>Your request has been: "+req.body.status;
								mailer.send(
									constants.admin.email, 
									foundVisitor.email,
									"Update in status",
									html
								).then(
									Visitor.findByIdAndUpdate(req.params.id, { $set: { status: req.body.status }}, {},function (err) {
										if (err) { 
											return apiResponse.ErrorResponse(res, err); 
										}else{
										// let visitorData = new VisitorData(visitor);
											return apiResponse.successResponseWithData(res,"Visitor update Success.", "visitorData");
										}
									}));
							}
						}
					});
				}
			}
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

/**
 * Visitor Delete.
 * 
 * @param {string}      id
 * 
 * @returns {Object}
 */
exports.visitorDelete = [
	auth,
	function (req, res) {
		if(!mongoose.Types.ObjectId.isValid(req.params.id)){
			return apiResponse.validationErrorWithData(res, "Invalid Error.", "Invalid ID");
		}
		try {
			Visitor.findById(req.params.id, function (err, foundVisitor) {
				if(foundVisitor === null){
					return apiResponse.notFoundResponse(res,"Visitor not exists with this id");
				}else{
					//Check authorized user
					if(foundVisitor.contact.toString() !== req.user.email){
						return apiResponse.unauthorizedResponse(res, "You are not authorized to do this operation.");
					}else{
						//delete Visitor.
						Visitor.findByIdAndRemove(req.params.id,function (err) {
							if (err) { 
								return apiResponse.ErrorResponse(res, err); 
							}else{
								return apiResponse.successResponse(res,"Visitor delete Success.");
							}
						});
					}
				}
			});
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];