const messageModel = require("../models/messageModel");
const { validationResult } = require("express-validator");
const userModel = require("../models/userModel");
const Socket = require("../middelwear/socket");

// Send a message
const sendMessage = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { sender, receiver, message } = req.body;

  const senderUser = await userModel.findById(sender);
  const receiverUser = await userModel.findById(receiver);

  if (!senderUser || !receiverUser) {
    return res.status(404).json({ error: "Sender or receiver not found" });
  }

  try {
    const newMessage = await messageModel.create({
      sender: senderUser,
      receiver: receiverUser,
      message,
    });

    // Emit the message to the relevant users via Socket.IO
    Socket.emitMessage(sender, receiver, newMessage);

    return res.json({ message: "Message sent successfully", newMessage });
  } catch (err) {
    console.error("Error sending message:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Retrieve messages between two users
const getMessages = async (req, res) => {
  const { sender, receiver } = req.params;

  try {
    const messages = await messageModel
      .find({
        $or: [
          { sender, receiver },
          { sender: receiver, receiver: sender },
        ],
        //We sort the messages based on the timestamp to retrieve them in chronological order,
        //starting from the oldest to the newest.
      })
      .sort({ timestamp: 1 });
    console.log(messages);

    if (messages.length === 0) {
      return res.status(404).json({ message: "No messages found" });
    }
    return res.json({ messages });
  } catch (err) {
    console.error("Error retrieving messages:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { sendMessage, getMessages };
