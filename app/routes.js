/*
var medium = require('medium-sdk')
var client = new medium.MediumClient({
  clientId: 'd1554f1f2fed',
  clientSecret: '949aef0d7a79e30f08750bd4cf66ad5ee20760ec'
})
var redirectURL = 'https://thy-neighbor.github.io/'; 
var url = client.getAuthorizationUrl('secretState', redirectURL, [
  medium.Scope.BASIC_PROFILE, medium.Scope.PUBLISH_POST
])
console.log(url);
// (Send the user to the authorization URL to obtain an authorization code.)
client.exchangeAuthorizationCode('3c7601933c04', redirectURL, function (err, token) {
  client.getUser(function (err, user) {
    client.createPost({
      userId: user.id,
      title: 'A new post',
      contentFormat: medium.PostContentFormat.HTML,
      content: '<h1>A New Post</h1><p>This is my new post.</p>',
      publishStatus: medium.PostPublishStatus.DRAFT
    }, function (err, post) {
      console.log(token, user, post)
    })
  })
})
*/
const brain=require("brain.js");
const Article= require('./models/article');
//Cheerio
var request = require('request');
var cheerio = require('cheerio');
var net = new brain.NeuralNetwork();
 const trainingData=[
    {
        input:"Dogs are cool",
        output: {like:1}
    },
        
    {   input:"Cats seem dope",
        output:{like:1}
    },
    {   input:"What is the Pizza Capital",
        output:{like:1}
    }  
]; 
/*
const ARTICLES =  [ { _id: '5bad1141acf37a5a25dcb58e',
    userId: '5bad1120acf37a5a25dcb58d',
    headerText: 'What is the Pizza Capital of the US?',
    headerImage:
     'https://cdn-images-1.medium.com/fit/t/1600/480/1*4_E6m7J0112DBi1Lmdniiw.png',
    __v: 0 },
  { _id: '5bad1142acf37a5a25dcb58f',
    userId: '5bad1120acf37a5a25dcb58d',
    headerText:
     'I Made the Pizza Cinnamon Rolls from Mario Batali’s Sexual Misconduct Apology Letter',
    headerImage:
     'https://cdn-images-1.medium.com/max/859/0*_XiHwzptmCWNLkjY.jpg',
    __v: 0 },
  { _id: '5bad11a8acf37a5a25dcb590',
    userId: '5bad1120acf37a5a25dcb58d',
    headerText: 'Live Prototyping with InVision Craft Prototype in Sketch',
    headerImage:
     'https://cdn-images-1.medium.com/fit/t/1600/480/1*63eHIsw3nfms1SG0vw3Umg.jpeg',
    __v: 0 },
  { _id: '5bad11d1acf37a5a25dcb591',
    userId: '5bad1120acf37a5a25dcb58d',
    headerText: 'A Five-Minute Guide to Better Typography',
    headerImage:
     'https://cdn-images-1.medium.com/fit/t/1600/480/1*m460vGFZ28J1Np-lydJSMA.gif',
    __v: 0 },
  { _id: '5bad11d3acf37a5a25dcb592',
    userId: '5bad1120acf37a5a25dcb58d',
    headerText:
     'The Single Piece Of Advice That Changed The Course Of My Career',
    headerImage:
     'https://cdn-images-1.medium.com/fit/t/1600/480/1*K9H8j1-zCwEDJjly8dJe2g.jpeg',
    __v: 0 } ]
const ARTICLES = [
  {
        headerText:"Dogs are cool",
    },
        
    {   headerText:"Cats seem dope",
    },
    {   headerText:"What is the Pizza Capital",
    }  
]
*/
let trainedNet;
function encode(arg) {
    return arg.split('').map(x => (x.charCodeAt(0) / 256));
}
 
function train(data) {
    let net = new brain.NeuralNetwork();
    net.train(processTrainingData(data));
    trainedNet = net.toFunction();
};
function execute(input) {
    console.log('input ',input);
    let results = trainedNet(encode(input));
    console.log('res' ,results)
    return results;
/*   if (results.trump > results.kardashian) {
        output = 'Donald Trump'
        certainty = Math.floor(results.trump * 100)
    } else { 
        output = 'Kim Kardashian'
        certainty = Math.floor(results.kardashian * 100)
    }
    return "I'm " + certainty + "% sure that tweet was written by " + output; */
}
 function processTrainingData(data) {
    return data.map(d => {
        console.log("Pumpkin",d);
        return {
            input: encode(d.headerText),
            output: {like:1}
        }
    })
} 
/*
 function processTrainingData(data) {
    
    return data.map(d => {
        console.log("blah",d);
    
        return {
            input: encode(d.input),
            output: d.output
        }
    })
}
*/
//train(ARTICLES);
//execute("Cats are dope")
//execute("Cats are stupid")
module.exports = function(app, passport) {
   
    app.get('/medium',isLoggedIn,async function(req,res){ 
        console.log(req.query, req.params);
        let articles=await Article.find({
            userId:req.user._id
        }).exec();
        if(articles.length>0){
            console.log('ARTICLES', articles)
            //train(articles);
        } 
        
        request(`https://medium.com/search?q=${req.query.q}`, function(err, resp, html) {
            console.log(err);
            if (!err){
                const $ = cheerio.load(html);
                
                if(articles.length>0){
                    $('.section-inner').each(function(e){
                        //let results=execute($(this).find('h3').text());
                        let results={like:Math.random()}
                        if(!isNaN(results.like)){
                            $(this).append(`<div>${Math.floor(results.like*100)}%</div>`);
                        } else { 
                            $(this).append(`<div>No calculation available</div>`);
                        }
                        
                        //console.log(this);
                        console.log($(this).find('h3').text());
                        console.log(results);
                    
                    }); 
                }                
                
                let temp=$('.postArticle-content').append("<button>Push me</button>");
                //$('.section-inner').prepend("<div>75%</div>");
                
                //let section=$('.section-inner');
                let section=$('.postArticle-content');
                //console.log(section);
                //$('.section-inner').after("<button>Push me</button>");
                $.html();
                //console.log(section.html());
                res.render('medium.hbs', {
                    html:section
                });
            }
        });
    });
    app.post('/article',isLoggedIn,function(req,res){
        console.log('article',req.body,req.user);
        let article=new Article(req.body);
        article.userId=req.user._id;
        article.save(function(err){
            if(err){ throw err } 
            res.json({success:true})
          });
        
    });
// normal routes ===============================================================
    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('login.hbs');
    });
    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function(req, res) {
        Article.find({userId:req.user._id}).then(articles=>{
            console.log(articles);
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
            successRedirect : '/profile', // redirect to the secure profile section
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