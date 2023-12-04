const test = require('ava');
const { usersGET } = require('../service/DefaultService');

function user_contain(t, user) {
    t.is(user.id,0);
    t.is(user.email,'email'); 
    t.is(user.username,'username');
  };
module.exports =  {user_contain} ;

//_____________________________________________________________
test ('GET users', async (t) => {
    const result = await usersGET();
    t.is(result.length,2);
    user_contain(t, result[0]);
    user_contain(t, result[1]);
});