// --------------------------------- Variable declaration ----------------------------

const baseURL = 'https://gateway.marvel.com/v1/public/';
const apiKey = '5815682df904a6080be6caaebd915b02';
const searchInput = document.querySelector('#search-input');
const typeSelect = document.querySelector('#type');
const orderSelect = document.querySelector('#order');
const searchButton = document.querySelector('.search');
const resultsSection = document.querySelector('.results');
const aside = document.querySelector('aside');
const shownComics = document.querySelector('.title > p');
const loader = document.querySelector('.overlay');
const body = document.body;
const cardsPerPage = 20;
let currentPage = 0;

// ------------------------------ Creating pagination buttons ------------------------

const paginationButtons = document.createElement('div');
paginationButtons.setAttribute('class', 'center-button');
body.appendChild(paginationButtons);
paginationButtons.innerHTML = `

		<button id="first-page">
			<< </button>
		<button id="previous-page">
			< </button>
		<button id="next-page">
			> </button>
		<button id="last-page">
			>> </button>
	`;

const nextPage = document.querySelector('#next-page');
const previousPage = document.querySelector('#previous-page');
const lastPage = document.querySelector('#last-page');
const firstPage = document.querySelector('#first-page');

// -------------------------- Fetching comics and accessing them -----------------

const fetchComics = (currentPage, cardsPerPage, collection = 'comics', order = 'title') => {
	loader.classList.remove('hidden');
	fetch(`${baseURL}${collection}?apikey=${apiKey}&orderBy=${order}&offset=${currentPage * cardsPerPage}`)
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
				updatePagination(comicsQuantity, collection, order, currentPage);
			});
			loader.classList.add('hidden');
		});
};

fetchComics(currentPage, cardsPerPage, 'comics', 'title');

// -------------------------------- Generating cards -----------------------------

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
		createBackButton();
		// goBack(collection, id);
	});
};

// ----------------------- Fetching characters and accessing each of them --------------------------

const fetchCharacters = (collection = 'comics', comicId) => {
	fetch(`${baseURL}${collection}/${comicId}/characters?apikey=${apiKey}`).then((res) => res.json()).then((json) => {
		const foundCharacters = json.data.results;
		// this following condition does not work but the mapping does
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
					accessCharacter();
				});
		loader.classList.add('hidden');
		createBackButton();
		// goBack('comics', comicId);
	});
};

const accessCharacter = () => {
	const pickedCharacter = document.querySelectorAll('.character');
	pickedCharacter.forEach((character) => {
		character.onclick = () => {
			resultsSection.innerHTML = '';

			fetchCharacterID('characters', character.dataset.id);
			fetchComicsFromCharacters('characters', character.dataset.id);
		};
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
	});
};

// ------------------------ Fetching comics where characters participated on -------------------

const fetchComicsFromCharacters = (collection = 'characters', characterId) => {
	fetch(`${baseURL}${collection}/${characterId}/comics?apikey=${apiKey}`).then((res) => res.json()).then((json) => {
		const foundComics = json.data.results;
		// console.log(foundComics);
		// aside.innerHTML = '';
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
			// -------------------- accessing each comic according to character's ID ---------------------

			const pickedComic = document.querySelectorAll('.comic');
			pickedComic.forEach((comic) => {
				comic.onclick = () => {
					// console.log(comic, comic.dataset.id);
					htmlCards('comics', comic.dataset.id);
				};
			});
		});
		loader.classList.add('hidden');
	});
};

// --------------------------- Updating pagination --------------------------------

const buttonsAvailable = (currentPage, totalAmount, remainder) => {
	if (currentPage <= 0) {
		firstPage.disabled = true;
		previousPage.disabled = true;
		lastPage.disabled = false;
		nextPage.disabled = false;
	} else if (currentPage > 0) {
		firstPage.disabled = false;
		previousPage.disabled = false;
		lastPage.disabled = false;
		nextPage.disabled = false;
	} else if ((currentPage = (totalAmount - remainder) / cardsPerPage)) {
		lastPage.disabled = true;
		nextPage.disabled = true;
	} else if ((currentPage = (totalAmount - remainder) / cardsPerPage - cardsPerPage)) {
		lastPage.disabled = true;
		nextPage.disabled = true;
	}
};

const updatePagination = (totalAmount, collection, order, currentPage) => {
	const remainder = totalAmount % cardsPerPage;
	buttonsAvailable(currentPage, totalAmount, remainder);
	console.log('currentPage:', currentPage, 'totalAmount:', totalAmount, 'remaider:', remainder);

	firstPage.onclick = () => {
		currentPage = 0;
		collection !== 'comics' ? sortCharactersBy(order) : fetchComics(currentPage, cardsPerPage, collection, order);
	};
	nextPage.onclick = () => {
		currentPage++;
		collection !== 'comics' ? sortCharactersBy(order) : fetchComics(currentPage, cardsPerPage, collection, order);
	};
	previousPage.onclick = () => {
		currentPage--;
		collection !== 'comics' ? sortCharactersBy(order) : fetchComics(currentPage, cardsPerPage, collection, order);
	};
	lastPage.onclick = () => {
		if (remainder > 0) {
			currentPage = (totalAmount - remainder) / cardsPerPage;
			console.log('(totalAmount - remainder) / cardsPerPage', currentPage);
		} else {
			currentPage = totalAmount / cardsPerPage - cardsPerPage;
			console.log('totalAmount / cardsPerPage - cardsPerPage', currentPage);
		}
		console.log('currentPage', currentPage, 'remainder', remainder);
		collection !== 'comics' ? sortCharactersBy(order) : fetchComics(currentPage, cardsPerPage, collection, order);
	};
};

// --------------------------------- Updating results quantity ---------------------------

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

// ------------------------------ Search, type and order filters -------------------------

searchInput.value = '';
searchInput.oninput = () => {
	const word = searchInput.value;
	resultsSection.innerHTML = '';
	fetch(`${baseURL}comics?apikey=${apiKey}&titleStartsWith=${word}`).then((res) => res.json()).then((data) => {
		const resultsFound = data.data.results;
		// console.log(resultsFound);
		resultsFound.map((userSearch) => {
			// console.log(userSearch.title);
			resultsSection.innerHTML += `
						<article class="comic" data-id=${userSearch.id}>
                            	<div class="img-container">
                            		<img src=${noAvailableImg(userSearch)} alt="${userSearch.title}">
                            	</div>
                            	<div>                                               
                            		<p>${userSearch.title}</p>                               
                            	</div>
                        </article> 	
			`;

			const comicsHTML = document.querySelectorAll('.comic');
			comicsHTML.forEach((comic) => {
				comic.onclick = () => {
					// console.log('hiciste click a un comic');
					shownComics.textContent = '';
					htmlCards('comics', userSearch.id);
					searchInput.value = '';
				};
			});
		});
	});
};

typeSelect.onsubmit = () => {
	search();
};

orderSelect.onsubmit = () => {
	search();
};

const search = () => {
	const orderOption = orderSelect.options[orderSelect.selectedIndex].value;
	// 	console.log(orderOption);
	const typeOption = typeSelect.options[typeSelect.selectedIndex].value;
	// console.log(typeOption);
	if (typeOption === 'comics') {
		if (orderOption === 'A-Z') {
			fetchComics(currentPage, cardsPerPage, 'comics', 'title');
		} else if (orderOption === 'Z-A') {
			fetchComics(currentPage, cardsPerPage, 'comics', '-title');
		} else if (orderOption === 'most-updated-ones') {
			fetchComics(currentPage, cardsPerPage, 'comics', '-onsaleDate');
		} else if (orderOption === 'most-old-ones') {
			fetchComics(currentPage, cardsPerPage, 'comics', 'onsaleDate');
		}
	} else if (typeOption === 'characters') {
		if (orderOption === 'A-Z') {
			sortCharactersBy('name');
		} else if (orderOption === 'Z-A') {
			sortCharactersBy('-name');
		} else if (orderOption === 'most-updated-ones') {
			sortCharactersBy('modified');
		} else if (orderOption === 'most-old-ones') {
			sortCharactersBy('-modified');
		}
		// updateResultsQuantity(collection);
	}
	// goBack(typeOption);
};

searchButton.onclick = (e) => {
	e.preventDefault();
	search();
};

const sortCharactersBy = (order) => {
	fetch(`${baseURL}characters?apikey=${apiKey}&orderBy=${order}`).then((res) => res.json()).then((data) => {
		const characters = data.data.results;
		// console.log(characters);
		resultsSection.innerHTML = '';
		characters.map((character) => {
			resultsSection.innerHTML += `
			<article class="character" data-id=${character.id}>
				<div class="img-container">
					<img src=${noAvailableImg(character)} alt="image of ${character.name}"/>
					<h2>${character.name}</h2>
				</div>						
			</article>		
			`;
			accessCharacter();
		});
	});
};

// -------------------------- When fetched card has no img to show -----------------

const noAvailableImg = (data) => {
	return data.thumbnail.path.includes('not_available')
		? `./assets/noPhotoAvailable.jpg`
		: `${data.thumbnail.path}.${data.thumbnail.extension}`;
};

// ------------------------ Creating a "back" button just once ----------------------

let executed = false;
const createBackButton = () => {
	if (!executed) {
		executed = true;
		const backButton = document.createElement('button');
		const buttonsContainer = document.querySelector('.center-button');
		buttonsContainer.appendChild(backButton);
		backButton.textContent = 'BACK';
		backButton.onclick = () => {
			// goBack();
		};
	}
};

// --------------------- "back" button function ------------------------

const goBack = (collection) => {
	console.log('estas retrocediendo');
	resultsSection.innerHTML = '';
	aside.innerHTML = '';

	// if (collection === 'comics') {
	fetchComics(currentPage, cardsPerPage, collection, 'title');
	// } else {
	// }
};
