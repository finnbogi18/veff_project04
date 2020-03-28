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
            chai.expect(res.body).to.be.a('object');
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
            chai.expect(Object.keys(res.body).length).to.be.eql(4);
            chai.expect()
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

    it("POST /users failure", function (done) {
        chai.request('http://localhost:3000/api/v1')
            .post('/users')
            .set('Content-type', 'application/json')
            .send({'age':'10'})
            .end( (err, res) => {
            chai.expect(res).to.have.status(400);
            chai.expect(res).to.be.json;
            chai.expect(res.body).to.be.a('object');
            chai.expect(res.body).to.have.property('message').eql('No username defined.');
            chai.expect(Object.keys(res.body).length).to.be.eql(1);
            done();
        });
    });
});