const env = require('../env/env');
const jwt = require('jsonwebtoken');
const jwt_key = process.env.JWT_KEY || env.jwt_key;

let jwt_obj = {
	generate: (obj = {}) =>{
		return jwt.sign(obj, jwt_key );
	},
	decode: (token) =>  {
		return new Promise((resolve, reject)=>{
			if(!token) return reject({error:true, message: "Not token sent"})
			jwt.verify(token, jwt_key, function(err, decoded) {
			  if(err) reject(err)
				else resolve(decoded)
			});
		})
	},
	middleware: (req, res, next) => {
		let token = req.headers.authorization;
		jwt_obj.decode(token)
			.then(
				decode => next(decode)
			)
			.catch(error => {
				res.status(401).json({error: true, message: "Error decode JWT"})
			})
	},
	middleware_admin: (req, res, next) => {
		let token = req.headers.authorization;
		jwt_obj.decode(token)
			.then(
				decode => {
					if(decode.type === "admin") next(decode)
					else res.status(401).json({error: true, message: "This JWT isn´t admin type"})
				}
			)
			.catch(error => {
				res.status(401).json({error: true, message: "Error decode JWT"})
			})
	}
}
module.exports = jwt_obj;
