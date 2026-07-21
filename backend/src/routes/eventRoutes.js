const router = require('express').Router()
const { listEvents, getEvent, getMeta } = require('../controllers/eventController')

router.get('/', listEvents)
router.get('/meta', getMeta)       // cities, categories, states for filter UI
router.get('/:id', getEvent)

module.exports = router
