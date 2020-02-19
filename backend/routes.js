'use strict'

module.exports = function routes(app) {
  //GET Rotues




  //POST routes
  app.get('/login', require('./auth/login').login);
  app.get('/signup', require('./auth/login').signup);
}
