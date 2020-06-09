import React from "react";
import './chattitle.css';

const Chattitle = ({currentReceiver}) => {
    return (
        <div id = "chat-title">
            <span>{currentReceiver}</span>
            <img src = {require("../../images/bin.ico")} alt = "Delete"/>
        </div>
    )
}

export default Chattitle;