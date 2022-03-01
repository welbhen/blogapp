if(process.env.NODE_ENV == "production"){
	module.exports = {
		mongoURI: 'mongodb+srv://user:user@cluster0.kruav.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
	}
}else {
	module.exports = {
		mongoURI: 'mongodb://127.0.0.1/blogapp'
	}
}