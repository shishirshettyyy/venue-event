const TeamMember = require('../models/TeamMember')

// ─── Get all team members (public) ────────────────────────────────────────────
async function listTeam(req, res, next) {
  try {
    const members = await TeamMember.find().sort({ order: 1, createdAt: 1 })
    res.json(members)
  } catch (err) {
    next(err)
  }
}

// ─── Admin: create team member ────────────────────────────────────────────────
async function createTeamMember(req, res, next) {
  try {
    const member = await TeamMember.create(req.body)
    res.status(201).json(member)
  } catch (err) {
    next(err)
  }
}

// ─── Admin: update team member ────────────────────────────────────────────────
async function updateTeamMember(req, res, next) {
  try {
    const member = await TeamMember.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!member) return res.status(404).json({ message: 'Team member not found' })
    res.json(member)
  } catch (err) {
    next(err)
  }
}

// ─── Admin: delete team member ────────────────────────────────────────────────
async function deleteTeamMember(req, res, next) {
  try {
    const member = await TeamMember.findByIdAndDelete(req.params.id)
    if (!member) return res.status(404).json({ message: 'Team member not found' })
    res.json({ message: 'Team member deleted' })
  } catch (err) {
    next(err)
  }
}

module.exports = { listTeam, createTeamMember, updateTeamMember, deleteTeamMember }
