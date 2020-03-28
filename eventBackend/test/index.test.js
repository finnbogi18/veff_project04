//Importing the application to test
let server = require('../index');
let mongoose = require("mongoose");
let Event = require('../models/event');
let Booking = require('../models/booking');

//These are the actual modules we use
let chai = require('chai');
let should = chai.should();
let chaiHttp = require('chai-http');
chai.use(chaiHttp);

describe('Endpoint tests', () => {
    //###########################
    //These variables contain the ids of the existing event/booking
    //That way, you can use them in your tests (e.g., to get all bookings for an event)
    //###########################
    let eventId = '';
    let bookingId = '';

    //###########################
    //The beforeEach function makes sure that before each test, 
    //there is exactly one event and one booking (for the existing event).
    //The ids of both are stored in eventId and bookingId
    //###########################
    beforeEach((done) => {
        let event = new Event({ name: "Test Event", capacity: 10, startDate: 1590840000000, endDate: 1590854400000});

        Event.deleteMany({}, (err) => {
            Booking.deleteMany({}, (err) => {
                event.save((err, ev) => {
                    let booking = new Booking({ eventId: ev._id, firstName: "Jane", lastName: "Doe", email: "jane@doe.com", spots: 2 });
                    booking.save((err, book) => {
                        eventId = ev._id;
                        bookingId = book._id;
                        done();
                    });
                });
            });
        });
    });

    //###########################
    //Write your tests below here
    //###########################

    it("should always pass", function() {
        console.log("Our event has id " + eventId);
        console.log("Our booking has id " + bookingId);
        chai.expect(1).to.equal(1);
    });
    
    it("GET /events", function (done) {
        chai.request('http://localhost:3000/api/v1').get('/events').end( (err, res) => {
            chai.expect(res).to.have.status(200);
            chai.expect(res).to.be.json;
            chai.expect(res.body).to.be.an('array');
            chai.expect(Object.keys(res.body).length).to.be.eql(1);
            done();
        });
    });

    it("GET /events/:eventId", function (done) {
        chai.request('http://localhost:3000/api/v1').get('/events/'+ eventId).end( (err, res) => {
            chai.expect(res).to.have.status(200);
            chai.expect(res).to.be.json;
            chai.expect(res.body).to.be.a('object');
            chai.expect(Object.keys(res.body).length).to.be.eql(8);
            chai.expect(res.body).to.have.property('name').eql('Test Event');
            chai.expect(res.body).to.have.property('capacity').eql(10);
            chai.expect(res.body).to.have.property('startDate');
            chai.expect(res.body).to.have.property('endDate');
            chai.expect(res.body).to.have.property('_id').to.be.eql(String(eventId));
            chai.expect(res.body).to.have.property('description').to.be.an('string');
            chai.expect(res.body).to.have.property('location').to.be.an('string');
            chai.expect(res.body).to.have.property('bookings').to.be.an('array');
            done();
        });
    });

    it("POST /events", function (done) {
        chai.request('http://localhost:3000/api/v1')
            .post('/events')
            .set('Content-type', 'application/json')
            .send({	'name': 'Arshatid HR', 'capacity': 3, 'startDate': '158458972000', 'endDate': '1584585972000', 'description': 'This was cancelled :/', 'location': 'Vodafonehollin'})
            .end( (err, res) => {
            chai.expect(res).to.have.status(201);
            chai.expect(res).to.be.json;
            chai.expect(res.body).to.be.a('object');
            chai.expect(res.body).to.have.property('name').eql('Arshatid HR');
            chai.expect(res.body).to.have.property('capacity').eql(3);
            chai.expect(res.body).to.have.property('description').eql('This was cancelled :/');
            chai.expect(res.body).to.have.property('location').eql('Vodafonehollin');
            chai.expect(res.body).to.have.property('_id');
            chai.expect(Object.keys(res.body).length).to.be.eql(7);
            done();
        });
    });

    it("POST /events/:eventid/bookings", function (done) {
        chai.request('http://localhost:3000/api/v1')
            .post('/events/' + eventId + '/bookings')
            .set('Content-type', 'application/json')
            .send({	'firstName': 'Finnbogi', 'lastName':'Jakobsson', 'tel':'5812345', 'email':'bogi@bogi.is', 'spots': 2})
            .end( (err, res) => {
            chai.expect(res).to.have.status(201);
            chai.expect(res).to.be.json;
            chai.expect(res.body).to.be.a('object');
            chai.expect(res.body).to.have.property('firstName').eql('Finnbogi');
            chai.expect(res.body).to.have.property('lastName').eql('Jakobsson');
            chai.expect(res.body).to.have.property('tel').eql('5812345');
            chai.expect(res.body).to.have.property('email').eql('bogi@bogi.is');
            chai.expect(res.body).to.have.property('spots').eql(2);
            chai.expect(res.body).to.have.property('_id');
            chai.expect(Object.keys(res.body).length).to.be.eql(6);
            done();
        });
    });

    it("GET /events/:eventId/bookings", function (done) {
        chai.request('http://localhost:3000/api/v1').get('/events/' + eventId + "/bookings").end( (err, res) => {
            chai.expect(res).to.have.status(200);
            chai.expect(res).to.be.json;
            chai.expect(res.body).to.be.an('array');
            chai.expect(Object.keys(res.body).length).to.be.eql(1);
            done();
        });
    });

    it("GET /events/:eventId/bookings/:bookingId", function (done) {
        chai.request('http://localhost:3000/api/v1').get('/events/'+ eventId + '/bookings/' + bookingId).end( (err, res) => {
            chai.expect(res).to.have.status(200);
            chai.expect(res).to.be.json;
            chai.expect(res.body).to.be.a('object');
            chai.expect(Object.keys(res.body).length).to.be.eql(6);
            chai.expect(res.body).to.have.property('firstName').eql('Jane');
            chai.expect(res.body).to.have.property('lastName').eql('Doe');
            chai.expect(res.body).to.have.property('spots').eql(2);
            chai.expect(res.body).to.have.property('email').eql('jane@doe.com');
            chai.expect(res.body).to.have.property('_id').to.be.eql(String(bookingId));
            chai.expect(res.body).to.have.property('tel').to.be.an('string');
            done();
        });
    });
    
    it("DELETE /events/:eventid/bookings/:bookingid Successful", function (done) {
        chai.request('http://localhost:3000/api/v1')
        .delete('/events/' + eventId + '/bookings/' + bookingId)
        .auth('admin', 'supersecret')
        .end((err, res) => {
        chai.expect(res).to.have.status(200);
        done();
        });
    });

    it("DELETE /events/:eventid/bookings/:bookingid Unsuccessful", function (done) {
        chai.request('http://localhost:3000/api/v1')
        .delete('/events/' + eventId + '/bookings/' + bookingId)
        .auth('admin', 'wrongpassword')
        .end((err, res) => {
        chai.expect(res).to.not.have.status(200);
        done();
        });
    });
});

