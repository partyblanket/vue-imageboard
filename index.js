const express = require('express')

const db = require('./db')

const app = express()

const PORT = 8080

app.use(express.static('./public'))

app.use(require('body-parser').json())

app.get('/content', (req,res) => {
    db.load().then(({rows}) => res.json(rows))
})

app.listen(PORT, () => console.log(`listening to port ${PORT}`))
