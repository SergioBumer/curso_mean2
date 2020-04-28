'use strict'
var express = require('express');
var SongController = require('../controllers/song')
var md_auth = require('../middleware/authenticated')
var api = express.Router();
var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/songs'});
api.post('/save-song', md_auth.ensureAuth, SongController.saveSong)
api.get('/get-song/:id', md_auth.ensureAuth, SongController.getSong)
api.get('/get-songs/:id?', md_auth.ensureAuth, SongController.getSongs)
api.put('/update-song/:id', md_auth.ensureAuth, SongController.updateSong)
api.delete('/delete-song/:id', md_auth.ensureAuth, SongController.deleteSong)
// Imagenes
api.post('/upload-audio-file/:id',[md_auth.ensureAuth, md_upload], SongController.uploadAudioFile)
api.post('/get-file-song/:audioFile', SongController.getAudioFile)

module.exports = api;