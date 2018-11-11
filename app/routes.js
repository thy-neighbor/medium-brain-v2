
const brain=require("brain.js");
const Article= require('./models/article');
//Cheerio
var request = require('request');
var cheerio = require('cheerio');


module.exports = function(app, passport) {
   
    app.get('/medium', isLoggedIn, async function(req,res){ 
        console.log(req.query, req.params);
        
        
        let articles=await Article.find({
            userId:req.user._id
        }).exec();
      
        request(`https://medium.com/search?q=${req.query.q}`, async function(err, resp, html) {
        console.log("ERROR",err);
            if (!err){
                const $ = cheerio.load(html);
                
                
                let temp=$('.postArticle-content').append(`<br>
                <button class="save-btn-js">Save me</button>
                <button class="edit-btn-js">Edit</button>
                `);
                let section=`<h1 class="medium-search-results-title">Medium Search Results</h1><br> ${$('.postArticle-content')}`;
                
                $.html();
                res.render('medium.hbs', {
                    html:section
                });
            }
       });           

    });

    app.get('/article',function(req,res){
        console.log("IM HERREE",req.query.q);
        request(`${req.query.q}`, async function(err, resp, html) {
            console.log('ERROR',err);
            if (!err){
                
                const $ = cheerio.load(html);
                
                //let tempHeader=$('.elevateCover');
                $(".section-inner").attr("contenteditable","true");
                let tempBody=$('.section-inner').html();
                //let simple=$('.section-inner').html();
                console.log('ALL OF THAT GOOD CONTENT',tempBody);

                //let section=`${tempHeader}<br>${tempBody}`;
                
                $.html();
                res.render('article-edit.hbs', {
                    //tempHeader:tempHeader,
                    tempBody:tempBody,
                    originalUrl:req.query.q
                });
            }//if
        });//request

    });//app.get

    app.post('/medium',isLoggedIn,function(req,res){
        res.redirect(`/medium?q=${req.body.q}`);
    });

    app.post('/article',isLoggedIn,async function(req,res){
        console.log('article',req.body,req.user);
/*
        let articles=await Article.find({
            userId:req.user._id
        }).exec();
*/
        
        if(req.body.edit==1){

            return res.redirect(`/article-edit?q=${req.body.articleUrl}`);
            
        }//if            
        

        console.log("IM HERREE");

        let article=new Article(req.body);
        article.userId=req.user._id;
        article.save(function(err){
            if(err){ throw err }
            if(req.body.edit==0){
                res.json({success:true})
            } 
            
        });//article save


    });//post

    app.post('/delete',isLoggedIn,function(req,res){
        console.log("DELETE",req.body);
        Article.remove({_id:req.body.id}).exec().then(function(){
            res.json({deleted:req.body.id});
        });
        
    });
// normal routes ===============================================================
    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('login.hbs');
    });

    app.get('/profile-home', isLoggedIn ,function(req,res){
        Article.find({userId:req.user._id}).then(articles=>{
            console.log(articles);
            res.render('profile-home.hbs', {
                user : req.user,
                articles:articles
            });
        }).catch(err=>{throw err});
        
    });
    
    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function(req, res) {
        Article.find({userId:req.user._id}).then(articles=>{
            //console.log(articles);
            res.render('profile.hbs', {
                user : req.user,
                articles:articles
            });
        }).catch(err=>{throw err});
        
    });
    
    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================
    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.hbs', { message: req.flash('loginMessage') });
        });
        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile-home', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));
        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.hbs', { message: req.flash('signupMessage') });
        });
        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

    // google ---------------------------------
        // send to google to do the authentication
        app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));
        // the callback after google has authenticated the user
        app.get('/auth/google/callback',
            passport.authenticate('google', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));
// =============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================
    // locally --------------------------------
        app.get('/connect/local', function(req, res) {
            res.render('connect-local.hbs', { message: req.flash('loginMessage') });
        });
        app.post('/connect/local', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

    // google ---------------------------------
        // send to google to do the authentication
        app.get('/connect/google', passport.authorize('google', { scope : ['profile', 'email'] }));
        // the callback after google has authorized the user
        app.get('/connect/google/callback',
            passport.authorize('google', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));
// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future
    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });
    // google ---------------------------------
    app.get('/unlink/google', isLoggedIn, function(req, res) {
        var user          = req.user;
        user.google.token = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });
};
// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}


//mobile menu 
//css