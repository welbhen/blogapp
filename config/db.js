if(process.env.NODE_ENV == "production"){
	module.exports = {
		mongoURI: process.env.MONGOURI
	}
}else {
	module.exports = {
		mongoURI: 'mongodb://127.0.0.1/blogapp'
	}
}