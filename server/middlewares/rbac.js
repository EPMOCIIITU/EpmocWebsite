/**
 * Middleware to restrict access based on user roles.
 * Must be used AFTER the `protect` (auth) middleware.
 * 
 * @param  {...String} roles - Array of allowed roles (e.g., 'core', 'head')
 */
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ message: 'User role not defined' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Role (${req.user.role}) is not allowed to access this resource` 
      });
    }
    
    next();
  };
};

module.exports = { authorizeRoles };
