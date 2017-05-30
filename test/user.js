let expect = require("chai").expect;
let request = require("supertest-as-promised");
let app = require("../app.js");
let host = app;
let mongoose = require("mongoose");

request = request(app);

describe("Check User API", ()=>{
	after(done => {
		mongoose.models = {}
		done()
	})
	describe("GET /user", ()=>{
		it("Should return an array with users", done =>{
			request.get("/user")
							.expect(200)
							.then(res => {
								expect(res.body).to.be.an("array");
								done()
							}, error => done(error))
		})
	})

	describe("POST /user", () => {
		it("Should create a user", done => {
			let user = {
				email: "yo@yo.es",
				password: "123456"
			}
			request.post("/user")
						.expect(201)
						.send(user)
						.then(res => {
							expect(res.status).to.equal(201);
							expect(res.body).to.have.property("_id");
							expect(res.body).to.have.property("email", user.email);
							expect(res.body).to.have.property("password", user.password);
							done()
						}, error => done(error))
		})
	})
})
