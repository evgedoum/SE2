'use strict';

var utils = require('../utils/writer.js');
var Default = require('../service/DefaultService');

// Implementation of function to get all orders
module.exports.ordersGET = function ordersGET (req, res, next) {
  Default.ordersGET()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

// Implementation of function to get an order by orderID
module.exports.ordersOrderIdGET = function ordersOrderIdGET (req, res, next, orderId) {
  Default.ordersOrderIdGET(orderId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

// Implementation of function to modify an order by orderID
module.exports.ordersOrderIdPUT = function ordersOrderIdPUT (req, res, next, body, orderId) {
  Default.ordersOrderIdPUT(body, orderId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

// Implementation of function to place an order
module.exports.ordersPOST = function ordersPOST (req, res, next, body) {
  Default.ordersPOST(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

// Implementation of function to get an order by userID
module.exports.ordersUserGET = function ordersUserGET (req, res, next, user_id) {
  Default.ordersUserGET(user_id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

// Implementation of function to get all products
module.exports.productsGET = function productsGET (req, res, next) {
  Default.productsGET()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

// Implementation of function to add a new product
module.exports.productsPOST = function productsPOST (req, res, next, body) {
  Default.productsPOST(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

// Implementation of function to delete a product by productID
module.exports.productsProductIdDELETE = function productsProductIdDELETE (req, res, next, productId) {
  Default.productsProductIdDELETE(productId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

// Implementation of function to get a product by productID
module.exports.productsProductIdGET = function productsProductIdGET (req, res, next, productId) {
  Default.productsProductIdGET(productId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

// Implementation of function to modify a product by productID
module.exports.productsProductIdPUT = function productsProductIdPUT (req, res, next, body, productId) {
  Default.productsProductIdPUT(body, productId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

// Implementation of function to get all users
module.exports.usersGET = function usersGET (req, res, next) {
  Default.usersGET()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

// Implementation of function to create a user
module.exports.usersPOST = function usersPOST (req, res, next, body) {
  Default.usersPOST(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

// Implementation of function to delete a user by userID
module.exports.usersUserIdDELETE = function usersUserIdDELETE (req, res, next, userId) {
  Default.usersUserIdDELETE(userId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

// Implementation of function to get a user by userID
module.exports.usersUserIdGET = function usersUserIdGET (req, res, next, userId) {
  Default.usersUserIdGET(userId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

// Implementation of function to modify a user by userID
module.exports.usersUserIdPUT = function usersUserIdPUT (req, res, next, body, userId) {
  Default.usersUserIdPUT(body, userId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};