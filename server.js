const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)

const path = require('path')
const uuid = require('uuid/v4')

const port = process.env.PORT || 3000

app.use('/:game', express.static(path.join(__dirname, 'public')))
app.get('/', (_, res) => res.redirect(`${uuid()}`))

io.on('connection', (socket) => {
  socket.on('battle.join', ({ battle }) => socket.join(battle))

  socket.on('battle.offensive', ({ battle, target }) =>
    socket.to(battle).emit('battle.offensive', target))
})

http.listen(port, () => console.log(`Battleship running on  0.0.0.0:${port}!`))
