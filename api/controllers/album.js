'use strict'
var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');
var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function saveAlbum(req, res) {
    var album = new Album();

    var params = req.body;
    album.title = params.title;
    album.description = params.description;
    album.year = params.year;
    album.image = 'null';
    album.artist = params.artist;

    album.save((err, albumStored) => {
        if (err) {
            res.status(500).send({ message: "Error al guardar el álbum." })
        } else {
            if (!albumStored) {
                res.status(404).send({ message: "No se pudo almacenar el álbum" })
            } else {
                res.status(200).send({ album: albumStored })
            }
        }
    });

}
function getAlbum(req, res) {
    var albumId = req.params.id;
    Album.findById(albumId).populate({ path: 'artist' }).exec((err, album) => {
        if (err) {
            res.status(500).send({ message: "Error al obtener el album" });
        } else {
            if (!album) {
                res.status(404).send({ message: "El álbum no existe." });
            } else {
                res.status(200).send({ album: album });
            }
        }
    });
}
function getAlbums(req, res) {
    var artistId = req.params.id;
    if (!artistId) {
        // Todos los albumes
        var find = Album.find({}).sort('title');
    } else {
        // Album de un artista
        var find = Album.find({ artist: artistId }).sort('year');
    }
    find.populate({ path: 'artist' }).exec((err, albums) => {
        if (err) {
            res.status(500).send({ message: "Error al obtener los álbumes" });
        } else {
            if (!albums) {
                res.status(404).send({ message: "No hay álbumes." });
            } else {
                res.status(200).send({ albums });
            }
        }
    });
}
function updateAlbum(req, res) {
    var albumId = req.params.id;
    var update = req.body;
    Album.findByIdAndUpdate(albumId, update, (err, albumUpdated) => {
        if (err) {
            res.status(500).send({ message: "Error al actualizar el album" });
        } else {
            if (!albumUpdated) {
                res.status(404).send({ message: "No fue posible actualizar el álbum." });
            } else {
                res.status(200).send({ album: albumUpdated });
            }
        }
    });
}
function deleteAlbum(req, res) {
    var albumId = req.params.id;
    Album.findByIdAndRemove(albumId, (err, albumRemoved) => {
        if (err) {
            res.status(500).send({message: "Error al eliminar el album"});
        } else {
            if (!albumRemoved) {
                res.status(404).send({message: "El álbum no existe."});
            } else {
                Song.find({album: albumRemoved._id}).remove((err, songRemoved) => {
                    if (err) {
                        res.status(500).send({ message: "Error al eliminar la canción." })
                    } else {
                        if (!songRemoved) {
                            res.status(404).send({ message: "Canción no eliminada. Vuelva a intentar." })
                        } else {
                            res.status(200).send({ album: albumRemoved })
                        }
                    }
                });
            }
        }
    });
}
function uploadImage(req, res) {
    var albumId = req.params.id;
    var file_name = "No subido..."

    if (req.files) {
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2];

        var ext_split = file_path.split('.');
        var file_ext = ext_split[1];

        var valid_ext = ['png', 'jpg', 'gif']
        if (valid_ext.includes(file_ext)) {
            Album.findByIdAndUpdate(albumId, { image: file_name }, (err, albumUpdated) => {
                if (err) {
                    res.status(500).send({ message: "Error al actualizar la imagen." });
                } else {
                    if (!albumUpdated) {
                        res.status(404).send({ message: "No se actualizó la imagen del álbum." });
                    } else {
                        res.status(200).send({ message: "Imagen actualizada correctamente." });
                    }
                }
            });
        } else {
            res.status(404).send({ message: "Extensión de archivo incorrecta." });
        }
    } else {
        res.status(404).send({ message: "Imagen no cargada." });
    }
}
function getImageFile(req, res) {
    var imageFile = req.params.imageFile;
    var pathFile = './uploads/albums/' + imageFile;
    fs.exists(pathFile, function(exists){
        if (exists) {
            res.status(200).sendFile(path.resolve(pathFile));
        } else {
            res.status(404).send({ message: "Imagen no existe" })
        }
    });
}
module.exports = {
    saveAlbum,
    getAlbum,
    getAlbums,
    updateAlbum,
    deleteAlbum,
    uploadImage,
    getImageFile
};