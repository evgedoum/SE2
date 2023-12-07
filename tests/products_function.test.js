const test = require('ava');
const { productsGET } = require('../service/DefaultService');

function product_contain(t, product) {
    t.is(product.price, 6.027456183070403);
    t.is(product.name, 'name');
    t.is(product.id, 0);
  };
  module.exports =  {product_contain} ;

test('GET products', async (t) =>{
    const result = await productsGET();
    t.is(result.length, 2);
    product_contain(t, result[0]);
    product_contain(t, result[1]);
});
