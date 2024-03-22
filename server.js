const http= require('http')
const app=require('./backend/app')
const debug=require('debug')('node-angular')

// =================================================================

// Here stored the 3000 PORT in the port variable


// port= process.env.PORT || 3000
// // process.env.PORT= In many environments (e.g. Heroku), and as a convention, you can set the environment variable PORT to tell your web server what port to listen on.
// // So process.env.PORT || 3000 means: whatever is in the environment variable PORT, or 3000 if there's nothing there.
// // So you pass that to app.listen, or to app.set('port', ...), and that makes your server able to accept a "what port to listen on" parameter from the environment.
// // If you pass 3000 hard-coded to app.listen(), you're always listening on port 3000, which might be just for you, or not, depending on your requirements and the requirements of the environment in which you're running your server.



// // Here we setting the port on app
// app.set('port',port)

// const server = http.createServer(app)

// // Here server listen to port
// server.listen(port)
// ==================================================================



const normalizePort = val => {
    var port = parseInt(val, 10);
  
    if (isNaN(port)) {
      // named pipe
      return val;
    }
  
    if (port >= 0) {
      // port number
      return port;
    }
  
    return false;
  };
  
  const onError = error => {
    if (error.syscall !== "listen") {
      throw error;
    }
    const bind = typeof port === "string" ? "pipe " + port : "port " + port;
    switch (error.code) {
      case "EACCES":
        console.error(bind + " requires elevated privileges");
        process.exit(1);
        break;
      case "EADDRINUSE":
        console.error(bind + " is already in use");
        process.exit(1);
        break;
      default:
        throw error;
    }
  };
  
  const onListening = () => {
    const addr = server.address();
    const bind = typeof port === "string" ? "pipe " + port : "port " + port;
    debug("Listening on " + bind);
  };
  
  const port = normalizePort(process.env.PORT || "3000");
  app.set("port", port);
  
  const server = http.createServer(app);
  server.on("error", onError);
  server.on("listening", onListening);
  server.listen(port);
  