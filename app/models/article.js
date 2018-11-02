// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var articleSchema = mongoose.Schema({
    headerText:String,
    headerImage:String,
    userId:String,
    articleUrl:String,
    like:Number,
    input:String,
    output:Object
});


// create the model for users and expose it to our app
module.exports = mongoose.model('article', articleSchema);
