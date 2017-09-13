const mongoose = require('mongoose')
require('dotenv').config({ path: 'variables.env' })
mongoose.connect(process.env.DATABASE, {
  useMongoClient: true
})

const app = require('./app')

mongoose.connection.on(
  'error',
  console.error.bind(console, 'connection error:')
)

app.listen(3000, function() {
  console.log('listening on 3000')
})
