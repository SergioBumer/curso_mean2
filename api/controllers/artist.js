'use strict'
var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');
var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');


function saveArtist(req, res) {
    var artist = new Artist();
    var params = req.body;
    artist.name = params.name;
    artist.description = params.description;
    artist.image = 'null';
    artist.save((err, artistStored) => {
        if (err) {
            res.status(500).send({ message: "Error al guardar el artista." })
        } else {
            if (!artistStored) {
                res.status(404).send({ message: "Artista no creado. Vuelva a intentar." })
            } else {
                res.status(200).send({ message: "Artista creado satisfactoriamente." })
            }
        }
    });
}
function getArtist(req, res) {
    var artistId = req.params.id;

    Artist.findById(artistId, (err, artist) => {
        if (err) {
            res.status(500).send({ message: "Error al obtener el artista." })
        } else {
            if (!artist) {
                res.status(404).send({ message: "Artista no encontrado. Vuelva a intentar." })
            } else {
                res.status(200).send({ artist: artist })
            }
        }
    });
}
function getArtists(req, res) {
    var page = req.params.page || 1;
    var itemsPerPage = 3;

    Artist.find().sort('name').paginate(page, itemsPerPage, function (err, artists, total) {
        if (err) {
            res.status(500).send({ message: "Error al obtener los artista." })
        } else {
            if (!artists) {
                res.status(404).send({ message: "No se encontraron artistas." })
            } else {
                return res.status(200).send({ artists: artists, total_items: total, page: page })
            }
        }
    });
}
function updateArtist(req, res) {
    var artistId = req.params.id;
    var update = req.body;
    Artist.findByIdAndUpdate(artistId, update, (err, artistUpdated) => {
        if (err) {
            res.status(500).send({ message: "Error al actualizar el artista." })
        } else {
            if (!artistUpdated) {
                res.status(404).send({ message: "Artista no actualizado. Vuelva a intentar." })
            } else {
                res.status(200).send({ message: "Artista actualizado satisfactoriamente." })
            }
        }
    });
}
function deleteArtist(req, res) {
    var artistId = req.params.id;

    Artist.findByIdAndRemove(artistId, (err, artistDeleted) => {
        if (err) {
            res.status(500).send({message: "Error al eliminar el artista."});
        } else {
            if (!artistDeleted) {
                res.status(404).send({message: "Artista no fue eliminado."});
            } else {
                // res.status(200).send({message: "Artista eliminado correctamente."});
                Album.find({artist: artistDeleted._id}).remove((err, albumRemoved) => {
                    if (err) {
                        res.status(500).send({ message: "Error al eliminar el album." });
                    } else {
                        if (!albumRemoved) {
                            res.status(404).send({ message: "Album no creado. Vuelva a intentar." });
                        } else {
                            Song.find({album: albumRemoved._id}).remove((err, songRemoved) => {
                                if (err) {
                                    res.status(500).send({ message: "Error al eliminar la canción." })
                                } else {
                                    if (!songRemoved) {
                                        res.status(404).send({ message: "Canción no eliminada. Vuelva a intentar." })
                                    } else {
                                        res.status(200).send({ artist: artistDeleted })
                                    }
                                }
                            });
                        }
                    }
                });
            }
        }
    });
}



function uploadImage(req, res) {
    var artistId = req.params.id;
    var file_name = "No subido..."

    if (req.files) {
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2];

        var ext_split = file_path.split('.');
        var file_ext = ext_split[1];

        var valid_ext = ['png', 'jpg', 'gif']
        if (valid_ext.includes(file_ext.toLowerCase())) {
            Artist.findByIdAndUpdate(artistId, { image: file_name }, (err, artistUpdated) => {
                if (err) {
                    res.status(500).send({ message: "Error al actualizar la imagen." });
                } else {
                    if (!artistUpdated) {
                        res.status(404).send({ message: "No se actualizó la imagen del usuario." });
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
    var pathFile = './uploads/artists/' + imageFile;
    fs.exists(pathFile, function(exists){
        if (exists) {
            res.status(200).sendFile(path.resolve(pathFile));
        } else {
            res.status(404).send({ message: "Imagen no existe" })
        }
    });
}
module.exports = {
    saveArtist,
    getArtist,
    getArtists,
    updateArtist,
    deleteArtist,
    uploadImage,
    getImageFile
}