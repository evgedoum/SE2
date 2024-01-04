const test = require('ava');
const { usersGET, usersUserIdGET, usersPOST, usersUserIdPUT, usersUserIdDELETE} = require('../service/DefaultService');

// Create a function that tests the dummy data 
function user_contain(t, user) {
    t.is(user.id,0);
    t.is(user.email,'email'); 
    t.is(user.username,'username');
  };
module.exports =  {user_contain} ;

//_____________________________________________________________
// GET ALL USERS

test ('GET users', async (t) => {
    const result = await usersGET();
    t.is(result.length,2);
    user_contain(t, result[0]);
    user_contain(t, result[1]);
});

//_____________________________________________________________
// GET USERS BY ID

test ('GET user by id', async (t) => {
    const result = await usersUserIdGET('0');
    user_contain(t, result);
});

test ('GET users by id without id', async (t) => {
    const result = await usersUserIdGET('');
    user_contain(t, result);
});

test ('GET order by id without integer id', async (t) => {
    const result = await usersUserIdGET('a');
    user_contain(t, result);
});

//_____________________________________________________________
// POST USERS 

test ('POST users', async (t) => {
  const requestBody = {
    "id" : 0,
    "email" : "email",
    "username" : "username"
    };
  const result = await usersPOST(requestBody);
  user_contain(t, result);
});

//-----------------------------------------------------------------------//
// PUT USERS 

test ('PUT users', async (t) => {
  const requestBody = {
    "id" : 0,
    "email" : "email",
    "username" : "username"
    };
  const result = await usersUserIdPUT(requestBody, 0);
  user_contain(t, result);
});

//_____________________________________________________________
// DELETE USERS BY ID

test ('DELETE user by id', async (t) => {
  const result = await usersUserIdDELETE('0');
  t.is(result.message, 'User deleted with ID: 0');
});

test ('DELETE users by id without id', async (t) => {
  const result = await usersUserIdDELETE('');
  t.is(result.message, 'User deleted with ID: ');
});

test ('DELETE order by id without integer id', async (t) => {
  const result = await usersUserIdDELETE('a');
  t.is(result.message, 'User deleted with ID: a');
});
