import {useContext} from "react"
import {useHistory, useParams} from "react-router-dom"
import {WebsocketContext} from "../context/WebsocketContext";

export const ContactList = ({contacts, isFindFlag}) => {
    const history = useHistory()
    const contactId = useParams().id
    const io = useContext(WebsocketContext)
    if ((!contacts || !contacts.length) && isFindFlag) {
        return <p>Поиск не дал результатов</p>
    }

    if (!contacts || !contacts.length) {
        return <p>Контактов пока нет</p>
    }

    return (
        <>
            {!isFindFlag &&
                <p>Ваш список контаков:</p>
            }
            {isFindFlag &&
                <p>Найденные пользователи:</p>
            }

            <ul className="collection">
                {
                    contacts.map((contact)=> {
                        let styleLi = "collection-item"
                        if (contactId === contact.id) {
                            styleLi += " active"
                        }
                        return (
                                <li className={styleLi} key={contact.id} onClick={ () => {
                                    if (contactId !== contact.id) {
                                        io.clearMessagesOnCloseChat()
                                        io.setFriendIdOnOpenConversation(contact.id)
                                        history.push(`/chat/${contact.id}`)
                                    }
                                }
                                }>
                                    <p>{contact.name}</p>
                                    <p>{contact.email}</p>
                                </li>
                        )
                    })
                }
            </ul>
        </>
    )

}