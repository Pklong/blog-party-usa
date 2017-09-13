const mongoose = require('mongoose')
mongoose.Promise = global.Promise
const Schema = mongoose.Schema

const blogSchema = new Schema({
  title: String,
  author: String,
  body: String,
  tags: [String],
  date: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Blog', blogSchema)
