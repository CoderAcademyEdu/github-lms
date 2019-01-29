const isAuthenticated = (req, res, next) => {
  return req.isAuthenticated()
    ? next()
    : res.status(403).send('Not authorised - Authentication');
}

const hasRole = (roles) => {
  return (req, res, next) => {
    isAuthenticated(req, res, () => {
      const { role } = req.user;
      if (!roles.includes(role)) {
        return res.status(403).send('Not authorised - Role');
      }
      return next();
    });
  }
}

const isEnrolled = (req, res, next) => {
  isAuthenticated(req, res, () => {
    const { cohort } = req.params;
    const { cohorts, role } = req.user;

    const userIsEnrolled = cohorts.filter(c => c.code === cohort).length > 0;
    if (userIsEnrolled || role === 'teacher' || role === 'admin') {
      return next();
    }
    return res.status(403).send('Not authorised - Enrolment');
  })
}

const refreshCookie = (req, res, next) => {
  if (req.session) {
    req.session.nowInMinutes = Date.now() / 60e3;
  }
  next();
}

module.exports = {
  hasRole,
  isEnrolled,
  refreshCookie
};