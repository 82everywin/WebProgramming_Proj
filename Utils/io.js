// io 관련된 파일
const chatController = require("../Controllers/chat.controller");
const userController = require("../Controllers/user.controller");
const roomController = require("../Controllers/room.controller");
const { times } = require("lodash");

module.exports = function (io) {

    io.on("connection", async(socket) => {
        console.log("[Server] client is connected", socket.id);

        // 서버받기 ) 회원가입
        socket.on("register", async({userId, userPw}, cb) => {
            console.log("회원가입 ",userId);
            try{
                const user = await userController.saveUser(userId, userPw, socket.id);
                cb({ok: true, data: user});
            }catch(error){
                cb({ok: false, error: error.message});
            }

        });

        // 로그인
        socket.on("login", async({userId, userPw}, cb) => {
            console.log("[Server] BackEnd",userId);
            try{
                const user = await userController.loginUser(userId, userPw, socket.id);
                cb({ok:true, data: user});
            }catch(error){
                cb({ok:false, error: "로그인 정보 불일치"});
            }

        });

        // 유저정보 
        socket.on('getUser', async(userId, cb) =>{
            try{
                const user = await userController.getUser(userId);
                cb({ok: true, data: user});
            }catch(error) {
                cb({ok: false, error: "유저 정보 가져오기 실패"});
            }
        });

        // 채팅방 목록 가져오기 
        socket.emit("rooms", await roomController.getAllRooms()); 

        // 방생성 
        socket.on('createRoom', async(roomName, cb) => {
            try{
                const room = await roomController.createRoom(roomName);
                io.emit('rooms', await roomController.getAllRooms());
                cb({ok:true, data: room});
            } catch(error) {
                cb({ok: false, error: error.message});
            }
        })

        // 방 참여 
        socket.on("joinRoom", async(rid, cb) => {
            try {
                const user = await userController.checkUser(socket.id);
                await roomController.joinRoom(rid, user);
                socket.join(user.room.toString());
                const welcomeMessage = {
                    chat: `${user.name}님이 입장하였습니다.`,
                    user: { id: null, name: "system" },
                    timestamp: new Date().toISOString()
                 };
                io.to(user.room.toString()).emit("message", welcomeMessage);
                io.emit("rooms", await roomController.getAllRooms());
                cb({ ok: true });
            } catch (error) {
                cb({ ok: false, error: error.message });
            }
          });


        // 특정 방 가져오기 
        socket.on('getRoom', async(roomId, cb) => { 
            try{
                const room = await roomController.getRoom(roomId);
                const messages = await chatController.getChat(roomId);
                cb({ok:true, data:room, messages});
            }catch(error) {
                cb({ok:false, error:error.message}); 
            }
        })


        // 메세지 전송 
        socket.on("sendMessage", async({message, roomId, userId}, cb)=> {
            try {
                // 유저 찾기 = socketID로
                const user = await userController.getUser(userId);
                const room = await roomController.getRoom(roomId);
                const timestamp = new Date().toISOString();
                const newMessage = await chatController.saveChat(message, user, room, timestamp);     
                io.to(roomId).emit("message", newMessage);
                cb({ok: true});
            }catch(error){
                 cb({ok: false, error: error.message});
            }
        });

        // 채팅방 나가기
        socket.on("leaveRoom", async (roomId, cb) => {
            try {
                const user = await userController.checkUser(socket.id);
                await roomController.leaveRoom(user);
                const leaveMessage = {
                    chat: `${user.name}님이 방을 나갔습니다. `,
                    user: { id: null, name: "system" },
                    timestamp : new Date().toISOString(),
                };
                socket.broadcast.to(roomId).emit("message", leaveMessage);
                // socket.broadcast의 경우 io.to()와 달리,나를 제외한 채팅방에 모든 맴버에게 메세지를 보낸다 
                io.emit("rooms", await roomController.getAllRooms());
                socket.leave(roomId); // join했던 방을 떠남 
                if (typeof cb === 'function') {
                    cb({ ok: true });
                }
            } catch (error) {
                if (typeof cb === 'function') {
                    cb({ ok: false, error: error.message });
                }
            }
        });

        // 정보 변경
        socket.on("changeName", async({userId, newName}, cb) => {
            try{
                const user = await userController.updateUser(userId,newName);
                await userController.updateUserNameInMessages(userId, newName);
                io.emit('updateUser', user);
                cb({ ok: true, data: user });
            }catch(error) {
                cb({ok:false, error: error.message});
            };
        });

        // 연결 해제
        socket.on("disconnect", async() => {
            console.log("[Server] user is disconnected");
        });
    });


};