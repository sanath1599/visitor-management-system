const Visitor = require("../models/UserModel");
const { body,validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator");
const apiResponse = require("../helpers/apiResponse");
const auth = require("../middlewares/jwt");
var mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);

// Visitor Schema
class visitorData {
	constructor(data) {
		this.visitor = data.visitor;
		this.time = data.time;
		this.description = data.description;
		this.phone = data.phone;
		this.createdAt = data.createdAt;
	}
}

/**
 * Visitor List.
 * 
 * @returns {Object}
 */
exports.VisitorList = [
	auth,
	function (req, res) {
		try {
			Visitor.find({contact: req.user._id},"_id title description isbn createdAt").then((Visitors)=>{
				if(Visitors.length > 0){
					return apiResponse.successResponseWithData(res, "Operation success", Visitors);
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
exports.VisitorDetail = [
	auth,
	function (req, res) {
		if(!mongoose.Types.ObjectId.isValid(req.params.id)){
			return apiResponse.successResponseWithData(res, "Operation success", {});
		}
		try {
			Visitor.findOne({phone: req.params.phone},"_id title description isbn createdAt").then((Visitor)=>{                
				if(Visitor !== null){
					let VisitorData = new visitorData(Visitor);
					return apiResponse.successResponseWithData(res, "Operation success", VisitorData);
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
exports.VisitorStore = [
	auth,
	body("title", "Title must not be empty.").isLength({ min: 1 }).trim(),
	body("description", "Description must not be empty.").isLength({ min: 1 }).trim(),
	body("isbn", "ISBN must not be empty").isLength({ min: 1 }).trim().custom((value,{req}) => {
		return Visitor.findOne({isbn : value,user: req.user._id}).then(Visitor => {
			if (Visitor) {
				return Promise.reject("Visitor already exist with this ISBN no.");
			}
		});
	}),
	sanitizeBody("*").escape(),
	(req, res) => {
		try {
			const errors = validationResult(req);
			var Visitor = new Visitor(
				{ title: req.body.title,
					user: req.user,
					description: req.body.description,
					isbn: req.body.isbn
				});

			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}
			else {
				//Save Visitor.
				Visitor.save(function (err) {
					if (err) { return apiResponse.ErrorResponse(res, err); }
					let VisitorData = new visitorData(Visitor);
					return apiResponse.successResponseWithData(res,"Visitor add Success.", VisitorData);
				});
			}
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

/**
 * Visitor update.
 * 
 * @param {string}      visitor 
 * @param {string}      description
 * @param {number}      phone
 * @param {string} 		contact
 * @param {string}		time
 * 
 * @returns {Object}
 */
exports.VisitorUpdate = [
	auth,
	body("title", "Title must not be empty.").isLength({ min: 1 }).trim(),
	body("description", "Description must not be empty.").isLength({ min: 1 }).trim(),
	body("isbn", "ISBN must not be empty").isLength({ min: 1 }).trim().custom((value,{req}) => {
		return Visitor.findOne({isbn : value,user: req.user._id, _id: { "$ne": req.params.id }}).then(Visitor => {
			if (Visitor) {
				return Promise.reject("Visitor already exist with this ISBN no.");
			}
		});
	}),
	sanitizeBody("*").escape(),
	(req, res) => {
		try {
			const errors = validationResult(req);
			var Visitor = new Visitor(
				{ title: req.body.title,
					description: req.body.description,
					isbn: req.body.isbn,
					_id:req.params.id
				});

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
							if(foundVisitor.user.toString() !== req.user._id){
								return apiResponse.unauthorizedResponse(res, "You are not authorized to do this operation.");
							}else{
								//update Visitor.
								Visitor.findByIdAndUpdate(req.params.id, Visitor, {},function (err) {
									if (err) { 
										return apiResponse.ErrorResponse(res, err); 
									}else{
										let VisitorData = new visitorData(Visitor);
										return apiResponse.successResponseWithData(res,"Visitor update Success.", VisitorData);
									}
								});
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
exports.VisitorDelete = [
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
					if(foundVisitor.user.toString() !== req.user._id){
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