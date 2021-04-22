const jwt = require("jsonwebtoken")
const User = require("../models/User")
const Conversation = require("../models/Conversation")
const config = require("config")

const createWebsocket = (server) => {

    const io = require("socket.io")(server, {
        cors: {
            origin: "http://localhost:3000",
            methods: ["GET", "POST"]
        }
    })



    io.on("connection", socket => {
        socket.on("i logged", async () => {
            const senderId = jwt.verify(socket.handshake.auth.token, config.get("jwtSecret"))
            await User.findOneAndUpdate({_id: senderId.userId}, {$set: {socketId: socket.id}}, {useFindAndModify: false})
        })

        socket.on('find user', async (msg) => {
            const fromId = jwt.verify(socket.handshake.auth.token, config.get("jwtSecret")).userId
            const fromUser = await User.findById({_id: fromId})
            let users = await User.find()

            //Filter arr and find email
            let filteredArr = users.filter(user => {
                return user.email.includes(msg)
            })

            const senderId = jwt.verify(socket.handshake.auth.token, config.get("jwtSecret"))

            const senderInUsers = filteredArr.findIndex(item => item.id === senderId.userId)
            if (senderInUsers > -1) {
                filteredArr = [...filteredArr.slice(0, senderInUsers), ...filteredArr.slice(senderInUsers+1, filteredArr.lenght)]
            }
            const response = {
                payload: []
            }

            if (filteredArr) {
                filteredArr.map((user) => {
                    response.payload.push({
                        id: user.id,
                        name: user.name,
                        email: user.email
                    })
                })
            }
            io.to(fromUser.socketId).emit("find user", JSON.stringify(response))
        })



        socket.on("get conversation", async () => {
            const fromId = jwt.verify(socket.handshake.auth.token, config.get("jwtSecret")).userId
            const fromUser = await User.findById({_id: fromId})
            if (fromUser.conversationList) {
                fromUser.populated("conversationList")
                await fromUser.populate("conversationList")
                    .execPopulate()

                const jsonArr = []


                let promises = []
                for (let item of fromUser.conversationList) {
                    if (JSON.stringify(item.members[0]._id) === JSON.stringify(fromId)) {
                        promises.push(new Promise(async (resolve, reject) => {
                            await User.findById({_id: item.members[1]._id}, (err, doc) => {
                                jsonArr.push({
                                    id: doc._id,
                                    name: doc.name,
                                    email: doc.email,
                                    lastMessage: item.lastMessage
                                })
                                resolve()
                            })
                        }))
                    } else {
                        promises.push(new Promise(async (resolve, reject) => {
                            await User.findById({_id: item.members[0]._id}, (err, doc) => {
                                jsonArr.push({
                                    id: doc._id,
                                    name: doc.name,
                                    email: doc.email,
                                    lastMessage: item.lastMessage
                                })
                                resolve()
                            })

                        }))
                    }
                }

                await Promise.all(promises)
                    .then(() => {
                        io.to(fromUser.socketId).emit("get conversation", JSON.stringify(jsonArr))
                    })
            }

        })


        socket.on("get messages" , async (toId) => {
            const fromId = jwt.verify(socket.handshake.auth.token, config.get("jwtSecret")).userId
            const fromUser = await User.findById({_id: fromId})

            await Conversation.findOne({members: {"$all": [{_id: fromId}, {_id: toId}]} }, (err, doc) => {
                if (!doc) {
                    return
                }

                const arrMessage = []
                doc.messages.forEach(item => {
                    arrMessage.push({
                        value: item.value,
                        date: item.date,
                        from: item.from,
                        _id: item._id
                    })
                })
                const messages = JSON.stringify(arrMessage)
                io.to(fromUser.socketId).emit("get messages", messages)
            })

        })


        socket.on("send message", async (json) => {
            const {toId, message} = JSON.parse(json)
            const fromId = jwt.verify(socket.handshake.auth.token, config.get("jwtSecret")).userId

            const fromUser = await User.findById({_id: fromId})
            const toUser = await User.findOne({_id: toId})

            let flagHaveDialog = false
            let idConversation = null

            if (fromUser.conversationList) {
                fromUser.populated("conversationList")
                await fromUser.populate("conversationList")
                    .execPopulate()
                for (let i = 0; i< fromUser.conversationList.length; i++) {
                    if ((JSON.stringify(fromUser.conversationList[i].members[0]._id) === JSON.stringify(fromUser._id) && JSON.stringify(fromUser.conversationList[i].members[1]._id) === JSON.stringify(toUser._id))
                        || (JSON.stringify(fromUser.conversationList[i].members[1]._id) === JSON.stringify(fromUser._id) && JSON.stringify(fromUser.conversationList[i].members[0]._id) === JSON.stringify(toUser._id))) {
                        flagHaveDialog = true
                        idConversation = fromUser.conversationList[i]._id
                    }

                }
            }

            let conversation
            let date = null
            let messageId = ""

            if (!flagHaveDialog) {

                conversation = new Conversation({
                    members: [{_id: fromId}, {_id: toId}]
                })
                await conversation.save()


                await fromUser.conversationList.push(conversation._id)
                await toUser.conversationList.push(conversation._id)
                await fromUser.save()
                await toUser.save()

                date = Date.now()
                await conversation.messages.push({
                    value: message,
                    from: fromId,
                    date: date
                })
                conversation.lastMessage = message
                messageId = conversation.messages[conversation.messages.length - 1]._id
                await conversation.save()

                const newConversationFrom =  JSON.stringify( {id: toUser.id, name: toUser.name, email: toUser.email})
                const newConversationTo =  JSON.stringify( {id: fromUser.id, name: fromUser.name, email: fromUser.email})
                io.to(fromUser.socketId).emit("new conversation", newConversationFrom)
                io.to(toUser.socketId).emit("new conversation", newConversationTo)
            } else {
                date = Date.now()
                await Conversation.findById({_id: idConversation}, async (err, doc) => {
                    doc.messages.push({
                        value: message,
                        from: fromId,
                        date: date
                    })
                    doc.lastMessage = message
                    messageId = doc.messages[doc.messages.length - 1]._id

                    await doc.save()
                })


            }

            const str = JSON.stringify({value: message, date, from: fromId, _id: messageId})
            io.to(fromUser.socketId).emit("new message", str)
            if (toUser.socketId !== null) {
                io.to(toUser.socketId).emit("new message", str)
            }
        })


        socket.on("disconnect", async () => {
            if (socket.handshake.auth.token) {
                const senderId = jwt.verify(socket.handshake.auth.token, config.get("jwtSecret"))
                await User.findOneAndUpdate({_id: senderId.userId}, {$set: {socketId: null}}, {useFindAndModify: false})
            }
        })
    })
}

module.exports = createWebsocket