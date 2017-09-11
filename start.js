const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/blog-party-dev', {
  useMongoClient: true,
  promiseLibrary: require('bluebird')
})
const db = mongoose.connection

const app = require('./app')

db.on('error', console.error.bind(console, 'connection error:'))

db.once('open', function() {
  app.listen(3000, function() {
    console.log('listening on 3000')
  })
})
