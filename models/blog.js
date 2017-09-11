const mongoose = require('mongoose')
const Schema = mongoose.Schema

const blogSchema = new Schema({
  title: String,
  author: String,
  body: String,
  tags: [{ name: String }],
  date: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Blog', blogSchema)
