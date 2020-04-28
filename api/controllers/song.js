'use strict'
var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');
var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function saveSong(req, res) {
    var song = Song();
    var params = req.body;
    song.number = params.number;
    song.name = params.name;
    song.file = 'null';
    song.duration = params.duration;
    song.album = params.album;
    song.save((err, songStored) => {
        if (err) {
            res.status(500).send({ message: "Error al guardar la canción." })
        } else {
            if (!songStored) {
                res.status(404).send({ message: "No se pudo almacenar la canción." })
            } else {
                res.status(200).send({ song: songStored })
            }
        }
    });
}
function getSong(req, res) {
    var songId = req.params.id;
    Song.findById(songId).populate({ path: 'album' }).exec((err, song) => {
        if (err) {
            res.status(500).send({ message: "Error al obtener la canción" });
        } else {
            if (!song) {
                res.status(404).send({ message: "Canción no existe." });
            } else {
                res.status(200).send({ song: song });
            }
        }
    });
}
function getSongs(req, res) {
    var albumId = req.params.id;
    if (!albumId) {
        var find = Song.find({}).sort('name');
    } else {
        var find = Song.find({ album: albumId }).sort('number');
    }
    find.populate({
        path: 'album',
        populate: {
            path: 'artist',
            model: 'Artist'
        }
    }).exec((err, songs) => {
        if (err) {
            res.status(500).send({ message: "Error al obtener las canciones." });
        } else {
            if (!songs) {
                res.status(404).send({ message: "No hay canciones" });
            } else {
                res.status(200).send({ songs: songs });
            }
        }
    });
}
function updateSong(req, res) {
    var songId = req.params.id;
    var update = req.body;

    Song.findByIdAndUpdate(songId, update, (err, songUpdated) => {
        if (err) {
            res.status(500).send({ message: "Error al actualizar la canción" });
        } else {
            if (!songUpdated) {
                res.status(404).send({ message: "No se actualizó el álbum." });
            } else {
                res.status(200).send({ songUpdated: songUpdated });
            }
        }
    });
}
function deleteSong(req, res) {
    var songId = req.params.id;

    Song.findByIdAndRemove(songId, (err, songRemoved) => {
        if (err) {
            res.status(500).send({ message: "Error al eliminar la canción" });
        } else {
            if (!songRemoved) {
                res.status(404).send({ message: "No se eliminó la canción" });
            } else {
                res.status(200).send({ song: songRemoved });
            }
        }
    });
}
function uploadAudioFile(req, res) {
    var songId = req.params.id;
    var file_name = "No subido..."

    if (req.files) {
        var file_path = req.files.audioFile.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2];

        var ext_split = file_path.split('.');
        var file_ext = ext_split[1];

        var valid_ext = ['mp3','aac']
        if (valid_ext.includes(file_ext)) {
            Song.findByIdAndUpdate(songId, { file: file_name }, (err, songUpdated) => {
                if (err) {
                    res.status(500).send({ message: "Error al actualizar el fichero de audio." });
                } else {
                    if (!songUpdated) {
                        res.status(404).send({ message: "No se actualizó el fichero de audio de la canción." });
                    } else {
                        res.status(200).send({ message: "Canción actualizada correctamente." });
                    }
                }
            });
        } else {
            res.status(404).send({ message: "Extensión de archivo incorrecta." });
        }
    } else {
        res.status(404).send({ message: "Fichero de audio no cargado." });
    }
}
function getAudioFile(req, res) {
    var audioFile = req.params.audioFile;
    var pathFile = './uploads/songs/' + audioFile;
    fs.exists(pathFile, function(exists){
        if (exists) {
            res.status(200).sendFile(path.resolve(pathFile));
        } else {
            res.status(404).send({ message: "Fichero de audio no existe" })
        }
    });
}
module.exports = {
    saveSong,
    getSong,
    getSongs,
    updateSong,
    deleteSong,
    uploadAudioFile,
    getAudioFile
};