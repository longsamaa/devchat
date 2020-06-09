import React,{ useState, useEffect,Component } from "react";
import io from "socket.io-client";
import { isAuthenticated } from "../auth";
import { read } from "../user/apiUser";
import Search from './components/search/search';
import FriendList from "./components/friendList/friendList";
import './chat.css';
import NewMessages from './components/NewMessages/newmessages';
import ChatTitle from './components/ChatTitle/chattitle';
import ChatMessageList from './components/ChatMessageList/chatmessagelist';
import ChatForm from './components/ChatForm/chatform';
import {Redirect} from "react-router-dom";
let socketIo = null;

const Chat = (props) => {
    const [messages,setMessages] = useState([]);
    const [currentRoom,setCurrentroom] = useState([]);
    const [conversations,setConversations] = useState([]);
    const [redirectToSignIn,setRedirectTosignIn] = useState(false);
    const [user,setUser] = useState(null);
    const [socket,setSocket] = useState(null);
    const [typingUsers,setTypingUsers] = useState([]);
    const [currentReceiver,setCurrentReceiver] = useState('');
    const userId = props.match.params.userId;
    let message = null;
    useEffect(() => {
        socketIo = io(process.env.REACT_APP_SERVER_URL);
        init(socketIo);
        console.log('render web');
        return () => {
            if(socket !== null) {
                socket.emit('disconnect');
                socket.off();
            }
        }
    },[messages,socket,typingUsers]);

    const init = (Socket) => {
        if(Socket != null){
            initUser(userId);
            initSocket(Socket);
            initChat(userId);
            getMessageFromServer(Socket);
            updateTypingUsersFromServer();
        }
    }
    const initSocket = (Socket) => {
        if(Socket !== null && socket === null) {
            setSocket(Socket);
        }
    }

    const initUser = userId => {
        const token = isAuthenticated().token;
        read(userId, token).then(data => {
            if (data.error) {
                setRedirectTosignIn(true);
            } else {
                setUser(data);
            }
        });
    };
    const initChat = (userId) => {
        if(socket !== null) {
            socket.emit(process.env.REACT_APP_USER_CONNECTED, {userId: userId}, chat);
        }
    }
    const chat = (listChat) => {
        //console.log(listChat);
        if(conversations.length === 0) {
            setConversations(listChat);
        }
    }
    const setCurrentRoom = (conversation) => {
        setCurrentroom(conversation._id);
        const roomId = conversation._id;
        if(socket !== null) {
            socket.emit(process.env.REACT_APP_CONNECT_TO_ROOM_CHAT, roomId, setMessageToRoomChat);
        }
    }
    const setMessageToRoomChat = (messages) => {
        console.log(messages);
        if(messages !== null) {
            setMessages(messages.messages);
        }
    }
    const loadFollower = (userId , token) => {
        read(userId,token).then(data => {
            if(data.error)
                console.log("Loi");
            else{
                data.followers.map((person, i) => {
                    console.log(person._id);
                })
            }
        })
    }

    const sendMessage = (event) => {
        event.target.value = "";
        event.preventDefault();
        if(message){
            let d = new Date();
            let currentTime = d.getTime();
            console.log(message);
            console.log(userId);
            console.log(currentTime);
            console.log(currentRoom);
            if(socket) {
                socket.emit(process.env.REACT_APP_MESSAGE_TO_SERVER, {
                    message: message,
                    sender: userId,
                    time: currentTime,
                    roomId: currentRoom
                });
            }
        }
    }
    const getMessage = (value) => {
        message = value;
    }
    const getMessageFromServer =  () => {
        if (socket !== null) {
            socket.on(process.env.REACT_APP_GET_MESSAGE_FROM_SERVER, (data) => {
                console.log(data);
                setMessages([...messages, data]);
            })
        }

    }
    const sendTyping = (isTyping) => {
        if(currentRoom !== null && userId !== null){
            socket.emit(process.env.REACT_APP_SEND_TYPING, {roomId : currentRoom,userId : userId,isTyping : isTyping});
        }
    }
    const updateTypingUsersFromServer = () => {
        if(socket !== null) {
            socket.on(process.env.REACT_APP_GET_TYPING_USERS_FROM_SERVER, (data) => {
                let isTyping = data.isTyping;
                let userid = data.userId;
                if(userid !== userId) {
                    if(isTyping === true) {
                        setTypingUsers([...typingUsers,userid]);
                    }else{
                        if(isTyping === false) {
                            let empty = [];
                            setTypingUsers(empty);
                        }
                    }
                }
            })
        }
    }
    const setCurrentRecerved = (user) => {
        setCurrentReceiver(user.name);
    }



    if (redirectToSignIn) return <Redirect to="/signin" />;
    return (
        <div id = "chat-page">
            <div id = "chat-container">
                <Search/>
                <FriendList conversations = {conversations} userId = {userId} setCurrentRoomChat = {setCurrentRoom} token = {isAuthenticated().token} setCurrentRecerved = {setCurrentRecerved}/>
                <NewMessages/>
                <ChatTitle currentReceiver = {currentReceiver}/>
                <ChatMessageList messages={messages} userId={userId} typingUsers = {typingUsers}/>
                <ChatForm getMessage = {getMessage} sendMessage = {sendMessage} sendTyping = {sendTyping}/>
            </div>
        </div>
    )
};

export default Chat;