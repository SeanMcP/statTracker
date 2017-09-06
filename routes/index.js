const express = require('express')
const passport = require('passport')
const BasicStrategy = require('passport-http').BasicStrategy
const router = express.Router()
const models = require('../models/index')

const sendMessage = function(status, data) {
  let obj = {
    status: status,
    data: data
  }
  return obj
}

router.get('/', passport.authenticate('basic', { session: false }), function(req, res) {
  let str = 'Welcome to Stat Tracker!'
  res.send(sendMessage('success', str))
})

router.get('/auth',
  passport.authenticate('basic', {session: false}),
  function (req, res) {
    res.json({'hello': req.user})
  }
)

// GET	/activities	Show a list of all activities I am tracking, and links to their individual pages
router.get('/activities', passport.authenticate('basic', { session: false }), function(req, res) {
  models.Activity.findAll()
  .then(function(data) {
    res.status(200).send(sendMessage('success', data))
  })
  .catch(function(err) {
    res.status(400).send(sendMessage('fail', err))
  })
})

// POST	/activities	Create a new activity for me to track.
router.post('/activities', passport.authenticate('basic', { session: false }), function(req, res) {

  let newActivity = {
    name: req.body.name,
    unit: req.body.unit
  }

  models.Activity.create(newActivity)
  .then(function(data) {
    res.status(200).send(sendMessage('success', data))
  })
  .catch(function(err) {
    res.status(304).send(sendMessage('fail', err))
  })
})

// GET	/activities/{id}	Show information about one activity I am tracking, and give me the data I have recorded for that activity.
router.get('/activities/:id', passport.authenticate('basic', { session: false }), function(req, res) {
  models.Activity.findOne({
    where: { id: req.params.id },
    include: [{
        model: models.Stat,
        as: 'stats'
    }]
  })
  .then(function(data) {
    res.status(200).send(sendMessage('success', data))
  })
  .catch(function(err) {
    res.status(400).send(sendMessage('fail', err))
  })
})

// PUT	/activities/{id}	Update one activity I am tracking, changing attributes such as name or type. Does not allow for changing tracked data.
router.put('/activities/:id', passport.authenticate('basic', { session: false }), function(req, res) {
  models.Activity.update({
    name: req.body.name,
    unit: req.body.unit
  }, { where: { id: req.params. id } })
  .then(function(data) {
    res.status(200).send(sendMessage('success', data))
  })
  .catch(function(err) {
    res.status(304).send(sendMessage('fail', err))
  })
})

// DELETE	/activities/{id}	Delete one activity I am tracking. This should remove tracked data for that activity as well.
router.delete('/activities/:id', passport.authenticate('basic', { session: false }), function(req, res) {
  models.Stat.destroy({ where: { activityId: req.params.id } })
  .then(function(data) {
    models.Activity.destroy({ where: { id: req.params.id } })
    .then(function(activity) {
      res.status(200).send(sendMessage('success', activity))
    })
    .catch(function(err) {
      res.status(400).send(sendMessage('fail', err))
    })
  })
  .catch(function(err) {
    res.status(400).send(sendMessage('fail', err))
  })
})

// POST	/activities/{id}/stats	Add tracked data for a day. The data sent with this should include the day tracked. You can also override the data for a day already recorded.
router.post('/activities/:id/stats', passport.authenticate('basic', { session: false }), function(req, res) {
  let newStat = {
    activityId: req.params.id,
    measurement: req.body.measurement
  }
  models.Stat.create(newStat)
  .then(function(data) {
    res.status(200).send(sendMessage('success', data))
  })
  .catch(function(err) {
    res.status(304).send(sendMessage('fail', err))
  })
})

// DELETE	/stats/{id}	Remove tracked data for a day.
router.delete('/stats/:id', passport.authenticate('basic', { session: false }), function(req, res) {
  models.Stat.destroy({ where: { id: req.params.id } })
  .then(function(data) {
    res.status(200).send(sendMessage('success', data))
  })
  .catch(function(err) {
    res.status(304).send(sendMessage('fail', err))
  })
})

module.exports = router
