let expect = require("chai").expect;
let request = require("supertest-as-promised");
let app = require("../app.js");
let host = app;
let mongoose = require("mongoose");
let crypter = require("../app/helpers/crypto");
request = request(app);

describe("************ Test Model Professional", ()=> {
	describe("POST /professional/login", ()=>{
		it("Should return a token if email and password are right", done => {
			request.post("/professional/login")
							.send({
								email: "professional@professional.es",
								password: "111111"
							})
							.expect(200)
							.then(
								res => {
									expect(res.status).to.equal(200)
									expect(res.body).to.have.property("token")
									expect(res.body).to.have.property("professional")
									done()
								},
								error => done(error)
							)
		})
	})
	describe("GET /professional", ()=> {
		it("Should return all professionals if you are logged", done => {
			request.get("/professional")
							.set("authorization", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE0OTYyNDQ5NDR9.I5oDcYDLuT-49QGE6SIvVOFi3_ZMkd7eKbDdTw1MZ44")
							.expect(200)
							.then(
								res => {
									expect(res.status).to.equal(200);
									expect(res.body.docs).to.be.an("Array")
									done()
								},
								error => done(error)
							)
		})
		it("Should return 401 if you are not logged", done => {
			request.get("/professional")
							.expect(401)
							.then(
								res => {
									expect(res.status).to.equal(401);
									done()
								},
								error => done(error)
							)
		})
	})
	describe("POST /professional", ()=> {
		after(done => {
			mongoose.models = {}
			done()
		})
		it("Should create a professional if it exists", done => {
			let professional = {
				email: "professional@professional.es",
				password: "111111",
				password_crypter: crypter.encrypt("111111"),
				first_name: "Edu",
				last_name: "Muñoz Alfonso",
				document_id: "12200109N",
				phone: "665882020",
				address: {place:"Tirso de molina 4", location: "Valladolid", postal_code: "47010"},
				working_place: [47000,47140]
			}

			request.post("/professional")
							.send(professional)
							.then(
								res => {
									if(res.status == 201){
										expect(res.status).to.equal(201)
										expect(res.body).to.have.property("_id"),
										expect(res.body).to.have.property("email", professional.email)
										expect(res.body).to.not.have.property("password")
									}else {
										expect(res.status).to.equal(403)
										expect(res.body).to.have.property("error")
									}

									done()
								},
								error => done(error)
							)
		})
	})
})
