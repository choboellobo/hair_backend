module.exports = {

  host: process.env.HOST || "http://localhost:3000",
  jwt_key : 'wtf',
  crypto_key: 'wtf',
	stripe_key: process.env.STRIPE_KEY || 'sk_live_mlZME2zMvnLHlkMsHenDi21v',
  cloudinary: {
    cloud_name: process.env.CLOUDINARY_CLOUDNAME || 'dyfof1mr5',
    api_key: process.env.CLOUDINARY_APIKEY || '156183584475275',
    api_secret: process.env.CLOUDINARY_APISECRET || 'QIpKnaKaSgT6_X6TwxY3avsTfrQ'
  },
  email: {
    user: process.env.MAIL_USER,
    password: process.env.MAIL_PASSWORD
  }
};
