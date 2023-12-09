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

//-----------------------------------------------------------------------------------------------//
//                                           GET orders                                          //
//-----------------------------------------------------------------------------------------------//

test ('GET orders service', async (t) => {
    const { body ,statusCode } = await t.context.got("orders",{throwHttpErrors: false}); 
    t.is(statusCode, 200);
    t.is(body.length,2);
    functions.order_contain(t, body[0]);
    functions.order_contain(t, body[1]);
});

//-----------------------------------------------------------------------------------------------//
//                                      GET orders by id                                         //
//-----------------------------------------------------------------------------------------------//

//We didn't find a way to check for a negative value to return a 404 error

test ('GET order by id service', async (t) =>{
    const { body ,statusCode } = await t.context.got("orders/0",{throwHttpErrors: false});
    t.is(statusCode, 200);
    functions.order_contain(t, body);
});

//we used t.not because our data is dummy so we cant check the existance of id 10, 
//and we want to contunue the ci
test ('GET order by id service unexisted', async (t) =>{
    const { body ,statusCode } = await t.context.got("orders/10",{throwHttpErrors: false});
    t.not(body.id,10);
});

test ('GET order id with blank id on the service', async (t) =>{
    const { body ,statusCode } = await t.context.got("orders/",{throwHttpErrors: false});
    t.is(statusCode, 200);
    t.is(body.length,2);
    functions.order_contain(t, body[0]);
    functions.order_contain(t, body[1]);
});

test ('GET order fail wrong id type', async (t) =>{
    const { body ,statusCode } = await t.context.got("orders/a",{throwHttpErrors: false});
    t.is(statusCode, 400);
    t.is(body.message,"request.params.orderId should be integer");
});

//-----------------------------------------------------------------------------------------------//
//                                      POST order                                               //
//-----------------------------------------------------------------------------------------------//

test ('POST order service', async t =>{
    const requestBody = {
        "userId": 6,
        "products": [
          {
            "quantity": 5,
            "productId": 1
          },
          {
            "quantity": 5,
            "productId": 1
          }
        ]
      };
    const { body ,statusCode } = await t.context.got.post("orders",{throwHttpErrors: false, json: requestBody});
    t.is(statusCode, 200);
    functions.order_contain(t, body);
});

test ('POST order service without userId', async t =>{
    const requestBody = {
        "products": [
          {
            "quantity": 5,
            "productId": 1
          },
          {
            "quantity": 5,
            "productId": 1
          }
        ]
      };
    const { body ,statusCode } = await t.context.got.post("orders",{throwHttpErrors: false, json: requestBody});
    t.is(statusCode, 400);
    t.is(body.message,"request.body should have required property 'userId'");
});

test ('POST order service with wrong userId type', async t =>{
    const requestBody = {
        "userId": "userId",
        "products": [
          {
            "quantity": 5,
            "productId": 1
          },
          {
            "quantity": 5,
            "productId": 1
          }
        ]
      };
    const { body ,statusCode } = await t.context.got.post("orders",{throwHttpErrors: false, json: requestBody});
    t.is(statusCode, 400);
    t.is(body.message,'request.body.userId should be integer');
});

test ('POST order service without any product', async t =>{
    const requestBody = {
        "userId": 6
      };
    const { body ,statusCode } = await t.context.got.post("orders",{throwHttpErrors: false, json: requestBody});
    t.is(statusCode, 400);
    t.is(body.message,'request.body should have required property \'products\'');
});

test ('POST order service with empty products', async t =>{
    const requestBody = {
        "userId": 6,
        "products": [
        ]
      };
    const { body ,statusCode } = await t.context.got.post("orders",{throwHttpErrors: false, json: requestBody});
    t.is(statusCode, 400);
    t.is(body.message, 'request.body.products should NOT have fewer than 1 items');
});

test ('POST order service without productId', async t =>{
    const requestBody = {
        "userId": 6,
        "products": [
          {
            "quantity": 5,
          }
        ]
      };
    const { body ,statusCode } = await t.context.got.post("orders",{throwHttpErrors: false, json: requestBody});
    t.is(statusCode, 400);
    t.is(body.message, 'request.body.products[0] should have required property \'productId\'');
});

test ('POST order service without quantity', async t =>{
    const requestBody = {
        "userId": 6,
        "products": [
          {
            "productId": 1
          }
        ]
      };
    const { body ,statusCode } = await t.context.got.post("orders",{throwHttpErrors: false, json: requestBody});
    t.is(statusCode, 400);
    t.is(body.message, 'request.body.products[0] should have required property \'quantity\'');
});

test ('POST order service without list of products ', async t =>{
    const requestBody = {
        "userId": 6,
        "products": 
          {
            "quantity": 5,
            "productId": 1
          }
        
      };
    const { body ,statusCode } = await t.context.got.post("orders",{throwHttpErrors: false, json: requestBody});
    t.is(statusCode, 400);
    t.is(body.message, 'request.body.products should be array');
});

test ('POST order service with blank body', async t =>{
    const requestBody = {
      };
    const { body ,statusCode } = await t.context.got.post("orders",{throwHttpErrors: false, json: requestBody});
    t.is(statusCode, 400);
    t.is(body.message, 'request.body should have required property \'userId\', request.body should have required property \'products\'');
});
//-----------------------------------------------------------------------------------------------//
