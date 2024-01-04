// Constructor function for ResponsePayload
var ResponsePayload = function(code, payload) {
  this.code = code;
  this.payload = payload;
}
// Function to create and return a new ResponsePayload instance
exports.respondWithCode = function(code, payload) {
  return new ResponsePayload(code, payload);
}

//Function to get response code
var getResponseCode = function(arg1, arg2) {
  var code;

  if(arg2 && Number.isInteger(arg2)) {
    code = arg2;
  }
  else if(arg1 && Number.isInteger(arg1)) {
      code = arg1;
  }
  else {
    // if no response code given, we default to 200
    code = 200;
  }
  return code;
}

//Function to get payload
var getPayload = function (arg1){
  var payload;

  if(arg1) {
    payload = arg1;
  }

  // Convert payload to JSON string if it's an object
  if(typeof payload === 'object') {
    payload = JSON.stringify(payload, null, 2);
  }
  return payload;
}

// Function to write JSON response to the HTTP response
var writeJson = exports.writeJson = function(response, arg1, arg2) {
  var code;
  var payload;

  if(arg1 && arg1 instanceof ResponsePayload) {
    // If arg1 is instance of Payload call writeJson again 
    // passing responsePaylod arguiment to arg1 and arg2
    writeJson(response, arg1.payload, arg1.code);
    return;
  }

  code = getResponseCode(arg1, arg2);
  payload = getPayload(arg1);
  
  // Set response headers and send the response
  response.writeHead(code, {'Content-Type': 'application/json'});
  response.end(payload);
}
