const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)

const path = require('path')
const uuid = require('uuid/v4')

const port = process.env.PORT || 3000

app.use('/:game', express.static(path.join(__dirname, 'public')))
app.get('/', (_, res) => res.redirect(`${uuid()}`))

io.on('connection', socket => {
  socket.on('battle.join', ({ battle }) => socket.join(battle))

  socket.on('battle.offensive', offensive =>
    socket.to(offensive.battle).emit('battle.offensive', offensive))

  socket.on('battle.report', report =>
    socket.to(report.battle).emit('battle.report', report))
})

http.listen(port, () => console.log(`Battleship running on  0.0.0.0:${port}!`))
