import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import Notification from '../models/Notification.js';

// @desc    Get user's conversations
// @route   GET /api/messages/conversations
export const getConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user._id
    })
      .populate('participants', 'name avatar location verificationStatus isAvailableNow')
      .sort({ updatedAt: -1 });

    res.json({ success: true, conversations });
  } catch (error) {
    next(error);
  }
};

// @desc    Get messages for a conversation
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

    const messages = await Message.find({ conversation: conversationId })
      .populate('sender', 'name avatar')
      .sort({ createdAt: 1 });

    // Mark unread messages as read
    await Message.updateMany(
      { conversation: conversationId, sender: { $ne: req.user._id }, readBy: { $ne: req.user._id } },
      { $addToSet: { readBy: req.user._id } }
    );

    res.json({ success: true, messages });
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

    res.status(201).json({ success: true, message: populatedMsg, conversationId: conv._id });
  } catch (error) {
    next(error);
  }
};
