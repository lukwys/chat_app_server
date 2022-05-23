const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');

const wss = new WebSocket.Server({ port: 8080 });

const users = [];

wss.on('connection', ws => {
  ws.clientId = uuidv4();
  users.push(ws);

  console.log('connected');

  ws.send(JSON.stringify({ message: '', userId: ws.clientId, isInitMessage: true }));
  users.forEach(user => {
    if (user.clientId !== ws.clientId)
      user.send(JSON.stringify({ message: 'New user joined', userId: '', isInitMessage: false }));
  });

  ws.on( 'message', data => {
    console.log(`${data}`);
    users.forEach(user => user.send(JSON.stringify({ message: `${data}`, userId: ws.clientId, isInitMessage: false })));
  })

  ws.on('close', () => {
    console.log('Client has disconnected');
    users.forEach(user => user.send(JSON.stringify({ message: 'User disconnected', userId: '', isInitMessage: false })));
  })
});
