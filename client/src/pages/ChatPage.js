import React, {} from "react"
import {ChatList} from "../components/ChatList";
import "../styles/chatList.css"
import {Chat} from "../components/Chat";

export const ChatPage = () => {

    return (
        <>
            <div className="row no-mp-block">
                <div className="col s3 blue lighten-5 divider-chat-list no-mp-block">
                    <ChatList/>
                </div>
                <div className="col s9">
                    <Chat/>
                </div>
            </div>
        </>
    )
}