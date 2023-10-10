const { Server } = require('socket.io');

function configureSocket(server) {
  const io = new Server(server);

  io.on('connection', (socket) => {
    console.log('Successfully connected to Socket.io⚡⚡⚡');

    socket.on('disconnect', () => {
      console.log('Socket.io is not connected');
    });
  });

  return io;
}

module.exports = configureSocket;
