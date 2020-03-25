//During the automated test the env variable, We will set it to "test"
process.env.NODE_ENV = "test";
process.env.MONGODB_URL = "mongodb+srv://sanath:statwig@cluster0-h4t0a.mongodb.net/test?retryWrites=true&w=majority";
// "mongodb://127.0.0.1:27017/?compressors=zlib&gssapiServiceName=mongodb";

//Require the dev-dependencies
let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../app");
let should = chai.should();
chai.use(chaiHttp);

//Export this to use in multiple files
module.exports = {
	chai: chai,
	server: server,
	should: should
};