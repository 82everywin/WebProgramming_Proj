const roomController = {}
const Room = require("../Models/room");

roomController.createRoom = async(roomName) => {
  let room = await Room.findOne({room: roomName});
  console.log("채팅방 있는지 유무",room);
  if(!room) {
    room = new Room( {
      room: roomName,
      members : [],
    });
    console.log("방생성 성공 유무", room);
  }

  await room.save();
  return room;

}

// 채팅방 목록 
roomController.getAllRooms = async() => {
    const roomList = await Room.find({});
    return roomList;
};

// 회원추가
roomController.joinRoom = async(roomId, user) => {
    const room = await Room.findById(roomId);
    if (!room) {
        throw new Error("해당 방이 없습니다.");
      }
      if (!room.members.includes(user._id)) {
        room.members.push(user._id);
        await room.save();
      }
      user.room = roomId;
      await user.save();
};

roomController.getRoom = async(roomId) => {
  const room = await Room.findById(roomId).populate('members');
  return room
}

roomController.leaveRoom = async (user) => {
  const room = await Room.findById(user.room);
  if (!room) {
    throw new Error("Room not found");
  }
  room.members.remove(user._id);
  await room.save();
};

module.exports = roomController;