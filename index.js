const link = document.createElement('a');
const body = document.body;
body.appendChild(link);
link.setAttribute('id', 'prox');
console.log(link.id);
link.textContent = 'Proxima pagina';

const buscarInfo = (URL) => {
	fetch(URL)
		.then((data) => {
			return data.json();
		})
		.then((personajes) => {
			console.log(personajes);

			const link = document.querySelector('#prox');
			link.href = personajes.info.next;
			link.onclick = (e) => {
				e.preventDefault();
				buscarInfo(personajes.info.next);
			};

			const seccion = document.querySelector('.resultados');
			seccion.innerHTML = '';
			personajes.results.map((info) => {
				seccion.innerHTML += `
                <article>
                <div class="imagen">
                <img src="${info.image}">
                </div>
                <div class="info">
                    <div class="nombre">
                        <h2>${info.name}</h2>
                    </div>
                    <div class="estado">
                        <p>${info.status}</p>
                        - <p>${info.species}</p>
                    </div>
                    <div class="ubicacion">
                        <p>Last known location:</p>
                        <p>${info.location.name}</p>
                    </div>
                    <div class="episodio">
                        <p>First seen in:</p>
                        <p>${info.episode[0]}</p>
                    </div>
                </div>
            </article>
            `;
			});
		});
};

buscarInfo('https://rickandmortyapi.com/api/character');

const botonBuscar = document.querySelector('.buscar');

botonBuscar.onclick = (e) => {
	e.preventDefault();
};
