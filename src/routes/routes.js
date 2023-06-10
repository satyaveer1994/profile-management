const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const messageController = require('../controllers/messageController');
const validator= require("../middelwear/validator")

// Profile Management Routes
router.post('/addUser',validator.createProfileValidationRules,userController.createProfile)
router.put('/users/:userId',validator.updateProfileValidationRules, userController.updateProfile);

// Chat Messaging Routes
router.post('/messages',validator.validateMessageInput, messageController.sendMessage);
router.get('/messages/:sender/:receiver', messageController.getMessages);

// Reveal and Open Modes Routes
router.put('/users/:userId/reveal-mode', userController.updateRevealMode);
router.put('/users/:userId/open-mode', userController.updateOpenMode);
// Check consent to reveal user profile
router.get('/:currentUserId/consent/reveal/:targetUserId', userController.checkConsentToReveal);

// Check consent to open user profile
router.get('/:currentUserId/consent/open/:targetUserId', userController.checkConsentToOpen);

module.exports = router;
