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

    User.findByIdAndUpdate(userID, update, (err, userUpdated)=>{
        if(err){
            res.status(500).send({message: "Error de actualización"})
        }else{
            if(!userUpdated){
                res.status(404).send({message: "Usuario no se pudo actualizar"})
            }else{
                res.status(200).send({user: userUpdated})
            }
        }
    });
}
module.exports = {
    pruebas,
    saveUser,
    loginUser,
    updateUser
}