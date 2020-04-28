'use strict'
var express = require('express');
var AlbumController = require('../controllers/album');
var md_auth = require('../middleware/authenticated');
var api = express.Router();
var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/albums'});

api.post('/save-album', md_auth.ensureAuth, AlbumController.saveAlbum);
api.get('/get-album/:id', md_auth.ensureAuth, AlbumController.getAlbum);
api.get('/get-albums/:id?', md_auth.ensureAuth, AlbumController.getAlbums);
api.put('/update-album/:id', md_auth.ensureAuth, AlbumController.updateAlbum);
api.delete('/delete-album/:id', md_auth.ensureAuth, AlbumController.deleteAlbum);
// Imagenes
api.post('/upload-image-album/:id',[md_auth.ensureAuth, md_upload], AlbumController.uploadImage)
api.post('/get-image-album/:imageFile', AlbumController.getImageFile)
module.exports = api;