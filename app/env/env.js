module.exports = {
  //host: "http://localhost:3000",
  host: "http://hair-chobo.rhcloud.com",
  jwt_key : 'wtf',
  crypto_key: 'wtf',
	stripe_key: 'sk_test_MrFhxIb2j4Ebc6gBbq3GuHq7',
  cloudinary: {
    cloud_name: 'dyfof1mr5',
    api_key: '156183584475275',
    api_secret: 'QIpKnaKaSgT6_X6TwxY3avsTfrQ'
  },
  email: {
    user: process.env.MAIL_USER,
    password: process.env.MAIL_PASSWORD
  }
};
