const app = require('./app');
const http = require('http');
const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('./models/user');

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true
  }
});

// Socket.IO authentication middleware
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "DEV@TINDER$790");
    const user = await User.findById(decoded._id).select('-password');
    
    if (!user) {
      return next(new Error('User not found'));
    }

    socket.userId = user._id;
    socket.user = user;
    next();
  } catch (error) {
    next(new Error('Authentication error'));
  }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.userId}`);

  // Join user to their personal room
  socket.join(socket.userId.toString());

  // Handle sending messages
  socket.on('sendMessage', async (data) => {
    try {
      const { receiverId, content, messageType = 'text' } = data;
      
      // Save message to database
      const Message = require('./models/message');
      const message = new Message({
        senderId: socket.userId,
        receiverId,
        content,
        messageType
      });
      await message.save();

      // Emit to receiver
      socket.to(receiverId.toString()).emit('newMessage', {
        senderId: socket.userId,
        content,
        messageType,
        createdAt: new Date()
      });

      // Emit back to sender for confirmation
      socket.emit('messageSent', {
        receiverId,
        content,
        messageType,
        createdAt: new Date()
      });
    } catch (error) {
      console.error('Error sending message:', error);
      socket.emit('messageError', { error: 'Failed to send message' });
    }
  });

  // Handle typing indicators
  socket.on('typing', (data) => {
    socket.to(data.receiverId.toString()).emit('userTyping', {
      userId: socket.userId,
      isTyping: data.isTyping
    });
  });

  // Handle marking messages as read
  socket.on('markAsRead', async (data) => {
    try {
      const { senderId } = data;
      
      // Update messages as read in database
      const Message = require('./models/message');
      await Message.updateMany(
        { senderId, receiverId: socket.userId, isRead: false },
        { isRead: true, readAt: new Date() }
      );

      // Notify sender
      socket.to(senderId.toString()).emit('messagesRead', {
        readerId: socket.userId
      });
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.userId}`);
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Socket.IO server is ready for real-time messaging`);
});