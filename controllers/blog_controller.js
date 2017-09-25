const Blog = require('../models/blog')

module.exports = {
  index: function(req, res) {
    Blog.find().then(blogs => {
      console.log(blogs)
      res.render('index', { blogs })
    })
  },
  create: function(req, res) {
    const blog = new Blog({
      title: req.body.title,
      author: req.body.author,
      body: req.body.body,
      tags: []
    })
    blog.save(function(err, data) {
      if (err) {
        console.log(err)
        res.end('did not work')
      } else {
        res.redirect('/')
      }
    })
  },
  new: function(req, res) {
    res.render('new')
  }
}
