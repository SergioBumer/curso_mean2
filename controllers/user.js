'use strict'
var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');
var jwt = require("../services/jwt")
function pruebas(req, res) {
    res.status(200).send({ message: "Probando controlador usuario" })
}

function saveUser(req, res) {
    var user = new User();
    var params = req.body;
    console.log("Test");
    user.name = params.name;
    user.surname = params.surname;
    user.email = params.email;
    user.role = 'ROLE_USER';
    user.image = 'null'

    if (params.password) {
        bcrypt.hash(params.password, null, null, function (err, hash) {
            user.password = hash;
            if (user.name != null && user.surname != null && user.email != null) {
                user.save((err, userStored) => {
                    if (err) {
                        res.status(500).send({ message: "Error al registrar el usuario." })
                    } else {
                        if (!userStored) {
                            res.status(404).send({ message: "No se ha podido registrar el usuario." })
                        } else {
                            res.status(200).send({ user: userStored })
                        }
                    }
                })
            } else {
                res.status(409).send({ message: "Introduzce todos los campos." })
            }
        })
    } else {
        res.status(409).send({ message: "Introduzca la contraseña." })
    }
}
function loginUser(req, res) {
    var params = req.body;
    var email = params.email;
    var password = params.password;

    User.findOne({ email: email.toLowerCase() }, (err, user) => {
        if (err) {
            res.status(500).send({ message: "Error en la petición" });
        } else {
            if (!user) {
                res.status(404).send({ message: "Usuario no existe" });
            } else {
                bcrypt.compare(password, user.password, function (err, check) {
                    if (check) {
                        if (params.getHash) {
                            // Generar un token JWT
                            res.status(200).send({ token: jwt.createToken(user) });
                        } else {
                            res.status(200).send({ user });
                        }
                    } else {
                        res.status(404).send({ message: "Usuario no puede iniciar sesión." });
                    }
                });
            }
        }
    });

}
function updateUser(req, res) {
    var userID = req.params.id;
    var update = req.body;

    User.findByIdAndUpdate(userID, update, (err, userUpdated) => {
        if (err) {
            res.status(500).send({ message: "Error de actualización" })
        } else {
            if (!userUpdated) {
                res.status(404).send({ message: "Usuario no se pudo actualizar" })
            } else {
                res.status(200).send({ user: userUpdated })
            }
        }
    });
}
function uploadImage(req, res) {
    var userId = req.params.id;
    var file_name = "No subido..."

    if (req.files) {
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2];

        var ext_split = file_path.split('.');
        var file_ext = ext_split[1];

        var valid_ext = ['png', 'jpg', 'gif']
        if (valid_ext.includes(file_ext)) {
            User.findByIdAndUpdate(userId, { image: file_name }, (err, userUpdated) => {
                if (!userUpdated) {
                    res.status(404).send({ message: "No se actualizó la imagen del usuario." });
                } else {
                    res.status(200).send({ message: "Imagen actualizada correctamente." });
                }
            });
        } else {
            res.status(404).send({ message: "Extensión de archivo incorrecta." });
        }
    } else {
        res.status(404).send({ message: "Imagen no cargada." });
    }
}
module.exports = {
    pruebas,
    saveUser,
    loginUser,
    updateUser,
    uploadImage
}