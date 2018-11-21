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

let playerField = new Array(100).fill(0)
let turnFlag = ''

const displayFleet = (field) => {
  field.forEach((value, index) => value === 1 && addShipIn(q(`#one-${index}`)))
}

const battle = window.location.pathname
const socket = io()

socket.emit('battle.join', { battle })

socket.on('battle.offensive', ({ battle, target, flag }) => {
  const position = q(`#one-${target}`)

  play(audios.onNotification)

  if (playerField[target] === 1) {
    playerField[target] = 'X'
    hitShipIn(position)
    socket.emit('battle.report', { battle, target, flag, movement: 'report', result: true })
    return
  }

  playerField[target] = 'O'
  hitWaterIn(position)
  socket.emit('battle.report', { battle, target, flag, movement: 'report', result: false })
})

socket.on('battle.report', ({ battle, target, flag, result }) => {
  const position = q(`#two-${target}`)

  q('#stats-flag').classList.add('hide')
  turnFlag = ''
  socket.emit('turn.change', { battle })

  if (result) {
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

socket.on('game.start', ({ field, flag }) => {
  play(audios.onNotification)
  playerField = field
  displayFleet(field)
  
  if (flag) {
    q('#stats-flag').classList.remove('hide')
    turnFlag = flag
  }
})

socket.on('turn.change', ({ flag }) => {
  play(audios.onNotification)
  q('#stats-flag').classList.remove('hide')
  turnFlag = flag
})

const getTarget = target => {
  const [_, position] = target.split('-')
  return parseInt(position)
}

const onClickHandler = event => {
  play(audios.onClick)
  const target = getTarget(event.target.id)
  socket.emit('battle.offensive', { 
    battle: battle,
    movement: 'attack',
    flag: turnFlag,
    target: target
  })
}

const [...positions] = qs('position player-two water')
positions.forEach(position => position.onmouseenter = () => play(audios.onHover))

const [...opponent] = qs('position player-two')
opponent.forEach(position => position.onclick = onClickHandler)
