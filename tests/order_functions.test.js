const test = require('ava');
const { ordersGET } = require('../service/DefaultService');

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
test ('GET orders', async t => {
    const result = await ordersGET();
    t.is(result.length,2);
    order_contain(t, result[0]);
    order_contain(t, result[1]);
});
