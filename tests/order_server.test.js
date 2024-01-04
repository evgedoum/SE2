const test = require('ava');
const http = require('http');
const listen = require('test-listen');
const got =  require('got');
const app = require('../index.js');
// inport the order_contain function from the order_functions.test.js
const functions = require('./order_functions.test.js')

// Setting up server and HTTP requests for testing
test.before (async (t) => {
  t.context.server = http.createServer(app);
  t.context.prefixUrl = await listen(t.context.server);
  t.context.got = got.extend({ prefixUrl: t.context.prefixUrl, responseType: 'json' });
});

// Closing the server after all tests are done
test.after.always((t) => {
  t.context.server.close();
});

//-----------------------------------------------------------------------------------------------//
//                                           GET orders                                          //
//-----------------------------------------------------------------------------------------------//

// test the get all orders end point --correct 
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

// test the get order by id end point --correct 
test ('GET order by id service', async (t) =>{
    const { body ,statusCode } = await t.context.got("orders/0",{throwHttpErrors: false});
    t.is(statusCode, 200);
    functions.order_contain(t, body);
});

//_______________________________________________________________________________________________
 //  ** WE CANNOT TEST THE UNEXISTED ORDER BECAUSE WE DONT HAVE A DATABASE ** //

//  test ('GET order by id service unexisted order', async (t) => {
//      const { body ,statusCode } = await t.context.got("orders/10",{throwHttpErrors: false});
//      t.is(statusCode, 400);
//  });
 //_______________________________________________________________________________________________

// test the get order by id end point with an not integer id (id should be an positive integer)  
test ('GET order fail wrong id type', async (t) =>{
    const { body ,statusCode } = await t.context.got("orders/a",{throwHttpErrors: false});
    t.is(statusCode, 400);
    t.is(body.message,"request.params.orderId should be integer");
});

// test the get order by id end point with an negative id (id should be an positive integer)
test ('GET order by id service with negative id', async (t) =>{
  const { body ,statusCode } = await t.context.got("orders/-10",{throwHttpErrors: false});
  t.is(statusCode, 400);
  t.is(body.message,"request.params.orderId should be >= 0")
});

//-----------------------------------------------------------------------------------------------//
//                                        GET users orders                                       //
//-----------------------------------------------------------------------------------------------//

// test get users orders service (get all the orders that a user made) --correct 
test ('GET users orders service', async t =>{
  const { body ,statusCode } = await t.context.got("orders/user/0",{throwHttpErrors: false});
  t.is(statusCode, 200);
  t.is(body.length, 2);
  functions.order_contain(t, body[0]);
  functions.order_contain(t, body[1]);
});

//_______________________________________________________________________________________________
 //  ** WE CANNOT TEST THE ORDERS OF UNEXISTED USER BECAUSE WE DONT HAVE A DATABASE ** //

//  test ('GET users orders service with wrong id', async (t) => {
//      const { body ,statusCode } = await t.context.got("orders/user/10",{throwHttpErrors: false});
//      t.is(statusCode, 400);
//  });
 //_______________________________________________________________________________________________

// test get users orders service (get all the orders that a user made) without an id 
test ('GET users orders with blank id on service', async t =>{
  const { body ,statusCode } = await t.context.got("orders/user/",{throwHttpErrors: false});
  t.is(statusCode, 400);
  t.is(body.message, 'request.params.orderId should be integer');
});

// test get users orders service (get all the orders that a user made) with a non integer user id (user id is a positive integer)
test ('GET users orders with wrong id type on service', async t =>{
  const { body ,statusCode } = await t.context.got("orders/user/a",{throwHttpErrors: false});
  t.is(statusCode, 400);
  t.is(body.message, 'request.params.user_id should be integer');
});

// test get users orders service (get all the orders that a user made) with a negative user id (user id is a positive integer)
test ('GET users orders service with negative id', async t =>{
  const { body ,statusCode } = await t.context.got("orders/user/-10",{throwHttpErrors: false});
  t.is(statusCode, 400);
  t.is(body.message, "request.params.user_id should be >= 0");
});

//-----------------------------------------------------------------------------------------------//
//                                      POST order                                               //
//-----------------------------------------------------------------------------------------------//

// test post order end point (in this one we have to create a json request body to send) --correct
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

//_______________________________________________________________________________________________
 //  ** WE CANNOT TEST THE UNEXISTED USER FOR AN ORDER BECAUSE WE DONT HAVE A DATABASE ** //

//  test ('POST order service for unexisted user', async t =>{
//   const requestBody = {
//       "userId": 60,
//       "products": [
//         {
//           "quantity": 5,
//           "productId": 1
//         },
//         {
//           "quantity": 5,
//           "productId": 1
//         }
//       ]
//     };
//   const { body ,statusCode } = await t.context.got.post("orders",{throwHttpErrors: false, json: requestBody});
//   t.is(statusCode, 400);
// });
 //_______________________________________________________________________________________________

//_______________________________________________________________________________________________
 //  ** WE CANNOT TEST THE UNEXISTED PRODUCT FOR AN ORDER BECAUSE WE DONT HAVE A DATABASE ** //

//  test ('POST order service for unexisted product', async t =>{
//   const requestBody = {
//       "userId": 6,
//       "products": [
//         {
//           "quantity": 5,
//           "productId": 100
//         },
//         {
//           "quantity": 5,
//           "productId": 1
//         }
//       ]
//     };
//   const { body ,statusCode } = await t.context.got.post("orders",{throwHttpErrors: false, json: requestBody});
//   t.is(statusCode, 400);
// });
 //_______________________________________________________________________________________________

// test post order end point (in this one we have to create a json request body to send).
// in this one we use non integer order id on request body (order id shoud be positive integer)
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

// test post order end point (in this one we have to create a json request body to send).
// in this one we use a negative order id on request body (order id shoud be positive integer)
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
  t.is(body.message,"request.body.id should be >= 0");
});

// test post order end point (in this one we have to create a json request body to send).
// in this one we use a negative quantity of a product on request body (quantity should be positive integer)
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
  t.is(body.message,"request.body.products[1].quantity should be >= 1");
});

// test post order end point (in this one we have to create a json request body to send).
// in this one we dont use user id on request body (user id is required)
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

// test post order end point (in this one we have to create a json request body to send).
// in this one we use non integer user id on request body (it should be positive integer)
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

// test post order end point (in this one we have to create a json request body to send).
// in this one we use a negative user id on request body (it should be positive integer)
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
  t.is(body.message,"request.body.userId should be >= 0");
});

// test post order end point (in this one we have to create a json request body to send)
// without product list on request body (products are required)
test ('POST order service without any product', async t =>{
    const requestBody = {
        "userId": 6
      };
    const { body ,statusCode } = await t.context.got.post("orders",{throwHttpErrors: false, json: requestBody});
    t.is(statusCode, 400);
    t.is(body.message,'request.body should have required property \'products\'');
});

// test post order end point (in this one we have to create a json request body to send)
// with an empty list on request body (minimum length is 1 item, there is no order without products)
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

// test post order end point (in this one we have to create a json request body to send)
// without product id on request body (product id is required)
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

// test post order end point (in this one we have to create a json request body to send)
// without quantity of product on request body (it is required)
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

// test post order end point (in this one we have to create a json request body to send).
// in this we use a single product instead of a array of products on request body (products should be an array)
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

// test post order end point (in this one we have to create a json request body to send).
// in this one we use an empty request body (body is required with user id and products).
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

// test put order end point (in this one we have to create a json request body to send). --correct
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

//_______________________________________________________________________________________________
 //  ** WE CANNOT TEST THE UNEXISTED USER FOR AN ORDER BECAUSE WE DONT HAVE A DATABASE ** //
//  test ('PUT order service for unexisted user', async t =>{
//   const requestBody = {
//       "userId": 60,
//       "products": [
//         {
//           "quantity": 5,
//           "productId": 1
//         },
//         {
//           "quantity": 5,
//           "productId": 1
//         }
//       ]
//     };
//   const { body ,statusCode } = await t.context.got.put("orders/0",{throwHttpErrors: false, json: requestBody});
//   t.is(statusCode, 400);
// });
 //_______________________________________________________________________________________________

 //_______________________________________________________________________________________________
 //  ** WE CANNOT TEST THE UNEXISTED ORDER BECAUSE WE DONT HAVE A DATABASE ** //
//  test ('PUT order service for unexisted order', async t =>{
//   const requestBody = {
//       "userId": 6,
//       "products": [
//         {
//           "quantity": 5,
//           "productId": 1
//         },
//         {
//           "quantity": 5,
//           "productId": 1
//         }
//       ]
//     };
//   const { body ,statusCode } = await t.context.got.put("orders/60",{throwHttpErrors: false, json: requestBody});
//   t.is(statusCode, 400);
// });
 //_______________________________________________________________________________________________

 //_______________________________________________________________________________________________
 //  ** WE CANNOT TEST THE UNEXISTED PRODUCT IN AN ORDER BECAUSE WE DONT HAVE A DATABASE ** //
//  test ('PUT order service for unexisted product', async t =>{
//   const requestBody = {
//       "userId": 6,
//       "products": [
//         {
//           "quantity": 5,
//           "productId": 1
//         },
//         {
//           "quantity": 5,
//           "productId": 100
//         }
//       ]
//     };
//   const { body ,statusCode } = await t.context.got.put("orders/60",{throwHttpErrors: false, json: requestBody});
//   t.is(statusCode, 400);
// });
 //_______________________________________________________________________________________________

// test put order end point (we have to create a json request body to send).
// in this one we use a negative user id on request body (it should be positive integer).
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
  t.is(body.message, "request.body.userId should be >= 0")
});

// test put order end point (we have to create a json request body to send).
// in this one we use a negative order id on request body (it should be a positive integer).
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
  t.is(body.message, "request.body.id should be >= 0")
});

// test put order end point (we have to create a json request body to send).
// in this one we use a non integer order id on request body (it should be a positive integer).
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

// test put order end point (we have to create a json request body to send).
// in this one we use a negative order id on URL (it should be a positive integer).
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
  t.is(body.message, "request.params.orderId should be >= 0")
});

// test put order end point (we have to create a json request body to send).
// in this one we use anegative quantity of a product on request body (it should be a positive integer).
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
  t.is(body.message,"request.body.products[1].quantity should be >= 1");
});

// test put order end point (we have to create a json request body to send).
// in this one we use a non integer order id on URL (it should be a positive integer).
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

// test put order end point (we have to create a json request body to send).
// in this one we dont use an user id on request body (it is required).
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

// test put order end point (we have to create a json request body to send).
// in this one we use a non integer user id on request body (it should be a positive integer).
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

// test put order end point (we have to create a json request body to send).
// in this one we dont ad the product list on rewuest body (it is required).
test ('PUT order service without any product', async t =>{
  const requestBody = {
      "userId": 6
    };
  const { body ,statusCode } = await t.context.got.put("orders/0",{throwHttpErrors: false, json: requestBody});
  t.is(statusCode, 400);
  t.is(body.message,'request.body should have required property \'products\'');
});

// test put order end point (we have to create a json request body to send).
// in this one we use an empty product list on request body (an order should contain at least 1 product).
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

// test put order end point (we have to create a json request body to send).
// in this one we dont use product id on a product on body (it is required).
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

// test put order end point (we have to create a json request body to send).
// in this one we dont use the quantity of a product on request body (it is required).
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

// test put order end point (we have to create a json request body to send).
// in this one we dont use an array of products but a single product on request body (product shoud be an array).
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

// test put order end point (we have to create a json request body to send).
// with an empty request body (body is required with user id and products).
test ('PUT order service with blank body', async t =>{
  const requestBody = {
    };
  const { body ,statusCode } = await t.context.got.put("orders/0",{throwHttpErrors: false, json: requestBody});
  t.is(statusCode, 400);
  t.is(body.message, 'request.body should have required property \'userId\', request.body should have required property \'products\'');
});


//-----------------------------------------------------------------------------------------------//