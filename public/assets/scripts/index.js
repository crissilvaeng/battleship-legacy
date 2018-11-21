const q = document.querySelector.bind(document)
const qs = document.getElementsByClassName.bind(document)

const play = audio => audio.play()

const audios = {
  onHover: q('#on-position-hover'),
  onClick: q('#on-position-click'),
  onNotification: q('#on-notification-receive'),
  onWater: q('#on-water-offensive'),
  onShip: q('#on-ship-hit')
}

const flipClass = (previous, before) => element => {
  element.classList.remove(previous)
  element.classList.add(before)
}

const addShipIn = position => flipClass('water', 'ship')(position)
const hitShipIn = position => flipClass('ship', 'hit')(position)
const hitWaterIn = position => position.classList.remove('water')

let field = new Array(100).fill(0)

const displayFleet = (field) => {
  field.forEach((value, index) => value === 1 && addShipIn(q(`#one-${index}`)))
}

const battle = window.location.pathname
const socket = io()

socket.emit('battle.join', { battle })

socket.on('battle.offensive', ofessive => {
  const row = ofessive.target.row
  const column = ofessive.target.column
  const position = q(`#one-${row}${column}`)

  play(audios.onNotification)

  if (one[row][column] === 1) {
    one[row][column] = 'X'
    hitShipIn(position)
    socket.emit('battle.report', { battle: ofessive.battle, target: ofessive.target, hit: true })
    return
  }

  one[row][column] = 'O'
  hitWaterIn(position)
  socket.emit('battle.report', { battle: ofessive.battle, target: ofessive.target, hit: false })
})

socket.on('battle.report', report => {
  const row = report.target.row
  const column = report.target.column
  const position = q(`#two-${row}${column}`)

  if (report.hit) {
    hitShipIn(position)
    play(audios.onShip)
    return
  }

  hitWaterIn(position)
  play(audios.onWater)
})

socket.on('battle.stats', stats => {
  const players = q('#stats-players')
  players.textContent = stats.players.length
})

socket.on('game.start', data => {
  console.log(data)
  play(audios.onNotification)
  field = data.field
  displayFleet(field)
  
  if (data.flag) q('#stats-flag').classList.remove('hide')
})

const getTarget = target => {
  const [_, position] = target.split('-')
  const value = parseInt(position)
  const row = parseInt(value / 10)
  const column = parseInt(value % 10)
  return { row, column }
}

const onClickHandler = event => {
  play(audios.onClick)
  const target = getTarget(event.target.id)
  socket.emit('battle.offensive', { battle, target })
}

const [...positions] = qs('position player-two water')
positions.forEach(position => position.onmouseenter = () => play(audios.onHover))

const [...opponent] = qs('position player-two')
opponent.forEach(position => position.onclick = onClickHandler)
