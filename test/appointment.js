let expect = require("chai").expect;
let request = require("supertest-as-promised");
let app = require("../app.js");
let host = app;
let mongoose = require("mongoose");

request = request(app);

describe("************ Test Model Appointment", ()=>{
	describe("POST /appointment", ()=>{
		it("Should create an appointment and after that delete it", done =>{
			let appointment = {
				user: "592d4cc48967d7a92f030b87",
				professional: "59319cc254ae912105ae03d2",
				service: "59326bb3bc42cebc293ba164",
				date: new Date()
			}
			request.post("/appointment")
						.expect(201)
						.set("authorization", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1OTMxNjVlOWJjNDJjZWJjMjkzYmExNjIiLCJsZXZlbCI6NSwidHlwZSI6ImFkbWluIiwiaWF0IjoxNDk2NDIyMDAzfQ.q29ExhIohwUoBpNzyEBHxqeK9i0GuSa27Aoq6kx0k6c")
						.send(appointment)
						.then((res) => {
							expect(res.status).to.equal(201);
							expect(res.body).to.have.property("_id");
							expect(res.body).to.have.property("completed");
							expect(res.body.completed).to.have.property("status", false);
							console.log("Appointment created successfully .......")
							return request.delete("/appointment/" + res.body._id)
														.expect(200)
														.set("authorization", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1OTMxNjVlOWJjNDJjZWJjMjkzYmExNjIiLCJsZXZlbCI6NSwidHlwZSI6ImFkbWluIiwiaWF0IjoxNDk2NDIyMDAzfQ.q29ExhIohwUoBpNzyEBHxqeK9i0GuSa27Aoq6kx0k6c")
						}, error => done(error))
						.then((res)=>{
								expect(res.status).to.equal(200)
								expect(res.body).to.be.empty;
								console.log("Appointment deleted successfully .......")
								done();
						}, error => done(error))
		})
	})
})
