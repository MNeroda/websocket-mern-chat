
export const MessageList = (props) => {
    /*console.log("messages in message list: ", props.messages, "friend id: ", props.friendId)*/
    if (!props.messages || !props.messages.length) {
        return <p>Сообщений пока нет</p>
    }

    let styleDiv
    return (
        <>
            {props.messages.map(message => {
                (message.from === props.friendId) ? styleDiv = "message friend-message" : styleDiv = "message my-message"
                return (
                    <div className={styleDiv} key={message._id}>
                        <span>
                            {message.value}
                        </span>
                    </div>
                )
            })}
        </>
    )

}