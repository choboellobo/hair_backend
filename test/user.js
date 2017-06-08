let expect = require("chai").expect;
let request = require("supertest-as-promised");
let app = require("../app.js");
let host = app;
let mongoose = require("mongoose");

request = request(app);

describe("************ Test Model User", ()=>{
	after(done => {
		mongoose.models = {}
		done()
	})
	describe("GET /user", ()=>{
		it("Should return an array with users", done =>{
			request.get("/user")
							.expect(200)
							.then(res => {
								expect(res.body.docs).to.be.an("array");
								if(res.body.total > 0) {
									console.log(`There are ${res.body.length} items into DDBB`)
									expect(res.body.docs).to.have.lengthOf.above(0);
								}
								done()
							}, error => done(error))
		})
	})

	describe("POST /user", () => {
		it("Should create a user and after remove it", done => {
			let user = {
				email: "yo@yo.es",
				password: "123456",
        first_name: "Edu",
        last_name: "Muñoz Alfonso"
			}
			request.post("/user")
						.expect(201)
						.send(user)
						.then((res) => {
							expect(res.status).to.equal(201);
							expect(res.body).to.have.property("_id");
							expect(res.body).to.have.property("email", user.email);
							expect(res.body).to.have.property("password", user.password);
							console.log("User created successfully .......")
							return request.delete("/user/" + res.body._id).expect(200)
						}, error => done(error))
						.then((res) => {
							expect(res.status).to.equal(200);
							expect(res.body).to.be.empty;
							console.log("User deleted successfully .......")
							done();
						},error => done(error))
		})
	})
})
