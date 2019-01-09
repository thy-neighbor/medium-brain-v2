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
                //console.log(header);
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
                
                expect(testUser).to.be.ok;   //only called on success
            }).then(function(){
                User.findOneAndRemove({'local.email':'username@user.com'}).exec();
                
            });
        });
    
        it("Should login (Post'/login')", function(){   //this is tested twice
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
        this.timeout(20000); //the cheerio request time varies between 3000ms to 4000ms on my network
        before(function(done){         
            authenticatedUser           
            .post('/login')
            .set('Accept', 'application/x-www-form-urlencoded')
            .set('content-type', 'application/x-www-form-urlencoded')
            .type('form')
            .send('email=test@test.com')
            .send('password=test')

            .then(function(err, response){
                console.log("BEFORE: PATH->",response);
              expect('Location', '/profile-home');
              done();
            });
        });

        after( function(){
            return authenticatedUser
            .get('/logout')
            .then(function(res){
                expect(res).to.be.ok;
                expect(res).to.have.status(302);
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
                //console.log(header);
                expect(header).to.be.ok;
                expect(header).to.be.equal("User Profile Page");
            });
        });
        
        it("(GET '/medium?q=cats') Should get results from Medium.com using webscrape", function(){
            return authenticatedUser
            .get('/medium?q=cats')          
            .then(function(res){
                expect(res).to.be.ok;
                //scrape the new handlebar page loaded using cheerio AGAIN :)
                
                var $ =cheerio.load(res.text);
                //for this case medium.hbs
                let header = $('h1').text();
                //This header is set inside of the cheerio request function which is only
                expect(header).to.be.equal('Medium Search Results');
    
                let content = $('.postArticle-content');
                //this would mean that there is valid content loaded
                expect(content).to.not.equal(undefined);
                expect(content).to.not.equal(null);
            });//then
        });//it

        it("(POST '/medium') Should get results from Medium.com using webscrape", function(){
            return authenticatedUser
            .post('/medium')
            .set('Accept', 'application/x-www-form-urlencoded')
            .set('content-type', 'application/x-www-form-urlencoded')
            .type('form')
            .send('q=cats')
            .then(function(res){
                expect(res).to.have.status(302);//redirect to GET(/medium?q=cats);
            });//then
        });//it
        
        it('(GET /article-edit)', function(){
            return authenticatedUser
            .get('/article-edit?q=https://medium.com/human-parts/chasing-cats-ed619de5c00?source=search_post---------4')
            .then(function(res){
                expect(res).to.be.ok;
                var $ =cheerio.load(res.text);
                
                let header = $('h1').text();
                //This header is set inside of the cheerio request function which is only
                //called to without an err
                let expectHeader = 'Chasing Cats';

                expectHeader.trim();
                header.trim();
                expect(header).to.be.equal(expectHeader);
            });//then
        
        });//it

        it('(POST /article-edit)', function(){
            let headerText= 'What I, A Millennial, Call Dogs';
            let articleUrl='https://medium.com/@kickinson/what-i-a-millennial-call-dogs-d58d8fcc643c?source=search_post---------3';
            let headerImage='https://cdn-images-1.medium.com/max/1250/1*_WJ8KHZh2l8ofv_lXiRJmA.jpeg';
            let articleContent='<p>Jubacabra! RUN!</p>';
            return authenticatedUser
            .post('/article-edit')
            .send({headerText:headerText,headerImage:headerImage,articleUrl:articleUrl,articleContent:articleContent,like:1,edit:1})

        });

        it('(GET /article)', function(){
            return authenticatedUser
            .get('/article?q=https://medium.com/human-parts/chasing-cats-ed619de5c00?source=search_post---------0')
            .then(function(res){
                expect(res).to.be.ok;
                var $ =cheerio.load(res.text);
                //for this case medium.hbs
                let header = $('h1').text();
                //This header is set inside of the cheerio request function which is only
                //called to without an err
                console.log("HEADER",header);
                let expectedHeader = 'Chasing Cats';
                expect(header).to.be.equal(expectedHeader);
            });//then
        
        });//it

        it('(POST /article?q=)',function(){
            let headerText= 'How AI can learn to generate pictures of cats';
            let articleUrl='https://medium.freecodecamp.org/how-ai-can-learn-to-generate-pictures-of-cats-ba692cb6eae4?source=search_post---------8';
            let headerImage='https://cdn-images-1.medium.com/max/2600/1*7wMCLJ-EbSeyQvFUb9zVbA.png';

            return authenticatedUser
            .post('/article?q=https://medium.freecodecamp.org/how-ai-can-learn-to-generate-pictures-of-cats-ba692cb6eae4?source=search_post---------8')
            .send({headerText:headerText,headerImage:headerImage,articleUrl:articleUrl,like:1,edit:0})
            .then(function(res){
                expect(res).to.have.ok;
                expect(res).to.have.status(200);
            });//then
        });//it

        it('(GET /profile-home)',function(){
            return authenticatedUser
            .get('/profile-home')
            .then(function(res){
                expect(res).to.be.ok;
                var $ =cheerio.load(res.text);
                //for this case medium.hbs
                let header = $('h2').text();
                //This header is set inside of the cheerio request function which is only
                //called to without an err
                //console.log("HEADER",header);
                let expectedHeader='Liked Article Content';
                expect(header).to.be.equal(expectedHeader);

            });//then
        });//it

        it('(POST /delete)', async function(){
            let testUser = User.findOne({'local.email':'test@test.com'});

            let articles=await Article.find({
                userId:'5c315199ec12eb27fc27a8db'
            }).exec();


            let testArticle = articles.find(function(item){
            if(item.articleUrl=='https://medium.freecodecamp.org/how-ai-can-learn-to-generate-pictures-of-cats-ba692cb6eae4?source=search_post---------8'){
                return item;
                }
            });
            
            //console.log("USERRRRR",testArticle._id);

            return authenticatedUser
            .post('/delete')
            .send({id:testArticle.id})
            .then(function(res){
                expect(res).to.be.ok;
                expect(res).to.have.status(200);
            });
        });

    });//describe

});//describe

