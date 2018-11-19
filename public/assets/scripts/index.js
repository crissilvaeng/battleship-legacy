const one = [
  [0, 0, 1, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
  [0, 1, 0, 1, 0, 0, 0, 1, 1, 1],
  [0, 1, 0, 1, 0, 0, 0, 0, 0, 1],
  [0, 1, 0, 0, 0, 0, 1, 1, 0, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [0, 1, 1, 1, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 1, 1, 1, 0, 0],
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

const mock = (player, field) => {
  const n = [...Array(10).keys()]
  n.forEach(row => n.forEach(column => {
    if (field[row][column]) {
      const id = `${player}-${row}${column}`
      const position = document.getElementById(id)
      position.classList.remove('water')
      position.classList.add('ship')
    }
  }))
}

mock('one', one)

const onPositionHover = document.getElementById('on-position-hover')
const onPositionClick = document.getElementById('on-position-click')
const onWaterOffensive = document.getElementById('on-water-offensive')

const battle = window.location.pathname
const socket = io()

socket.emit('battle.join', { battle })

socket.on('battle.offensive', ofessive => {
  const row = ofessive.target.row
  const column = ofessive.target.column
  const position = document.getElementById(`one-${row}${column}`)

  if (one[row][column]) {
    return
  }

  one[row][column] = 'W'
  // onWaterOffensive.play() // replace by notification
  position.classList.remove('water')
  socket.emit('battle.report', { battle: ofessive.battle, target: ofessive.target, hit: false })
})

socket.on('battle.report', report => {
  const row = report.target.row
  const column = report.target.column
  const position = document.getElementById(`two-${row}${column}`)

  if (report.hit) {
    return
  }

  one[row][column] = 'W'
  position.classList.remove('water')
  onWaterOffensive.play()
})

const getTarget = target => {
  const [_, position] = target.split('-')
  const value = parseInt(position)
  const row = parseInt(value / 10)
  const column = parseInt(value % 10)
  return { row, column }
}

const onClickHandler = event => {
  onPositionClick.play()
  const target = getTarget(event.target.id)
  socket.emit('battle.offensive', { battle, target })
}

const [...positions] = document.getElementsByClassName('position player-two water')
positions.forEach(position => position.onmouseenter = () => onPositionHover.play())

const [...opponent] = document.getElementsByClassName('position player-two')
opponent.forEach(position => position.onclick = onClickHandler)
