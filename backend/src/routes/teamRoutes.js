const router = require('express').Router()
const requireAuth = require('../middleware/requireAuth')
const requireRole = require('../middleware/requireRole')
const {
  listTeam,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
} = require('../controllers/teamController')

// Public
router.get('/', listTeam)

// Admin only
router.post('/', requireAuth, requireRole('admin'), createTeamMember)
router.patch('/:id', requireAuth, requireRole('admin'), updateTeamMember)
router.delete('/:id', requireAuth, requireRole('admin'), deleteTeamMember)

module.exports = router
