'use strict';

var orderArrayResponse = function () {
  return new Promise(function(resolve) {
    var examples = {};
    examples['application/json'] = [ {
  "id" : 0,
  "userId" : 6,
  "products" : [ {
    "quantity" : 5,
    "productId" : 1
  }, {
    "quantity" : 5,
    "productId" : 1
  } ]
  }, {
  "id" : 0,
  "userId" : 6,
  "products" : [ {
    "quantity" : 5,
    "productId" : 1
  }, {
    "quantity" : 5,
    "productId" : 1
  } ]
  } ];
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

var orderResponse = function() {
  return new Promise(function(resolve) {
    var examples = {};
    examples['application/json'] = {
  "id" : 0,
  "userId" : 6,
  "products" : [ {
    "quantity" : 5,
    "productId" : 1
  }, {
    "quantity" : 5,
    "productId" : 1
  } ]
  };
      if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

var userResponse = function() {
  return new Promise(function(resolve) {
    var examples = {};
    examples['application/json'] = {
  "id" : 0,
  "email" : "email",
  "username" : "username"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

var productResponse = function() {
  return new Promise(function(resolve) {
    var examples = {};
    examples['application/json'] = {
  "price" : 6.027456183070403,
  "name" : "name",
  "id" : 0
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

/**
 * Get all orders
 *
 * returns List
 **/
exports.ordersGET = function() {
  return orderArrayResponse();
}

/**
 * Get an order by ID
 *
 * orderId Integer 
 * returns Order
 **/
exports.ordersOrderIdGET = function(orderId) {
  return orderResponse();
}

/**
 * Update an order by ID
 *
 * body Order Order data
 * orderId Integer 
 * returns Order
 **/
exports.ordersOrderIdPUT = function(body,orderId) {
  return orderResponse();
}

/**
 * Create a new order
 *
 * body Order Order data
 * returns Order
 **/
exports.ordersPOST = function(body) {
  return orderResponse();
}

/**
 * Get orders for a specific user
 *
 * user_id Integer 
 * returns List
 **/
exports.ordersUserGET = function(user_id) {
  return orderArrayResponse();
}

/**
 * Get all products
 *
 * returns List
 **/
exports.productsGET = function() {
  return new Promise(function(resolve) {
    var examples = {};
    examples['application/json'] = [ {
  "price" : 6.027456183070403,
  "name" : "name",
  "id" : 0
}, {
  "price" : 6.027456183070403,
  "name" : "name",
  "id" : 0
} ];
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

/**
 * Create a new product
 *
 * body Product Product data
 * returns Product
 **/
exports.productsPOST = function(body) {
  return productResponse();
}

/**
 * Delete a product by ID
 *
 * productId Integer 
 * no response value expected for this operation
 **/
exports.productsProductIdDELETE = function(productId) {
  return new Promise(function(resolve) {
    resolve();
  });
}

/**
 * Get a product by ID
 *
 * productId Integer 
 * returns Product
 **/
exports.productsProductIdGET = function(productId) {
  return productResponse();
}

/**
 * Update a product by ID
 *
 * body Product Product data
 * productId Integer 
 * returns Product
 **/
exports.productsProductIdPUT = function(body,productId) {
  return productResponse();
}

/**
 * Get all users
 *
 * returns List
 **/
exports.usersGET = function() {
  return new Promise(function(resolve) {
    var examples = {};
    examples['application/json'] = [ {
  "id" : 0,
  "email" : "email",
  "username" : "username"
}, {
  "id" : 0,
  "email" : "email",
  "username" : "username"
} ];
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

/**
 * Create a new user
 *
 * body User User data
 * returns User
 **/
exports.usersPOST = function(body) {
  return userResponse();
}

/**
 * Delete a user by ID
 *
 * userId Integer 
 * no response value expected for this operation
 **/
exports.usersUserIdDELETE = function(userId) {
    var examples = {};
    examples['application/json'] = {
      "id" : userId
    };
    return new Promise(function(resolve) {
      resolve({ 
        message: "User deleted with ID: " + userId
      });
  });
}

/**
 * Get a user by ID
 *
 * userId Integer 
 * returns User
 **/
exports.usersUserIdGET = function(userId) {
  return userResponse();
}

/**
 * Update a user by ID
 *
 * body User User data
 * userId Integer 
 * returns User
 **/
exports.usersUserIdPUT = function(body,userId) {
  return userResponse();
}
