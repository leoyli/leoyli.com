const http = require('http');
const debug = require('debug')('OpenBox:server');
const app = require('./app');
const { _U_: { string: { checkToStringTag } } } = require('./utilities');


// helper functions
/** Normalize a port into a number, string, or false **/
const normalizePort = (val) => {
  const port = parseInt(val, 10);

  if (Number.isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
};


// server entity
/** Get port from environment and store in Express **/
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);


/** Create HTTP server **/
const server = http.createServer(app);


// events handler
/** Event listener for HTTP server "error" event **/
const onError = (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = checkToStringTag(port, 'String')
    ? `Pipe ${port}`
    : `Port ${port}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default: {
      throw error;
    }
  }
};


/** Event listener for HTTP server "listening" event **/
const onListening = () => {
  const addr = server.address();
  const bind = checkToStringTag(addr, 'String')
    ? `pipe ${addr}`
    : `port ${addr.port}`;
  debug(`Listening on ${bind}`);
};


// events listener
/** Listen on provided port, on all network interfaces **/
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);


/** Event listener for 'unhandledRejection' event **/
process.on('unhandledRejection', (err) => console.log('Unhandled Promise Rejection:\n', err.stack));
