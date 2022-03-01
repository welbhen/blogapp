const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('../models/User');
const User = mongoose.model('User');
const bcrypt = require('bcryptjs');
const passport = require('passport');

router.get('/register', (req, res) => {
	res.render('user/register');
});

router.post('/register', (req, res) => {
	var errors = [];
	if(!req.body.name|| typeof req.body.name == undefined || req.body.name == null){
		errors.push({
			text: "No name found!"
		});
	}
	if(!req.body.email || typeof req.body.email == undefined || req.body.email == null){
		errors.push({
			text: "No email found!"
		});
	}
	if(!req.body.password || typeof req.body.password == undefined || req.body.password == null){
		errors.push({
			text: "Choose a password!"
		});
	}
	if(!req.body.password2 || typeof req.body.password2 == undefined || req.body.password2 == null){
		errors.push({
			text: "Please, repeat your password!"
		});
	}
	

	const validateEmail = (email) => {
	  return String(email)
	    .toLowerCase()
	    .match(
	      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	    );
	};
	
	if(validateEmail(req.body.email)){
	
	}else{
		errors.push({
			text: "E-mail invalid!"
		});
	}
		
	const validatePassword = (password) => {
	  return String(password)
	    .match(
	      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,20}$/
	    );
	};
	
	if(validatePassword(req.body.password)){
		
	}else{
		errors.push({
			text: "Password invalid! Please review the rules and try again."
		});
	}
	if(req.body.password != req.body.password2){
		errors.push({
			text: "Passwords don't match!"
		});
	}
	
	// Checking for errors:
	if(errors.length > 0){
		res.render('user/register', {
			errors: errors
		});
	}else {
		
		User.findOne({
			email: req.body.email
		}).then((user) => {
			
			if(user){
				req.flash("error_msg", "This e-mail is already in use!");
				res.redirect('/user/login');
			}else {
				const newUser = new User({
					name: req.body.name,
					email: req.body.email,
					password: req.body.password
					//isAdmin: 1
				})
				
				bcrypt.genSalt(10, (err, salt) => {
					bcrypt.hash(newUser.password, salt, (err, hash) => {
						if(err){
							req.flash("error_msg", "Internal error occured while saving new user!");
							res.redirect('/user/register');
						}else {
							newUser.password = hash;
							newUser.save()
							.then(() => {
								req.flash("success_msg", "New user created with success!");
								res.redirect('/');
							}).catch((err) => {
								req.flash("error_msg", "Internal error occured while creating new user!");
								res.redirect('/user/register');
							});
						}
					})
				});
			}	
			
		}).catch((err) => {
			req.flash("error_msg", "Oops! An error occured, please try again!");
			res.redirect('/');
		});
	}	
});

router.get('/login', (req, res) => {
	res.render('user/login');
});

router.post('/login', (req, res, next) => {
	passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/user/login',
		failureFlash: true
	})(req, res, next);
	
});

router.get('/logout', (req, res) => {
	req.logout();
	req.flash("success_msg", "User logged-out!");
	res.redirect('/');
});


module.exports = router;