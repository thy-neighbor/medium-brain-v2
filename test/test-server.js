const chai= require("chai");
const chaiHttp = require("chai-http");
const Article= require('../app/models/article');
const User= require('../app/models/user');
const request = require('supertest');


const {app, runServer, closeServer} = require("../server.js");

var authenticatedUser = request.agent(app);

const cheerio = require('cheerio');
const expect = chai.expect;

chai.use(chaiHttp);

describe("Medium Wiki", function(){
    before(function(){
        return runServer();
    });

    after(function(){
        return closeServer();
    });

    describe("Tests without Login Needed",function(){
        it("Should start on the landing page('/' || '/landing') as default(!LoggedIn)", function(){
            return chai
            .request(app)
            .get('/')
            .then(function(res){
                expect(res).to.be.ok; 
                //res.body gives a bad return value for cheerio.. so we use res.text to load into cheerio scrape
                var $ = cheerio.load(res.text);
                var header = $('h1').text();
                console.log(header);
                expect(header).to.be.ok;
                expect(header).to.be.equal("Welcome to Medium Wiki");
            });
        });
    
        it("Should load '/signup' page", function(){
            return chai
            .request(app)
            .get('/signup')
            .then(function(res){
                expect(res).to.be.ok; 
                //res.body gives a bad return value for cheerio.. so we use res.text to load into cheerio scrape
                var $ = cheerio.load(res.text);
                var header = $('h1').text();
                console.log(header);
                expect(header).to.be.ok;
                expect(header).to.be.equal("Signup");
            });
        });
    
        it("GET('/login') page", function(){
            return chai
            .request(app)
            .get('/login')
            .then(function(res){
                expect(res).to.be.ok; 
                //res.body gives a bad return value for cheerio.. so we use res.text to load into cheerio scrape
                var $ = cheerio.load(res.text);
                var header = $('h1').text();
                console.log(header);
                expect(header).to.be.ok;
                expect(header).to.be.equal("Login");
            });
        });
    
        it("Post('/signup') should signup new user", function(){
            return chai
            .request(app)
            .post('/signup')
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .send({ email: 'username@user.com', password: 'password' })
            .then(function(res){
                expect(res).to.be.ok;
            
                expect(res).to.have.status(200);
                let testUser = User.find({'local.email':'username@user.com'});
                //console.log('USer',testUser);
                
                
                //expect(res.req.path).to.be.equal('/profile');   //only called on success
            }).then(function(){
                //User.remove({local:{email:'username@user.com'}}).exec();
                //User.find(local:);
                User.findOneAndRemove({'local.email':'username@user.com'}).exec();
                
            });
        });
    
        it("Should login (Post'/login')", function(){
            return chai
            .request(app)
            .post('/login')
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .send({ email: 'test@test.com', password: 'test' })
            .then(function(res){
                expect(res).to.be.ok;
                expect(res).to.have.status(200);
            });//then
        });//it
    
        it("Should connect local account (Post'/connect/local')", function(){
            return chai
            .request(app)
            .post('/connect/local')
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json')
            .send({ email: 'test@test.com', password: 'test' })
            .then(function(res){
                expect(res).to.be.ok;
                expect(res).to.have.status(200);
            });//then
        });//it

    
    });//describe

    describe('Tests with Login Needed', function(){
        before(function(done){
            //return chai
            //.request(app)
            
            authenticatedUser
            
            .post('/login')
            
            //.set('Accept', 'application/json')
            //.set('Content-Type', 'application/json')
            //.send({ email: 'test@test.com', password: 'test' });
            .set('Accept', 'application/x-www-form-urlencoded')
            .set('content-type', 'application/x-www-form-urlencoded')
            .type('form')
            //.send('grant_type=password')
            .send('email=test@test.com')
            .send('password=test')
            //return chai
            //authenticatedUser
            //.request(app)
            //.post('/login')
            
            //.set('Accept', 'application/json')
            //.set('Content-Type', 'application/json')
           // .send({ email: 'test@test.com', password: 'test' })
            
            //.set('content-type', 'application/x-www-form-urlencoded')
            //.type('form')
            //.send('grant_type=password')
            //.send('email=test@test.com')
            //.send('password=test')
            .then(function(err, response){
                console.log("BEFORE: PATH->",response);
              expect('Location', '/profile-home');
              done();
            });
        });
    
        it("GET('/profile') page", function(){
            return authenticatedUser
            .get('/profile')
            .then(function(res){
                expect(res).to.be.ok; 
                //res.body gives a bad return value for cheerio.. so we use res.text to load into cheerio scrape
                var $ = cheerio.load(res.text);
                var header = $('h1').text();
                console.log(header);
                expect(header).to.be.ok;
                expect(header).to.be.equal("User Profile Page");
            });
        });
        
        it("Should get results from Medium.com using webscrape (GET '/medium?q=cats')", function(done){
            return authenticatedUser
            .get('/medium?q=cats')
            .then(async function(res){
                expect(res).to.be.ok;
                //scrape the new handlebar page loaded using cheerio AGAIN :)
                var $ =await cheerio.load(res.text);
                //for this case medium.hbs
                let header = $('h1').text();
                //This header is set inside of the cheerio request function which is only
                //called to without an err
                expect(header.text()).to.be.equal('Medium Search Results');
    
                let content = $('.postArticle-content');
                //this would mean that there is valid content loaded
                expect(content).to.not.equal(undefined);
                expect(content).to.not.equal(null);
                done();
        
            });//then
        });//it
    
    });//describe

});//describe

