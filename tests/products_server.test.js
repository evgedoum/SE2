const test = require('ava');
const http = require('http');
const listen = require('test-listen');
const got = require('got');
const app = require('../index.js');

const { product_contain } = require('./products_function.test.js');

test.before(async (t) => {
    t.context.server = http.createServer(app);
    t.context.prefixUrl = await listen(t.context.server);
    t.context.got = got.extend({ prefixUrl: t.context.prefixUrl, responseType: 'json', throwHttpErrors: false });
});

test.after.always((t) => {
    t.context.server.close();
});


test ('GET products server', async (t) =>{
    const { body, statusCode } = await t.context.got("products");
    t.is(statusCode, 200);
    t.is(body.length, 2);
    product_contain(t, body[0]);
    product_contain(t, body[1]);
    
    // console.log(statusCode);
    console.log(body);
});

//Make a GET request to the /products endpoint with an unexpeted random query.
test ('GET products server: Bad request with random query', async (t) =>{
    const { body, statusCode } = await t.context.got("products?value=bad");
    t.is(statusCode, 400);
});
