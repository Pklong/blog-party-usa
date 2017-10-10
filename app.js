// LOAD OUR APP CONFIGURATION
require('dotenv').config({ path: './variables.env' })
// SIMPLIFY DIRECTORY PATHS
const path = require('path')
// READ AND WRITE FROM FILES
const fs = require('fs')
// FRAMEWORK FOR BUILDING WEB APPS WITH NODE
const express = require('express')
// GENERATE UNIQUE IDS FOR JSON FILE
const uuid = require('uuid/v1')
// PARSE HTML FORMS
const bodyParser = require('body-parser')
// HTML FORMS PUT & DELETE
const methodOverride = require('method-override')
// LOGGING
const morgan = require('morgan')
// MONGODB ORM
const mongoose = require('mongoose')
// CONNECT TO HOSTED DATABASE
mongoose.connect(`${process.env.DATABASE}`, { useMongoClient: true })

const db = mongoose.connection
db.on('error', err => console.error(err))
// Create Schema and Model once connected
let Blog, blogSchema
db.once('open', () => {
  blogSchema = new mongoose.Schema({
    author: String,
    title: String,
    body: String,
    updatedAt: Date,
    createdAt: Date
  })

  Blog = mongoose.model('Blog', blogSchema)
})

// MAKE THE APP
const app = express()

app.set('views', 'views')
app.set('view engine', 'pug')

// create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({ extended: false })

// LOGGING
app.use(morgan('combined'))
// SERVING STATIC FILES
app.use(express.static(path.join(__dirname, 'styles')))
// PUT & DELETE FOR FORMS
app.use(methodOverride('_method'))

// MIDDLEWARE EXAMPLE
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
// INDEX VIEW
app.get('/', (req, res) => {
  // synchronous method to read in the file. Bad! We'll replace...
  // const blogArray = JSON.parse(fs.readFileSync('./seeds/blogs.json', 'utf-8'))
  Blog.find((err, blogCollection) => {
    if (err) {
      res.status(404).end('something went wrong')
    } else {
      res.render('index', {
        blogs: blogCollection
      })
    }
  })
})

// NEW VIEW
app.get('/new', (req, res) => {
  res.render('new')
})

// SHOW VIEW
app.get('/:blogId', (req, res) => {
  const blogId = req.params.blogId
  // const blogArray = JSON.parse(fs.readFileSync('./seeds/blogs.json', 'utf-8'))
  // let blog
  // for (let i = 0; i < blogArray.length; i++) {
  //   if (blogArray[i]._id === blogId) {
  //     blog = blogArray[i]
  //     break
  //   }
  // }
  // if (blog !== undefined) {
  //   res.render('show', { blog })
  // } else {
  //   res.status(404).end('Blog Not Found')
  // }
  Blog.findById(blogId, (err, blog) => {
    if (err) {
      res.status(404).end('Blog not found')
    } else {
      res.render('show', { blog })
    }
  })
})

// EDIT VIEW
app.get('/:blogId/edit', (req, res) => {
  const blogId = req.params.blogId
  // const blogArray = JSON.parse(fs.readFileSync('./seeds/blogs.json', 'utf-8'))
  // let blog
  // for (let i = 0; i < blogArray.length; i++) {
  //   if (blogArray[i]._id === blogId) {
  //     blog = blogArray[i]
  //     break
  //   }
  // }
  // if (blog !== undefined) {
  //   res.render('edit', { blog })
  // } else {
  //   res.status(404).end('Blog Not Found')
  // }

  Blog.findById(blogId, (err, blog) => {
    if (err) {
      res.status(404).end('Blog not found')
    } else {
      res.render('edit', { blog })
    }
  })
})

// DELETE ACTION
app.delete('/:blogId', (req, res) => {
  const blogId = req.params.blogId
  // const blogArray = JSON.parse(fs.readFileSync('./seeds/blogs.json', 'utf-8'))
  // const newBlogArray = blogArray.filter(b => b._id !== blogId)

  // fs.writeFileSync('./seeds/blogs.json', JSON.stringify(newBlogArray, null, 2))

  Blog.deleteOne({ _id: blogId }, () => {
    res.redirect(303, '/')
  })
})

// UPDATE ACTION
app.put('/:blogId', urlencodedParser, (req, res) => {
  const blogId = req.params.blogId
  // const blogArray = JSON.parse(fs.readFileSync('./seeds/blogs.json', 'utf-8'))
  // let blog, blogIdx
  // for (let i = 0; i < blogArray.length; i++) {
  //   if (blogArray[i]._id === blogId) {
  //     blog = blogArray[i]
  //     blogIdx = i
  //     break
  //   }
  // }
  // if (blog !== undefined) {
  //   const { author, title, blog_body: body } = req.body
  //   const updatedBlog = Object.assign({}, blog, {
  //     author,
  //     title,
  //     body,
  //     updatedAt: Date.now()
  //   })
  //   blogArray[blogIdx] = updatedBlog
  //   fs.writeFileSync('./seeds/blogs.json', JSON.stringify(blogArray, null, 2))
  //   res.redirect(303, '/')
  // } else {
  //   res.status(404).end('Blog Not Found')
  // }
  const { author, title, blog_body: body } = req.body
  Blog.findByIdAndUpdate(
    blogId,
    { author, title, body, updatedAt: Date.now() },
    err => {
      if (err) {
        res.status(404).end('Blog not found')
      } else {
        res.redirect(303, '/')
      }
    }
  )
})

// CREATE ACTION
app.post('/', urlencodedParser, (req, res) => {
  // const blogArray = JSON.parse(fs.readFileSync('./seeds/blogs.json', 'utf-8'))
  // const newBlog = {
  //   author: req.body.author || 'anon',
  //   title: req.body.title || 'BLOG TITLE',
  //   _id: uuid(),
  //   body: req.body.blog_body || 'Just blog things',
  //   updatedAt: Date.now(),
  //   createdAt: Date.now()
  // }
  // blogArray.push(newBlog)
  // fs.writeFileSync('./seeds/blogs.json', JSON.stringify(blogArray, null, 2))
  Blog.create(
    {
      author: req.body.author || 'anon',
      title: req.body.title || 'blog title',
      body: req.body.blog_body || 'blog body',
      updatedAt: Date.now(),
      createdAt: Date.now()
    },
    (err, blog) => {
      if (err) {
        res.status(404).end('something went wrong')
      } else {
        res.redirect(303, '/')
      }
    }
  )
})

app.listen(process.env.PORT, () =>
  console.log(`i am listening on ${process.env.PORT}`)
)
