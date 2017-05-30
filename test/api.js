let expect = require("chai").expect;
let request = require("supertest-as-promised");
let app = require("../app.js");
let host = app;

request = request(host);

describe("Test environment", ()=>{
	it("Should true to be true", ()=>{
		expect(true).to.be.true;
	})
})
