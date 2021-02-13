const link = document.createElement('button');
const body = document.body;
const urlBase = 'https://gateway.marvel.com/v1/public/';
const apiKey = '5815682df904a6080be6caaebd915b02';
const comicsPorPagina = 20;
let paginaActual = 0;

body.appendChild(link);
link.setAttribute('id', 'prox');
link.textContent = '>';

const buscarInfo = (URL) => {
	fetch(URL).then((res) => res.json()).then((data) => {
		console.log(data);
		const comics = data.data.results;
		const seccion = document.querySelector('.resultados');
		const link = document.querySelector('#prox');

		link.onclick = (e) => {
			e.preventDefault();
			paginaActual++;
			buscarInfo(
				`${urlBase + 'comics?apikey=' + apiKey + '&orderBy=title&offset=' + paginaActual * comicsPorPagina}`
			);
		};

		seccion.innerHTML = '';

		comics.map((comic) => {
			seccion.innerHTML += `
                            <article>
                            <div class="imagen">
                            <img src="${comic.thumbnail.path}/portrait_uncanny.${comic.thumbnail.extension}">
                            </div>
                            <div>                                               
                                    <p>${comic.title}</p>                               
                            </div>
                        </article>
                        `;
		});
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

const buscarPersonajes = (paginaActual) => {
	fetch(`${paginaActual * comicsPorPagina}`).then((res) => res.json()).then((data) => {
		console.log(data);
		personajes = data.data.results;
		const seccion = document.querySelector('.resultados');
		seccion.innerHTML = '';
		personajes.map((personaje) => {
			seccion.innerHTML += `<p>${personaje.name}</p>`;
		});
	});
};
