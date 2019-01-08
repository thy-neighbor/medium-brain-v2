
const brain=require("brain.js");
const Article= require('./models/article');
//Cheerio
var request = require('request');
var cheerio = require('cheerio');


module.exports = function(app, passport) {
    //get the results from medium.com's search, a query is NEEDED
    app.get('/medium', isLoggedIn, async function(req,res){ 
        //console.log(req.query, req.params);
        
        
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

    //article editing page, render what is saved in user's database
    app.get('/article-edit',isLoggedIn, function(req,res){
        console.log("IM HERREE",req.query.q);
        //check if theres already content for this article
        //if s load that content
        //else do the request below
        request(`${req.query.q}`, async function(err, resp, html) {
            console.log('ERROR',err);
            if (!err){
                
                const $ = cheerio.load(html);
                let header=$('.postArticle-content').find('h1').text();
                let headerImg=$('.postArticle-content').find('img.graf-image').attr("src");

                let tempBody=$('.postArticle-content').html();

                console.log('ALL OF THAT GOOD CONTENT',header, headerImg);
                
                $.html();
                res.render('article-edit.hbs', {
                    headerText:header,      //works
                    headerImg:headerImg,       //works
                    tempBody:tempBody,
                    originalUrl:req.query.q
                });
            }//if
        });//request

    });//app.get

    //Make the article-edit page from main article list
    app.get('/article',isLoggedIn, async function(req,res){
        console.log("IM HERREE",req.query.q);
        //check if theres already content for this article
        //if s load that content
        //else do the request below
       
        let articles=await Article.find({
            userId:req.user._id
        }).exec();

        let tempBody=await articles.find(function(item){
            if(item.articleUrl==req.query.q){
                return item;
            }
        });

        console.log("GOOD CONTENT",tempBody.articleContent);
            
        res.render('article-edit.hbs', {
            headerText:tempBody.headerText,      //works
            headerImg:tempBody.headerImage,       //works
            tempBody:tempBody.articleContent,
            originalUrl:tempBody.articleUrl
        });
    });//app.get 


    //redirects with the query for the medium article search
    app.post('/medium',isLoggedIn,function(req,res){
        res.redirect(`/medium?q=${req.body.q}`);
    });

    //Saving article from search list(checks to see if article was saved previously, if so deletes then rewrites)
    app.post('/article',isLoggedIn,async function(req,res){
        console.log('article',req.body,req.user);

        let msg="";

        let articles=await Article.find({
            userId:req.user._id
        }).exec();

        let articleResult=await articles.find(function(item){
            if(item.articleUrl==req.body.articleUrl){
                return item;
            }
        });

        console.log("ARTICLE ID: IF FOUND IS-->",articleResult);

        if(articleResult){
            msg=await Article.findByIdAndRemove(articleResult._id, (err, article) => {
                //handle any potential errors:
                if (err) return err;
                // We'll create a simple object to send back with a message and the id of the document that was removed
                
                const response = {
                    message: "Article successfully deleted",
                    id: articleResult._id
                };
                
            });//(err,article)            
        }//if
          
        console.log("IM HERREE--> Line 134", msg);


        let article=new Article(req.body);
        article.userId=req.user._id;

        var promise= new Promise(function(resolve,reject){
            if(article.edit==0){
                request(`${req.body.articleUrl}`, async function(err, resp, html) {
                    console.log('ERROR',err);
                    if (!err){
                        
                        const $ = cheerio.load(html);
                        
                        
                        $(".postArticle-content").attr("contenteditable","true");
                        article.articleContent= await $('.postArticle-content').html();
                        
                        console.log('SAVED THIS INTO ARTICLECONTENT',article.articleContent);
                        resolve(1);
                    }//if
                });//request            
            }//if
            
            
        }).then(function(response){
            console.log('SAVED THIS INTO ARTICLECONTENT OUSSIDE',article.articleContent);

            article.save(function(err){
                if(err){ throw err }
                res.json({success:true})     
                
            });//article save
        });       


    });//post

    //saves edited articles, with delete if found in database, then rewrite method
    app.post("/article-edit", isLoggedIn, async function(req,res){
        console.log('article-edit', req.body, req.user);

        let msg="";

        let articles=await Article.find({
            userId:req.user._id
        }).exec();

        let articleResult=await articles.find(function(item){
            if(item.articleUrl==req.body.articleUrl){
                return item;
            }
        });

        //console.log("ARTICLE ID: IF FOUND IS-->",articleResult);

        

        if(articleResult){
            msg=await Article.findByIdAndRemove(articleResult._id, (err, article) => {
                //handle any potential errors:
                if (err) return err;
                // We'll create a simple object to send back with a message and the id of the document that was removed
                const response = {
                    message: "Article successfully deleted",
                    id: articleResult._id
                };
                //return response;
            });//(err,article)            
        }//if
          
        console.log("IM HERREE--> Line 101", msg);

        let article=new Article(req.body);
        article.userId=req.user._id;

        article.save(function(err){
            if(err){ throw err }
            res.json({success:true})     
            
        });//article save
             

    });//app.post(/article-edit)

    //Not needed for current version, but keep for future versions
    app.post('/update',isLoggedIn,function(req,res){
        console.log('update',req.body,req.user);
         Article.findOne({headerText: req.body.headerText}, function (err, art) {
            art.articleContent=req.body.articleContent;
            art.save(function (err) {
                if(err) {
                    console.error('ERROR!');
                }
            });
        }); 
        
    });

    //Delete the article from the database using the id
    app.post('/delete',isLoggedIn,function(req,res){
        console.log("DELETE",req.body);
        Article.remove({_id:req.body.id}).exec().then(function(){
            res.json({deleted:req.body.id});
        });
        
    });
// normal routes ===============================================================
    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('landing.hbs');
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
            failureRedirect : '/login', // redirect back to the login page if there is an error
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
        user.remove(function(err) {
            res.redirect('/login');
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
// route middleware to ensure user is logged in using passport
function isLoggedIn(req, res, next) {
    //console.log(req.referer);
    let test = false; 
    //if(req.referer==undefined)
        //test = true;
    if (req.isAuthenticated()||test)//req.test used for testing if i can manage that
        return next();
    res.redirect('/login');
}


