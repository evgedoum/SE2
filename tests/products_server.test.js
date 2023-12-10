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

//---------------------------------------------------------------------------
//GET /products


test ('GET /products (SERVER)', async (t) =>{
    const { body, statusCode } = await t.context.got("products");
    t.is(statusCode, 200);
    t.is(body.length, 2);
    product_contain(t, body[0]);
    product_contain(t, body[1]);
});

//Make a GET request to the /products endpoint with an unexpeted random query.
test ('GET /products | Bad request with random query (SERVER)', async (t) =>{
    const { body, statusCode } = await t.context.got("products?value=bad");
    t.is(statusCode, 400);
});

//---------------------------------------------------------------------------
//GET product by ID

test('GET /productsd/{productId} (SERVER)', async (t) =>{
    const { body, statusCode } = await t.context.got("products/0");
    t.is(statusCode, 200);
    product_contain(t, body);
  });

  test('GET /productsd/{productId} | wrong argument type (SERVER)', async (t) =>{
    const { body, statusCode } = await t.context.got("products/a");
    t.is(statusCode, 400);
    t.is(body.message, 'request.params.productId should be integer')
  });

  test ('GET /products/{productId} | Bad request with random query (SERVER)', async (t) =>{
    const { body, statusCode } = await t.context.got("products/1?value=bad");
    t.is(statusCode, 400);
    t.is(body.message, "Unknown query parameter 'value'");
});