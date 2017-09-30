require('dotenv').config()

const express = require('express')
const app = express()

app.get('/', (req, res) => res.end('hey what is good?'))
app.listen(process.env.PORT, () =>
  console.log(`i am listening on ${process.env.PORT}`)
)
