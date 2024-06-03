const Chat = require("../Models/chat");
const chatController = {}


chatController.saveChat = async(message, user, room, timestamp) => {
    const newMessage = new Chat({
        chat: message,
        user: {
            id: user._id,
            name: user.name,
        },
        room: room._id,
        timestamp: timestamp,
    });
    await newMessage.save();
    return newMessage;

}

chatController.getChat = async(roomId) => {
    const messages = await Chat.find(
        {room: roomId}).populate("user.id");
    return messages;
}




module.exports = chatController;