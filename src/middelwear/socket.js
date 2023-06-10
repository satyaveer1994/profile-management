const socketIO = require('socket.io');

let io;

module.exports = {
  initialize: (server) => {
    io = socketIO(server);

    io.on('connection', (socket) => {
      console.log('Socket connected:', socket.id);

      // Handle socket events
      socket.on('disconnect', () => {
        console.log('Socket disconnected:', socket.id);
      });
    });
  },

  emitMessage: (sender, receiver, message) => {
    io.emit('newMessage', { sender, receiver, message });
  }
};
