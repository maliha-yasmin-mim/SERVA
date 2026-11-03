import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import Notification from '../models/Notification.js';

// In-memory active typing tracker: conversationId -> { [userId]: { timestamp: number, name: string } }
const activeTypingMap = new Map();

// Helper to clean expired typing indicators (> 3.5 seconds)
const getTypingUsers = (conversationId, excludeUserId) => {
  if (!activeTypingMap.has(conversationId.toString())) return [];
  const userMap = activeTypingMap.get(conversationId.toString());
  const now = Date.now();
  const typingList = [];

  for (const [userId, info] of Object.entries(userMap)) {
    if (userId !== excludeUserId?.toString()) {
      if (now - info.timestamp < 3500) {
        typingList.push(info.name || 'User');
      } else {
        delete userMap[userId];
      }
    }
  }
  return typingList;
};

// @desc    Get user's conversations
// @route   GET /api/messages/conversations
export const getConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user._id
    })
      .populate('participants', 'name avatar location verificationStatus isAvailableNow phone')
      .sort({ updatedAt: -1 });

    res.json({ success: true, conversations });
  } catch (error) {
    next(error);
  }
};

// @desc    Get messages for a conversation & typing status
// @route   GET /api/messages/:conversationId
export const getMessages = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    if (!conversation.participants.some(p => p.toString() === req.user._id.toString())) {
      return res.status(403).json({ success: false, message: 'Unauthorized access to conversation' });
    }

    // Mark unread messages sent by other participants as read FIRST
    await Message.updateMany(
      { conversation: conversationId, sender: { $ne: req.user._id }, readBy: { $ne: req.user._id } },
      { $addToSet: { readBy: req.user._id } }
    );

    // Fetch messages with updated readBy list
    const messages = await Message.find({ conversation: conversationId })
      .populate('sender', 'name avatar')
      .sort({ createdAt: 1 });

    const typingUsers = getTypingUsers(conversationId, req.user._id);

    res.json({
      success: true,
      messages,
      isTyping: typingUsers.length > 0,
      typingUsers
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user typing status in conversation
// @route   POST /api/messages/:conversationId/typing
export const updateTypingStatus = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const { isTyping } = req.body;
    const key = conversationId.toString();

    if (!activeTypingMap.has(key)) {
      activeTypingMap.set(key, {});
    }

    const userMap = activeTypingMap.get(key);
    if (isTyping) {
      userMap[req.user._id.toString()] = {
        timestamp: Date.now(),
        name: req.user.name || 'User'
      };
    } else {
      delete userMap[req.user._id.toString()];
    }

    res.json({ success: true, isTyping: !!isTyping });
  } catch (error) {
    next(error);
  }
};

// @desc    Send a message
// @route   POST /api/messages
export const sendMessage = async (req, res, next) => {
  try {
    const { recipientId, conversationId, text } = req.body;

    if (!text || (!recipientId && !conversationId)) {
      return res.status(400).json({ success: false, message: 'Message text and recipient or conversation are required' });
    }

    let conv;
    if (conversationId) {
      conv = await Conversation.findById(conversationId);
    } else {
      // Find or create between req.user._id and recipientId
      conv = await Conversation.findOne({
        participants: { $all: [req.user._id, recipientId] }
      });

      if (!conv) {
        conv = await Conversation.create({
          participants: [req.user._id, recipientId]
        });
      }
    }

    if (!conv) {
      return res.status(404).json({ success: false, message: 'Conversation could not be initialized' });
    }

    const message = await Message.create({
      conversation: conv._id,
      sender: req.user._id,
      text,
      readBy: [req.user._id]
    });

    conv.lastMessage = {
      text,
      sender: req.user._id,
      createdAt: new Date()
    };
    await conv.save();

    // Clear typing indicator for this sender once message is sent
    if (activeTypingMap.has(conv._id.toString())) {
      delete activeTypingMap.get(conv._id.toString())[req.user._id.toString()];
    }

    // Determine other participant
    const otherParticipant = conv.participants.find(p => p.toString() !== req.user._id.toString());
    if (otherParticipant) {
      await Notification.create({
        recipient: otherParticipant,
        sender: req.user._id,
        type: 'message',
        title: 'New Message',
        message: `${req.user.name}: ${text.length > 40 ? text.substring(0, 40) + '...' : text}`,
        link: `/dashboard/messages?convId=${conv._id}`
      });
    }

    const populatedMsg = await Message.findById(message._id).populate('sender', 'name avatar');

    res.status(201).json({
      success: true,
      message: populatedMsg,
      conversationId: conv._id,
      conversation: conv
    });
  } catch (error) {
    next(error);
  }
};
