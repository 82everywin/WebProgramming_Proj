const userController = {}
const User = require("../Models/user");
const Chat = require("../Models/chat");

userController.saveUser = async(userId, userPw, socketId) =>{
    // 이미 존재하는 유저인지 확인
    let user = await User.findOne({name: userId });
    // 없다면 새로 유저정보 생성
    if(!user) {
        user = new User({
            name: userId,
            password: userPw,
            token: socketId,
        });
    }

    await user.save()
    return user;
};

userController.loginUser = async(userId, userPw, socketId) => {
    let user = await User.findOne({name: userId, password: userPw});
    if(user){
        user.token = socketId;
        await user.save();
    }else{
        return null;
    }
    return user;
};

userController.getUser = async(socketId) => {
    let user = await User.findById(socketId);
    return user;
};

userController.checkUser = async(socketId) => {
    const user = await User.findOne({token: socketId})
    if(!user) throw new Error("user not found!");
    return user;
};

userController.updateUser = async(userId, newName) => {
  //  console.log ("userId--->", userId);
    let user = await User.findById(userId);
    if(user){
        user.name = newName;
        await user.save();
    }
    return user;
};

userController.updateUserNameInMessages = async(userId, newName) => {
    console.log(`Updating messages for userId: ${userId} to newName: ${newName}`);
    const result = await Chat.updateMany(
        { "user.id": userId }, 
        { $set: {"user.name": newName }}
    );
};

module.exports = userController