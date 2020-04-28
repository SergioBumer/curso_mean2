'use strict'
var express = require('express');
var UserController = require('../controllers/user')
var md_auth = require('../middleware/authenticated')
var api = express.Router();

api.post('/login-user', UserController.loginUser)
api.post('/register-user', UserController.saveUser)


api.put('/update-user/:id', md_auth.ensureAuth, UserController.updateUser)

api.get('/probando-controlador', md_auth.ensureAuth, UserController.pruebas)


module.exports = api;