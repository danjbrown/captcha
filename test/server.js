
let chai        = require('chai');
let chaiHttp    = require('chai-http');
let server      = require('../server');
let should      = chai.should();

chai.use(chaiHttp);

describe('Captcha Service', () => {
    // Test create Captcha
    describe('GET /create', () => {
        it('it should create a Captcha image', (done) => {
            chai.request(server)
            .get('/create')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('success');
                res.body.should.have.property('data');
                done();
            });
        });
    });

    // Test the verify Captcha code route
    describe('POST /verify', () => {
        it('it should verify a Captcha code', (done) => {
            chai.request(server)
            .post('/verify')
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({code: 'HG6adF'})
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.have.property('success', false);
                res.body.should.have.property('message', 'Invalid code');
                done();
            });
        });
    });
});
  