/**
 *    REMEMBER: Upper case first letter is 'good programming practice'!
 *
 *    See: NodejsMongooseStudies for more ways of working with Mongoose and
 *    creating Schemas
 */
 
 const mongoose = require('mongoose');
 const Schema = mongoose.Schema;
 
 // Creating the Schema:
const categorySchema = new Schema({
	name: {
		type: String,
		required: true
	},
	slug: {
		type: String,
		required: true
	},
	date: {
		type: Date,
		default: Date.now
	}
});

mongoose.model('Category', categorySchema);