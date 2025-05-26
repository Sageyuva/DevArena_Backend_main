const mongoose = require('mongoose');
const UserModel = require('../Models/UserModel');

const addFriend = async (req, res) => {
    const senderId = req.userId;
    const { receiverId } = req.params;

    if (!receiverId || receiverId === senderId) {
        return res.status(400).json({ message: "Invalid request: Cannot send request to yourself or missing user ID." });
    }

    try {
        const [sender, receiver] = await Promise.all([
            UserModel.findById(senderId).select('friends sentRequests'),
            UserModel.findById(receiverId).select('receivedRequests sentRequests friends')
        ]);

        if (!sender || !receiver) {
            return res.status(404).json({ message: "User not found." });
        }

        // Defensive check: initialize arrays if missing
        if (!Array.isArray(sender.sentRequests)) sender.sentRequests = [];
        if (!Array.isArray(receiver.receivedRequests)) receiver.receivedRequests = [];

        if (sender.friends.includes(receiverId)) {
            return res.status(409).json({ message: "You are already friends with this user." });
        }

        if (sender.sentRequests.includes(receiverId) || receiver.sentRequests.includes(senderId)) {
            return res.status(409).json({ message: "Friend request already sent." });
        }

        sender.sentRequests.push(receiverId);
        receiver.receivedRequests.push(senderId);

        await Promise.all([
            sender.save(),
            receiver.save()
        ]);

        res.status(200).json({ message: "Friend request sent successfully." });

    } catch (error) {
        console.error("Error in addFriendController:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};




module.exports = {
    addFriend
};
