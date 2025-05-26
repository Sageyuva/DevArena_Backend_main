const express = require('express');
const router = express.Router();
const { addFriend } = require ('../Controllers/UserActionController');
const { verifyToken } = require('../Utils/Jwt/Middleware');

router.post("/addFriend/:receiverId", verifyToken, addFriend);


module.exports = router;