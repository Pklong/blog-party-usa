# Blog Party USA

This project will provide an introduction to Express and server-side rendering using the JS templating engine Pug. We'll use [Node], [Express], and [MongoDB] to build an application that allows users to view and create blog posts.

[Node]: https://nodejs.org/en/about/
[Express]: http://expressjs.com/
[MongoDB]: https://www.mongodb.com/what-is-mongodb

## Getting Started

`npm install express` as a dependency and `nodemon` as a devDependency.

### [Dependency vs. DevDependency](https://stackoverflow.com/a/22004559/4462871) :confused:

## Hello Express

Make an `app.js` file and require `express` at the top. Invoke the default export with no arguments and save the result to a variable. This will be your `app` object, which has methods for routing, middleware, registering templates and rendering views.

### [app.METHOD](http://expressjs.com/en/api.html#app.METHOD)

We can route HTTP requests in our app using the following structure:

```javascript

app.HTTPVerb(
    "path/being/visited", 
    function middlewareCB (requestObject, responseObject) {
        // form server response
    }
)
    

```

The second argument, represented as `middlewareCB`, is very flexible. We'll start simple. The [response] object provides many useful methods. Pass a string to its [end] method. We've now completed a very basic web application that will respond with the given string whenever we visit the path provided as the first argument.

We need to tell this application on which port it should [listen] for incoming requests. I chose 3000.

Putting it all together...

```javascript

const express = require('express')
const app = express()

app.get('/', (req, res) => res.end('hey what is good?'))

app.listen(3000, () => console.log('i am listening on port 3000'))

```

Let's update our package.json's `scripts` property to have a key of `start` pointing to `nodemon app.js`. This will allow us to use `npm start` to run our application with `nodemon`, which prevents the need to restart the server every time we make changes.

`npm start` and visit `localhost:3000` in your browser. Cool!

#### Logging

It's helpful to have a log of the requests your server is processing. There are many options, but I chose [morgan]. Install as a devDependency, require the library in `app.js` and `app.use` the logger.

[morgan]: https://github.com/expressjs/morgan

### Environment configuration

`npm install dotenv`

We wrote the PORT directly into our code, but it's preferable to separate environment configuration. Use [dotenv] to inject our `PORT` variable into an `variables.env` file. Later, we'll use this file to store details about our database.

## First Template

Use [app.set] to configure the settings of our application. We'll set the `views` directory and the `view engine`to `pug`. Do this before the routing logic.

Create a `views` directory and make a `hello.pug` file. [Pug] is a JS templating library which uses indentation to denote the HTML structure. Variables can be passed in and interpolated with the `=` sign. Here's an example:

```yaml
html
  head
    title Example Title
  body
    main
      h1 I'll be an h1 tag with this text
      h3= variablePassedToTemplate
      p.alert Here's a body of text with the class 'alert'
      .action divs are so common that you can just write the class!

```

Change the callback to your `/` route so your `res` object will now [render] the `hello` file. You don't need to specify the `views` directory or the `.pug` extension since you set that earlier.
Try passing in different variables as an object in `render`'s optional second argument. 

### A Proper Layout

Views are great, but we don't want to write necessary elements of an HTML page for each route. Things like `<!DOCTYPE>`, `<html>`, etc. will be rendered for every route, so let's extract those into a `layout.pug`. This will serve a similar purpose to Rails' `application.html.erb`. Check out the [pug docs] for guidance on how to get started.

Once you're able to render the `index` view as a `block` within `layout.pug`, let's mix in some CSS! In `layout.pug`, you'll need to add a `link` tag with `rel` and `href` attributes. How does one implement [HTML attributes in Pug]? Docs to the rescue!

We'll also need to tell Express how to deliver these [static assets] (our CSS in this case). Don't move forward until you're able to load some CSS on the page.


[pug docs]: https://pugjs.org/language/inheritance.html

[HTML attributes in Pug]: https://pugjs.org/language/attributes.html

[static assets]: http://expressjs.com/en/starter/static-files.html

## Building Our Routes

Before we introduce MongoDB, let's use a file as our database. Make some dummy data to populate your views in a `db.json` file. Use Node's `fs` module to read and write to this single file. We wouldn't use a file as a database for any application with multiple users (why would that be?), but this will allow us to focus on routing and views for a little bit longer.

```javascript
// sample blog post
{
    author: "Danielle Avocado",
    id: Math.floor(Math.random(1000000)),
    title: "My first post",
    body: "I sure do love blogging"
    updatedAt: Date.now(),
    createdAt: Date.now()
}

```

Build routes for an `index`, `show`, `create`, `update`, and `delete`. Here's how your index view might look:

```javascript
// grab the array of blog posts from a file
const blogFile = fs.readFileSync('./seeds/blogs.json', 'utf-8')
const blogArray = JSON.parse(blogFile)

app.get('/', (req, res) =>
  res.render('index', {
    blogs: blogArray
  })
)

```

We'll need to start accessing params in our url in order to handle the `show`, `update`, and `delete` actions. Give the below example a try with a few different strings and numbers to see what is displayed.

```javascript

// the colon indicates this is a url parameter
app.get('/:info', (req, res) => {
    // we have access to the params in our request object
    res.end(req.params.info)
    }
)

```


Certain actions won't require a view. For example, your `new` route will render the form to create a blog, but the submitted form's `POST` request will only create the blog. For deleting, updating, or editing, you'll want to [redirect] the user once you've made the appropriate change to your database file. We'll also need to introduce new middleware to parse the data from submitted forms. Check out the [body parser] docs! Finally, I added [uuid] as a dependency to generate `_id`'s for blogs...

### HTML Forms: PUT, & DELETE

HTML forms are only able to make `post` or `get` requests. This puts us in a bind for our `update` and `destroy` routes, as these require the HTTP verbs `put` and `delete` respectively. We could make routes that listen for `get` requests with paths that correspond to deletion, but let's keep things RESTful. Install the [method override] library; I picked the strategy using [query values].

[method override]: https://github.com/expressjs/method-override
[query values]: https://github.com/expressjs/method-override#override-using-a-query-value

### Middleware Detour

Until now, we've had a single callback as the second argument to be invoked when our defined route is hit. Express allows us to define an arbitrary number of middleware callbacks which we pipe together using a third argument `next`. This enables us to write tightly focused middleware that is easily composed. Here's a silly example to try out:

```javascript

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
  // check if this is the first time middleware is invoked
  if (req.colors instanceof Array) {
    // previous middleware has set a 'colors' property
    // Note: It's the same request object!
    req.colors.push(sampleColor())
  } else {
    req.colors = [sampleColor()]
  }
  // invoking next ensures our following middleware will be run
  next()
}

// we could also pass an array containing all middlewares as our second argument. Try it!
app.get(
  '/three-colors',
  addColorToReq,
  addColorToReq,
  addColorToReq,
  (req, res) => {
    res.end(req.colors.join(', '))
  }
)

```

Install [body parser] and pass it as a middleware to routes where you handle form input.

[redirect]: http://expressjs.com/en/api.html#res.redirect
[body parser]: https://github.com/expressjs/body-parser
[uuid]: https://www.npmjs.com/package/uuid


### Mixins

You'll notice there's repetition in how blogs are displayed on the page and the forms used to create / edit a blog. This is a great time to introduce [mixins]! Mixins should feel like using Rails partials. To use a mixin in your pug views, you'll need to [include] that mixin. Extract the code you've been using to display your blog posts and bask in this refactored code.

## Connecting MongoDB

At this point, we have a fully functioning REST app using a json file as a database. We'll now swap out the logic that involves reading and writing to that file and replace it with equivalent calls to MongoDB, a noSQL database.

### Database as a Service (DBaaS)

There are a few ways we can run an instance of MongoDB. We can host our own local database, similar to how we've used Postgres with our Rails apps locally, or we can offload that work to someone else, similar to how we make use of Heroku. We'll use a service called [mLab] to host our MongoDB instance. Sign up for a new account and create a new database instance. Choose the AWS free sandbox option. Once you've created an instance, you'll need to create a `User` for that instance, this acts as your application's representative for reading and writing to the database instance. You'll be asked to create a username and password for this `Database User`. You should find instructions on the page about assembling your [connection string] with this User. Here's an example:

```
database username: Sennacy
database password: catnip
database instance name: blog-party-dev

mongodb://<dbuser>:<dbpassword>@ds113795.mlab.com:13795/<dbinstance>

becomes

mongodb://Sennacy:catnip@ds113795.mlab.com:13795/blog-party-dev

```

Store this connection string under `DATABASE` in your `variables.env` file.

### Introducing Mongoose

We'll use [Mongoose] to interact with our hosted MongoDB instance. [Mongoose] is an Object-Modeling library for MongoDB which will simplify our interactions with the database, much like ActiveRecord simplifies our interactions in Rails. `npm install mongoose`. Require it at the top of your `app.js` file and use your connection string...

```javascript
const mongoose = require('mongoose')
mongoose.connect("connection string from your configuration")

// If you see a deprecation warning in the console... 
// http://mongoosejs.com/docs/connections.html#use-mongo-client

const db = mongoose.connection
db.on('error', (err) => {console.error(err)})
db.once('open', function() {
  console.log('it works!')
})

```

#### Defining the Schema

MongoDB collections (noSQL's version of tables) are mapped to a schema which we define using Mongoose. A new Schema is created for each collection which we wish to represent in our application. The Schema function is invoked with an object that contains the properties of our collection and their respective types. Here's an example...

```javascript

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    name: String,
    age: Number
})

```

Check out the mongoose [guide] for more information. The `blogSchema` properties will be almost identical to your json file, except we won't need to define the `_id` property ourselves.

#### Compiling our Model

Once you've created a `blogSchema`, we'll invoke the `mongoose.model` function to create our models. These models will be our way our interacting with the underlying mongoDB collections. Here's an example...

```javascript

// create our model
const User = mongoose.model('User', userSchema)

// create an unsaved instance of our model
const sennacy = new User({name: "Sennacy", age: 11})

// asynchronously save our instance
sennacy.save(function(err) {
  if (err) {
    console.log(err)
  } else {
    console.log("sennacy has been saved!")
  }
})

// alternatively...

User.create({name: "Wampus", age: 14}, function(err) {
  if (err) {
    console.log('oh no!')
  } else {
    console.log('instance saved!')
  }
})

```

It's important to note that all *interactions with our database will be asynchronous*. The above example uses callbacks, and promises or async/await are also supported. You'll need to connect Node's Promises to Mongoose if you're interested in using promises instead of callbacks. [Read more here].

[read more here]: http://mongoosejs.com/docs/promises.html

Here's an example of querying...

```javascript

// query model and pass results to second argument callback
User.find({name: "Wampus"}, function(err, docs) {
    console.log(docs)
})
```

Further information is available in the [documentation].

#### Inspecting our collections

We'll use a GUI provided by MongoDB to inspect our database instance. Download [Compass] and install it on your computer. Copy the database connection string in your `variables.env` and Compass will detect the string when it loads. You should be able to automatically fill all the fields and continue. Your database will now be available to view, though there's nothing to see yet!

#### Replacing json with MongoDB

Go back through your routes and replace the logic of reading and writing to the json file with reading and writing to your `Blog` model. Lean heavily on the mongoose documentation for models here. Remember that all operations will be asynchronous, so you'll build the `response` objects in success callbacks. Here's an example of how an index view might look...


```javascript

app.get('/', (req, res) => {
    // return all documents in collection
    User.find(function(err, users) {
      if (err) {
        // there was an error retrieving the documents
        res.status(500).end('something bad happened')
      } else {
        // pass the retrieved documents to our Pug view
        res.render('index', { users })
      }
    })
})


```

### Finishing up

Congratulations, you've created a Node application with full CRUD functionality backed by MongoDB! Here are some ideas for improvements:

* Refactor so the entire app isn't in a single file
  * Organize functionality, have a controller directory, a views directory, a models directory, etc.
* Implement user authentication
  * Check out [Passport.js]
* Explore more complex queries 
  * Allow users to see 5 most recent posts
  * Add tagging to blogs

[connection string]: https://docs.mongodb.com/v3.2/reference/connection-string/
[mLab]: https://mlab.com/
[mixins]: https://pugjs.org/language/mixins.html
[include]: https://pugjs.org/language/includes.html
[app.set]: https://expressjs.com/en/4x/api.html#app.set
[Pug]: https://pugjs.org/api/getting-started.html
[response]: http://expressjs.com/en/4x/api.html#res.render
[end]: http://expressjs.com/en/4x/api.html#res.end
[listen]: http://expressjs.com/en/4x/api.html#app.listen
[dotenv]: https://www.npmjs.com/package/dotenv
[render]: http://expressjs.com/en/4x/api.html#res.render
[Mongoose]: http://mongoosejs.com/
[guide]: http://mongoosejs.com/docs/guide.html
[documentation]: http://mongoosejs.com/docs/api.html#model_Model.find
[Compass]: https://www.mongodb.com/products/compass
[Passport.js]: http://passportjs.org/

