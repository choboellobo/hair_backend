let expect = require("chai").expect;
let request = require("supertest-as-promised");
let app = require("../app.js");
let host = app;
let mongoose = require("mongoose");
let crypter = require("../app/helpers/crypto");
request = request(app);

describe("Test Model Professional", ()=> {
	describe("POST /professional", ()=> {
		after(done => {
			mongoose.models = {}
			done()
		})
		it("Should create a professional", done => {
			let professional = {
				email: "professional@professional.es",
				password: "111111",
				password_crypter: crypter.encrypt("111111"),
				firts_name: "Edu",
				last_name: "Muñoz Alfonso",
				document_id: "12200109N",
				phone: "665882020",
				address: {place:"Tirso de molina 4", location: "Valladolid", postal_code: "47010"}
			}

			request.post("/professional")
							.expect(201)
							.send(professional)
							.then(
								res => {
									expect(res.status).to.equal(201)
									expect(res.body).to.have.property("_id"),
									expect(res.body).to.have.property("email", professional.email)
									expect(res.body).to.not.have.property("password")
									done()
								},
								error => done(error)
							)
		})
	})
})
