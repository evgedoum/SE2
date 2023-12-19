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
//GET /products/{productId}

test('GET /products/{productId} (SERVER)', async (t) =>{
    const { body, statusCode } = await t.context.got("products/0");
    t.is(statusCode, 200);
    product_contain(t, body);
  });

  test('GET /products/{productId} | wrong argument type (SERVER)', async (t) =>{
    const { body, statusCode } = await t.context.got("products/a");
    t.is(statusCode, 400);
    t.is(body.message, 'request.params.productId should be integer')
  });

  test ('GET /products/{productId} | Bad request with random query (SERVER)', async (t) =>{
    const { body, statusCode } = await t.context.got("products/1?value=bad");
    t.is(statusCode, 400);
    t.is(body.message, "Unknown query parameter 'value'");
});

//---------------------------------------------------------------------------
//POST /products

test('POST /products (SERVER)', async (t) =>{
    request_body = {
        "price" : 6.027456183070403,
        "name" : "name" 
    };
    const { body, statusCode } = await t.context.got.post("products",{json: request_body});
    t.is(statusCode, 200);
    product_contain(t, body);
});

test('POST /products | missing property "price" (SERVER)', async (t) =>{
    request_body = {
        "name" : "name" 
    };
    const { body, statusCode } = await t.context.got.post("products",{json: request_body});
    t.is(body.message, "request.body should have required property 'price'");
});

test('POST /products | missing property "name" (SERVER)', async (t) =>{
    request_body = {
        "price" : 6.027456183070403
    };
    const { body, statusCode } = await t.context.got.post("products",{json: request_body});
    t.is(body.message, "request.body should have required property 'name'");
});

test('POST /products | empty body (SERVER)', async (t) =>{
    request_body = {};
    const { body, statusCode } = await t.context.got.post("products", {json: request_body});
    t.is(statusCode, 400);
    t.is(body.message, "request.body should have required property 'name', request.body should have required property 'price'");
});

test('POST /products | wrong "price" type (SERVER)', async (t) =>{
    request_body = {
        "price" : "6.027456183070403",
        "name" : "name" 
    };
    const { body, statusCode } = await t.context.got.post("products",{json: request_body});
    t.is(statusCode, 400);
    t.is(body.message, 'request.body.price should be number');
});

test('POST /products | wrong "name" type (SERVER)', async (t) =>{
    request_body = {
        "price" : 6.027456183070403,
        "name" : 1024 
    };
    const { body, statusCode } = await t.context.got.post("products",{json: request_body});
    t.is(statusCode, 400);
    t.is(body.message, 'request.body.name should be string');
});

test ('POST /products | Bad request with random query (SERVER)', async (t) =>{
    request_body = {
        "price" : 6.027456183070403,
        "name" : "name" 
    };
    const { body, statusCode } = await t.context.got.post("products?value=bad",{json: request_body});
    t.is(statusCode, 400);
    t.is(body.message, "Unknown query parameter 'value'");
});

//---------------------------------------------------------------------------
//PUT /products/{productID}

test('PUT /product/{productID} (SERVER)', async (t) =>{
    request_body = {
        "price" : 6.027456183070403,
        "name" : "name" 
    };
    const { body, statusCode } = await t.context.got.put("products/0",{json: request_body});
    t.is(statusCode, 200);
    product_contain(t, body);
});

test('PUT /products/{productID} | missing property "price" (SERVER)', async (t) =>{
    request_body = {
        "name" : "name" 
    };
    const { body, statusCode } = await t.context.got.put("products/0",{json: request_body});
    t.is(body.message, "request.body should have required property 'price'");
});

test('PUT /products/{productID} | missing property "name" (SERVER)', async (t) =>{
    request_body = {
        "price" : 6.027456183070403
    };
    const { body, statusCode } = await t.context.got.put("products/0",{json: request_body});
    t.is(body.message, "request.body should have required property 'name'");
});

test('PUT /products/{productID} | empty body (SERVER)', async (t) =>{
    request_body = {};
    const { body, statusCode } = await t.context.got.put("products/0", {json: request_body});
    t.is(statusCode, 400);
    t.is(body.message, "request.body should have required property 'name', request.body should have required property 'price'");
});

test('PUT /products/{productID} | wrong "price" type (SERVER)', async (t) =>{
    request_body = {
        "price" : "6.027456183070403",
        "name" : "name" 
    };
    const { body, statusCode } = await t.context.got.put("products/0",{json: request_body});
    t.is(statusCode, 400);
    t.is(body.message, 'request.body.price should be number');
});

test('PUT /products/{productID} | wrong "name" type (SERVER)', async (t) =>{
    request_body = {
        "price" : 6.027456183070403,
        "name" : 1024 
    };
    const { body, statusCode } = await t.context.got.put("products/0",{json: request_body});
    t.is(statusCode, 400);
    t.is(body.message, 'request.body.name should be string');
});

test ('PUT /products/{productID} | Bad request with random query (SERVER)', async (t) =>{
    request_body = {
        "price" : 6.027456183070403,
        "name" : "name" 
    };
    const { body, statusCode } = await t.context.got.put("products/0?value=bad",{json: request_body});
    t.is(statusCode, 400);
    t.is(body.message, "Unknown query parameter 'value'");
});

//---------------------------------------------------------------------------
//DELETE /products/{productId}

test('DELETE /products/{productId} (SERVER)', async (t) =>{
    const { body, statusCode } = await t.context.got.delete("products/0");
    t.is(statusCode, 200);
  });

  test('DELETE /products/{productId} | wrong argument type (SERVER)', async (t) =>{
    const { body, statusCode } = await t.context.got.delete("products/a");
    t.is(statusCode, 400);
    t.is(body.message, 'request.params.productId should be integer')
  });

  test ('DELETE /products/{productId} | Bad request with random query (SERVER)', async (t) =>{
    const { body, statusCode } = await t.context.got.delete("products/1?value=bad");
    t.is(statusCode, 400);
    t.is(body.message, "Unknown query parameter 'value'");
});
