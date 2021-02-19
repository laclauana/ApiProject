const urlBase = 'https://gateway.marvel.com/v1/public/';
const apiKey = '5815682df904a6080be6caaebd915b02';
const comicsPorPagina = 20;
let paginaActual = 0;
// const paginasAtras = document.querySelector('#saltear-atras');
// const paginasAdelante = document.querySelector('#saltear-adelante');
// const atras = document.querySelector('#atras');
// console.log(paginasAdelante);
// console.log(paginasAtras);
// console.log(atras);

const buscarInfo = (URL) => {
	fetch(URL).then((res) => res.json()).then((data) => {
		// console.log(data);
		const siguiente = document.querySelector('#siguiente');
		const seccion = document.querySelector('.resultados');
		const comics = data.data.results;

		seccion.innerHTML = '';
		comics.map((comic) => {
			seccion.innerHTML += `
                            <article>
                            <div class="imagen">
                            <img src="${comic.thumbnail.path}/portrait_uncanny.${comic.thumbnail.extension}">
                            </div>
                            <div>                                               
                            <p class="comic" data-id=${comic.id}>${comic.title}</p>                               
                            </div>
                        </article>
                        `;
		});

		const comicsMostrados = document.querySelector('.titulo > p');
		comicsMostrados.innerHTML = '';
		let cantidadComics = data.data.total;
		comicsMostrados.textContent = `Mostrando ${cantidadComics} resultados`;
		siguiente.onclick = () => {
			paginaActual++;
			buscarInfo(
				`${urlBase + 'comics?apikey=' + apiKey + '&orderBy=title&offset=' + paginaActual * comicsPorPagina}`
			);
		};

		const primeraPagina = document.querySelector('#primera-pagina');
		const ultimaPagina = document.querySelector('#ultima-pagina');
		const atras = document.querySelector('#atras');
		ultimaPagina.onclick = () => {
			paginaActual += 2;
			console.log('paginas adelante', paginaActual);
			buscarInfo(
				`${urlBase + 'comics?apikey=' + apiKey + '&orderBy=title&offset=' + paginaActual * comicsPorPagina}`
			);
		};

		atras.onclick = () => {
			paginaActual--;
			buscarInfo(
				`${urlBase + 'comics?apikey=' + apiKey + 'orderBy=title&offset' + paginaActual * comicsPorPagina}`
			);
		};

		primeraPagina.onclick = () => {
			paginaActual = 0;
		};

		const comicsHTML = document.querySelectorAll('.comic');
		// console.log(comicsHTML);

		// comicsHTML.forEach((comic) => {
		// 	comic.onclick = () => {
		// 		console.log(comic.dataset.id);
		// 		// console.log('hiciste click a un comic');
		// 		fetch(
		// 			`${urlBase} + 'comics/' + ${comic.dataset
		// 				.id} + '?apikey=' + ${apiKey} + '&orderBy=title&offset=' + ${paginaActual} * ${comicsPorPagina}`
		// 		)
		// 			.then((res) => res.json())
		// 			.then((dataComic) => console.log(dataComic));

		// seccion.innerHTML = '';
		// seccion.innerHTML +=
		// NUEVO ARTICLE CON EL DATACOMIC
		// mismo procedimiento con dataComicPersonaje
	});
};

buscarInfo(`${urlBase + 'comics?apikey=' + apiKey + '&orderBy=title&offset=' + paginaActual * comicsPorPagina}`);

const inputBusqueda = document.querySelector('#input-busqueda');
inputBusqueda.oninput = () => {
	console.log(inputBusqueda.value);
};
const selectTipo = document.querySelector('#tipo');
const selectOrden = document.querySelector('#orden');
const botonBuscar = document.querySelector('.buscar');

selectTipo.onchange = () => {
	const opcionTipo = selectTipo.options[selectTipo.selectedIndex].value;
	console.log(opcionTipo);
};

selectOrden.onchange = () => {
	const opcionOrden = selectOrden.options[selectOrden.selectedIndex].value;
	console.log(opcionOrden);
};

botonBuscar.onclick = (e) => {
	e.preventDefault();
};

// const buscarComics = (url, paginaActual, nombre) => {
// 	console.log('buscando comics...');
// 	fetch(`${urlBase + url}?apikey=${apiKey}&offset=${paginaActual * comicsPorPagina}`)
// 		.then((res) => res.json())
// 		.then((data) => {
// 			console.log(data);
// 			personajes = data.data.results;
// 			const seccion = document.querySelector('.resultados');
// 			seccion.innerHTML = '';
// 			personajes.map((personaje) => {
// 				seccion.innerHTML += `<p>${personaje[nombre]}</p>`;
// 			});
// 		});
// };

// buscarComics('comics', paginaActual, 'title');
// buscarComics('characters', paginaActual, 'name');

const buscarPersonajes = (paginaActual) => {
	fetch(`${urlBase + 'characters?apikey=' + apiKey + '&offset=' + paginaActual}`)
		.then((res) => res.json())
		.then((data) => {
			console.log(data);
			personajes = data.data.results;
			const seccion = document.querySelector('.resultados');
			seccion.innerHTML = '';
			personajes.map((personaje) => {
				seccion.innerHTML += `<p>${personaje.name}</p>`;
			});
		});
};
// collectionURI en Preview pestania para tomar datos de characters y etc

// estructura final de la URL a la que hacemos fetch:
// url de la api + coleccion que buscamos + ? + queryParam=valor + & + queryParam=valor
