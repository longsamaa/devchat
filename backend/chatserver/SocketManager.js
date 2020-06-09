const io = require('../app').io;
const uniqid = require('uniqid');
const id = uniqid();
const id2 = uniqid();
const Room = require('../models/rooms');
const Message = require('../models/messages');
const mongoose = require("mongoose");
const listChat = [
    {
        id :  id,
        name : '1',
        users : [
            {
                id : '5ed1eedfe5d695af30f5d968',
                name : 'ntlong'
            },
            {
                id : '5ed1efc3e5d695af30f5d969',
                name : 'tmcanh'
            }],
        lastMessage : "Con cho",
        type : "privatechat"
    },
    {
        id :  id2,
        name : '2',
        users : [
            {
                id : '5ed1eedfe5d695af30f5d968',
                name : 'ntlong'
            },
            {
                id : '5edcd0201126da3d9c4424f9',
                name : 'pvchuan'
            }],
        lastMessage : "Con cho",
        type : "privatechat"
    }
]

const messages = [{
    id : id,
    messages : [
        {
            sender : '5ed1eedfe5d695af30f5d968',
            content : 'Con cho'
        },
        {
            sender: '5ed1efc3e5d695af30f5d969',
            content: 'Con Ho'
        },
        {
            sender: '5ed1efc3e5d695af30f5d969',
            content: 'abc'
        },
        {
            sender : '5ed1eedfe5d695af30f5d968',
            content : 'Kaiz'
        }
    ]
},
    {
        id : 'alksdfjlkasdjf',
        messages : [
            {
                sender : '5ed1eedfe5d695af30f5d968',
                content : 'Con cho'
            }
        ]
},
    {
        id : id2,
        messages : [
            {
                sender : '5edcd0201126da3d9c4424f9',
                content : 'a'
            },
            {
                sender: '5edcd0201126da3d9c4424f9',
                content: 'Cb'
            },
            {
                sender: '5edcd0201126da3d9c4424f9',
                content: 'abc'
            },
            {
                sender : '5edcd0201126da3d9c4424f9',
                content : 'Ksadasdz'
            }
        ]
    },
]

//-------------------------------

module.exports.onConnecting = (socket) => {
    console.log("id : " + socket.id);
    socket.on(process.env.USER_CONNECTED, (userId,callback) => {
        console.log(userId);
        Room.find()
            .select('_id users name last lastMessage')
            .then(data => {
                //console.log(data);
                console.log(checkUserInListChat(userId.userId,data));
                callback(checkUserInListChat(userId.userId,data));
            })
            .catch(err => console.log(err));
    });
    socket.on(process.env.CONNECT_TO_ROOM_CHAT,async (roomId,callback) => {
        //Tra lai message trong room chat
        //console.log(roomId);
        //callback(getListMessagesInRoomChat(roomId));

        if(roomId !== null){
            socket.join(roomId);
            //check exits messages
            const messagesExists = await Message.findOne({idRoom : roomId});
            if(messagesExists){
                callback(messagesExists);
            }else{
                const newMessages = new Message ({
                    idRoom : roomId
                });
                await newMessages.save((err,result) => {
                    if(err) {
                        console.log(err);
                        return err;
                    }
                    callback(newMessages.messages);
                });
            }
        }
    });
    socket.on(process.env.GET_ALL_MESSAGE_IN_ROOM,(roomId,callback) => {
        console.log("get message in room :" + roomId);
    })
    socket.on(process.env.MESSAGE_CLIENT_TO_SERVER,async (data) => {
        //check messages is exist
        const roomId = data.roomId;
        const sender = data.sender;
        const content = data.message;
        const messagesExists = await Message.findOne({idRoom : roomId});
        if(messagesExists){
            Message.findOneAndUpdate({idRoom : roomId},{$push : {messages : {sender : sender, content : content}}},(err,result) =>{
                if (err) {
                    return res.status(400).json({ error: err });
                }
                io.to(data.roomId).emit(process.env.MESSAGE_SERVER_TO_CLIENT, {sender : data.sender, content : data.message});
            });
        }else{
            console.log("chua ton tai roi");
        }
    });
    socket.on(process.env.SEND_TYPING,(data) => {
        let userId = data.userId;
        let roomId = data.roomId;
        let isTyping = data.isTyping;
        io.to(roomId).emit(process.env.GET_TYPING_USERS_FROM_SERVER,{userId : userId,isTyping : isTyping});
    })
}


const checkUserInListChat = (userId,listChat) => {
    let listChatContainUser = [];
    listChat.map((chat) => {
        for(let i = 0; i < chat.users.length; i++){
            if(userId === chat.users[i]){
                console.log(chat.users[i]);
                listChatContainUser = listChatContainUser.concat(chat);
            }
        }
    })
    return listChatContainUser;
}

const loadAllChatRoom = async () => {
    let listAllRoom = [];
    let rooms = await Room.find()
        .select('_id users name last lastMessage')
        .then(data => {
            listAllRoom = data;
        })
        .catch(err => console.log(err));
    return rooms;
}

const getListMessagesInRoomChat = (roomId) => {
    let listMessageInRoomChat = null;
    messages.map((message) => {
        if(message.id === roomId){
            listMessageInRoomChat = message;
        }
    });
    return listMessageInRoomChat;
}

//-------------------------------------------------TEST---------------------------//



const createChat = ({messages = [], name="Community", users=[]} = {})=>(
    {
        id: uniqid(),
        name,
        messages,
        users,
        typingUsers: [],

        addMessage: (messages, message)=>{
            return [...messages, message]
        },
        addTypingUser: (typingUsers, username)=>{
            return [...typingUsers, username]
        },
        removeTypingUser: (typingUsers, username) => {
            return typingUsers.filter((u)=>u === username)

        }
    }
)

const getTime = (date)=>{
    return `${date.getHours()}:${("0"+date.getMinutes()).slice(-2)}`
};