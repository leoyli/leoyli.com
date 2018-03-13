const path = require('path');
const request = require('supertest');
const { app, mongoose } = require('../app');
const { configModel, userModel, mediaModel, postModel } = require('../models');



// setup
const agent = request.agent(app);
const cookiesJar = [];


beforeAll(done => {
    if (process.env['NODE_ENV'] !== 'test') throw new Error('Should run in the test mode!');
    return mongoose.connection.dropDatabase(configModel.initialize(done));
});

afterAll(done => mongoose.disconnect(done));



// test
describe('Server Initialization', () => {
    test('Should run in test mode', () => {
        expect(process.env['NODE_ENV']).toEqual('test');
    });

    test('GET the root', async() => {
        const result = await request(app)
            .get('/');
        //
        expect(result.statusCode).toBe(200);
    });
});


describe('Router - Seed', () => {
    test('Seeds data', async () => {
        const result = await request(app)
            .get('/seed');
        //
        expect(result.statusCode).toBe(302);
        expect(result.headers.location).toBe('/post');
        expect(await userModel.count({})).toBe(1);
        expect(await postModel.count({})).toBe(1);
    });
});


describe('Router - Authentication', () => {
    test('POST to sign-in by email or username', async () => {
        const req = (doc) => request(app).post('/signin').send(doc);
        const doc = [{ email: 'leo@leoyli.com', password: 'leo' }, { email: 'leo', password: 'leo' }];
        const result = await Promise.all([req(doc[0]), req(doc[1])]);
        //
        result.forEach(result => {
            expect(result.statusCode).toBe(302);
            expect(result.headers.location).toBe('/home');
        });
    });

    test('Persists a session by cookie', async () => {
        await request(app)
            .post('/signin')
            .send({ email: 'leo@leoyli.com', password: 'leo' })
            .then(result => cookiesJar.push(result.headers['set-cookie'].pop().split(';')[0]));
        const result = await request(app)
            .get('/home')
            .set('Cookie', cookiesJar[0]);
        //
        expect(result.statusCode).toBe(200);
        expect(cookiesJar.length).toBe(1);
    });

    test('Persists the session by agent', async () => {
        await agent
            .post('/signin')
            .send({ email: 'leo@leoyli.com', password: 'leo' });
        const result = await agent.get('/home');
        //
        expect(result.statusCode).toBe(200);
    });

    test('GET to sign-in with/without been authorized', async () => {
        const result = await Promise.all([request(app).get('/signin'), agent.get('/signin')]);
        //
        expect(result[0].statusCode).toBe(200);
        expect(result[1].statusCode).toBe(302);
    });

    test('GET to sign-up with/without been authorized', async () => {
        const result = await Promise.all([request(app).get('/signup'), agent.get('/signup')]);
        //
        expect(result[0].statusCode).toBe(200);
        expect(result[1].statusCode).toBe(302);
    });

    test('POST a new user', async () => {
        const mocUserInput = {
            email           : 'test@leoyli.com',
            username        : 'test',
            password        : { new : 'test', confirmed: 'test' },
            picture         : '/media/201710/1509304639065.png',
            info: {
                firstName   : 'test',
                lastName    : 'test',
                residence   : 'Test/test',
                timeZone    : 'UTC−07:00 (MST)',
                gender      : 'NA',
                birthday    : Date.now(),
            }
        };
        const result = await request(app)
            .post('/signup')
            .send(mocUserInput);
        //
        expect(result.statusCode).toBe(302);
        expect(result.headers.location).toBe('/home');
        expect(await userModel.count({})).toBe(2);
    });

    test('GET to sign-out from a session', async () => {
        const result = {
            signout: await request(app)
                .get('/signout')
                .set('Cookie', cookiesJar[0]),
            accessAuthPage: await request(app)
                .get('/home')
                .set('Cookie', cookiesJar[0]),
        };
        //
        expect(result.signout.statusCode).toBe(302);
        expect(result.accessAuthPage.statusCode).toBe(302);
        expect(result.accessAuthPage.headers.location).toBe('/signin');
    });
});


describe('Router - Home', () => {
    test('GET and have "x-robots-tag" header set to "none"', async () => {
        const result = await agent
            .get('/home');
        //
        expect(result.statusCode).toBe(200);
        expect(result.headers['x-robots-tag']).toBe('none');
    });

    test('PATCH configs of the site', async () => {
        await agent
            .patch('/home/configs')
            .send({ configs: { title: 'Testing Website' }});
        //
        expect((await configModel.findOne({})).title).toEqual('Testing Website');
    });

    test.skip('PATCH user nickname', async () => {
        await agent
            .patch('/home/profile')
            .send({ profile: { nickname: 'test' }});
        //
        expect((await userModel.findOne({ email: 'leo@leoyli.com' })).nickname).toContain('test');
    });

    test('PATCH user password', async () => {
        await agent
            .patch('/home/security')
            .send({ password: { old: 'leo', new: 'test', confirmed: 'test' }});
        const req = doc => request(app).post('/signin').send(doc);
        const doc = [{ email: 'leo@leoyli.com', password: 'test' }, { email: 'leo@leoyli.com', password: 'leo' }];
        const result = await Promise.all([req(doc[0]), req(doc[1])]);
        //
        expect(result[0].headers.location).toBe('/home');
        expect(result[1].headers.location).not.toBe('/home');
    });

    test('POST to upload a test file', async () => {
        const result = await agent
            .post('/home/upload')
            .attach('media[file]', path.join(__dirname, 'test.png'))
            .field('media[title]', 'test')
            .field('media[description]', 'user profile picture for the test');
        //
        expect(result.statusCode).toBe(302);
        expect(result.headers.location).toBe('/');
        expect(await mediaModel.count({})).toBe(1);
    });
});


describe('Router - Post', () => {
    test('POST a new post', async () => {
        const mockNewPost = { post: { title: 'TEST POST', category: 'test', featured: '', content: 'TEST CONTENT' }};
        const result = await agent
            .post('/post/edit')
            .send(mockNewPost);
        //
        expect(result.statusCode).toBe(302);
        expect(result.headers.location).toBe('/post');
        expect(await postModel.count({ canonical: 'test-post' })).toBe(1);
    });

    test('GET access to the editor', async () => {
        const result = await Promise.all([agent.get('/post/edit'), agent.get('/post/edit/test-post')]);
        result.push(await agent.get(result[1].headers.location));
        //
        expect(result[0].statusCode).toBe(200);
        expect(result[1].statusCode).toBe(302);
        expect(result[2].statusCode).toBe(200);
    });

    test('GET the created post', async () => {
        const result = await agent
            .get('/post/test-post');
        //
        expect(result.statusCode).toBe(200);
    });

    test('GET the created post via alias', async () => {
        const post = await postModel.findOne({ canonical: 'test-post' });
        const result = await agent
            .get(`/post/${post._id}`);
        //
        expect(result.statusCode).toBe(302);
        expect(result.headers.location).toBe('/post/test-post');
    });

    test('PATCH the created post', async () => {
        const mockEditedPost = { post: { title: 'EDITED', category: 'test', featured: '', content: 'CONTENT EDITED' }};
        const post = await postModel.findOne({ canonical: 'test-post' });
        const result = await agent
            .patch(`/post/edit/${post._id}`)
            .send(mockEditedPost);
        //
        expect(result.statusCode).toBe(302);
        expect(result.headers.location).toBe('/post/test-post');
        expect(await postModel.count({ title: 'EDITED' })).toBe(1);
    });

    test('DELETE the created new post', async () => {
        const post = await postModel.findOne({ canonical: 'test-post' });
        const result = await agent
            .delete(`/post/edit/${post._doc._id}`);
        //
        expect(result.statusCode).toBe(302);
        expect(result.headers.location).toBe('/post/');
        expect(await postModel.count({ canonical: 'test-post' })).not.toBe(1);
    });
});
