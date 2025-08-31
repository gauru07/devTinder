const express = require('express');
const chatRouter = express.Router();
const { userAuth } = require('../middlewares/auth');
const Message = require('../models/message');
const User = require('../models/user');
const ConnectionRequest = require('../models/connectionRequest');

// Get all conversations for the logged-in user
chatRouter.get('/chat/conversations', userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    // Get all accepted connections
    const connections = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id, status: 'accepted' },
        { toUserId: loggedInUser._id, status: 'accepted' }
      ]
    }).populate('fromUserId toUserId', 'firstName lastName photoUrl');

    // Get the other user from each connection
    const conversations = connections.map(connection => {
      const otherUser = connection.fromUserId._id.toString() === loggedInUser._id.toString() 
        ? connection.toUserId 
        : connection.fromUserId;
      
      return {
        userId: otherUser._id,
        firstName: otherUser.firstName,
        lastName: otherUser.lastName,
        photoUrl: otherUser.photoUrl,
        connectionId: connection._id
      };
    });

    res.json({
      message: 'Conversations fetched successfully',
      data: conversations
    });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
});

// Get messages between two users
chatRouter.get('/chat/messages/:otherUserId', userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const otherUserId = req.params.otherUserId;

    // Verify they are connected
    const connection = await ConnectionRequest.findOne({
      $or: [
        { fromUserId: loggedInUser._id, toUserId: otherUserId, status: 'accepted' },
        { fromUserId: otherUserId, toUserId: loggedInUser._id, status: 'accepted' }
      ]
    });

    if (!connection) {
      return res.status(403).json({ error: 'You can only message your connections' });
    }

    // Get messages between the two users
    const messages = await Message.find({
      $or: [
        { senderId: loggedInUser._id, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: loggedInUser._id }
      ]
    })
    .sort({ createdAt: 1 })
    .populate('senderId', 'firstName lastName photoUrl')
    .populate('receiverId', 'firstName lastName photoUrl');

    res.json({
      message: 'Messages fetched successfully',
      data: messages
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Send a message
chatRouter.post('/chat/send', userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { receiverId, content, messageType = 'text' } = req.body;

    // Verify they are connected
    const connection = await ConnectionRequest.findOne({
      $or: [
        { fromUserId: loggedInUser._id, toUserId: receiverId, status: 'accepted' },
        { fromUserId: receiverId, toUserId: loggedInUser._id, status: 'accepted' }
      ]
    });

    if (!connection) {
      return res.status(403).json({ error: 'You can only message your connections' });
    }

    // Create new message
    const message = new Message({
      senderId: loggedInUser._id,
      receiverId,
      content,
      messageType
    });

    await message.save();

    // Populate sender and receiver info
    await message.populate('senderId', 'firstName lastName photoUrl');
    await message.populate('receiverId', 'firstName lastName photoUrl');

    res.status(201).json({
      message: 'Message sent successfully',
      data: message
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Mark messages as read
chatRouter.patch('/chat/read/:senderId', userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const senderId = req.params.senderId;

    // Mark all unread messages from this sender as read
    await Message.updateMany(
      {
        senderId,
        receiverId: loggedInUser._id,
        isRead: false
      },
      {
        isRead: true,
        readAt: new Date()
      }
    );

    res.json({
      message: 'Messages marked as read'
    });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({ error: 'Failed to mark messages as read' });
  }
});

// Get unread message count
chatRouter.get('/chat/unread-count', userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const unreadCount = await Message.countDocuments({
      receiverId: loggedInUser._id,
      isRead: false
    });

    res.json({
      message: 'Unread count fetched successfully',
      data: { unreadCount }
    });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    res.status(500).json({ error: 'Failed to fetch unread count' });
  }
});

// Get user by ID (for chat)
chatRouter.get('/user/:userId', userAuth, async (req, res) => {
  try {
    const userId = req.params.userId;
    const loggedInUser = req.user;

    // Verify they are connected
    const connection = await ConnectionRequest.findOne({
      $or: [
        { fromUserId: loggedInUser._id, toUserId: userId, status: 'accepted' },
        { fromUserId: userId, toUserId: loggedInUser._id, status: 'accepted' }
      ]
    });

    if (!connection) {
      return res.status(403).json({ error: 'You can only view connected users' });
    }

    const user = await User.findById(userId).select('firstName lastName photoUrl age location jobTitle company bio');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: 'User fetched successfully',
      data: user
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

module.exports = chatRouter;
