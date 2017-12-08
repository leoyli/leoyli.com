const path = require('path');
const request = require('supertest');
const { app, mongoose } = require('../app');
const { settingModel, userModel, mediaModel, postModel } = require('../models');



// setup
const agent = request.agent(app);
const cookiesJar = [];


beforeAll(async (done) => {
    if (process.env.NODE_ENV === 'test') await mongoose.connection.dropDatabase();
    else throw new Error('run in test mode!');
    return settingModel.init().then(() => done());
});

afterAll((done) => mongoose.disconnect(done));



// test
describe('Server Initialization', () => {
    test('Should run in test mode', () => {
        expect(process.env.NODE_ENV).toEqual('test');
    });

    test('GET the root', async() => {
        const res = await request(app)
            .get('/');
        //
        expect(res.statusCode).toBe(200);
    });
});


describe('Router - Seed', () => {
    test('Seeds data', async () => {
        const res = await request(app)
            .get('/seed');
        //
        expect(res.statusCode).toBe(302);
        expect(res.headers.location).toBe('/post');
        expect(await userModel.count({})).toBe(1);
        expect(await postModel.count({})).toBe(1);
    });
});


describe('Router - Authentication', () => {
    test('POST to sign-in by email or username', async () => {
        const req = (doc) => request(app).post('/signin').send(doc);
        const doc = [{ email: 'leo@leoyli.com', password: 'leo' }, { email: 'leo', password: 'leo' }];
        const res = await Promise.all([req(doc[0]), req(doc[1])]);
        //
        res.forEach(res => {
            expect(res.statusCode).toBe(302);
            expect(res.headers.location).toBe('/dashboard');
        });
    });

    test('Persists a session by cookie', async () => {
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

    test('Persists the session by agent', async () => {
        await agent
            .post('/signin')
            .send({ email: 'leo@leoyli.com', password: 'leo' });
        const res = await agent.get('/dashboard');
        //
        expect(res.statusCode).toBe(200);
    });

    test('GET to sign-in with/without been authorized', async () => {
        const res = await Promise.all([request(app).get('/signin'), agent.get('/signin')]);
        //
        expect(res[0].statusCode).toBe(200);
        expect(res[1].statusCode).toBe(302);
    });

    test('GET to sign-up with/without been authorized', async () => {
        const res = await Promise.all([request(app).get('/signup'), agent.get('/signup')]);
        //
        expect(res[0].statusCode).toBe(200);
        expect(res[1].statusCode).toBe(302);
    });

    test('POST a new user', async () => {
        const mocUserInput = {
            email       : 'test@leoyli.com',
            username    : 'test',
            password    : { new : 'test', confirmed: 'test' },
            firstName   : 'test',
            lastName    : 'test',
            picture     : '/media/201710/1509304639065.png'
        };
        const res = await request(app)
            .post('/signup')
            .send(mocUserInput);
        //
        expect(res.statusCode).toBe(302);
        expect(res.headers.location).toBe('/dashboard');
        expect(await userModel.count({})).toBe(2);
    });

    test('GET to sign-out from a session', async () => {
        const res = {
            signout: await request(app)
                .get('/signout')
                .set('Cookie', cookiesJar[0]),
            accessAuthPage: await request(app)
                .get('/dashboard')
                .set('Cookie', cookiesJar[0]),
        };
        //
        expect(res.signout.statusCode).toBe(302);
        expect(res.accessAuthPage.statusCode).toBe(302);
        expect(res.accessAuthPage.headers.location).toBe('/signin');
    });
});


describe('Router - Dashboard', () => {
    test('GET and have "x-robots-tag" header set to "none"', async () => {
        const res = await agent
            .get('/dashboard');
        //
        expect(res.statusCode).toBe(200);
        expect(res.headers['x-robots-tag']).toBe('none');
    });

    test('PATCH configs of the site', async () => {
        await agent
            .patch('/dashboard/setting')
            .send({ siteSetting: { title: 'Testing Website' }});
        //
        expect((await settingModel.findOne({})).title).toContain('Testing Website');
    });

    test('PATCH user nickname', async () => {
        await agent
            .patch('/dashboard/profile')
            .send({ profile: { nickname: 'test' }});
        //
        expect((await userModel.findOne({ email: 'leo@leoyli.com' })).nickname).toContain('test');
    });

    test('PATCH user password', async () => {
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

    test('POST to upload a test file', async () => {
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


describe('Router - Post', () => {
    test('POST a new post', async () => {
        const mockNewPost = { post: { title: 'TEST POST', category: 'test', featured: '', content: 'TEST CONTENT' }};
        const res = await agent
            .post('/post/editor')
            .send(mockNewPost);
        //
        expect(res.statusCode).toBe(302);
        expect(res.headers.location).toBe('/post');
        expect(await postModel.count(mockNewPost.post)).toBe(1);
    });

    test('GET access to the editor', async () => {
        const res = await Promise.all([agent.get('/post/editor'), agent.get('/post/editor/test-post')]);
        res.push(await agent.get(res[1].headers.location));
        //
        expect(res[0].statusCode).toBe(200);
        expect(res[1].statusCode).toBe(302);
        expect(res[2].statusCode).toBe(200);
    });

    test('GET the created post', async () => {
        const res = await agent
            .get('/post/test-post');
        //
        expect(res.statusCode).toBe(200);
    });

    test('GET the created post via alias', async () => {
        const post = await postModel.findOne({ canonical: 'test-post' });
        const res = await agent
            .get(`/post/${post._id}`);
        //
        expect(res.statusCode).toBe(302);
        expect(res.headers.location).toBe('/post/test-post');
    });

    test('PATCH the created post', async () => {
        const mockEditedPost = { post: { title: 'EDITED', category: 'test', featured: '', content: 'CONTENT EDITED' }};
        const post = await postModel.findOne({ canonical: 'test-post' });
        const res = await agent
            .patch(`/post/editor/${post._id}`)
            .send(mockEditedPost);
        //
        expect(res.statusCode).toBe(302);
        expect(res.headers.location).toBe('/post/test-post');
        expect(await postModel.count(mockEditedPost.post)).toBe(1);
    });

    test('DELETE the created new post', async () => {
        const post = await postModel.findOne({ canonical: 'test-post' });
        const res = await agent
            .delete(`/post/editor/${post._doc._id}`);
        //
        expect(res.statusCode).toBe(302);
        expect(res.headers.location).toBe('/post/');
        expect(await postModel.count({ canonical: 'test-post' })).not.toBe(1);
    });
});
