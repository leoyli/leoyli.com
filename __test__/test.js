const { app, mongoose } = require('../app');
const request   = require('supertest');



// setup
beforeAll((done) => {
    require('../models/_siteConfig').siteInitialization(done);
});

afterAll((done) => {
    if (process.env.ENV === 'test') mongoose.connection.dropDatabase(() => {
        mongoose.disconnect(done);
    });
});



// test
describe('Server Initialization', () => {
    it('Should failed when env not test ', () => {
        expect(process.env.ENV).toEqual('test');
    });

    it('200 - GET /', () => {
        return request(app).get('/').expect(200);
    });
});
