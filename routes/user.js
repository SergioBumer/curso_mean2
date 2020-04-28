'use strict'
var express = require('express');
var UserController = require('../controllers/user')
var md_auth = require('../middleware/authenticated')
var api = express.Router();
var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/users'});

api.post('/login-user', UserController.loginUser)
api.post('/register-user', UserController.saveUser)
api.post('/upload-image-user/:id',[md_auth.ensureAuth, md_upload], UserController.uploadImage)
api.post('/get-image-user/:imageFile', UserController.getImageFile)

api.put('/update-user/:id', md_auth.ensureAuth, UserController.updateUser)
api.get('/probando-controlador', md_auth.ensureAuth, UserController.pruebas)


module.exports = api;