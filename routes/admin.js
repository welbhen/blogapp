/**
 *    This creates the 'admin' routes
 *    only used to edit the blog
 *    secured by user and password
 */

var express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('../models/Category');
const Category = mongoose.model('Category');
require('../models/Post');
const Post = mongoose.model('Post');
const {isAdmin} = require('../helpers/isAdmin');


router.get('/', isAdmin, (req, res) => {
	//res.send("This is a test for admin page");
	//res.sendFile(__dirname + "/main.html");
	res.render('admin/index');
});

router.get('/posts', isAdmin, (req, res) => {
	
	Post.find().lean().populate('category').sort({
		date: 'desc'
	}).then((posts) => {
		res.render('admin/posts', {
			posts: posts
		});
	}).catch((err) => {
		req.flash("error_msg", "Failed listing posts!");
		res.redirect('/admin');
	});	

});

router.get('/posts/add', isAdmin, (req, res) => {
	Category.find().lean()
	.then((categories) => {
		res.render('admin/addposts', {
			categories: categories
		});
	}).catch((err) => {
		req.flash("error_msg", "Failed loading the new post form!");
		res.redirect('/admin/posts');
	});
	
	
});

router.post('/posts/new', isAdmin, (req, res) => {
	var errors = [];
	if(req.body.category == "0"){
		errors.push({
			text: "Invalid category! Please, register a category before creating a post."
		});
	}
	if(!req.body.title|| typeof req.body.title == undefined || req.body.title == null){
		errors.push({
			text: "Invalid title!"
		});
	}
	if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
		errors.push({
			text: "Invalid slug!"
		});
	}
	if(!req.body.description || typeof req.body.description == undefined || req.body.description == null){
		errors.push({
			text: "Invalid description!"
		});
	}
	if(!req.body.content || typeof req.body.content == undefined || req.body.content == null){
		errors.push({
			text: "Invalid content!"
		});
	}
	if(req.body.title.length < 2){
		errors.push({
			text: "Title is too short!"
		});
	}
	if(req.body.slug.length < 2){
		errors.push({
			text: "Slug is too short!"
		});
	}
	if(req.body.description.length < 2){
		errors.push({
			text: "Description is too short!"
		});
	}
	if(req.body.content.length < 2){
		errors.push({
			text: "Content is too short!"
		});
	}
	// Checking for errors:
	if(errors.length > 0){
		// If any error occur, this will redirect back to the 'add categories' page
		// and display the errors as alert (see 'addcategories.handlebars' file to know how):
		res.render('admin/addposts', {
			errors: errors
		});
	}else{
		const newPost = {
			title: req.body.title,
			slug: req.body.slug,
			description: req.body.description,
			content: req.body.content,
			category: req.body.category
		}
		
		new Post(newPost).save()
		.then(() => {
			req.flash("success_msg", "New post created!");
			res.redirect('/admin/posts');
		}).catch((err) => {
			req.flash("error_msg", "Failed creating a new post. Please, try again!");
			res.redirect('/admin/posts');
		});	
	}
});

router.get('/posts/edit/:id', isAdmin, (req, res) => {
		
	Post.findOne({
		_id: req.params.id
	}).then((post) => {
		
		Category.find().lean().then((categories) => {
			
			res.render('admin/editpost', {
				categories: categories,
				post: post
			});
		
		}).catch((err) => {
			req.flash("error_msg", "There was an error listing the categories!");
			res.redirect('/admin/posts');
		});
		
	}).catch((err) => {
		req.flash("error_msg", "Oops! An error occured, please try again!");
		res.redirect('/admin/posts');
	});
	
});

router.post('/posts/edit', isAdmin, (req, res) => {
	Post.findOne({
		_id: req.body.id
	}).then((post) => {
		
		var errors = [];
		if(req.body.category == "0"){
			errors.push({
				text: "Invalid category! Please, register a category before creating a post."
			});
		}
		if(!req.body.title|| typeof req.body.title == undefined || req.body.title == null){
			errors.push({
				text: "Invalid title!"
			});
		}
		if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
			errors.push({
				text: "Invalid slug!"
			});
		}
		if(!req.body.description || typeof req.body.description == undefined || req.body.description == null){
			errors.push({
				text: "Invalid description!"
			});
		}
		if(!req.body.content || typeof req.body.content == undefined || req.body.content == null){
			errors.push({
				text: "Invalid content!"
			});
		}
		if(req.body.title.length < 2){
			errors.push({
				text: "Title is too short!"
			});
		}
		if(req.body.slug.length < 2){
			errors.push({
				text: "Slug is too short!"
			});
		}
		if(req.body.description.length < 2){
			errors.push({
				text: "Description is too short!"
			});
		}
		if(req.body.content.length < 2){
			errors.push({
				text: "Content is too short!"
			});
		}
		// Checking for errors:
		if(errors.length > 0){
			// If any error occur, this will redirect back to the 'add categories' page
			// and display the errors as alert (see 'addcategories.handlebars' file to know how):
			res.render('admin/addposts', {
				errors: errors
			});
		}else{
			
			post.title = req.body.title;
			post.slug = req.body.slug;
			post.description = req.body.description;
			post.content = req.body.content;
			post.category = req.body.category;
			
			post.save()
			.then(() => {
				req.flash("success_msg", "Post edited successfully!");
				res.redirect('/admin/posts');
			}).catch((err) => {
				req.flash("error_msg", "Failed editing the post!");
				res.redirect('/admin/categories');
			});
		}
		
	}).catch((err) => {
		req.flash("error_msg", "Oops! There was an error editing this post.");
		res.redirect('/admin/posts');
	});
	
});

router.post('/posts/delete', isAdmin, (req, res) => {
	Post.deleteOne({
		_id: req.body.id
	}).then(() => {
		req.flash("success_msg", "Post deleted!");
		res.redirect('/admin/posts');
	}).catch((err) => {
		req.flash("error_msg", "Failed deleting post!");
		res.redirect('/admin/post');
	});
});

router.get('/categories', isAdmin, (req, res) => {
	Category.find().lean().sort({
		date: 'desc'
	}).then((categories) => {
		res.render('admin/categories', {
			categories: categories
		});
	}).catch((err) => {
		req.flash("error_msg", "Failed listing categories!");
		res.redirect('/admin');
	});	
});

router.get('/categories/edit/:id', isAdmin, (req, res) => {
	Category.findOne({
		_id: req.params.id
	}).then((category) => {
		res.render('admin/editcategory', {
			category: category
		});
	}).catch((err) => {
		req.flash("error_msg", "This category does not exist!");
		res.redirect('/admin');
	});
	
});

router.post('/categories/edit', isAdmin, (req, res) => {
	Category.findOne({
		_id: req.body.id
	}).then((category) => {		
		var errors = [];
		if(!req.body.name || typeof req.body.name == undefined || req.body.name == null){
			errors.push({
				text: "Invalid name!"
			});
		}
		if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
			errors.push({
				text: "Invalid slug!"
			});
		}
		if(req.body.name.length < 2){
			errors.push({
				text: "Name is too short!"
			});
		}
		// Checking for errors:
		if(errors.length > 0){
			// If any error occur, this will redirect back to the 'add categories' page
			// and display the errors as alert (see 'addcategories.handlebars' file to know how):
			res.render('admin/editcategory', {
				errors: errors
			});
		}else{
		
			category.name = req.body.name;
			category.slug = req.body.slug;
			
			category.save()
			.then(() => {
				req.flash("success_msg", "Category edited successfully!");
				res.redirect('/admin/categories');
			}).catch((err) => {
				req.flash("error_msg", "Failed editing the category!");
				res.redirect('/admin/categories');
			});
			
		}
	}).catch((err) => {
		req.flash("error_msg", "Oops! There was an error editing this category.");
		res.redirect('/admin/categories');		
	});
});

router.post('/categories/delete', isAdmin, (req, res) => {
	Category.deleteOne({
		_id: req.body.id
	}).then(() => {
		req.flash("success_msg", "Category deleted!");
		res.redirect('/admin/categories');
	}).catch((err) => {
		req.flash("error_msg", "Failed deleting category!");
		res.redirect('/admin/categories');
	});
});

router.get('/categories/add', isAdmin, (req, res) => {
	//res.sendFile(__dirname + "/addcategories.html");
	res.render('admin/addcategories');		
});

router.post('/categories/new', isAdmin, (req, res) => {
	// Creating our own form validation (without frameworks):
	var errors = [];
	if(!req.body.name || typeof req.body.name == undefined || req.body.name == null){
		errors.push({
			text: "Invalid name!"
		});
	}
	if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
		errors.push({
			text: "Invalid slug!"
		});
	}
	if(req.body.name.length < 2){
		errors.push({
			text: "Name is too short!"
		});
	}
	// Checking for errors:
	if(errors.length > 0){
		// If any error occur, this will redirect back to the 'add categories' page
		// and display the errors as alert (see 'addcategories.handlebars' file to know how):
		res.render('admin/addcategories', {
			errors: errors
		});
	}else{
		
		const newCategory = {
		name: req.body.name,
		slug: req.body.slug
		}
		
		new Category(newCategory).save()
		.then(() => {
			//console.log("New category saved successfully!");
			req.flash("success_msg", "New category saved successfully!");
			res.redirect('/admin/categories');
		}).catch((err) => {
			//console.log("Failed saving category. Error: " + err);
			req.flash("error_msg", "Failed saving category. Please, try again!");
			res.redirect('/admin');
		});			
	}	
});


module.exports = router;