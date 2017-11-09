const request = require('supertest');
const { app, mongoose } = require('../app');
const { userModel, mediaModel, postModel } = require('../schema');



// setup
beforeAll((done) => {
    require('../schema')._siteConfig.siteInitialization(done);
});

afterAll((done) => {
    if (process.env.ENV === 'test') mongoose.connection.dropDatabase(() => {
        mongoose.disconnect(done);
    });
});



// test
describe('Server Initialization', () => {
    test('Testing Environment: test', () => {
        return expect(process.env.ENV).toEqual('test');
    });

    test('Connection: 200 - GET /', () => {
        return request(app).get('/').expect(200);
    });
});


describe('Route - Seed', () => {
    test('response: 302 - GET /', async () => {
        const res = await request(app).get('/seed');
        expect(res.headers.location).toBe('/post');
        expect(res.statusCode).toBe(302);
    });

    test('db: data counting', async () => {
        await expect(userModel.count({})).resolves.toBe(1);
        await expect(postModel.count({})).resolves.toBe(1);
    });
});


describe('Route - Authentication', () => {
    test('User login via email or username', async () => {
        const req = (doc) => request(app).patch('/signin').send(doc);
        const doc = [{ email: 'leo@leoyli.com', password: 'leo' }, { email: 'leo', password: 'leo' }];
        const res = await Promise.all([req(doc[0]), req(doc[1])]);
        res.forEach(res => expect(res.headers.location).toBe('/console/dashboard'));
    });
});
