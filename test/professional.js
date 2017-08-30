let expect = require("chai").expect;
let request = require("supertest-as-promised");
let app = require("../app.js");
let host = app;
let mongoose = require("mongoose");
let crypter = require("../app/helpers/crypto");
request = request(app);

describe("************ PROFESSIONAL API *************", ()=> {
	describe("POST /professional/login", ()=>{
		it("Should return a token if email and password are right", done => {
			request.post("/api/professional/login")
							.send({
								email: "mario@mario.es",
								password: "123456"
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
			request.get("/api/professional")
							.set("authorization", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1OTZjOGY5NTYxMDM5YzZiYTJjZjVkZmMiLCJ0eXBlIjoicHJvZmVzc2lvbmFsIiwiaWF0IjoxNTA0MDg1MTgxfQ.k6Dy8d1u_0msFEPSaML12vLgOfgepjLWNngRqBZZtB0")
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
			request.get("/api/professional")
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
	// describe("POST /professional", ()=> {
	// 	after(done => {
	// 		mongoose.models = {}
	// 		done()
	// 	})
	// 	it("Should create a professional if it exists", done => {
	// 		let professional = {
	// 			avatar: '/img/avatar_man.png',
	// 			email: "test@test.es",
	// 			password: "123456",
	// 			password_crypter: crypter.encrypt("123456"),
	// 			first_name: "Test",
	// 			last_name: "Test",
	// 			document_id: "12200109N",
	// 			gender: "male",
	// 			birthday: new Date(),
	// 			phone: "665882020",
	// 			address: {coordinate: {lat: 41.543, lng: -4.72}, location: "VAlladolid"}
	// 		}
	//
	// 		request.post("/api/professional")
	// 						.send(professional)
	// 						.then(
	// 							res => {
	// 								if(res.status == 201){
	// 									expect(res.status).to.equal(201)
	// 									expect(res.body.professional).to.have.property("_id"),
	// 									expect(res.body.professional).to.have.property("email", professional.email)
	// 									expect(res.body).to.have.property('token')
	// 								}else {
	// 									expect(res.status).to.equal(403)
	// 									expect(res.body).to.have.property("error")
	// 								}
	// 								done()
	// 							},
	// 							error => done(error)
	// 						)
	// 	})
	// })
	describe("PATCH /professional/:id", () => {
		it("Should not update a property of a professional because JWT doesn´t have a permissions", done => {
			request.patch('/api/professional/596c8f9561039c6ba2cf5dfc')
			.send({active: true})
			.then(
				res => {
					expect(res.status).to.be.equal(401)
					done()
				}
			)
		})
		it("Should update a property of a professional", done => {
			request.patch('/api/professional/596c8f9561039c6ba2cf5dfc')
			.send({active: true})
			.set("authorization", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1OTZjOGY5NTYxMDM5YzZiYTJjZjVkZmMiLCJ0eXBlIjoicHJvZmVzc2lvbmFsIiwiaWF0IjoxNTA0MDg1MTgxfQ.k6Dy8d1u_0msFEPSaML12vLgOfgepjLWNngRqBZZtB0")
			.then(
				res => {
					expect(res.status).to.be.equal(204)
					done()
				}
			)
		})
	})
})
