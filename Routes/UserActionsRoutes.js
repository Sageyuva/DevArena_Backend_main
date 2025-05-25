const express = require('express');
const router = express.Router();
const { addFriendController } = require ('../Controllers/UserActionController');
const { verifyToken } = require('../Utils/Jwt/Middleware');

router.post("/addFriend/:receiverId", verifyToken, addFriendController);


module.exports = router;