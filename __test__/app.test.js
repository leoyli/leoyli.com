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


describe('Router - Seed', () => {
    test('Should seeds data and move', async () => {
        const res = await request(app)
            .get('/seed');
        //
        expect(res.statusCode).toBe(302);
        expect(res.headers.location).toBe('/post');
        expect(await userModel.count({})).toBe(1);
        expect(await postModel.count({})).toBe(1);
    });
});


describe('Route - Authentication', () => {
    test('Should be able to sign-in by email or username and move', async () => {
        const req = (doc) => request(app).post('/signin').send(doc);
        const doc = [{ email: 'leo@leoyli.com', password: 'leo' }, { email: 'leo', password: 'leo' }];
        const res = await Promise.all([req(doc[0]), req(doc[1])]);
        //
        res.forEach(res => {
            expect(res.statusCode).toBe(302);
            expect(res.headers.location).toBe('/dashboard');
        });
    });

    test('Should persists session by cookie', async () => {
        await request(app)
            .post('/signin')
            .send({ email: 'leo@leoyli.com', password: 'leo' })
            .then(res => cookiesJar.push(res.headers['set-cookie'].pop().split(';')[0]));
        const res = await request(app)
            .get('/dashboard')
            .set('Cookie', cookiesJar[0]);
        //
        expect(res.statusCode).toBe(200);
        expect(cookiesJar.length).toBe(1);
    });

    test('Should persists session by agent', async () => {
        await agent
            .post('/signin')
            .send({ email: 'leo@leoyli.com', password: 'leo' });
        const res = await agent.get('/dashboard');
        //
        expect(res.statusCode).toBe(200);
    });
});


describe('Router - Dashboard', () => {
    test('Should have "x-robots-tag" header set to "none"', async () => {
        const res = await agent
            .get('/dashboard');
        //
        expect(res.headers['x-robots-tag']).toBe('none');
    });

    test('Should updates configs of the site', async () => {
        await agent
            .patch('/dashboard/setting')
            .send({ siteSetting: { title: 'Testing Website' }});
        //
        expect((await settingModel.findOne({})).title).toContain('Testing Website');
    });

    test('Should updates nickname for current user profile', async () => {
        await agent
            .patch('/dashboard/profile')
            .send({ profile: { nickname: 'test' }});
        //
        expect((await userModel.findOne({ email: 'leo@leoyli.com' })).nickname).toContain('test');
    });

    test('Should updates password of the user', async () => {
        await agent
            .patch('/dashboard/security')
            .send({ password: { old: 'leo', new: 'test', confirmed: 'test' }});
        const req = (doc) => request(app).post('/signin').send(doc);
        const doc = [{ email: 'leo@leoyli.com', password: 'test' }, { email: 'leo@leoyli.com', password: 'leo' }];
        const res = await Promise.all([req(doc[0]), req(doc[1])]);
        //
        expect(res[0].headers.location).toBe('/dashboard');
        expect(res[1].headers.location).not.toBe('/dashboard');
    });

    test('Should upload test file and move', async () => {
        const res = await agent
            .post('/dashboard/upload')
            .attach('media[file]', path.join(__dirname, 'test.png'))
            .field('media[title]', 'test')
            .field('media[description]', 'user profile picture for the test');
        //
        expect(res.statusCode).toBe(302);
        expect(res.headers.location).toBe('/');
        expect(await mediaModel.count({})).toBe(1);
    });
});


describe('Router - post', () => {
    test('Should POST a new post', async () => {
        const mockNewPost = { post: { title: 'TEST POST', category: 'test', featured: '', content: 'TEST CONTENT' }};
        const res = await agent
            .post('/post/editor')
            .send(mockNewPost);
        //
        expect(res.statusCode).toBe(302);
        expect(res.headers.location).toBe('/post');
        expect(await postModel.count(mockNewPost.post)).toBe(1);
    });

    test('Should GET the created post', async () => {
        const res = await agent
            .get('/post/test-post');
        //
        expect(res.statusCode).toBe(200);
    });

    test('Should PATCH the created post', async () => {
        const mockEditedPost = { post: { title: 'EDITED', category: 'test', featured: '', content: 'CONTENT EDITED' }};
        const post = await postModel.findOne({ canonical: 'test-post' });
        const res = await agent
            .patch(`/post/editor/${post._doc._id}`)
            .send(mockEditedPost);
        //
        expect(res.statusCode).toBe(302);
        expect(res.headers.location).toBe('/post/test-post');
        expect(await postModel.count(mockEditedPost.post)).toBe(1);
    });

    test('Should DELETE the created new post', async () => {
        const post = await postModel.findOne({ canonical: 'test-post' });
        const res = await agent
            .delete(`/post/editor/${post._doc._id}`);
        //
        expect(res.statusCode).toBe(302);
        expect(res.headers.location).toBe('/post/');
        expect(await postModel.count({ canonical: 'test-post' })).not.toBe(1);
    });
});
