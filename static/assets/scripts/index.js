const [onPositionHover] = document.getElementsByTagName("audio")

const [...positions] = document.getElementsByClassName('position')
positions.forEach(position => position.onmouseenter = () => onPositionHover.play())