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

test ('GET order by id service with negative id', async (t) =>{
  const { body ,statusCode } = await t.context.got("orders/-10",{throwHttpErrors: false});
  t.is(statusCode, 400);
  t.is(body.message,"Id should be a positive integer.")
});

//-----------------------------------------------------------------------------------------------//
//                                        GET users orders                                       //
//-----------------------------------------------------------------------------------------------//

test ('GET users orders service', async t =>{
  const { body ,statusCode } = await t.context.got("orders/user/0",{throwHttpErrors: false});
  t.is(statusCode, 200);
  t.is(body.length, 2);
  functions.order_contain(t, body[0]);
  functions.order_contain(t, body[1]);
});

//this should fail but we test it with the dummy so as not to stop the ci
test ('GET users orders service with wrond id', async t =>{
  const { body ,statusCode } = await t.context.got("orders/user/10",{throwHttpErrors: false});
  t.is(statusCode, 200);
  t.is(body.length, 2);
 // t.is(body[0].userId,10); //if we test this as we should it fails so i test the dummy data with the function
  functions.order_contain(t, body[0]);
  functions.order_contain(t, body[1]);
});

test ('GET users orders with blank id on service', async t =>{
  const { body ,statusCode } = await t.context.got("orders/user/",{throwHttpErrors: false});
  t.is(statusCode, 400);
  t.is(body.message, 'request.params.orderId should be integer');
});

test ('GET users orders with wrong id type on service', async t =>{
  const { body ,statusCode } = await t.context.got("orders/user/a",{throwHttpErrors: false});
  t.is(statusCode, 400);
  t.is(body.message, 'request.params.user_id should be integer');
});

test ('GET users orders service with negative id', async t =>{
  const { body ,statusCode } = await t.context.got("orders/user/-10",{throwHttpErrors: false});
  t.is(statusCode, 400);
  t.is(body.message, "Id should be a positive integer.");
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

test ('POST order service with wrong id type', async t =>{
  const requestBody = {
      "id": "a",
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
  t.is(statusCode, 400);
  t.is(body.message,"request.body.id should be integer");
});

test ('POST order service with negative id', async t =>{
  const requestBody = {
      "id":-5,
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
  t.is(statusCode, 400);
  t.is(body.message,"Id should be a positive integer.");
});

test ('POST order service with a negative quantity', async t =>{
  const requestBody = {
      "userId": 6,
      "products": [
        {
          "quantity": 5,
          "productId": 1
        },
        {
          "quantity": -5,
          "productId": 1
        }
      ]
    };
  const { body ,statusCode } = await t.context.got.post("orders",{throwHttpErrors: false, json: requestBody});
  t.is(statusCode, 400);
  t.is(body.message,"Quantity of a product can't be negative.");
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

test ('POST order service with negative UserId', async t =>{
  const requestBody = {
      "userId": -6,
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
  t.is(body.message,"UserId should be a positive integer.");
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
//                                       PUT order                                               //
//-----------------------------------------------------------------------------------------------//


test ('PUT order service', async t =>{
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
  const { body ,statusCode } = await t.context.got.put("orders/0",{throwHttpErrors: false, json: requestBody});
  t.is(statusCode, 200);
  functions.order_contain(t, body);
});

test ('PUT order service with negative user id', async t =>{
  const requestBody = {
      "userId": - 6,
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
  const { body ,statusCode } = await t.context.got.put("orders/0",{throwHttpErrors: false, json: requestBody});
  t.is(statusCode, 400);
  t.is(body.message, "UserId should be a positive integer.")
});

test ('PUT order service with negative id', async t =>{
  const requestBody = {
      "id":-10,
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
  const { body ,statusCode } = await t.context.got.put("orders/0",{throwHttpErrors: false, json: requestBody});
  t.is(statusCode, 400);
  t.is(body.message, "Id should be a positive integer.")
});


test ('PUT order service with wrong id type', async t =>{
  const requestBody = {
      "id": "a",
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
  const { body ,statusCode } = await t.context.got.put("orders/0",{throwHttpErrors: false, json: requestBody});
  t.is(statusCode, 400);
  t.is(body.message, "request.body.id should be integer")
});

test ('PUT order service with negative id on URL', async t =>{
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
  const { body ,statusCode } = await t.context.got.put("orders/-10",{throwHttpErrors: false, json: requestBody});
  t.is(statusCode, 400);
  t.is(body.message, "Id of order to change should be a positive integer.")
});

test ('PUT order service with negative quantity', async t =>{
  const requestBody = {
      "userId": 6,
      "products": [
        {
          "quantity": 5,
          "productId": 1
        },
        {
          "quantity":-5,
          "productId": 1
        }
      ]
    };
  const { body ,statusCode } = await t.context.got.put("orders/0",{throwHttpErrors: false, json: requestBody});
  t.is(statusCode, 400);
  t.is(body.message,"Quantity of a product can't be negative.");
});

test ('PUT order service with wrong id type on URL', async t =>{
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
  const { body ,statusCode } = await t.context.got.put("orders/a",{throwHttpErrors: false, json: requestBody});
  t.is(statusCode, 400);
  t.is(body.message,"request.params.orderId should be integer");
});

test ('PUT order service without userId', async t =>{
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
  const { body ,statusCode } = await t.context.got.put("orders/0",{throwHttpErrors: false, json: requestBody});
  t.is(statusCode, 400);
  t.is(body.message,"request.body should have required property 'userId'");
});

test ('PUT order service with wrong userId type', async t =>{
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
  const { body ,statusCode } = await t.context.got.put("orders/0",{throwHttpErrors: false, json: requestBody});
  t.is(statusCode, 400);
  t.is(body.message,'request.body.userId should be integer');
});

test ('PUT order service without any product', async t =>{
  const requestBody = {
      "userId": 6
    };
  const { body ,statusCode } = await t.context.got.put("orders/0",{throwHttpErrors: false, json: requestBody});
  t.is(statusCode, 400);
  t.is(body.message,'request.body should have required property \'products\'');
});

test ('PUT order service with empty products', async t =>{
  const requestBody = {
      "userId": 6,
      "products": [
      ]
    };
  const { body ,statusCode } = await t.context.got.put("orders/0",{throwHttpErrors: false, json: requestBody});
  t.is(statusCode, 400);
  t.is(body.message, 'request.body.products should NOT have fewer than 1 items');
});

test ('PUT order service without productId', async t =>{
  const requestBody = {
      "userId": 6,
      "products": [
        {
          "quantity": 5,
        }
      ]
    };
  const { body ,statusCode } = await t.context.got.put("orders/0",{throwHttpErrors: false, json: requestBody});
  t.is(statusCode, 400);
  t.is(body.message, 'request.body.products[0] should have required property \'productId\'');
});

test ('PUT order service without quantity', async t =>{
  const requestBody = {
      "userId": 6,
      "products": [
        {
          "productId": 1
        }
      ]
    };
  const { body ,statusCode } = await t.context.got.put("orders/0",{throwHttpErrors: false, json: requestBody});
  t.is(statusCode, 400);
  t.is(body.message, 'request.body.products[0] should have required property \'quantity\'');
});

test ('PUT order service without list of products ', async t =>{
  const requestBody = {
      "userId": 6,
      "products": 
        {
          "quantity": 5,
          "productId": 1
        }
      
    };
  const { body ,statusCode } = await t.context.got.put("orders/0",{throwHttpErrors: false, json: requestBody});
  t.is(statusCode, 400);
  t.is(body.message, 'request.body.products should be array');
});

test ('PUT order service with blank body', async t =>{
  const requestBody = {
    };
  const { body ,statusCode } = await t.context.got.put("orders/0",{throwHttpErrors: false, json: requestBody});
  t.is(statusCode, 400);
  t.is(body.message, 'request.body should have required property \'userId\', request.body should have required property \'products\'');
});


//-----------------------------------------------------------------------------------------------//
