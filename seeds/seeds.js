const path = require('path')
const fs = require('fs')
require('dotenv').config({ path: path.join(__dirname, '/../variables.env') })

const mongoose = require('mongoose')

mongoose.connect(process.env.DATABASE, {
  useMongoClient: true
})
mongoose.Promise = global.Promise

const Blog = require('../models/blog')
const blogs = JSON.parse(
  fs.readFileSync(path.join(__dirname, '/blogs.json'), 'utf-8')
)

async function reseed() {
  console.log('removing data...')
  await Blog.remove()
  console.log('removed data')
  console.log('seeding data')
  try {
    await Blog.insertMany(blogs)
    console.log('seeded data')
  } catch (e) {
    console.log('something went wrong')
    console.log(e)
  }
  process.exit()
}

reseed()
