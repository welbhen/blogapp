const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('../models/User');
const User = mongoose.model('User');

module.exports = function(passport){
	passport.use(new localStrategy({
		usernameField: 'email',
		passwordField: 'password'
	}, (email, password, done) => {
		User.findOne({
			email: email
		}).then((user) => {
			if(!user){
				return done(null, false, {message: "This user doesn't exist!"});
			}else {
				bcrypt.compare(password, user.password, (error, match) => {
					if(match){
						return done(null, user);
					}else {
						return done(null, false, {message: "Wrong password!"});
					}
				})
			}
		}).catch((err) => {
			req.flash("error_msg", "Unexpected error!");
			res.redirect('/user/login');
		});
	}));
	
	passport.serializeUser((user, done) => {
		done(null, user.id);
	});
	
	passport.deserializeUser((id, done) => {
		User.findById(id, (err, user) => {
			done(err, user);
		});
	});
	
}