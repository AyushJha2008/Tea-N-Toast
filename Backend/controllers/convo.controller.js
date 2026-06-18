import {Convo} from "../models/convo.model.js"
import { Message } from "../models/messagge.model.js";

export const startConversation = async (req, res) => {
  try {
    const { receiverId } = req.body;

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

    res.status(200).json(conversation);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error convo controller start convo",
    });
  }
};

export const getConversations = async (req, res) => {
  try {

    const conversations = await Convo.find({
      participants: req.user._id,
    })
      .populate({
        path: "participants",
        select: "username profilePic email"
      })
      .populate("lastMessage")
      .sort({ updatedAt: -1 });

    res.status(200).json(conversations);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error convo controller getconvo",
    });
  }
};
