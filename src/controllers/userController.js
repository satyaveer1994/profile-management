const userModel = require("../models/userModel");
const { validationResult } = require("express-validator");

// Create user profile
const createProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, age } = req.body;

  try {
    // Check if email is already taken
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email is already taken" });
    }

    const createdUser = await userModel.create({ name, email, age });

    return res
      .status(201)
      .json({ message: "Profile created successfully", user: createdUser });
  } catch (err) {
    console.error("Error creating profile:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
// Update user profile
const updateProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { name, email, age } = req.body;
    const user_Id = req.params.userId;
    console.log(user_Id);
    console.log(req.body);

    const existingUser = await userModel.findById(user_Id);
    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = await userModel.findByIdAndUpdate(
      user_Id,
      { name, email, age },
      { new: true }
    );

    return res.json({ message: "Profile updated successfully", user });
  } catch (err) {
    console.error("Error updating profile:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Update reveal mode
const updateRevealMode = async (req, res) => {
  const { revealMode } = req.body;
  const user_Id = req.params.userId;

  try {
    const user = await userModel.findByIdAndUpdate(
      user_Id,
      { revealMode },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({ message: "Reveal mode updated successfully", user });
  } catch (err) {
    console.error("Error updating reveal mode:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Update open mode
const updateOpenMode = async (req, res) => {
  const { openMode } = req.body;
  const user_Id = req.params.userId;

  try {
    const user = await userModel.findByIdAndUpdate(
      user_Id,
      { openMode },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({ message: "Open mode updated successfully", user });
  } catch (err) {
    console.error("Error updating open mode:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Check consent to reveal user profile
const checkConsentToReveal = async (req, res) => {
  const currentUserId = req.params.currentUserId;
  const targetUserId = req.params.targetUserId;

  try {
    const currentUser = await userModel.findById(currentUserId);
    const targetUser = await userModel.findById(targetUserId);

    if (!currentUser || !targetUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the current user has consent to reveal the target user's profile
    if (targetUser.revealMode && currentUser.openMode) {
      return res.json({ consent: true });
    }

    return res.json({ consent: false });
  } catch (err) {
    console.error("Error checking consent to reveal:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Check consent to open user profile
const checkConsentToOpen = async (req, res) => {
  const currentUserId = req.params.currentUserId;
  const targetUserId = req.params.targetUserId;

  try {
    const currentUser = await userModel.findById(currentUserId);
    const targetUser = await userModel.findById(targetUserId);

    if (!currentUser || !targetUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the current user has consent to open the target user's profile
    if (currentUser.openMode && targetUser.openMode) {
      return res.json({ consent: true });
    }

    return res.json({ consent: false });
  } catch (err) {
    console.error("Error checking consent to open:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createProfile,
  updateProfile,
  updateRevealMode,
  updateOpenMode,
  checkConsentToReveal,
  checkConsentToOpen,
};
