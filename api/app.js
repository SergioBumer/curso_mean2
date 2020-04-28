'use strict'
var express = require('express');
var bodyParser = require('body-parser');

var app = express();
// Cargar rutas
var user_routes = require('./routes/user');
var artists_routes = require('./routes/artist');
var album_routes = require('./routes/album');
var song_routes = require('./routes/song');

// Convierte los datos entrantes a documentos JSON
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// Configurar cabeceras de entrada
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers','Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow','GET, POST, OPTIONS, PUT, DELETE');

    next();
});
// Rutas Base
app.use('/api', user_routes);
app.use('/api', artists_routes);
app.use('/api', album_routes);
app.use('/api', song_routes);

module.exports = app;