const link = document.createElement('a');
const body = document.body;
body.appendChild(link);
link.setAttribute('id', 'prox');
console.log(link.id);
link.textContent = 'Proxima pagina';

const buscarInfo = (URL) => {
	fetch(URL).then((res) => res.json()).then((comic) => {
		console.log(comic);
		comics = comic.data.results;

		const seccion = document.querySelector('.resultados');
		const link = document.querySelector('#prox');
		// link.href = comic.data.next;
		link.onclick = (e) => {
			e.preventDefault();
			// buscarInfo(comic.data.next);
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

buscarInfo('https://gateway.marvel.com/v1/public/comics?apikey=5815682df904a6080be6caaebd915b02');

const botonBuscar = document.querySelector('.buscar');

botonBuscar.onclick = (e) => {
	e.preventDefault();
};
// para filtrar por comic y traer informacion del personaje y etc y eliminar los demas comics, debere hacer otro fetch
