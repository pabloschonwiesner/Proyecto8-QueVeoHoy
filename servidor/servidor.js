//paquetes necesarios para el proyecto
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var ctrl = require('./controladores/controlador.js');

var app = express();

app.use(cors());

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());


app.get('/', (req, res) => res.send({'test': 'test'}));
app.get('/getAllFilms', ctrl.getAllFilms);
app.get('/peliculas', ctrl.getFilteredFilms);
app.get('/peliculas/recomendacion', ctrl.getRecommendation);
app.get('/peliculas/:id([0-9]+)', ctrl.getOneFilm);
app.get('/generos', ctrl.getAllGender);



//seteamos el puerto en el cual va a escuchar los pedidos la aplicación
var puerto = '8080';

app.listen(puerto, function () {
  console.log( "Escuchando en el puerto " + puerto );
});

