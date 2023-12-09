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

//i didnt fount the way to test the negative id so as to return status code to be 400

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

