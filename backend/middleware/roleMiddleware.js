/**
 * AttendEase - Role-Based Authorization Middleware
 * Demonstrates: NRD Lab Experiment 11 (Role-Based Access Control)
 */

/**
 * Authorize specified roles
 * @param  {...string} roles Allowed roles ('admin', 'faculty', 'student')
 */
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required prior to authorization.'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Access restricted to [${roles.join(', ')}] roles. Your role is '${req.user.role}'.`
      });
    }

    next();
  };
};

module.exports = authorizeRoles;
