module.exports = function (app) {
  app.use('/auth', require('../controllers/auth.route'));
  app.use('/course', require('../controllers/course.route'));
  app.use('/profile', require('../controllers/profile.route'));
};
