const http = require('http');
const test = require('ava');
const listen = require('test-listen');
const got =  require('got');

const app = require('../index.js');

test('Random test', t => {
    t.pass();
});

test.before (async (t) => {
    t.context.server = http.createServer(app);
    t.context.prefixUrl = await listen(t.context.server);
    t.context.got = got.extend({ prefixUrl: t.context.prefixUrl, responseType: 'json' });
});

test.after.always((t) => {
    t.context.server.close();
});