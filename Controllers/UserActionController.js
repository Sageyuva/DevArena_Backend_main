const UserModel = require("../Models/UserModel");

const addFriendController = async (req, res) => {

    userId = req.userId;
    try {
        res.send("ok");
        // console.log(userId);
    } catch (error) {
        console.error(error);
    }
}

module.exports = {
    addFriendController
}