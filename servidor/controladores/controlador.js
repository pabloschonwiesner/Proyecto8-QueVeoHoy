var bd = require('./../lib/conexionbd.js');
bd.connect()

function getFilteredFilms(req, res) {
	var peliculas = {
			'peliculas': [],
			'total': 0
		}

	var p = req.query
	var limitDesde = parseInt(p.pagina) === 1 ? 1 : (parseInt(p.pagina) -1) * parseInt(p.cantidad) +1
	var q = 'select * from pelicula where id = id'
	if(p.anio) q = q + ` and anio = ${p.anio}`
	if(p.titulo) q = q + ` and titulo like '%${p.titulo}%'`
	if(p.genero) q = q + ` and genero_id = ${p.genero}`
	q = q + ` order by ${p.columna_orden} ${p.tipo_orden}`
	q = q + ` limit ${limitDesde}, ${parseInt(p.cantidad)}`
	console.log(q)

	bd.query(q, (error, results, fields) => {
		if(!error) {
			for(var i = 0; i<results.length; i++) {
				peliculas.peliculas.push(results[i])
			}
			peliculas.total = results.length
			res.send(peliculas)
		} else {
			res.status(500).send(error)
		}
	})
}

function getOneFilm(req, res) {
	var errors = []
	var pelicula = {
			'pelicula': {},
			'actores': [],
			'genero': ''
		}

	// pido pelicula
	var q = `select * from pelicula where id = ${req.params.id}`

	bd.query(q, (error, results, fields) => {		
		if(!error) {
			pelicula.pelicula = Object.assign({}, results[0]);
			//pido actores
			var aux = []
			var q1 = `
			select actor.nombre 
			from actor join actor_pelicula on actor.id = actor_pelicula.actor_id
			where actor_pelicula.pelicula_id = ${req.params.id}`

			bd.query(q1, (error, results, fields) => {							
				if(!error) {
					for(var i = 0; i<results.length; i++) {
						aux.push(Object.assign({}, results[i]))	
					}		
					pelicula.actores = aux.slice();	
				} else {
					res.status(500).send(error)
					return
				}
			})		

			// pido genero
			var q2 = `select nombre from genero where id = ${pelicula.pelicula.genero_id}`
			bd.query(q2, (error, results, fields) => {
				if(!error) {
					pelicula.genero = results[0]
					res.send(pelicula)				
				} else {
					res.status(500).send(error)
				}
			})
		} else {
			res.status(500).send(error)
		}		
	})	
}

function getRecommendation (req, res) {
	var p = req.query
	var peliculas = {
			'peliculas': []
		}
	var q = 'select * from pelicula join genero on genero.id = pelicula.genero_id where pelicula.id = pelicula.id'
	if(p.genero) q = q + ` and genero.nombre = '${p.genero}'`
	if(p.anio_inicio) q = q + ` and  pelicula.anio >= ${p.anio_inicio} and pelicula.anio <= ${p.anio_fin}`
	if(p.puntuacion) q = q + ` and pelicula.puntuacion >= ${p.puntuacion}`

	bd.query(q, (error, results, fields) => {
		if(!error) {
			for(var i = 0; i<results.length; i++) {
				peliculas.peliculas.push(Object.assign({}, results[i]))
			}
			res.send(peliculas)
		} else {
			res.status(500).send(error)
		}
	})
}

function getAllFilms(req, res) {
	var q = 'select * from pelicula'
	bd.query(q, (error, results, fields) => {
		var peliculas = {
			'peliculas': []
		}
		for(var i = 0; i<results.length; i++) {
			peliculas.peliculas.push(results[i])
		}
		!error ? res.send(peliculas) : res.status(500).send(error)
	})
}

function getAllGender(req, res) {
	var q = 'select * from genero'
	bd.query(q, (error, results, fields) => {
		var generos = {
			'generos': []
		}
		for(var i = 0; i<results.length ; i++) {
			generos.generos.push(results[i])
		}
		!error ? res.send(generos) : res.status(500).send(error)
	})
}


module.exports = { 
	getAllFilms: getAllFilms, 
	getAllGender: getAllGender,
	getFilteredFilms: getFilteredFilms,
	getOneFilm: getOneFilm,
	getRecommendation: getRecommendation
}