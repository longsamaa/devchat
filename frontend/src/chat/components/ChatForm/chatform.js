import React from "react";
import './chatform.css';

const ChatForm = ({getMessage,sendMessage,sendTyping}) => {
    let isTyping = false;
    const timeTyping = 5000;
    const onHandleChange = (e) => {
        getMessage(e.target.value);
    }
    const onKeyPress = (e) => {
        if(e.key === 'Enter') {
            sendMessage(e);
            timeOut();
        }else{
            checkTyping();
        }
    }
    const checkTyping = () => {
        if(isTyping === false) {
            isTyping = true;
            sendTyping(isTyping);
            setTimeout(timeOut,timeTyping);
        }
    }
    const timeOut = () => {
        isTyping = false;
        sendTyping(isTyping);
    }
    return (
        <div id = "chat-form">
            <form id = "grid-container">
                <img src = {require("../../images/icon-addfile.ico")}/>
                <input type = "text" placeholder="Type a message" onChange={onHandleChange} onKeyPress={onKeyPress}/>
                <button>>>></button>
            </form>
        </div>
    )
}

export default ChatForm;