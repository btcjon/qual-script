import express from 'express';
import http from 'http';
import { exec } from 'node:child_process';
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT || 8090;
const app = express();

app.set('port', port);

const server = http.createServer(app);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }
  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  console.log('Listening on ' + bind);
}

// http://62.146.229.99:8090/qualification_script/run

app.get('/qualification_script/run', (req, res) => {
  const scriptPath = process.env.SCRIPT_PATH || '/app/qualification_script.js';
  const command = `timeout 2200 node ${scriptPath}`;
  
  exec(command, (err, stdout, stderr) => {
    if (err) { 
      console.error(err);
      return res.status(500).send({status: "Error running script", error: err.message});
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
    res.send({status: "Running ...", output: stdout});
  });
});