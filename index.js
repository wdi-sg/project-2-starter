require('dotenv').config({ silent: true })

// Heroku check
const dbUrl =
process.env.NODE_ENV === 'production' ? process.env.MLAB_URI : 'mongodb://localhost/itinerary'
const port = process.env.PORT || 7000 // this is for our express server

// installing all modules
const express = require('express')
const mongoose = require('mongoose') // for DB
const path = require('path') // for Public files
const exphbs = require('express-handlebars') // for Handlebars
const bodyParser = require('body-parser') // for accessing POST request
const methodOverride = require('method-override') // for accessing PUT / DELETE

// UPDATE 23 Oct
const session = require('express-session') // to create session and cookies
const MongoStore = require('connect-mongo')(session) // to store session into db
const passport = require('./config/ppConfig') // to register passport strategies
const { hasLoggedOut, isLoggedIn } = require('./helpers')

// Models
const User = require('./models/user')

// require all my route files
const register_routes = require('./routes/register_routes')
const login_routes = require('./routes/login_routes')

const app = express()

// VIEW ENGINES aka handlebars setup
app.engine('handlebars', exphbs({ defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

// MIDDLEWARES
app.use(express.static(path.join(__dirname, 'public')))
app.use(function (req, res, next) {
  console.log('Method: ' + req.method + ' Path: ' + req.url)
  next()
})

// setup bodyParser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))
// setup methodOverride
app.use(methodOverride('_method'))

// connecting to mongodb before we starting the server
mongoose.Promise = global.Promise
mongoose.connect(dbUrl, {
  useMongoClient: true
})
.then(
  () => { console.log('db is connected') },
  (err) => { console.log(err) }
)

// MUST BE AFTER YOUR `mongoose.connect`
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  // store this to our db too
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}))

// PASSPORT ACTIVATED
app.use(passport.initialize())
app.use(passport.session())

app.use((req, res, next) => {
  app.locals.user = req.user // we'll only `req.user` if we managed to log in
  next()
})

// NEW ROUTE - HOMEPAGE
app.get('/', (req, res) => {
  res.render('home')
})

// NEW ROUTE - LOGOUT
app.get('/logout', hasLoggedOut, (req, res) => {
  req.logout()
  res.redirect('/')
})

// NEW ROUTE - REGISTER
app.use('/register', isLoggedIn, register_routes)
app.use('/login', isLoggedIn, login_routes)

// NEW ROUTE - PROFILE - to show the user profile page
app.get('/profile', hasLoggedOut, (req, res) => {
  res.send(req.user)
})


// opening the port for express
app.listen(port, () => {
  console.log(`Server is running on ${port}`)
})
