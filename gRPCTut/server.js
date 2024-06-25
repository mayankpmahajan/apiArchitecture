const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// Load the protobuf file
const packageDefinition = protoLoader.loadSync("./todo.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDefinition);
const todoPackage = grpcObject.todoPackage;




// Create a new gRPC server
const server = new grpc.Server();

// Add the service to the server
server.addService(todoPackage.Todo.service, {
  "createTodo": createTodo,
  "readTodos": readTodos,
  "readTodosStream": readTodosStream,
});

// Bind the server to a specific address and port
server.bindAsync("0.0.0.0:40000", grpc.ServerCredentials.createInsecure(), (error, port) => {
  if (error) {
    console.error(`Failed to bind server: ${error.message}`);
    return;
  }
  console.log(`Server running at http://0.0.0.0:${port}`);
});

const todos = []
// Implement the createTodo function
function createTodo(call, callback) {
  console.log("tere baap ki request to server",call.request); // Log the request for debugging

  const todoItem = {
    "id": todos.length+1,
    "text": call.request.text
  }
  todos.push(todoItem);
 
  callback(null, todoItem); // Send the response back to the client
}

// Implement the readTodos function
function readTodos(call, callback) {
  callback(null,{"items":todos});
}

function readTodosStream(call, callback) {
    todos.forEach(t => call.write(t));
    call.end();
}