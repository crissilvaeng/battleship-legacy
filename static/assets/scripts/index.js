const onPositionHover = document.getElementById('on-position-hover')
const onPositionClick = document.getElementById('on-position-click')

const [...positions] = document.getElementsByClassName('default')
positions.forEach(position => {
  position.onmouseenter = () => onPositionHover.play()
  position.onclick = () => onPositionClick.play()
})