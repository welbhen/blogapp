const mongoose = require('mongoose');
const Schema = mongoose.Schema;

 // Creating the Schema:
const postSchema = new Schema({
	title: {
		type: String,
		required: true
	},
	slug: {
		type: String,
		required: true
	},
	description:{
		type: String,
		required: true
	},
	content:{
		type: String,
		required: true
	},
	category:{
		type: Schema.Types.ObjectId,
		ref: 'Category',
		required: true
	},
	date: {
		type: Date,
		default: Date.now
	}
});

mongoose.model('Post', postSchema);