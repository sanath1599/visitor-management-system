/* eslint-disable linebreak-style */
/* eslint-disable no-redeclare */
/* eslint-disable no-mixed-spaces-and-tabs */

const Visitor = require("../models/VisitorModel");
const { body, validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator");
const apiResponse = require("../helpers/apiResponse");
const auth = require("../middlewares/jwt");
var mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);
//helpers
const mailer = require("../helpers/mailer");
var  Pusher = require("pusher");
const { constants } = require("../helpers/constants");
var mail_template = require("../helpers/mailtemplates");
// Visitor Schema
function VisitorData(data) {
	this.visitorName = data.visitorName;
	this.time = data.time;
	this.description = data.description;
	this.phone = data.phone;
	this.startup_email = data.startup_email;
	this.status = data.status;
	this.createdAt = data.createdAt;
	this.email = data.email;
}

var pusher = new Pusher({
	appId: "986874",
	key: "8bbef832a5513082ff54",
	secret: "c2b8d75cdd0f58e7c08a",
	cluster: "ap2",
	encrypted: true
});

/**
 * Visitor List.
 *
 * @returns {Object}
 */
exports.visitorList = [
	auth,
	function(req, res) {
		try {
			Visitor.find({ startup_email: req.user.email }, "_id visitorName description phone startup_email status time").then(
				visitors => {
					if (visitors.length > 0) {
						return apiResponse.successResponseWithData(
							res,
							"Operation success",
							visitors
						);
					} else {
						return apiResponse.successResponseWithData(
							res,
							"Operation success",
							[]
						);
					}
				}
			);
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
	function(req, res) {
		if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
			return apiResponse.successResponseWithData(res, "Operation success", {});
		}
		try {
			Visitor.findOne(
				{ _id: req.params.id, startup_email: req.user.email },
				"_id visitorName description phone startup_email status time email"
			).then(visitor => {
				if (visitor !== null) {
					let visitorData = new VisitorData(visitor);
					return apiResponse.successResponseWithData(
						res,
						"Operation success",
						visitorData
					);
				} else {
					return apiResponse.successResponseWithData(
						res,
						"Operation success",
						{}
					);
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
 * @param {string} 		startup_email
 * @param {string}		time
 *
 * @returns {Object}
 */
exports.visitorStore = [
	body("visitor", "Title must not be empty.")
		.isLength({ min: 1 })
		.trim(),
	body("description", "Description must not be empty.")
		.isLength({ min: 1 })
		.trim(),
	body("time", "time must not be empty.")
		.isLength({ min: 1 })
		.trim(),
	body("startup_email", "startup_email must not be empty.")
		.isLength({ min: 1 })
		.trim(),
	body("startup", "startup_email must not be empty.")
		.isLength({ min: 1 })
		.trim(),	
	body("email")
		.isLength({ min: 1 })
		.trim()
		.withMessage("Email must be specified.")
		.isEmail()
		.withMessage("Email must be a valid email address."),
	body("phone", "phone must not be empty")
		.isLength({ min: 1 })
		.trim()
		.custom((value, { req }) => {
			return Visitor.findOne({ phone: value }).then(Visitor => {
				if (Visitor) {
					return Promise.reject("Visitor already exists" + req.body.email);
				}
			});
		}),
	sanitizeBody("*").escape(),
	(req, res) => {
		try {
			const errors = validationResult(req);
			var visitor = new Visitor({
				visitorName: req.body.visitor,
				time: req.body.time,
				startup_email: req.body.startup_email,
				description: req.body.description,
				phone: req.body.phone,
				email: req.body.email,
				startup:req.body.startup
			});
			console.log("Validated Data");
			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(
					res,
					"Validation Error.",
					errors.array()
				);
			} else {
				//Save Visitor.
				// Html email body
				let html = mail_template.new_visitor_mail(req.body.visitor,req.body.phone,req.body.description,req.body.startup,req.body.email,req.body.time);
				//   "<img width=400 src='https://upload.wikimedia.org/wikipedia/commons/4/40/T-Hub_Logo-PNG.png' /><br/> <p>You have received a new request from  " +
				//   req.body.visitor +
				//   "<br/> phone number: " +
				//   req.body.phone +
				//   "<br/>for: " +
				//   req.body.description +
				//   "<br/> open the portal to approve or reject</p>";

				// Send new visitor email
				mailer
					.send(constants.admin.email, req.body.email, "Your Request has been Placed", html)
					.then(
						
						visitor.save(function(err) {
							if (err) {
								return apiResponse.ErrorResponse(res, err);
							}
							let visitorData = new VisitorData(visitor);

							return apiResponse.successResponseWithData(
								res,
								"Visitor add Success.",
								visitorData
							);
							
						})
						
							
					);
				let html2 = mail_template.visitor_confirmation(req.body.visitor,req.body.phone,req.body.description,req.body.email,req.body.startup,req.body.startup_email);
				mailer
					.send(constants.admin.email, req.body.startup_email, "new request", html2)
					.then(
						console.log("Mail sent to visitor")
						
					);
				pusher.trigger("thub-vm", "visitor", {
					"message": "new visitor"
					  });
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
// startup_email: req.body.startup_email,
// description: req.body.description,
// phone: req.body.phone,
//extra data ends
/**
 * Visitor update.
 * 
//  * @param {string}      visitor 
//  * @param {string}      description
//  * @param {number}      phone
//  * @param {string} 		startup_email
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
	// body("startup_email", "startup_email must not be empty.").isLength({ min: 1 }).trim(),
	// body("status", "status must not be empty.").isLength({ min: 1 }).trim(),
	body("status", "phone must not be empty")
		.isLength({ min: 1 })
		.trim()
		.custom((value, { req }) => {
			return Visitor.findOne({
				_id: req.params.id,
				startup_email: req.user.email
			}).then(Visitor => {
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
				return apiResponse.validationErrorWithData(
					res,
					"Validation Error.",
					errors.array()
				);
			} else {
				if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
					return apiResponse.validationErrorWithData(
						res,
						"Invalid Error.",
						"Invalid ID"
					);
				} else {
					Visitor.findById(req.params.id, function(err, foundVisitor) {
						if (foundVisitor === null) {
							return apiResponse.notFoundResponse(
								res,
								"Visitor not exists with this id"
							);
						} else {
							//Check authorized user
							if (foundVisitor.startup_email.toString() !== req.user.email) {
								return apiResponse.unauthorizedResponse(
									res,
									"You are not authorized to do this operation."
								);
							} else {
								//update Visitor.
								
								if(req.body.status != "Rejected"){
									var html = mail_template.visitor_update(foundVisitor.name, foundVisitor.phone, foundVisitor.description,foundVisitor.startup,foundVisitor.startup_email);
								}
								else {
									var html = mail_template.visitor_reject(foundVisitor.name, foundVisitor.phone, foundVisitor.description,foundVisitor.startup,foundVisitor.startup_email);
								}
								
								mailer
									.send(
										constants.admin.email,
										foundVisitor.email,
										"Update in status",
										html
									)
									.then(
										Visitor.findByIdAndUpdate(
											req.params.id,
											{ $set: { status: req.body.status } },
											{},
											function(err) {
												if (err) {
													return apiResponse.ErrorResponse(res, err);
												} else {
													pusher.trigger("thub-vm", "visitor", {
														"message": "updated visitor"
													  });
													// let visitorData = new VisitorData(visitor);
													return apiResponse.successResponseWithData(
														res,
														"Visitor update Success.",
														"visitorData"
													);
												}
											}
										)
									);
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
	function(req, res) {
		if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
			return apiResponse.validationErrorWithData(
				res,
				"Invalid Error.",
				"Invalid ID"
			);
		}
		try {
			Visitor.findById(req.params.id, function(err, foundVisitor) {
				if (foundVisitor === null) {
					return apiResponse.notFoundResponse(
						res,
						"Visitor not exists with this id"
					);
				} else {
					//Check authorized user
					if (foundVisitor.startup_email.toString() !== req.user.email) {
						return apiResponse.unauthorizedResponse(
							res,
							"You are not authorized to do this operation."
						);
					} else {
						//delete Visitor.
						Visitor.findByIdAndRemove(req.params.id, function(err) {
							if (err) {
								return apiResponse.ErrorResponse(res, err);
							} else {
								pusher.trigger("thub-vm", "visitor", {
									"message": "delete visitor"
								  });
								return apiResponse.successResponse(
									res,
									"Visitor delete Success."
								);
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
