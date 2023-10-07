const { Server } = require('socket.io');

function configureSocket(server) {
  const io = new Server(server);

  io.on('connection', (socket) => {
    console.log('Successfully connected to Socket.io⚡⚡⚡');

    socket.on('disconnect', () => {
      console.log('Socket.io is not connected');
    });
  });

  io.on('reconnect', (socket) => {
    console.log('Successfully reconnected to Socket.io⚡⚡⚡');
  });

  return io;
}

module.exports = configureSocket;
