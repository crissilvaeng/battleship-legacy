const express = require('express')
const uuid = require('uuid/v4')
const path = require('path')

const app = express()
const port = process.env.PORT || 3000

app.use('/:game', express.static(path.join(__dirname, 'public')))
app.get('/', (_, res) => res.redirect(`${uuid()}`))

app.listen(port, () => console.log(`Battleship running on  0.0.0.0:${port}!`))
