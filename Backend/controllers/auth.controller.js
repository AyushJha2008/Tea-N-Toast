import {User} from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "Email already exists",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      success: true,
      message: "user registered successfull",
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error in auth controller register",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if(!email || !password){
        return res.status(400).json({
            message: "something is missing",
            success: false
        })
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
        success: false,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
        success: false,
      });
    }

    const tokenData = { userId: user._id };
    const token = await jwt.sign(tokenData, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const safeUser = {
        _id: user._id,
      username: user.username,
      email: user.email,
      profilePic: user.profilePic,
    }

    return res.status(200)
    .cookie("token", token, {
        maxAge: 7*24*60*60*1000,
        httpOnly: true,
        sameSite: "strict",
    })
    .json({
        message: "welcome back",
        success: true,
        user: safeUser,
    //   _id: user._id,
    //   username: user.username,
    //   email: user.email,
    //   profilePic: user.profilePic,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error in auth controller login",
      success: false,
    });
  }
};

export const logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", {maxAge: 0,}).json({
      message: "Logged out",
      success: true
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error auth controller logout",
    });
  }
};

export const checkAuth = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    res.status(500).json({
      message: "Server Error in auth controller check auth",
    });
  }
};