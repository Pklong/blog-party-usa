require('dotenv').config({ path: './variables.env' })

const express = require('express')
const app = express()

app.set('views', 'views')
app.set('view engine', 'pug')

app.get('/', (req, res) =>
  res.render('hello', {
    title: 'Blog Party USA',
    blogTitle: 'hello',
    blogBody: 'hey what a cool blog, let us party.'
  })
)
app.listen(process.env.PORT, () =>
  console.log(`i am listening on ${process.env.PORT}`)
)
