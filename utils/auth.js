const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.locals.user = req.session.user;
    return next();
  }
  return res.status(403).send('Not authorised - Authentication');
}

const hasRole = (roles) => {
  return (req, res, next) => {
    const { role } = req.user;
    if (!roles.includes(role)) {
      return res.status(403).send('Not authorised - Role');
    }
    return next();
  }
}

const isEnrolled = (req, res, next) => {
  const { cohort } = req.params;
  const { cohorts, role } = req.user;
  const userIsEnrolled = cohorts.filter(c => c.code === cohort).length > 0;
  if (userIsEnrolled || role === 'teacher' || role === 'admin') {
    return next();
  }
  return res.status(403).send('Not authorised - Enrolled');
}

module.exports = {
  isAuthenticated,
  hasRole,
  isEnrolled
};