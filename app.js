const express = require("express")
const config = require("config")
const mongoose = require("mongoose")

const app = express()

app.use(express.json({extended: true}))

app.use('/api/auth', require('./routes/auth.routes'))

const PORT = config.get("port") || 5000

async function start() {
    try {
        await mongoose.connect(config.get("MongoURI"), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })
        app.listen(5000, () => {
            console.log(`App has been started on port ${PORT}...`)
        })

    } catch (e) {
        console.log(`Server error ${e.message}`)
        process.exit(1)
    }
}

start()

const http = require("http")

const server = http.createServer(app)


const io = require("./websocket/websocket")
io(server)


const WEBSOCKET_PORT = config.get("portSocketServer") || 8999


server.listen(WEBSOCKET_PORT, () => {
console.log("websocket server has been started on port ", WEBSOCKET_PORT)
})