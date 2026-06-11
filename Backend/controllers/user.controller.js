import { User } from "../models/user.model.js";

export const getUsers = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const users = await User.find({
      _id: {
        $ne: loggedInUserId,
      },
    }).select("-password");

    return res.status(200).json({
      users,
      message: "users list",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error in user controller getuser",
    });
  }
};

export const searchUsers = async (req, res) => {
  try {
    const { q } = req.query;

    const users = await User.find({
      username: {
        $regex: q,
        $options: "i",
      },
      _id: {
        $ne: req.user._id,
      },
    }).select("-password");

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: "Server Error in user controller search",
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { username, bio, profilePic } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        username,
        bio,
        profilePic,
      },
      {
        new: true,
      },
    ).select("-password");

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({
      message: "Server Error in user controlller update profile",
    });
  }
};
