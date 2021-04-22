import React, {useState, useContext, useEffect} from "react";
import "../styles/chatList.css"
import {WebsocketContext} from "../context/WebsocketContext";
import {ContactList} from "./ContactList";
import {AuthContext} from "../context/AuthContext";


export const ChatList = () => {
    const [searchInput, setSearchInput] = useState("")

    const io = useContext(WebsocketContext)
    const auth = useContext(AuthContext)

    useEffect(() => {
        io.getConversation()
    }, [])

    const submitHandler = (e) => {
        e.preventDefault()
        io.findNewUsers(searchInput)
        setSearchInput("")
    }


    return (
        <div className="full-height-block contacts">
            <div className="no-mp-block">
                <div className="row blue darken-1 no-mp-block">
                    <form className="col s3" onSubmit={submitHandler}>
                        <div className="row no-mp-block">
                            <div className="input-field col s6">
                                <i className="material-icons prefix">account_circle</i>
                                <input
                                        id="icon_prefix"
                                        type="text"
                                        className="validate white-text text-input"
                                        onChange={(event) => setSearchInput(event.target.value)}
                                        value={searchInput}/>
                                <label htmlFor="icon_prefix">Поиск</label>



                            </div>

                            <div className="input-field col s6">
                                {
                                    searchInput &&
                                    <i
                                        className="material-icons prefix backspace-icon "
                                        onClick={() => setSearchInput("")}
                                    >
                                        backspace
                                    </i>
                                }
                            </div>
                        </div>
                    </form>
                </div>
                {io.findUsers.payload && <ContactList contacts={io.findUsers.payload} isFindFlag={true}/>}
                <ContactList contacts={io.savedUsers.payload} isFindFlag={false}/>

            </div>

            <div className="exit-menu col s3 no-mp-block">
                <button
                    className="btn waves-effect waves-light exit-btn"
                    type="submit"
                    name="action"
                    onClick={auth.logOut}
                >
                    Выйти

                    <i className="material-icons right">exit_to_app</i>
                </button>
            </div>
        </div>
    )
}