import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../model/userModel.js";

export const signup = async (req, res) => {
  try {
    const { fullName, username, password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      username,
      password: hashedPassword,
    });

    await newUser.save();
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(201).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      username: newUser.username,
      token,
    });
  } catch (error) {
    console.log("Error in signup controller\n", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log("Username:", username);
    console.log("Password:", password);

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: "Invalid username or password" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({
      token,
      fullName: user.fullName,
      username: user.username,
    });
  } catch (error) {
    console.error("Error in login controller:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllUsers = async (req, res) => {
  console.log("Received request for all users");
  try {
      const users = await User.find().select('-password');
      console.log(users, "users");
      if (!users) {
          return res.status(404).json({ error: "No users found" });
      }
      res.status(200).json(users);
  } catch (error) {
      console.log("Error in getAllUsers controller:", error.message);
      res.status(500).json({ error: "Internal server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    
    const user = await User.findOne({ username: req.user.username });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const userId = user._id.toString();
    console.log(user, userId);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { ...req.body },{ new: true } 
    );

    return res.status(200).json({
      message: "User Updated Successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.log("Error in updateProfile controller\n", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};




