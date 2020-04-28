'use strict'
var express = require('express');
var bodyParser = require('body-parser');

var app = express();
// Cargar rutas
var user_routes = require('./routes/user')
var artists_routes = require('./routes/artist')
var album_routes = require('./routes/album')
var song_routes = require('./routes/song')

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json());



// Configurar cabeceras de entrada

// Rutas Base
app.use('/api', user_routes)
app.use('/api', artists_routes)
app.use('/api', album_routes)

module.exports = app;