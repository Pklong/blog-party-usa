const Blog = require('../models/blog')

module.exports = {
  index: function(req, res) {
    Blog.find().then(a => {
      res.json(a)
    })
  }
}
