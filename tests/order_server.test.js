const test = require('ava');
const http = require('http');
const listen = require('test-listen');
const got =  require('got');
const app = require('../index.js');

const functions = require('./order_functions.test.js')

test.before (async (t) => {
    t.context.server = http.createServer(app);
    t.context.prefixUrl = await listen(t.context.server);
    t.context.got = got.extend({ prefixUrl: t.context.prefixUrl, responseType: 'json' });
});

test.after.always((t) => {
    t.context.server.close();
});
//-----------------------------------------------------------------------//
test ('GET orders service', async (t) => {
    const { body ,statusCode } = await t.context.got("orders",{throwHttpErrors: false}); 
    t.is(statusCode, 200);
    t.is(body.length,2);
    functions.order_contain(t, body[0]);
    functions.order_contain(t, body[1]);
});


