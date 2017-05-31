let jwt = require('jsonwebtoken');
const jwt_key = process.env.JWT_KEY || "wtf";
let jwt_obj = {
	generate: function(obj){
		if(!obj) obj = {};
		return jwt.sign(obj, jwt_key );
	},
	decode: function(token) {
		return new Promise((resolve, reject)=>{
			if(!token) return reject({error:true, message: "Not token sent"})
			jwt.verify(token, jwt_key, function(err, decoded) {
			  if(err) reject(err)
				else resolve(decoded)
			});
		})
	},
	middleware: function(req, res, next) {
		let token = req.headers.authorization;
		jwt_obj.decode(token)
			.then(
				decode => next(decode)
			)
			.catch(error => {
				res.status(403).json({error: true, message: "Error decode JWT"})
			})

	}
}
module.exports = jwt_obj;
