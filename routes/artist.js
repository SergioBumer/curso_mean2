'use strict'
var express = require('express');
var ArtistController = require('../controllers/artist');
var md_auth = require('../middleware/authenticated');
var api = express.Router();
var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/artists'});

api.post('/save-artist', md_auth.ensureAuth, ArtistController.saveArtist);
api.get('/get-artist/:id', md_auth.ensureAuth, ArtistController.getArtist);
api.get('/get-artists/:page?', md_auth.ensureAuth, ArtistController.getArtists);
api.put('/update-artist/:id', md_auth.ensureAuth, ArtistController.updateArtist);
api.delete('/delete-artist/:id', md_auth.ensureAuth, ArtistController.deleteArtist);
// Imagenes
api.post('/upload-image-artist/:id',[md_auth.ensureAuth, md_upload], ArtistController.uploadImage)
api.post('/get-image-artist/:imageFile', ArtistController.getImageFile)
module.exports = api;