/**
 *    We're gonna use (seen before):
 *
 *    Express,
 *    Mongoose,
 *    Handlebars,
 *    Body-parser
 *
 *    New modules:
 *
 *    Bootstrap => HTML framework
 *    		download > unzip > CTRL + X > CTRL + V inside the 'public' dir of our project
 *    Express-session:
 *   		npm install --save express-session
 *    Connect-flash:
 *   		npm install --save connect-flash
 *    bcryptjs:
 *    (allow us to 'hash' the passwords)
 *          npm install --save bcryptjs
 *    Passport-local:
 *    (athenticates the user using our database)
 *          npm install --save passport
 *          npm install --save passport-local
 *    
 */

// Requiring Modules: 
const express = require('express');
const app = express();
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require ('mongoose');
const admin = require('./routes/admin');
const user = require('./routes/user');
const session = require('express-session');
const flash = require('connect-flash');
require("./models/Post");
const Post = mongoose.model('Post');
require("./models/Category");
const Category = mongoose.model('Category');
const passport = require('passport');
require("./config/auth")(passport);
const db = require('./config/db');


// Configs
	// Session:
		app.use(session({
			secret: "password",
			resave: true,
			saveUninitialized: true
		}));
		app.use(passport.initialize());
		app.use(passport.session());
		
	// Flash:
		app.use(flash());
	// Middleware:
		app.use((req, res, next) => {
			res.locals.success_msg = req.flash("success_msg");
			res.locals.error_msg = req.flash("error_msg");
			res.locals.error = req.flash("error");
			// req.user is automatically created by Passport and stores the logged user data
			res.locals.user = req.user || null;

			//console.log("This is the Middleware.");
			
			// NERVER FORGET the 'next()', otherside our app will be stopping here:
			next();
		});
	// Handlebars:
 		app.engine('handlebars', handlebars.engine({
			defaultLayout: 'main',
			runtimeOptions: {
      				allowProtoPropertiesByDefault: true,
       				allowProtoMethodsByDefault: false,
       		},
       		/*
       		helpers: {
				ifCond: (v1, operator, v2, options) => {
					switch (operator) {
		       			case '==':
		       				return (v1 == v2);
		       			default:
		          			return options.inverse(this);
		 		    }
				}
			}
			*/
		}));
		app.set('view engine', 'handlebars');
		 		
 	// Body-Parser:
 		app.use(bodyParser.urlencoded({extended: false}));
 		app.use(bodyParser.json());
 	// Mongoose:
 		mongoose.Promise = global.Promise;
		mongoose.connect(process.env.MONGO_URI, {
			useNewUrlParser:true,
		    useUnifiedTopology: true
		}).then(() => {
			console.log("MongoDB connected...");	
		}).catch((err) => {
			console.log("Error: " + err);
		});
	// Public:
		// Static files (CSS, for example):
		app.use(express.static(__dirname + '/public'));
		

// Routes:
	app.use('/admin', admin);
	app.use('/user', user);
	
	app.get('/', (req, res) => {
		
		Post.find().lean().populate('category').sort({
			date: 'desc'
		}).then((posts) => {
			res.render('./index', {
				posts: posts
			});
		}).catch((err) => {
			req.flash("error_msg", "Internal error!");
			res.redirect('/404');
		});	
	});
	
	app.get('/404', (req, res) => {
		res.send("Error 404");
	});
	
	app.get('/categories', (req, res) => {
		
		Category.find().lean().then((categories) => {
			res.render('categories', {
				categories: categories
			});
		}).catch((err) => {
			req.flash("error_msg", "Error listing categories!");
			res.redirect('/');
		});

	});
	
	app.get('/category/:slug', (req, res) => {
		
		Category.findOne({
			slug: req.params.slug
		}).then((category) => {
			if(category){		
						
				Post.find({
					category: category._id
				}).lean().then((posts) => {
			
					res.render('postByCategory', {
						category: category,
						posts: posts
					});
				
				}).catch((err) => {
					req.flash("error_msg", "There was an error finding posts with category.");
					res.redirect('/');
				});
				
			}else{
				req.flash("error_msg", "Error! Could not find this category.");
				res.redirect('/');
			}
		}).catch((err) => {
			req.flash("error_msg", "Internal error!");
			res.redirect('/');
		});
	});
	
	app.get('/post/:slug', (req, res) => {
		
		Post.findOne({
			slug: req.params.slug
		}).then((post) => {
			if(post){		
						
				Category.findOne().then((category) => {
			
					res.render('post', {
						category: category,
						post: post
					});
				
				}).catch((err) => {
					req.flash("error_msg", "There was an error finding the category!");
					res.redirect('/');
				});
				
			}else{
				req.flash("error_msg", "Error! Could not find this post.");
				res.redirect('/');
			}
		}).catch((err) => {
			req.flash("error_msg", "Internal error!");
			res.redirect('/');
		});
	});

// Starting the server:
const PORT = process.env.PORT || 8081;

app.listen(PORT, () => {
	console.log("Server opened! Use: http://localhost:" + PORT);
});