// eslint-disable-next-line no-unused-vars
const { chai, server, should } = require("./testConfig");
const VisitorModel = require("../models/VisitorModel");

/**
 * Test cases to test all the Visitor APIs
 * Covered Routes:
 * (1) Login
 * (2) Add Visitor
 * (3) Get all Visitors
 * (4) Get single Visitor
 * (5) Update Visitor
 * (6) Delete Visitor
 */

describe("Visitor", () => {
	//Before each test we empty the database
	before((done) => { 
		// eslint-disable-next-line no-unused-vars
		VisitorModel.deleteMany({}, (err) => { 
			done();           
		});        
	});

	// Prepare data for testing
	const userTestData = {
		"password":"password",
		"email":"testing@gmail.com"
	};

	// Prepare data for testing
	const testData = {
		"visitor":"Kunal",
		"description":"My friend Sanath",
		"phone":"8790682297",
		"contact":"sanath15swaroop@gmail.com",
		"time":3
	};

	const testDataUpdated = {
		"status" : "Approved"
	};

	/*
  * Test the /POST route
  */
	describe("/POST Login", () => {
		it("it should do user Login for Visitor", (done) => {
			chai.request(server)
				.post("/api/auth/login")
				.send({"email": userTestData.email,"password": userTestData.password})
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.have.property("message").eql("Login Success.");
					userTestData.token = res.body.data.token;
					done();
				});
		});
	});

	/*
  * Test the /POST route
  */
	describe("/POST Visitor Add", () => {
		it("It should send validation error for store Visitor", (done) => {
			chai.request(server)
				.post("/api/visitor")
				.send()
				.set("Authorization", "Bearer "+ userTestData.token)
				.end((err, res) => {
					res.should.have.status(400);
					done();
				});
		});
	});

	/*
  * Test the /POST route
  */
	describe("/POST Visitor Store", () => {
		it("It should store Visitor", (done) => {
			chai.request(server)
				.post("/api/visitor")
				.send(testData)
				.set("Authorization", "Bearer "+ userTestData.token)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.have.property("message").eql("Visitor add Success.");
					done();
				});
		});
	});

	/*
  * Test the /GET route
  */
	describe("/GET All Visitor", () => {
		it("it should GET all the Visitors", (done) => {
			chai.request(server)
				.get("/api/Visitor")
				.set("Authorization", "Bearer "+ userTestData.token)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.have.property("message").eql("Operation success");
					testData._id = res.body.data[0]._id;
					done();
				});
		});
	});

	/*
  * Test the /GET/:id route
  */
	describe("/GET/:id Visitor", () => {
		it("it should GET the Visitors", (done) => {
			chai.request(server)
				.get("/api/Visitor/"+testData._id)
				.set("Authorization", "Bearer "+ userTestData.token)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.have.property("message").eql("Operation success");
					done();
				});
		});
	});

	/*
  * Test the /PUT/:id route
  */
	describe("/PUT/:id Visitor", () => {
		it("it should PUT the Visitors", (done) => {
			chai.request(server)
				.put("/api/Visitor/"+testData._id)
				.send(testDataUpdated)
				.set("Authorization", "Bearer "+ userTestData.token)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.have.property("message").eql("Visitor update Success.");
					done();
				});
		});
	});

	/*
  * Test the /DELETE/:id route
  */
	describe("/DELETE/:id Visitor", () => {
		it("it should DELETE the Visitors", (done) => {
			chai.request(server)
				.delete("/api/Visitor/"+testData._id)
				.set("Authorization", "Bearer "+ userTestData.token)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.have.property("message").eql("Visitor delete Success.");
					done();
				});
		});
	});
});