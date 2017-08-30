let expect = require("chai").expect;
let request = require("supertest-as-promised");
let app = require("../app.js");
let host = app;

request = request(host);

describe("********** SERVICES API ***********", ()=>{
	describe('GET / service', ()=> {
    it('Should return an array with services', done => {
      request.get('/api/service')
        .set("authorization", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1OTZjOGY5NTYxMDM5YzZiYTJjZjVkZmMiLCJ0eXBlIjoicHJvZmVzc2lvbmFsIiwiaWF0IjoxNTA0MDg1MTgxfQ.k6Dy8d1u_0msFEPSaML12vLgOfgepjLWNngRqBZZtB0")
        .then(
          res => {
            expect(res.status).to.be.equal(200);
            expect(res.body).to.be.an("Array")
            done();
          }
        )
    })
    it('Should return an object with a service filter by id', done => {
      request.get('/api/service')
        .set("authorization", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1OTZjOGY5NTYxMDM5YzZiYTJjZjVkZmMiLCJ0eXBlIjoicHJvZmVzc2lvbmFsIiwiaWF0IjoxNTA0MDg1MTgxfQ.k6Dy8d1u_0msFEPSaML12vLgOfgepjLWNngRqBZZtB0")
        .then(
          res => {
            expect(res.status).to.be.equal(200);
            expect(res.body).to.be.an("Array")
            return res.body;
          },
          error => done(error)
        )
        .then(
          services => {
            let service = services[0];
            request.get('/api/service/'+ service._id)
            .set("authorization", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1OTZjOGY5NTYxMDM5YzZiYTJjZjVkZmMiLCJ0eXBlIjoicHJvZmVzc2lvbmFsIiwiaWF0IjoxNTA0MDg1MTgxfQ.k6Dy8d1u_0msFEPSaML12vLgOfgepjLWNngRqBZZtB0")
            .then(
              res => {
                expect(res.status).to.be.equal(200)
                expect(res.body._id).to.be.equal(service._id)
                expect(res.body).to.have.property('name')
                expect(res.body).to.have.property('image')
                done()
              }
            )
          }
        )
    })
  })
})
