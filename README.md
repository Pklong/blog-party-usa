# Blog Party USA

This project will provide an introduction to Express and server-side rendering using the JS templating engine Pug. We'll use [Node], [Express], and [MongoDB] to build an application that allows users to view and create blog posts.

[Node]: https://nodejs.org/en/about/
[Express]: http://expressjs.com/
[MongoDB]: https://www.mongodb.com/what-is-mongodb

## Getting Started

npm install express as a dependency and nodemon as a devDependency.

### [Dependency vs. DevDependency](https://stackoverflow.com/a/22004559/4462871) :confused:

## Hello Express

Make an `app.js` file and require `express` at the top. Express will export as default a function which takes no arguments and returns our app object where we will define various properties.

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

We'll need to start handling params in our url in order to handle the `show`, `update`, and `delete` actions. Give the below example a try with a few different strings and numbers to see what is displayed.

```javascript

// the colon indicates this is a url parameter
app.get('/:info', (req, res) => {
    // we have access to the param in our request object
    res.end(req.param.info)
    }
)

```


Certain actions won't require a view. For deleting, updating, or editting, you'll want to [redirect] the user once you've made the appropriate change to your database file. The `index` view is a great choice!

[redirect]: http://expressjs.com/en/api.html#res.redirect


### Mixins

You'll notice there's repetition in how blogs are displayed on the page. This is a great time to introduce [mixins]! Mixins should feel like using Rails partials. Extract the code you've been using to display your blog posts and bask in this refactored code.



[mixins]: https://pugjs.org/language/mixins.html

[app.set]: https://expressjs.com/en/4x/api.html#app.set
[Pug]: https://pugjs.org/api/getting-started.html
[response]: http://expressjs.com/en/4x/api.html#res.render
[end]: http://expressjs.com/en/4x/api.html#res.end
[listen]: http://expressjs.com/en/4x/api.html#app.listen
[dotenv]: https://www.npmjs.com/package/dotenv
[render]: http://expressjs.com/en/4x/api.html#app.render


