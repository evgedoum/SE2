// Constructor function for ResponsePayload
var ResponsePayload = function(code, payload) {
  this.code = code;
  this.payload = payload;
}
// Function to create and return a new ResponsePayload instance
exports.respondWithCode = function(code, payload) {
  return new ResponsePayload(code, payload);
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

  if(arg2 && Number.isInteger(arg2)) {
    code = arg2;
  }
  else {
    if(arg1 && Number.isInteger(arg1)) {
      code = arg1;
    }
  }
  if(code && arg1) {
    payload = arg1;
  }
  else if(arg1) {
    payload = arg1;
  }

  if(!code) {
    // if no response code given, we default to 200
    code = 200;
  }
  // Convert payload to JSON string if it's an object
  if(typeof payload === 'object') {
    payload = JSON.stringify(payload, null, 2);
  }
  // Set response headers and send the response
  response.writeHead(code, {'Content-Type': 'application/json'});
  response.end(payload);
}
