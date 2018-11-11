// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var articleSchema = mongoose.Schema({
    headerText:String,
    headerImage:String,
    articleContent:String,
    userId:String,
    articleUrl:String,
    like:Number,
    edit:Number
});


// create the model for users and expose it to our app
module.exports = mongoose.model('article', articleSchema);
