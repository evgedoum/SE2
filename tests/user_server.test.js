const test = require('ava');
const http = require('http');
const listen = require('test-listen');
const got =  require('got');
const app = require('../index.js');

const functions = require('./user_function.test.js')

test.before (async (t) => {
    t.context.server = http.createServer(app);
    t.context.prefixUrl = await listen(t.context.server);
    t.context.got = got.extend({ prefixUrl: t.context.prefixUrl, responseType: 'json' });
});

test.after.always((t) => {
    t.context.server.close();
});

//____________________________________________________________________________________________
// GET ALL USERS

test ('GET users (SERVER)', async (t) => {
    const { body ,statusCode } = await t.context.got("users",{throwHttpErrors: false});
    t.is(statusCode, 200);
    t.is(body.length,2);
    functions.user_contain(t, body[0]);
    functions.user_contain(t, body[1]);
});

//     ** We didn't find a way to check for a negative value to return a 404 error ** 
//______________________________________________________________________________________________
// GET USERS BY ID

test ('GET user by id (SERVER)', async (t) => {
    const { body ,statusCode } = await t.context.got("users/0",{throwHttpErrors: false});
    t.is(statusCode, 200);
    functions.user_contain(t, body);
});

test ('GET user by unexisted id', async (t) => {
    const { body ,statusCode } = await t.context.got("users/10",{throwHttpErrors: false});
    t.not(body.id, 10);
});

test ('GET users wrong id number', async (t) => {
    const { body ,statusCode } = await t.context.got("users/a",{throwHttpErrors: false});
    t.is(body.message, 'request.params.userId should be integer');
    t.is(statusCode, 400);    
});

test ('GET users without specific id', async (t) => {
    const { body ,statusCode } = await t.context.got("users/",{throwHttpErrors: false}); 
    t.is(statusCode, 200);
    t.is(body.length,2);
    functions.user_contain(t, body[0]);
    functions.user_contain(t, body[1]);
});
