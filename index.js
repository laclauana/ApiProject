// --------------------------------- Variable declaration ----------------------------
const baseURL = 'https://gateway.marvel.com/v1/public/';
const apiKey = '5815682df904a6080be6caaebd915b02';
const searchInput = document.querySelector('#search-input');
const typeSelect = document.querySelector('#type');
const orderSelect = document.querySelector('#order');
const searchButton = document.querySelector('.search');
const firstPage = document.querySelector('#first-page');
const nextPage = document.querySelector('#next-page');
const previousPage = document.querySelector('#previous-page');
const lastPage = document.querySelector('#last-page');
const resultsSection = document.querySelector('.results');
const aside = document.querySelector('aside');
const shownComics = document.querySelector('.title > p');
const loader = document.querySelector('.overlay');
const cardsPerPage = 20;
let currentPage = 0;
// let hasBeenExecuted = false;

const fetchComics = (currentPage, cardsPerPage, collection = 'comics') => {
	loader.classList.remove('hidden');
	fetch(`${baseURL}${collection}?apikey=${apiKey}&orderBy=title&offset=${currentPage * cardsPerPage}`)
		.then((res) => res.json())
		.then((data) => {
			const comics = data.data.results;
			resultsSection.innerHTML = '';
			comics.map((comic) => {
				resultsSection.innerHTML += `
                            <article class="comic" data-id=${comic.id}>
                            	<div class="img-container">
                            		<img src=${noAvailableImg(comic)} alt="${comic.title}">
                            	</div>
                            	<div>                                               
                            		<p>${comic.title}</p>                               
                            	</div>
                        </article> 	
                        `;
				shownComics.innerHTML = '';
				let comicsQuantity = data.data.total;
				shownComics.textContent = `Showing ${comicsQuantity} results`;

				const comicsHTML = document.querySelectorAll('.comic');
				comicsHTML.forEach((comic) => {
					comic.onclick = () => {
						// console.log('hiciste click a un comic');
						shownComics.textContent = '';
						htmlCards(collection, comic.dataset.id);
					};
				});
				// updatePagination(collection);
				// console.log(data.data.offset);
			});
			loader.classList.add('hidden');
		});
};

fetchComics(`${baseURL + 'comics?apikey=' + apiKey + '&orderBy=title&offset=' + currentPage * cardsPerPage}`);

const htmlCards = (collection = 'comics', id) => {
	loader.classList.remove('hidden');
	fetch(`${baseURL}${collection}/${id}?apikey=${apiKey}`).then((res) => res.json()).then((json) => {
		const pickedComic = json.data.results;
		// console.log(pickedComic);
		pickedComic.map((comic) => {
			fetchCharacters('comics', comic.id);
			resultsSection.innerHTML = '';
			aside.innerHTML = '';
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
		loader.classList.add('hidden');
		createReturnButton();
		// returN(collection, id);
	});
};

const fetchCharacters = (collection = 'comics', comicId) => {
	fetch(`${baseURL}${collection}/${comicId}/characters?apikey=${apiKey}`).then((res) => res.json()).then((json) => {
		const foundCharacters = json.data.results;

		foundCharacters === []
			? (resultsSection.innerHTML += `<p>No characters found 😕</p>`)
			: foundCharacters.map((character) => {
					aside.innerHTML += `
				<article class="character" data-id=${character.id}>
					<div class="img-container">
						<img src=${noAvailableImg(character)} alt="image of ${character.name}"/>
						<h2>${character.name}</h2>
					</div>						
				</article>		
				`;
					const pickedCharacter = document.querySelectorAll('.character');
					pickedCharacter.forEach((character) => {
						character.onclick = () => {
							resultsSection.innerHTML = '';

							fetchCharacterID('characters', character.dataset.id);
							fetchComicsFromCharacters('characters', character.dataset.id);
						};
					});
				});
		loader.classList.add('hidden');
		// returN('comics');
	});
};

const fetchCharacterID = (collection = 'characters', characterID) => {
	loader.classList.remove('hidden');
	fetch(`${baseURL}${collection}/${characterID}?apikey=${apiKey}`).then((res) => res.json()).then((json) => {
		const character = json.data.results[0];
		aside.innerHTML = '';
		resultsSection.innerHTML += `
						<article class="picked-comic" data-id=${character.id}>
							<div class="img-container">
								<img src=${noAvailableImg(character)} alt="image of ${character.name}"/>
							</div>
							<div>
								<h2>${character.name}</h2>
							</div>						
						</article>
		`;
		// returN('characters');
	});
};

const fetchComicsFromCharacters = (collection = 'characters', characterId) => {
	fetch(`${baseURL}${collection}/${characterId}/comics?apikey=${apiKey}`).then((res) => res.json()).then((json) => {
		const foundComics = json.data.results;
		// console.log(foundComics);
		aside.innerHTML = '';
		foundComics.map((comic) => {
			aside.innerHTML += `
				<article class="comic" data-id=${comic.id}>
					<div class="img-container">
						<img src=${noAvailableImg(comic)} alt="${comic.title}">
					</div>
					<div>                                               
						<p>${comic.title}</p>                               
					</div>
				</article> 
				`;

			const pickedComic = document.querySelectorAll('.comic');
			pickedComic.forEach((comic) => {
				comic.onclick = () => {
					// console.log(comic, comic.dataset.id);
					htmlCards('comics', comic.dataset.id);
				};
			});
		});
		loader.classList.add('hidden');
		// returN('characters', id);
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
	return data.thumbnail.path.includes('not_available')
		? `./assets/noPhotoAvailable.jpg`
		: `${data.thumbnail.path}.${data.thumbnail.extension}`;
};

var something = function() {
	var executed = false;
	return function() {
		if (!executed) {
			executed = true;
			// do something
		}
	};
};

let executed = false;
const createReturnButton = () => {
	if (!executed) {
		executed = true;
		const buttonsContainer = document.querySelector('.center-button');
		const returnButton = document.createElement('button');
		buttonsContainer.appendChild(returnButton);
		returnButton.textContent = 'GO BACK';
		returnButton.onclick = () => {
			returN('comics');
		};
	}
};

const returN = (collection, id) => {
	console.log(`showing ${collection}`);
	// if (currentPage === 0 && collection === 'comics') {
	// 	returnButton.disabled = true;
	// 	console.log('no hay a donde retroceder');
	// } else {
	// }
	// resultsSection.innerHTML = '';
};
