require('dotenv').config({ path: './variables.env' })
const path = require('path')
const fs = require('fs')
const express = require('express')
const uuid = require('uuid/v1')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const app = express()

app.set('views', 'views')
app.set('view engine', 'pug')

// create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(express.static(path.join(__dirname, 'styles')))

app.use(methodOverride('_method'))

const colors = [
  'red',
  'blue',
  'green',
  'yellow',
  'purple',
  'orange',
  'pink',
  'teal'
]
const sampleColor = () => {
  const randomIdx = Math.floor(Math.random() * colors.length)
  return colors[randomIdx]
}
const addColorToReq = (req, res, next) => {
  if (req.colors instanceof Array) {
    req.colors.push(sampleColor())
  } else {
    req.colors = [sampleColor()]
  }
  next()
}

app.get(
  '/three-colors',
  addColorToReq,
  addColorToReq,
  addColorToReq,
  (req, res) => {
    res.end(req.colors.join(', '))
  }
)

app.get('/', (req, res) => {
  // synchronous method to read in the file. Bad! We'll replace...
  const blogArray = JSON.parse(fs.readFileSync('./seeds/blogs.json', 'utf-8'))
  res.render('index', {
    blogs: blogArray
  })
})

app.get('/new', (req, res) => {
  res.render('new')
})

app.get('/:blogId', (req, res) => {
  const blogId = req.params.blogId
  const blogArray = JSON.parse(fs.readFileSync('./seeds/blogs.json', 'utf-8'))
  const blog = blogArray.filter(blog => blog._id === blogId)[0]
  if (blog !== undefined) {
    res.render('show', { blog })
  } else {
    res.status(404).end('Blog Not Found')
  }
})

app.delete('/:blogId', (req, res) => {
  console.log('in delete')
  const blogId = req.params.blogId
  const blogArray = JSON.parse(fs.readFileSync('./seeds/blogs.json', 'utf-8'))
  const newBlogArray = blogArray.filter(b => b._id !== blogId)

  fs.writeFileSync('./seeds/blogs.json', JSON.stringify(newBlogArray, null, 2))

  res.redirect('/')
})

app.post('/', urlencodedParser, (req, res) => {
  const blogArray = JSON.parse(fs.readFileSync('./seeds/blogs.json', 'utf-8'))
  const newBlog = {
    author: req.body.author || 'anon',
    title: req.body.title || 'BLOG TITLE',
    _id: uuid(),
    body: req.body.blog_body || 'Just blog things',
    updatedAt: Date.now(),
    createdAt: Date.now()
  }
  blogArray.push(newBlog)
  fs.writeFileSync('./seeds/blogs.json', JSON.stringify(blogArray, null, 2))
  res.redirect('/')
})

app.listen(process.env.PORT, () =>
  console.log(`i am listening on ${process.env.PORT}`)
)
