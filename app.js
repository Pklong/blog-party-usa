require('dotenv').config({ path: './variables.env' })
const path = require('path')
const fs = require('fs')
const express = require('express')
const app = express()

app.set('views', 'views')
app.set('view engine', 'pug')

app.use(express.static(path.join(__dirname, 'styles')))

app.get('/', (req, res) => {
  // synchronous method to read in the file. Bad! We'll replace soon...
  const blogArray = JSON.parse(fs.readFileSync('./seeds/blogs.json', 'utf-8'))
  res.render('index', {
    blogs: blogArray
  })
})

app.get('/:blogId', (req, res) => {
  res.end(req.params.blogId)
})

app.listen(process.env.PORT, () =>
  console.log(`i am listening on ${process.env.PORT}`)
)
