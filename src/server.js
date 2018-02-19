const http = require('http');
const fs = require('fs');
const socketIo = require('socket.io');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const index = fs.readFileSync(`${__dirname}/../client/client.html`);

const onRequest = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};

const app = http.createServer(onRequest).listen(port);
//console.log(app);
console.log(`Listening on 127.0.0.1: ${port}`);

const io = socketIo(app);
const lineHistory = [{x:10,y:10}];
io.on('connection', (socket) => {
  for (const i in lineHistory) {
    socket.emit('lineDraw', { usersLine: lineHistory[i] });
  }
  socket.on('lineDraw', (data) => {
    console.log("Im in this function");
    lineHistory.push(data.usersLine);
    io.emit('lineDraw', { usersLine: data.usersLine });
    console.log(data.windowWidth);
    console.log(data.windowHeight);
  });
});
