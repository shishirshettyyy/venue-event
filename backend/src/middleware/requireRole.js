/**
 * Role-based access control middleware factory.
 * Use after `requireAuth`.
 *
 * @param {...string} roles  Allowed roles (e.g., 'organizer', 'admin')
 */
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' })
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Required role: ${roles.join(' or ')}`,
      })
    }
    next()
  }
}

module.exports = requireRole
