'use strict'
var jwt = require("jwt-simple");
var moment = require("moment");
var secret = "clave_curso"

exports.ensureAuth = function (req, res, next) {
    if (!req.headers.authorization) {
        res.status(403).send({ message: "Usuario sin permisos" })
    }
    var token = req.headers.authorization.replace(/['"]+/g, '');
    //console.log(token)
    try {
        var payload = jwt.decode(token, secret);
        if (payload.exp <= moment().unix()) {
            return res.status(401).send({ message: "Token expirado" });
        }
    } catch (error) {
        console.log(error)
        return res.status(401).send({ message: "Token no válido" });
    }
    req.user = payload;
    next();

}