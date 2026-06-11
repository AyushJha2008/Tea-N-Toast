import { Message } from "../models/messagge.model.js";
import { Convo } from "../models/convo.model.js";
import { io } from "../sockets/socket.js";
import { getReceiverSocketId } from "../sockets/socket.js";

export const sendMessage = async (req, res) => {
  try {
    const { id: receiverId } = req.params;
    const { text, image } = req.body;
    const senderId = req.user._id;

    let conversation = await Convo.findOne({
      participants: {
        $all: [senderId, receiverId],
      },
      $expr: {
        $eq: [{ $size: "$participants" }, 2,],
      },
    });

    if (!conversation) {
      conversation = await Convo.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = await Message.create({
      sender: senderId,
      receiver: receiverId,
      text,
      image,
      conversationId: conversation._id,
    });

    conversation.lastMessage = newMessage._id;
    await conversation.save();
    return res.status(201).json(newMessage);

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }
    return res.status(201).json(newMessage);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Server Error in msg controller send msg" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;

    const senderId = req.user._id;

    const conversation = await Convo.findOne({
      participants: {
        $all: [senderId, userToChatId],
      },
      $expr: {
        $eq: [{ $size: "$participants" }, 2,],
      },
    });

    if (!conversation) {
      return res.status(200).json([]);
    }

    const messages = await Message.find({
      conversationId: conversation._id,
    }).sort({createdAt: 1,})

    return res.status(200).json(messages);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error in msg controller get msg",
    });
  }
};

export const markAsSeen = async (req, res) => {
  try {
    const { id } = req.params;
    await Message.updateMany(
      {
        sender: id,
        receiver: req.user._id,
        seen: false,
      },
      {
        seen: true,
      },
    );

    return res.status(200).json({
      message: "Messages seen",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error in msg controller markseen",
    });
  }
};
