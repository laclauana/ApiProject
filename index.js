// --------------------------------- Variable declaration ----------------------------
const baseURL = 'https://gateway.marvel.com/v1/public/';
const apiKey = '5815682df904a6080be6caaebd915b02';
const searchInput = document.querySelector('#search-input');
const typeSelect = document.querySelector('#type');
const orderSelect = document.querySelector('#order');
const searchButton = document.querySelector('.search');
// const firstPage = document.querySelector('#first-page');
// const nextPage = document.querySelector('#next-page');
// const previousPage = document.querySelector('#previous-page');
// const lastPage = document.querySelector('#last-page');
const resultsSection = document.querySelector('.results');
const shownComics = document.querySelector('.title > p');
const cardsPerPage = 20;
let currentPage = 0;

const fetchComics = (currentPage, cardsPerPage, collection = 'comics') => {
	fetch(`${baseURL}${collection}?apikey=${apiKey}&orderBy=title&offset=${currentPage * cardsPerPage}`)
		.then((res) => res.json())
		.then((data) => {
			const comics = data.data.results;
			resultsSection.innerHTML = '';
			comics.map((comic) => {
				resultsSection.innerHTML += `
                            <article class="comic" data-id=${comic.id}>
                            <div class="img-container">
                            <img src="${comic.thumbnail.path}/portrait_uncanny.${comic.thumbnail
					.extension}" alt="${comic.title}">
                            </div>
                            <div>                                               
                            <p>${comic.title}</p>                               
                            </div>
                        </article> 	
                        `;

				const shownComics = document.querySelector('.title > p');
				shownComics.innerHTML = '';
				let comicsQuantity = data.data.total;
				shownComics.textContent = `Showing ${comicsQuantity} results`;

				const comicsHTML = document.querySelectorAll('.comic');
				comicsHTML.forEach((comic) => {
					comic.onclick = () => {
						// console.log(comic);
						// console.log('hiciste click a un comic');
						console.log(comic.dataset.id);
						shownComics.textContent = '';
						htmlCards(collection, comic.dataset.id);
					};
				});
				updatePagination(collection);
				// console.log(data.data.offset);
			});
		});
};

fetchComics(`${baseURL + 'comics?apikey=' + apiKey + '&orderBy=title&offset=' + currentPage * cardsPerPage}`);

const htmlCards = (collection = 'comics', id) => {
	fetch(`${baseURL}${collection}/${id}?apikey=${apiKey}`).then((res) => res.json()).then((json) => {
		const pickedComic = json.data.results;
		console.log(pickedComic);

		pickedComic.map((comic) => {
			fetchCharacters('comics', comic.id);
			resultsSection.innerHTML = '';
			const date = new Date(comic.modified);
			return (resultsSection.innerHTML += `
					<article class="picked-comic" data-id=${comic.id}>
							<div class="img-container">
								<img src="${noAvailableImg(comic)}" alt="image of ${comic.title}"/>
							</div>

							<div>
								<h2>${comic.title}</h2>
								<p>Published on:</p>
								<p> ${date.toLocaleDateString() === 'Invalid Date' ? 'Not available' : date.toLocaleDateString()}</p>
								<p>Script writers:</p>
								<p> ${comic.creators.available === 0
									? 'Not available'
									: comic.creators.items.map((creator) => {
											return creator.name;
										})} </p>
								<p>Description: </p>
								<p> ${comic.description || 'No description round here 😁'} </p>
							</div>
							</article>
									
							`);
		});
		// fetchCharacters((collection = 'comics'), comicId, characters);
	});
};

const fetchCharacters = (collection = 'comics', comicId) => {
	fetch(`${baseURL}${collection}/${comicId}/characters?apikey=${apiKey}`).then((res) => res.json()).then((json) => {
		const foundCharacters = json.data.results;
		console.log(foundCharacters);

		foundCharacters.map((character) => {
			console.log(character.id, noAvailableImg(character), character.name);
			resultsSection.innerHTML += `
			<article class="comic" data-id=${character.id}>
				<div class="img-container">
					<img src=${noAvailableImg(character)} alt="image of ${character.name}"/>
				</div>
				<div>
					<h2>${character.name}</h2>
				</div>
			</article>
			`;
		});
	});
};

const updateResultsQuantity = (collection) => {
	// fetch(`${baseURL + collection + '?apikey=' + apiKey}`).then((res) => res.json()).then((data) => {
	// 	const shownComics = document.querySelector('.title > p');
	// 	shownComics.innerHTML = '';
	// 	let comicsQuantity = data.data.total;
	// 	return comicsQuantity != 0
	// 		? `Mostrando ${comicsQuantity} resultados`
	// 		: (shownComics.textContent = 'No están estos resultados 😪');
	// });
};

const updatePagination = (collection = 'comics') => {
	const firstPage = document.querySelector('#first-page');
	const nextPage = document.querySelector('#next-page');
	const previousPage = document.querySelector('#previous-page');
	const lastPage = document.querySelector('#last-page');
	// let offset = currentPage * cardsPerPage;

	// offset == 0
	// 	? ((previousPage.disabled = true), (firstPage.disabled = true))
	// 	: ((previousPage.disabled = false), (firstPage.disabled = false));

	// offset + cardsPerPage >= comicsQuantity
	// 	? ((nextPage.disabled = true), (lastPage.disabled = true))
	// 	: ((nextPage.disabled = false), (lastPage.disabled = false));

	nextPage.onclick = () => {
		currentPage++;
		console.log(currentPage);
	};

	lastPage.onclick = () => {
		const remainder = data.data.total % cardsPerPage;
		if (remainder > 0) {
			currentPage = (data.data.total - remainder) / cardsPerPage;
		} else {
			currentPage = (data.data.total - remainder) / cardsPerPage - cardsPerPage;
		}
		nextPage.disabled = true;
		lastPage.disabled = true;
		console.log(currentPage);
	};

	previousPage.onclick = () => {
		currentPage--;
		console.log(currentPage);
		resultsSection.innerHTML = '';
		fetchComics(
			`${baseURL + collection + '?apikey=' + apiKey + '&orderBy=title&offset=' + currentPage * cardsPerPage}`
		);
	};

	firstPage.onclick = () => {
		currentPage = 0;
		firstPage.disabled = true;
		previousPage.disabled = true;
	};
};

searchInput.value = '';
searchInput.oninput = () => {
	console.log(searchInput.value);
	// search();
};

typeSelect.onchange = () => {
	const typeOption = typeSelect.options[typeSelect.selectedIndex].value;
	console.log(typeOption);
	// search();
};

orderSelect.onchange = () => {
	const orderOption = orderSelect.options[orderSelect.selectedIndex].value;
	console.log(orderOption);
	// search();
};

// const search = () => {
// 	currentPage = 0;
// 	if (typeOption === 'characters') {
// 		fetchCharacters('characters');
// 	}
// 	if (typeOption === 'comics') {
// 		fetchComics(currentPage, cardsPerPage, (collection = 'comics'));
// 	}
// 	updateResultsQuantity(collection);
// };

searchButton.onclick = (e) => {
	e.preventDefault();
	// search();
};

const noAvailableImg = (data) => {
	return data.thumbnail.path.includes('image_not_available')
		? 'assets/img no disponible.jpg'
		: `${data.thumbnail.path}.${data.thumbnail.extension}`;
};
