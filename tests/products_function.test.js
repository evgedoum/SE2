const test = require('ava');
const { productsGET, productsPOST, productsProductIdGET, productsProductIdPUT, productsProductIdDELETE } = require('../service/DefaultService');

function product_contain(t, product) {
    t.is(product.price, 6.027456183070403);
    t.is(product.name, 'name');
    t.is(product.id, 0);
};
module.exports =  {product_contain} ;

//---------------------------------------------------------------------------
//Get /products

test('GET /products', async (t) =>{
    const result = await productsGET();
    t.is(result.length, 2);
    product_contain(t, result[0]);
    product_contain(t, result[1]);
});

//---------------------------------------------------------------------------
//Get /products/{productId}

test('GET /products/{productId}', async (t) =>{
  const result = await productsProductIdGET(0);
  product_contain(t, result);
});

//---------------------------------------------------------------------------
//POST /products

test('POST /products', async (t) =>{
  request_body = {
    "price" : 6.027456183070403,
    "name" : "name"
  };
  const result = await productsPOST(request_body);
  product_contain(t, result);
});

//---------------------------------------------------------------------------
//PUT /products

test('PUT /products/{productId}', async (t) =>{
  request_body = {
    "price" : 6.027456183070403,
    "name" : "name"
  };
  const result = await productsProductIdPUT(request_body, 0);
  product_contain(t, result);
});