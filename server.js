const express = require('express')
const bodyParser = require('body-parser')
const routes = require('./routes/index')
const morgan = require('morgan')
const passport = require('passport')
const BasicStrategy = require('passport-http').BasicStrategy

const app = express()

const users = {
  'test': 'test'
  // Basic dGVzdDp0ZXN0
}

passport.use(new BasicStrategy(
  function(username, password, done) {
    const userPassword = users[username]
    if (!userPassword) { return done(null, false) }
    if (userPassword !== password) { return done(null, false) }
    return done(null, username)
  }
))

app.get('/api/auth',
  passport.authenticate('basic', {session: false}),
  function (req, res) {
    res.json({"hello": req.user})
  }
)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.use(routes)

app.use(morgan('dev'))

app.listen(3000, function() {
  console.log('App is running on localhost:3000')
})
