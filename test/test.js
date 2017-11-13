'use strict';

const chai = require('chai');
const expect = require('chai').expect;
const fs = require('fs');

chai.use(require('chai-http'));

var app = require('../app');
var agent = chai.request.agent(app);

describe('server connection, API endpoint /', function() {
    this.timeout(5000); // How long to wait for a response (ms)

    before(function() {

    });

    after(function() {
        require('../app').stop();
    });

    // GET - test connection
    it('should return home page', function() {
        return chai.request(app)
            .get('/')
            .then(function(res) {
                expect(res).to.have.status(200);
            });
    });

    // GET - Invalid path
    it('should return Not Found', function() {
        return chai.request(app)
            .get('/INVALID_PATH')
            .then(function(res) {
                throw new Error('Path exists!');
            })
            .catch(function(err) {
                expect(err).to.have.status(404);
            });
    });
});

describe('user authentication, API endpoint /login', function() {
    this.timeout(5000); // How long to wait for a response (ms)
    before(function() {

    });
    after(function() {
        require('../app').stop();
    });

    it('should fail to login', function() {
        return chai.request(app)
            .post('/login')
            .send({
                username: 'INVALID_USERNAME',
                password: 'INVALID_PASSWORD'
            })
            .then(function(res) {

                throw new Error('INVALID USERNAME or PASSWORD!');
            })
            .catch(function(err){
                expect(err).to.have.status(400);
            });
    });

    it('should successfully login', function() {
        return userLogin();
    });
});

function userLogin(){
    return agent.post('/login')
        .send({
            username: 'bofan',
            password: '123'
        })
        .then(function(res) {
            expect(res).to.have.status(200);
        });
}
