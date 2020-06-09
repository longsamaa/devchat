import React,{useEffect,useState} from "react";
import './friendList.css';
import {authenticate, isAuthenticated} from "../../../auth";
import { read, createRoom} from "../../../user/apiUser";

const FriendList = ({conversations,userId,setCurrentRoomChat,token,setCurrentRecerved}) => {
    const [index,setIndex] = useState('');
    const [listUser,setListUser] = useState([]);
    //const [indexClick,setIndexClick] = useState('');
    //const [listTmp,setListTmp] = useState([]);
    let list = [];
    const handleClick = (conversation,i) => {
        setIndex(i);
        setCurrentRoomChat(conversation);
        if(listUser[i] !== undefined){
            conversation.users.map(user => {
                if(user != userId) {
                    if (listUser != undefined) {
                        for (let j = 0; j <= listUser.length; j++) {
                            if(listUser[j] !== undefined){
                                if(listUser[j]._id === user){
                                    //indexClick = i;
                                    setCurrentRecerved(listUser[j]);
                                }
                            }
                        }
                    }
                }
            })
        }
    }
    useEffect(() => {
        setList(conversations);
    })

    const setList = (conversations) => {
        if(isAuthenticated().token !== null && conversations.length !== 0 && listUser.length === 0){
            conversations.map(conversation => {
                conversation.users.map(user => {
                    if(userId !== user) {
                       getDataUser(user);
                    }
                })
            })
        }
    }
    const getDataUser = (userId) =>{
        //const token = isAuthenticated().token;
        read(userId, token).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                list.push(data);
                if(list.length === conversations.length){
                    setListUser(list);
                }
            }
        });
    }
    //console.log(indexClick);

    return (
        <div id = "friend-list">
            {conversations ? conversations.map((conversation,i) => {
                return(
                    <li className = {"friend" + (index === i ? " active" : "")} onClick = {() => {handleClick(conversation,i)}} key={i}>
                        <img src = {require("../../../images/avatar.jpg")} alt = "user 1"/>
                        <div className="title-text">
                            {
                                // listUser[i] !== undefined ? listUser[i].name : null
                                conversation.users.map(user => {
                                    if(user != userId) {
                                        if (listUser != undefined) {
                                            for (let j = 0; j <= listUser.length; j++) {
                                                if(listUser[j] !== undefined){
                                                    if(listUser[j]._id === user){
                                                        //indexClick = i;
                                                        return listUser[j].name;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                })
                            }
                        </div>
                        <div className="created-date">
                            {conversation.date ? conversation.date : null}
                        </div>
                        <div className="friend-message">
                            {conversation ? conversation.lastMessage : null}
                        </div>
                    </li>
                )
            }) : null}
        </div>
    )
}

export default FriendList;