const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)

const path = require('path')
const uuid = require('uuid/v4')

const port = process.env.PORT || 3000

const waiting = []

const getBattle = () => {
  if (waiting.length === 0) {
    const battle = uuid()
    waiting.push(battle)
    return battle
  }
  return waiting.pop()
}

app.use('/:game', express.static(path.join(__dirname, 'public')))
app.get('/', (_, res) => res.redirect(`${getBattle()}`))

const getRandomBetween = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min

const getRandomUniq = (min, max, duplicates = []) => {
  const random = getRandomBetween(min, max)
  if (duplicates.length > (max-min) ) return false
  if(duplicates.includes(random) === false) return random
  return getRandomUniq(min, max, duplicates)
}

const getRandomUniques = (min, max, size) => {
  const cells = new Array(size).fill(0)
  return cells.reduce((acc, _) => [...acc, getRandomUniq(min, max, acc)], [])
}

const drawField = (size, ships) => {
  const uniques = getRandomUniques(0, size - 1, ships)
  const field = new Array(size).fill(0)
  return field.reduce((acc, _, idx) =>
    uniques.includes(idx)? [...acc, 1]: [...acc, 0], [])
}

io.on('connection', socket => {
  socket.on('battle.join', ({ battle }) => {
    socket.join(battle)
    io.in(battle).clients((_, clients) => {
      io.in(battle).emit('battle.stats', { players: clients })
      if (clients.length === 2) {
        [playerOne, playerTwo] = clients

        io.to(playerOne).emit('game.start', {
          battle: battle,
          player: playerOne,
          opponent: playerTwo,
          field: drawField(100, 30),
          flag: uuid()
        })

        io.to(playerTwo).emit('game.start', {
          battle: battle,
          player: playerTwo,
          opponent: playerOne,
          field: drawField(100, 30),
          flag: ''
        })
      }
    })
  })

  socket.on('turn.change', ({ battle }) => {
    io.in(battle).clients((_, clients) => {
      const opponent = clients.filter(client => client !== socket.id)
      io.to(opponent).emit('turn.change',  {
        battle: battle,
        flag: uuid()
      })
    })
  })

  socket.on('battle.offensive', offensive =>
    socket.to(offensive.battle).emit('battle.offensive', offensive))

  socket.on('battle.report', report =>
    socket.to(report.battle).emit('battle.report', report))
})

http.listen(port, () => console.log(`Battleship running on  0.0.0.0:${port}!`))
