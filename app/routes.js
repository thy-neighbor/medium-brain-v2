
const brain=require("brain.js");
const Article= require('./models/article');
//Cheerio
var request = require('request');
var cheerio = require('cheerio');

const trainingData = [
    {
        input: "So true, thank you!",
        output: { dislike: 1 }
    },{
        input: "Make America Great Again", 
        output: { dislike: 1 }
    },{
        input: "Why I dyed my hair pink",
        output: { like: 1 }
    },
    {
        input: "So true, thank you!",
        output: { dislike: 1 }
    },{
        input: "Make America Great Again", 
        output: { dislike: 1 }
    },{
        input: "Why I dyed my hair pink",
        output: { like: 1 }
    },
    {
        input: "So true, thank you!",
        output: { dislike: 1 }
    },{
        input: "Make America Great Again", 
        output: { dislike: 1 }
    },{
        input: "Why I dyed my hair pink",
        output: { like: 1 }
    },
    {
        input: "So true, thank you!",
        output: { dislike: 1 }
    },{
        input: "Make America Great Again", 
        output: { dislike: 1 }
    },{
        input: "Why I dyed my hair pink",
        output: { like: 1 }
    },
    {
        input: "So true, thank you!",
        output: { dislike: 1 }
    },{
        input: "Make America Great Again", 
        output: { dislike: 1 }
    },{
        input: "Why I dyed my hair pink",
        output: { like: 1 }
    },
    {
        input: "So true, thank you!",
        output: { dislike: 1 }
    },{
        input: "Make America Great Again", 
        output: { dislike: 1 }
    },{
        input: "Why I dyed my hair pink",
        output: { like: 1 }
    },
    {
        input: "So true, thank you!",
        output: { dislike: 1 }
    },{
        input: "Make America Great Again", 
        output: { dislike: 1 }
    },{
        input: "Why I dyed my hair pink",
        output: { like: 1 }
    },
    {
        input: "So true, thank you!",
        output: { dislike: 1 }
    },{
        input: "Make America Great Again", 
        output: { dislike: 1 }
    },{
        input: "Why I dyed my hair pink",
        output: { like: 1 }
    },
    {
        input: "So true, thank you!",
        output: { dislike: 1 }
    },{
        input: "Make America Great Again", 
        output: { dislike: 1 }
    },{
        input: "Why I dyed my hair pink",
        output: { like: 1 }
    },
    {
        input: "So true, thank you!",
        output: { dislike: 1 }
    },{
        input: "Make America Great Again", 
        output: { dislike: 1 }
    },{
        input: "Why I dyed my hair pink",
        output: { like: 1 }
    },
    {
        input: "So true, thank you!",
        output: { dislike: 1 }
    },{
        input: "Make America Great Again", 
        output: { dislike: 1 }
    },{
        input: "Why I dyed my hair pink",
        output: { like: 1 }
    },
    {
        input: "So true, thank you!",
        output: { dislike: 1 }
    },{
        input: "Make America Great Again", 
        output: { dislike: 1 }
    },{
        input: "Why I dyed my hair pink",
        output: { like: 1 }
    },
    {
        input: "So true, thank you!",
        output: { dislike: 1 }
    },{
        input: "Make America Great Again", 
        output: { dislike: 1 }
    },{
        input: "Why I dyed my hair pink",
        output: { like: 1 }
    },
    {
        input: "So true, thank you!",
        output: { dislike: 1 }
    },{
        input: "Make America Great Again", 
        output: { dislike: 1 }
    },{
        input: "Why I dyed my hair pink",
        output: { like: 1 }
    },
    {
        input: "So true, thank you!",
        output: { dislike: 1 }
    },{
        input: "Make America Great Again", 
        output: { dislike: 1 }
    },{
        input: "Why I dyed my hair pink",
        output: { like: 1 }
    },
    {
        input: "So true, thank you!",
        output: { dislike: 1 }
    },{
        input: "Make America Great Again", 
        output: { dislike: 1 }
    },{
        input: "Why I dyed my hair pink",
        output: { like: 1 }
    },
    {
        input: "So true, thank you!",
        output: { dislike: 1 }
    },{
        input: "Make America Great Again", 
        output: { dislike: 1 }
    },{
        input: "Why I dyed my hair pink",
        output: { like: 1 }
    },
    {
        input: "So true, thank you!",
        output: { dislike: 1 }
    },{
        input: "Make America Great Again", 
        output: { dislike: 1 }
    },{
        input: "Why I dyed my hair pink",
        output: { like: 1 }
    }
    
    
]

let trainedNet;

function encode(arg) {
    return arg.split('').map(x => (x.charCodeAt(0) / 256));
}

function processTrainingData(data) {
    return data.map(d => {

        //console.log('d',d)
        let output;
        if(d.like==1){
            output={like:1}
        } else {
            output={dislike:1}
        }
        //console.log( output,  encode(d.headerText) )
        //console.log( d.output, encode(d.input) )
        return {
            input: encode(d.input),
            output: d.output
        }
    })
}

    /*
function train(data) {
    let net = new brain.NeuralNetwork();
    net.trainAsync(processTrainingData(data)).then(res=>{ console.log('traincallback is ',res)});
    trainedNet = net.toFunction();
    console.log('train')
};

*/


    
function train(data) {
    console.log('ho')
    return new Promise(function(resolve, reject) {
        let net = new brain.NeuralNetwork();
        net.trainAsync(processTrainingData(data)).then(res=>{ 
            console.log('traincallback', res)
            resolve(res)
        });
        trainedNet = net.toFunction();
        console.log('train')
    })
};






/*
var promise1 = new Promise(function(resolve, reject) {
    console.log("promise1")
    setTimeout(function() {
    console.log("promise1 resolved")
        
    resolve('foo');
  }, 10000);
});*/






function execute(input) {
    let results = trainedNet(encode(input));
    console.log('results ',results)
    let output;
    let certainty;
    if (results.dislike > results.like) {
        output = 'Donald dislike'
        certainty = Math.floor(results.dislike * 100)
    } else { 
        output = 'Kim like'
        certainty = Math.floor(results.like * 100)
    }

    return results
}


let statement=["Why I dyed my hair pink","Make America Great Again","'Congressman Schiff omitted and distorted key facts' @FoxNews  So, what else is new. He is a total phony!","Why I dyed my hair pink","Make America Great Again","'Congressman Schiff omitted and distorted key facts' @FoxNews  So, what else is new. He is a total phony!","Why I dyed my hair pink","Make America Great Again","'Congressman Schiff omitted and distorted key facts' @FoxNews  So, what else is new. He is a total phony!","Why I dyed my hair pink","Make America Great Again","'Congressman Schiff omitted and distorted key facts' @FoxNews  So, what else is new. He is a total phony!","Why I dyed my hair pink","Make America Great Again","'Congressman Schiff omitted and distorted key facts' @FoxNews  So, what else is new. He is a total phony!","Why I dyed my hair pink","Make America Great Again","'Congressman Schiff omitted and distorted key facts' @FoxNews  So, what else is new. He is a total phony!","Why I dyed my hair pink","Make America Great Again","'Congressman Schiff omitted and distorted key facts' @FoxNews  So, what else is new. He is a total phony!"]



module.exports = function(app, passport) {
    //app.get('/medium',isLoggedIn,async function(req,res){ 

    app.get('/medium',async function(req,res){ 
        console.log(req.query, req.params);
        
        
        let articles=await Article.find({
            //userId:req.user._id
        }).exec();
        console.log('ARTICLES', articles.length);
        /*promise1.then(function(value) {
            console.log(value);
            // expected output: "foo"
        });*/
        /*  if(articles.length != 0){
        
             let t = await train(articles);
            //let t = await train(articles);
            console.log('t',t)

            for(let i=0;i<statement.length;i++){
                console.log(i)
                //console.log(execute(statement[i]));
            }

   
        }*/



        request(`https://medium.com/search?q=${req.query.q}`, async function(err, resp, html) {
        console.log(err);
            if (!err){
                const $ = cheerio.load(html);
                
                if(articles.length>0){

                    let t = await train(articles);
                    console.log('t',t)
                    $('.section-inner').each(function(e){
                        let text=$(this).find('h3').text();
                        console.log("TEXT",text); 
                        //execute(text)
                        //console.log($(this).find('h3').text());
                        let result=execute(text);
                        console.log('result ',result)
                    //let results={like:Math.random()}*/
                        if(!isNaN(result.like)){
                            //$(this).append(`<div>${Math.floor(results.like*100)}%</div>`);
                            $(this).append(`<div>You like this ${(result.like).toFixed(2)*100}%</div>`);
                        } else { 
                            $(this).append(`<div class="calculation">No calculation available</div>`);
                        }
                        
                    }); 
                }                   
                let temp=$('.postArticle-content').append(`<br>
                <button class="like-btn-js">Like me</button>
                <button class="dislike-btn-js">Hate me</button>
                `);
                let section=`<h1 class="medium-search-results-title">Medium Search Results</h1><br> ${$('.postArticle-content')}`;
                
                
                
                $.html();
                //console.log(section.html());
                res.render('medium.hbs', {
                    html:section
                });
            }
       });
                   

    });

    app.post('/medium',isLoggedIn,function(req,res){
        res.redirect(`/medium?q=${req.body.q}`);
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
