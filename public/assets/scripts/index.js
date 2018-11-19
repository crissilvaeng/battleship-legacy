const one = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
]

const two = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
]

const battle = window.location.pathname
const socket = io()

socket.emit('battle.join', { battle })
socket.on('battle.offensive', target => {
  console.log(target)
})

const getTarget = target => {
  const [_, position] = target.split('-')
  const value = parseInt(position)
  const row = parseInt(value / 10)
  const column = parseInt(value % 10)
  return { row, column, positon: `one-${position}` }
}

const onClickHandler = event => {
  onPositionClick.play()
  const target = getTarget(event.target.id)
  socket.emit('battle.offensive', { battle, target })
}

const onPositionHover = document.getElementById('on-position-hover')
const onPositionClick = document.getElementById('on-position-click')

const [...positions] = document.getElementsByClassName('position player-two default')
positions.forEach(position => position.onmouseenter = () => onPositionHover.play())

const [...opponent] = document.getElementsByClassName('position player-two')
opponent.forEach(position => position.onclick = onClickHandler)
