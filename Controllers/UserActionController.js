const mongoose = require('mongoose');
const UserModel = require('../Models/UserModel');

const addFriendController = async (req, res) => {
    const senderId = req.userId;
    const { receiverId } = req.params;

    if (!receiverId || receiverId === senderId) {
        return res.status(400).json({ message: "Invalid request: Cannot send request to yourself or missing user ID." });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const [sender, receiver] = await Promise.all([
            UserModel.findById(senderId).select('friends sentRequests').session(session),
            UserModel.findById(receiverId).select('receivedRequests sentRequests friends').session(session)
        ]);

        if (!sender || !receiver) {
            await session.abortTransaction();
            return res.status(404).json({ message: "User not found." });
        }

        if (sender.friends.includes(receiverId)) {
            await session.abortTransaction();
            return res.status(409).json({ message: "You are already friends with this user." });
        }

        if (sender.sentRequests.includes(receiverId) || receiver.sentRequests.includes(senderId)) {
            await session.abortTransaction();
            return res.status(409).json({ message: "Friend request already sent." });
        }

        sender.sentRequests.push(receiverId);
        receiver.receivedRequests.push(senderId);

        await sender.save({ session });
        await receiver.save({ session });

        await session.commitTransaction();
        res.status(200).json({ message: "Friend request sent successfully." });

    } catch (error) {
        console.error("Error in addFriendController:", error);
        await session.abortTransaction();
        res.status(500).json({ message: "Internal server error." });
    } finally {
        session.endSession();
    }
};

module.exports = {
    addFriendController
};
