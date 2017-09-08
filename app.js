const express = require('express')
const app = express()
app.set('views', './views')
app.set('view engine', 'pug')

app.get('/', (req, res) => {
  res.render('index', { title: 'Very Nice', message: 'Bloggin' })
})

app.listen(3000, () => {
  console.log('listening on 3000')
})
