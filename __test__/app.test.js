const path = require('path');
const request = require('supertest');
const { app, mongoose } = require('../app');
const { settingModel, userModel, mediaModel, postModel } = require('../models');



// setup
const agent = request.agent(app);
const cookiesJar = [];


beforeAll(async (done) => {
    if (process.env.NODE_ENV === 'test') await mongoose.connection.dropDatabase();
    else throw new Error('Should run in test mode!');
    await settingModel.init(done);
});

afterAll((done) => mongoose.disconnect(done));



// test
describe('Server Initialization', () => {
    test('Should run in test mode', () => {
        expect(process.env.NODE_ENV).toEqual('test');
    });

    test('Should get access to the root', async() => {
        const res = await request(app)
            .get('/');
        //
        expect(res.statusCode).toBe(200);
    });
});


describe('Route - Seed', () => {
    test('Should seeds data and move', async () => {
        const res = await request(app)
            .get('/seed');
        //
        expect(res.headers.location).toBe('/post');
        expect(res.statusCode).toBe(302);
        await expect(userModel.count({})).resolves.toBe(1);
        await expect(postModel.count({})).resolves.toBe(1);
    });
});


describe('Route - Authentication', () => {
    test('Should be able to sign-in by email or username and move', async () => {
        const req = (doc) => request(app).patch('/signin').send(doc);
        const doc = [{ email: 'leo@leoyli.com', password: 'leo' }, { email: 'leo', password: 'leo' }];
        const res = await Promise.all([req(doc[0]), req(doc[1])]);
        //
        res.forEach(res => {
            expect(res.headers.location).toBe('/console/dashboard');
            expect(res.statusCode).toBe(302);
        });
    });

    test('Should persists session by cookie', async () => {
        await request(app)
            .patch('/signin')
            .send({ email: 'leo@leoyli.com', password: 'leo' })
            .then(res => cookiesJar.push(res.headers['set-cookie'].pop().split(';')[0]));
        const res = await request(app)
            .get('/console/dashboard')
            .set('Cookie', cookiesJar[0]);
        //
        expect(res.statusCode).toBe(200);
        expect(cookiesJar.length).toBe(1);
    });

    test('Should persists session by agent', async () => {
        await agent
            .patch('/signin')
            .send({ email: 'leo@leoyli.com', password: 'leo' });
        const res = await agent.get('/console/dashboard');
        //
        expect(res.statusCode).toBe(200);
    });
});


describe('Route - Console', () => {
    test('Should have "x-robots-tag" header set to "none"', async () => {
        const res = await agent
            .get('/console/dashboard');
        //
        expect(res.headers['x-robots-tag']).toBe('none');
    });

    test('Should updates configs of the site', async () => {
        await agent
            .patch('/console/setting')
            .send({ siteSetting: { title: 'Testing Website' }});
        //
        expect((await settingModel.findOne({})).title).toContain('Testing Website');
    });

    test('Should updates nickname for current user profile', async () => {
        await agent
            .patch('/console/profile')
            .send({ profile: { nickname: 'test' }});
        //
        expect((await userModel.findOne({ email: 'leo@leoyli.com' })).nickname).toContain('test');
    });

    test('Should updates password of the user', async () => {
        await agent
            .patch('/console/security')
            .send({ password: { old: 'leo', new: 'test', confirmed: 'test' }});
        const req = (doc) => request(app).patch('/signin').send(doc);
        const doc = [{ email: 'leo@leoyli.com', password: 'test' }, { email: 'leo@leoyli.com', password: 'leo' }];
        const res = await Promise.all([req(doc[0]), req(doc[1])]);
        //
        expect(res[0].headers.location).toBe('/console/dashboard');
        expect(res[1].headers.location).not.toBe('/console/dashboard');
    });

    test('Should upload test file and move', async () => {
        const res = await agent
            .post('/console/upload')
            .attach('media[file]', path.join(__dirname, 'test.png'))
            .field('media[title]', 'test')
            .field('media[description]', 'user profile picture for the test');
        //
        expect(res.headers.location).toBe('/');
        expect(res.statusCode).toBe(302);
        await expect(mediaModel.count({})).resolves.toBe(1);
    });
});
