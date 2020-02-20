'use strict'

module.exports = function routes(app) {
  //GET Rotues




  //POST routes
  app.post('/login',  require('./auth/login').login);
  app.post('/signup', require('./auth/login').signup);
}
