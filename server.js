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

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.use(function(req, res, next) {
  res.contentType('application/json')
  next()
})

app.use('/api', routes)

app.use(morgan('dev'))

app.listen(3000, function() {
  console.log('App is running on localhost:3000')
})
