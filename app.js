const express = require('express')
const app = express()
const routes = require('./routes/index')

app.set('views', './views')
app.set('view engine', 'pug')

app.use('/', routes.blogRouter)

module.exports = app
