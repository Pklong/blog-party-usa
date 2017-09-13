const path = require('path')

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const routes = require('./routes/index')

app.set('views', './views')
app.set('view engine', 'pug')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))
app.use('/', routes.blogRouter)

module.exports = app
