import React,{useEffect,useState} from "react";
import './chatmessagelist.css';
const ChatmessageList = ({messages,userId,typingUsers}) => {
    let ref;

    const ScrollToBottom = () => {
        if(ref != null) {
            if (ref.current) {
                ref.current.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                });
            }
        }
    }

    useEffect(() => {
        ScrollToBottom();
    });
    return (
        <div id = "chat-message-list" >
            {messages ? messages.map((message,index) => {
                const Ref = React.createRef();
                ref = Ref;
                if(message.sender === userId){
                return(
                    <div className = "message-row you-message"  key = {index} ref={ref}>
                        <div className="message-content" key = {index}>
                            <div className = "message-text">{message.content}</div>
                            <div className="message-time">June 9</div>
                        </div>
                    </div>
                )}else{
                    return (
                        <div className="message-row other-message" key = {index}>
                            <div className="message-content">
                                <img src = {require('../../../images/avatar.jpg')}/>
                                <div className="message-text">
                                    {message.content}
                                </div>
                                <div className="message-time">June 9</div>
                            </div>
                        </div>
                    )
                }
            }) : null}
            {typingUsers.length > 0 ? <h3>Đang nhập</h3> : null}
        </div>
    )
};

export default ChatmessageList;