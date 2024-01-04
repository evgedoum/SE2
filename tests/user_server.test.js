const test = require('ava');
const http = require('http');
const listen = require('test-listen');
const got =  require('got');
const app = require('../index.js');

// Import the user_contain function from user_function.test.js file 
// that tests the dummy data 
const functions = require('./user_function.test.js')

// Setting up server and HTTP requests for testing
test.before(async (t) => {
  t.context.server = http.createServer(app);
  t.context.prefixUrl = await listen(t.context.server);
  t.context.got = got.extend({ prefixUrl: t.context.prefixUrl, responseType: 'json' });
});

// Closing the server after all tests are done
test.after.always((t) => {
  t.context.server.close();
});

//____________________________________________________________________________________________
// GET ALL USERS

test ('GET users (SERVER)', async (t) => {
    const { body ,statusCode } = await t.context.got("users",{throwHttpErrors: false});
    t.is(statusCode, 200);
    t.is(body.length,2);
    functions.user_contain(t, body[0]);
    functions.user_contain(t, body[1]);
});

//______________________________________________________________________________________________
// GET USERS BY ID

test ('GET user by id (SERVER)', async (t) => {
    const { body ,statusCode } = await t.context.got("users/0",{throwHttpErrors: false});
    t.is(statusCode, 200);
    functions.user_contain(t, body);
});

//_______________________________________________________________________________________________
//  ** WE CANNOT TEST THE UNEXISTED USER BECAUSE WE DONT HAVE A DATABASE ** //

// test ('GET user by unexisted id', async (t) => {
//     const { body ,statusCode } = await t.context.got("users/10",{throwHttpErrors: false});
//     t.is(statusCode, 400);
// });
//_______________________________________________________________________________________________

//request fails because the API should reject negative IDs.
test ('GET user with negative id', async (t) => {
  const { body ,statusCode } = await t.context.got("users/-10",{throwHttpErrors: false});
  t.is(statusCode, 400);
  t.is(body.message, "request.params.userId should be >= 0");
});

//request fails due to an ID being in the wrong format (not a number).
test ('GET users wrong id number', async (t) => {
    const { body ,statusCode } = await t.context.got("users/a",{throwHttpErrors: false});
    t.is(body.message, 'request.params.userId should be integer');
    t.is(statusCode, 400);    
});

//____________________________________________________________________________________________
// POST USERS

test ('POST users (SERVER)', async (t) => {
    const requestBody = {
        "id" : 0,
        "email" : "email@example.com",
        "username" : "username"
      };
    const { body ,statusCode } = await t.context.got.post("users",{throwHttpErrors: false, json: requestBody});
    t.is(statusCode, 200);
    functions.user_contain(t, body);
});

//request fails because the ID provided is not an integer.
test ('POST users with wrong id type (SERVER)', async (t) => {
    const requestBody = {
        "id" : 'a',
        "email" : "email@example.com",
        "username" : "username"
      };
    const { body ,statusCode } = await t.context.got.post("users",{throwHttpErrors: false, json: requestBody});
    t.is(statusCode, 400);
    t.is(body.message, "request.body.id should be integer");
});

//request fails because the ID provided is negative.
test ('POST users with negative id (SERVER)', async (t) => {
    const requestBody = {
        "id" : -1,
        "email" : "email@example.com",
        "username" : "username"
      };
    const { body ,statusCode } = await t.context.got.post("users",{throwHttpErrors: false, json: requestBody});
    t.is(statusCode, 400);
    t.is(body.message, "request.body.id should be >= 0");
});

//request fails as the API requires an ID for user creation.
test ('POST users without id (SERVER)', async (t) => {
    const requestBody = {
        "email" : "email@example.com",
        "username" : "username"
      };
    const { body ,statusCode } = await t.context.got.post("users",{throwHttpErrors: false, json: requestBody});
    t.is(statusCode, 200);
    functions.user_contain(t, body);
});

//request fails due to incorrect email format (correct format: email@example.com).
test ('POST users with empty email (SERVER)', async (t) => {
    const requestBody = {
        "id" : 0,
        "email" : "",
        "username" : "username"
      };
    const { body ,statusCode } = await t.context.got.post("users",{throwHttpErrors: false, json: requestBody});
    t.is(statusCode, 400);
    t.is(body.message, "request.body.email should match format \"email\"");
});

//request fails due to incorrect email format (correct format: email@example.com).
test ('POST users with wrong email (SERVER)', async (t) => {
  const requestBody = {
      "id" : 0,
      "email" : "email",
      "username" : "username"
    };
  const { body ,statusCode } = await t.context.got.post("users",{throwHttpErrors: false, json: requestBody});
  t.is(statusCode, 400);
  t.is(body.message, "request.body.email should match format \"email\"");
});

//request fails due to minimum length requirement for username (length>=3 characters).
test ('POST users with empty username (SERVER)', async (t) => {
    const requestBody = {
        "id" : 0,
        "email" : "email@example.com",
        "username" : ""
      };
    const { body ,statusCode } = await t.context.got.post("users",{throwHttpErrors: false, json: requestBody});
    t.is(statusCode, 400);
    t.is(body.message, "request.body.username should NOT be shorter than 3 characters");
});

//request fails due to minimum length requirement for username (length>=3 characters).
test ('POST users with username < 3 characters (SERVER)', async (t) => {
  const requestBody = {
      "id" : 0,
      "email" : "email@example.com",
      "username" : "hi"
    };
  const { body ,statusCode } = await t.context.got.post("users",{throwHttpErrors: false, json: requestBody});
  t.is(statusCode, 400);
  t.is(body.message, "request.body.username should NOT be shorter than 3 characters");
});

//request fails due to incorrect email format and minimum length requirement for username.
test ('POST users with empty username and empty email (SERVER)', async (t) => {
    const requestBody = {
        "id" : 0,
        "email" : "",
        "username" : ""
      };
    const { body ,statusCode } = await t.context.got.post("users",{throwHttpErrors: false, json: requestBody});
    t.is(statusCode, 400);
    t.is(body.message, "request.body.username should NOT be shorter than 3 characters, request.body.email should match format \"email\"");
});

//request fails because the email format is incorrect (correct format: email@example.com).
test ('POST users with wrong email type (SERVER)', async (t) => {
    const requestBody = {
        "id" : 0,
        "email" : 2,
        "username" : "username"
      };
    const { body ,statusCode } = await t.context.got.post("users",{throwHttpErrors: false, json: requestBody});
    t.is(statusCode, 400);
    t.is(body.message, "request.body.email should be string");
});

//request fails due to a username that should be a string.
test ('POST users with wrong username type (SERVER)', async (t) => {
    const requestBody = {
        "id" : 0,
        "email" : "email@example.com",
        "username" : 2
      };
    const { body ,statusCode } = await t.context.got.post("users",{throwHttpErrors: false, json: requestBody});
    t.is(statusCode, 400);
    t.is(body.message, "request.body.username should be string");
});

//request fails due to a username that should be a string and the wrong email format.
test ('POST users with wrong username,email type (SERVER)', async (t) => {
    const requestBody = {
        "id" : 0,
        "email" : 2,
        "username" : 2
      };
    const { body ,statusCode } = await t.context.got.post("users",{throwHttpErrors: false, json: requestBody});
    t.is(statusCode, 400);
    t.is(body.message, "request.body.username should be string, request.body.email should be string");
});

//request fails as the API requires an email for user creation.
test ('POST users without email (SERVER)', async (t) => {
    const requestBody = {
        "id" : 0,
        "username" : "username"
      };
    const { body ,statusCode } = await t.context.got.post("users",{throwHttpErrors: false, json: requestBody});
    t.is(statusCode, 400);
    t.is(body.message, "request.body should have required property \'email\'");
});

//request fails as the API requires a username for user creation.
test ('POST users without username (SERVER)', async (t) => {
    const requestBody = {
        "id" : 0,
        "email" : "email@example.com"
      };
    const { body ,statusCode } = await t.context.got.post("users",{throwHttpErrors: false, json: requestBody});
    t.is(statusCode, 400);
    t.is(body.message, "request.body should have required property \'username\', request.body.email should match format \"email\"");
});

//request fails as the API requires a username and an email for user creation.
test ('POST users without username and without email (SERVER)', async (t) => {
    const requestBody = {
        "id" : 0
      };
    const { body ,statusCode } = await t.context.got.post("users",{throwHttpErrors: false, json: requestBody});
    t.is(statusCode, 400);
    t.is(body.message, "request.body should have required property \'username\', request.body should have required property \'email\'");
});

//request fails as the API requires an ID, a username and an email for user creation.
test ('POST users without body (SERVER)', async (t) => {
    const requestBody = {

      };
    const { body ,statusCode } = await t.context.got.post("users",{throwHttpErrors: false, json: requestBody});
    t.is(statusCode, 400);
    t.is(body.message, "request.body should have required property \'username\', request.body should have required property \'email\'");
});

//____________________________________________________________________________________________
// PUT USERS

test ('PUT users (SERVER)', async (t) => {
    const requestBody = {
        "id" : 0,
        "email" : "email@example.com",
        "username" : "username"
      };
    const { body ,statusCode } = await t.context.got.put("users/0",{throwHttpErrors: false, json: requestBody});
    t.is(statusCode, 200);
    functions.user_contain(t, body);
});

//request fails due to the ID in the URL not being an integer.
test ('PUT users with wrong id type at URL(SERVER)', async (t) => {
    const requestBody = {
        "id" : 0,
        "email" : "email@example.com",
        "username" : "username"
      };
    const { body ,statusCode } = await t.context.got.put("users/a",{throwHttpErrors: false, json: requestBody});
    t.is(statusCode, 400);
    t.is(body.message, "request.params.userId should be integer");
});

//request fails because the ID provided is negative.
test ('PUT users with negative id type (SERVER)', async (t) => {
    const requestBody = {
        "id" : -1,
        "email" : "email@example.com",
        "username" : "username"
      };
    const { body ,statusCode } = await t.context.got.put("users/0",{throwHttpErrors: false, json: requestBody});
    t.is(statusCode, 400);
    t.is(body.message, "request.body.id should be >= 0");
});

//request fails due to the negative ID in the URL.
test ('PUT users with negative id type in URL (SERVER)', async (t) => {
    const requestBody = {
        "id" : 0,
        "email" : "email@example.com",
        "username" : "username"
      };
    const { body ,statusCode } = await t.context.got.put("users/-1",{throwHttpErrors: false, json: requestBody});
    t.is(statusCode, 400);
    t.is(body.message, "request.params.userId should be >= 0");
});

//request fails as the API requires an ID for user update.
test ('PUT users without id (SERVER)', async (t) => {
    const requestBody = {
        "email" : "email@example.com",
        "username" : "username"
      };
    const { body ,statusCode } = await t.context.got.put("users/0",{throwHttpErrors: false, json: requestBody});
    t.is(statusCode, 200);
    functions.user_contain(t, body);
});

//_______________________________________________________________________________________________
//  ** WE CANNOT TEST THE UNEXISTED USER BECAUSE WE DONT HAVE A DATABASE ** //

// test ('PUT user with unexisted id', async (t) => {
//     const requestBody = {
//        "id" : 10,
//        "email" : "email@example.com",
//        "username" : "username"
//      };
//     const { body ,statusCode } = await t.context.got.put("users/10",{throwHttpErrors: false, json: requestBody});
//     t.is(statusCode, 400);
// });
//_______________________________________________________________________________________________

//request fails because the email format is incorrect (correct format: email@example.com).
test ('PUT users with empty email (SERVER)', async (t) => {
    const requestBody = {
        "id" : 0,
        "email" : "",
        "username" : "username"
      };
    const { body ,statusCode } = await t.context.got.put("users/0",{throwHttpErrors: false, json: requestBody});
    t.is(statusCode, 400);
    t.is(body.message, "request.body.email should match format \"email\"");
});

//request fails because the email format is incorrect (correct format: email@example.com).
test ('PUT users with wrong email (SERVER)', async (t) => {
  const requestBody = {
      "id" : 0,
      "email" : "email",
      "username" : "username"
    };
  const { body ,statusCode } = await t.context.got.put("users/0",{throwHttpErrors: false, json: requestBody});
  t.is(statusCode, 400);
  t.is(body.message, "request.body.email should match format \"email\"");
});

//request fails due to minimum length requirement for username (length>=3 characters).
test ('PUT users with empty username (SERVER)', async (t) => {
    const requestBody = {
        "id" : 0,
        "email" : "email@example.com",
        "username" : ""
      };
    const { body ,statusCode } = await t.context.got.put("users/0",{throwHttpErrors: false, json: requestBody});
    t.is(statusCode, 400);
    t.is(body.message, "request.body.username should NOT be shorter than 3 characters");
});

//fail due to minimum length requirement for username (length>=3 characters).
test ('PUT users with username < 3 characters (SERVER)', async (t) => {
  const requestBody = {
      "id" : 0,
      "email" : "email@example.com",
      "username" : "hi"
    };
  const { body ,statusCode } = await t.context.got.put("users/0",{throwHttpErrors: false, json: requestBody});
  t.is(statusCode, 400);
  t.is(body.message, "request.body.username should NOT be shorter than 3 characters");
});

//request fails due to minimum length requirement for username and the wrong email format.
test ('PUT users with empty username and empty email (SERVER)', async (t) => {
    const requestBody = {
        "id" : 0,
        "email" : "",
        "username" : ""
      };
    const { body ,statusCode } = await t.context.got.put("users/0",{throwHttpErrors: false, json: requestBody});
    t.is(statusCode, 400);
    t.is(body.message, "request.body.username should NOT be shorter than 3 characters, request.body.email should match format \"email\"");
});

//request fails because the email format is incorrect (correct format: email@example.com).
test ('PUT users with wrong email type (SERVER)', async (t) => {
    const requestBody = {
        "id" : 0,
        "email" : 2,
        "username" : "username"
      };
    const { body ,statusCode } = await t.context.got.put("users/0",{throwHttpErrors: false, json: requestBody});
    t.is(statusCode, 400);
    t.is(body.message, "request.body.email should be string");
});

//request fails due to a username that should be a string.
test ('PUT users with wrong username type (SERVER)', async (t) => {
    const requestBody = {
        "id" : 0,
        "email" : "email@example.com",
        "username" : 2
      };
    const { body ,statusCode } = await t.context.got.put("users/0",{throwHttpErrors: false, json: requestBody});
    t.is(statusCode, 400);
    t.is(body.message, "request.body.username should be string");
});

//request fails due to a username that should be a string and the wrong email format.
test ('PUT users with wrong username,email type (SERVER)', async (t) => {
    const requestBody = {
        "id" : 0,
        "email" : 2,
        "username" : 2
      };
    const { body ,statusCode } = await t.context.got.put("users/0",{throwHttpErrors: false, json: requestBody});
    t.is(statusCode, 400);
    t.is(body.message, "request.body.username should be string, request.body.email should be string");
});

//request fails as the API requires an email for user creation.
test ('PUT users without email (SERVER)', async (t) => {
    const requestBody = {
        "id" : 0,
        "username" : "username"
      };
    const { body ,statusCode } = await t.context.got.put("users/0",{throwHttpErrors: false, json: requestBody});
    t.is(statusCode, 400);
    t.is(body.message, "request.body should have required property \'email\'");
});

//request fails as the API requires a username for user creation.
test ('PUT users without username (SERVER)', async (t) => {
    const requestBody = {
        "id" : 0,
        "email" : "email@example.com"
      };
    const { body ,statusCode } = await t.context.got.put("users/0",{throwHttpErrors: false, json: requestBody});
    t.is(statusCode, 400);
    t.is(body.message, "request.body should have required property \'username\'");
});

//request fails as the API requires a username and an email for user creation.
test ('PUT users without username and without email (SERVER)', async (t) => {
    const requestBody = {
        "id" : 0
      };
    const { body ,statusCode } = await t.context.got.put("users/0",{throwHttpErrors: false, json: requestBody});
    t.is(statusCode, 400);
    t.is(body.message, "request.body should have required property \'username\', request.body should have required property \'email\'");
});


//request fails as the API requires an ID, a username and an email for user creation.
test ('PUT users without body (SERVER)', async (t) => {
    const requestBody = {

      };
    const { body ,statusCode } = await t.context.got.put("users/0",{throwHttpErrors: false, json: requestBody});
    t.is(statusCode, 400);
    t.is(body.message, "request.body should have required property \'username\', request.body should have required property \'email\'");
});

//request fails because the ID provided is not an integer.
test ('PUT users with wrong id type(SERVER)', async (t) => {
    const requestBody = {
        "id" : 'a',
        "email" : "email@example.com",
        "username" : "username"
      };
    const { body ,statusCode } = await t.context.got.put("users/0",{throwHttpErrors: false, json: requestBody});
    t.is(statusCode, 400);
    t.is(body.message, "request.body.id should be integer");
});

//______________________________________________________________________________________________
// DELETE USERS BY ID

test ('DELETE user by id (SERVER)', async (t) => {
  const { body ,statusCode } = await t.context.got.delete("users/0",{throwHttpErrors: false});
  t.is(statusCode, 200);
  t.is(body.message, 'User deleted with ID: 0');
});

//_______________________________________________________________________________________________
//  ** WE CANNOT TEST THE UNEXISTED USER BECAUSE WE DONT HAVE A DATABASE ** //

// test ('DELETE user with unexisted id', async (t) => {
//     const { body ,statusCode } = await t.context.got.delete("users/10",{throwHttpErrors: false});
//     t.is(statusCode, 400);
// });
//_______________________________________________________________________________________________

//request fails because the ID provided is not a number.
test ('DELETE users with wrong id number', async (t) => {
  const { body ,statusCode } = await t.context.got.delete("users/a",{throwHttpErrors: false});
  t.is(body.message, 'request.params.userId should be integer');
  t.is(statusCode, 400);    
  t.is(body.message, 'request.params.userId should be integer');
});

//request fails because it tries to delete without providing an ID.
test ('DELETE users without specific id', async (t) => {
  const { body ,statusCode } = await t.context.got.delete("users/",{throwHttpErrors: false}); 
  t.is(statusCode, 405);
  t.is(body.message, 'DELETE method not allowed');
});

//request fails because the ID provided is negative.
test ('DELETE users with negative id', async (t) => {
  const { body ,statusCode } = await t.context.got.delete("users/-1",{throwHttpErrors: false}); 
  t.is(statusCode, 400);
  t.is(body.message, 'request.params.userId should be >= 0');
});