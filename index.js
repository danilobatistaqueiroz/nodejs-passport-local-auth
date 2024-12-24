const passport = require('passport')
var LocalStrategy = require('passport-local')
const express = require('express')
var session = require('express-session')
const app = express()
const bodyParser = require('body-parser')
const {loginPage,logout,home,dashboard,profile}=require('./app')

const db = require('./db')
const auth = require('./auth')

app.use(bodyParser.json())

var SQLiteStore = require('connect-sqlite3')(session);

app.use(session({
  secret: 'keyboard cat',
  resave: false, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
  store: new SQLiteStore({ db: 'sessions.db', dir: './var/db' })
}))

app.use(passport.authenticate('session', { successRedirect: '/', failureRedirect: '/login' }));

app.use(function(req, res, next) {
  var msgs = req?.session?.messages || [];
  res.locals.messages = msgs;
  res.locals.hasMessages = !! msgs.length;
  req.session.messages = [];
  next();
})

passport.serializeUser(function(user, done) {
  done(null, {id: user.id, username: "joke"});
});

passport.deserializeUser(function(user, done) {
  let err = null;
  if(user.id!=1) err="invalid user"
  done(err, user);
});


passport.use(new LocalStrategy(auth.verify))

const checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) { return next() }
  res.redirect("/usuario/login")
}

app.use(auth.printData)

app.get('/usuario/login', loginPage)

//** username e password devem ser passados no body como json */
app.post('/usuario/login', passport.authenticate('local', {
  successReturnToOrRedirect: '/',
  failureRedirect: '/usuario/login',
  failureMessage: true
}))

app.get('/dashboard', checkAuthenticated, dashboard)
app.get('/', checkAuthenticated, home)
app.get('/profile', checkAuthenticated, profile)
app.post('/usuario/logout', logout)

app.listen(3000, () => console.log(`app is now running on port 3000`))
