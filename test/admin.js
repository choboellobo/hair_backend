let expect = require("chai").expect;
let request = require("supertest-as-promised");
let app = require("../app.js");
let host = app;
let mongoose = require("mongoose");
let crypter = require("../app/helpers/crypto");
request = request(app);

describe("************ Test Admin Model", ()=> {
	describe("POST /admin/login", ()=>{
		it("Should return a token if email and password are correct", done => {
			request.post("/admin/login")
							.send({
								email: "test@test.es",
								password: "111111"
							})
							.expect(200)
							.then(
								res => {
									expect(res.status).to.equal(200)
									expect(res.body).to.have.property("token")
									expect(res.body).to.have.property("admin")
									expect(res.body.admin).to.have.property("level")
									done()
								},
								error => done(error)
							)
		})
	})
})
