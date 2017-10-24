const dbUrl =
process.env.NODE_ENV === 'production' ? process.env.MONGODB_URI : 'mongodb://localhost/crane'
const port = process.env.PORT || 5000
require('dotenv').config({ silent: true })

const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const passport = require('./config/ppConfig')

const { hasLoggedOut, isLoggedIn } = require('./helpers')


const register_routes = require('./routes/register_routes')
const login_routes = require('./routes/login_routes')
const profile_routes = require('./routes/profile_routes')
const new_routes = require('./routes/new_routes')

const app = express()

const User = require('./models/user')

app.engine('handlebars', exphbs({ defaultLayout: 'main'}))
app.set('view engine', 'handlebars')
app.use(express.static(path.join(__dirname, 'public')))
app.use(function (req, res, next) {
  // console.log('Method: ' + req.method + ' Path: ' + req.url)
  next()
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

app.use(methodOverride('_method'))

mongoose.Promise = global.Promise
mongoose.connect(dbUrl, {
  useMongoClient: true
})
.then(
  () => { console.log('db is connected') },
  (err) => { console.log(err) }
)

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  // store this to our db too
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}))

app.use(passport.initialize())
app.use(passport.session())

app.use((req, res, next) => {
  app.locals.user = req.user
  next()
})





app.get('/', (req,res) => {
  res.render('home')
})

app.use('/login', isLoggedIn, login_routes)
app.get('/logout', hasLoggedOut, (req, res) => {
  req.logout()
  res.redirect('/')
})
app.use('/register', isLoggedIn, register_routes)
app.use('/profile', hasLoggedOut, profile_routes)
app.use('/new', hasLoggedOut, new_routes)


















app.listen(port, () => {
  console.log(`Server is running on ${port}`)
})
