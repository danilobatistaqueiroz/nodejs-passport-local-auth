const passport = require('passport')
var LocalStrategy = require('passport-local')
const express = require('express')
var session = require('express-session')
const app = express()
const bodyParser = require('body-parser')
const {loginPage,login,logout,home,dashboard,profile}=require('./app')

const db = require('./db')

app.use(bodyParser.json())

var SQLiteStore = require('connect-sqlite3')(session);

app.use(session({
  secret: 'keyboard cat',
  resave: false, // don't save session if unmodified
  saveUninitialized: true, // don't create session until something stored
  cookie: { secure: true },
  store: new SQLiteStore({ db: 'sessions.db', dir: './var/db' })
}))

//app.use(passport.initialize()) 
//app.use(passport.session());


function verify(username, password, done) {
  console.log("username",username);
  let err = null;
  if(!username || username.length === 0) err = 'Username not provided'
  if(username.length < 3) err = 'Username minimum length must be at least 3 characters'
  if(!password || password.length === 0) err = 'Password not provided'
  if(password.length < 8) err = 'Password minimum length must be at least 8 characters'
  console.log("err",err)
  if (err) return done(err)
  if (!(username=="joke" && password=="joke123456")) {
    return done(null, false, { message: 'Incorrect username or password.' });
  }
  return done(null, {username:"joke",id:"1"});
}


passport.use(new LocalStrategy(verify))

passport.serializeUser(function(user, done) {
  done(null, {id: user.id, username: "joke"});
});

passport.deserializeUser(function(user, done) {
  let err = null;
  if(user.id!=1) err="invalid user"
  done(err, user);
});

app.use(function(req, res, next) {
  var msgs = req?.session?.messages || [];
  res.locals.messages = msgs;
  res.locals.hasMessages = !! msgs.length;
  req.session.messages = [];
  next();
})

const checkAuthenticated = (req, res, next) => {
  //console.log(req.isAuthenticated(), req.session.passport?.user)
  if (req.isAuthenticated()) { return next() }
  res.redirect("/usuario/login")
}


app.get('/usuario/login', loginPage)

//** username e password devem ser passados no body como json */
app.post('/usuario/login', passport.authenticate('local',
{
  successRedirect: '/profile',
  failureRedirect: '/usuario/login',
}))

app.get('/dashboard', checkAuthenticated, dashboard)
app.get('/', home)
app.post('/usuario/logout', logout)

app.get('/profile', profile)

app.listen(3000, () => console.log(`app is now running on port 3000`))
