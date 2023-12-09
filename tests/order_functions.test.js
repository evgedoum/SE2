const test = require('ava');
const { ordersGET } = require('../service/DefaultService');
const { ordersOrderIdGET } = require('../service/DefaultService');
const { ordersUserGET } = require('../service/DefaultService');
const { ordersPOST } = require('../service/DefaultService');

function order_contain(t, order) {
    // tests for the items that returns the get orders
    t.is(order.id,0);
    t.is(order.userId,6);
    // check the length of the products of the order  
    t.is(order.products.length,2);
    t.is(order.products[0].quantity,5);
    t.is(order.products[0].productId,1);
    t.is(order.products[1].quantity,5);
    t.is(order.products[1].productId,1);
  };
module.exports =  {order_contain} ;

//-----------------------------------------------------------------------//
//                              GET orders                               //
//-----------------------------------------------------------------------//

test ('GET orders', async t => {
    const result = await ordersGET();
    t.is(result.length,2);
    order_contain(t, result[0]);
    order_contain(t, result[1]);
});

//-----------------------------------------------------------------------//
//                            GET orders by id                           //
//-----------------------------------------------------------------------//

test ('GET order by id', async t =>{
    const result = await ordersOrderIdGET(0);
    order_contain(t, result);
});

test ('GET order by id without id', async t =>{
    const result = await ordersOrderIdGET('');
    order_contain(t, result);
});

test ('GET order by id without integer id', async t =>{
    const result = await ordersOrderIdGET('a');
    order_contain(t, result);
});

//-----------------------------------------------------------------------//
//                              POST order                               //
//-----------------------------------------------------------------------//

test ('POST order', async t =>{
  const requestBody = {
      "id": 0,
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
  const result = await ordersPOST(requestBody);
  order_contain(t, result);
});

//-----------------------------------------------------------------------//

