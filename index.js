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

// -------------------------- Cards display -----------------------------

const displayCard = (section, articleClass, imgClass, id, img, tag, title) => {
	section.innerHTML += `
	<article class=${articleClass} data-id=${id}>
		<div class=${imgClass}>
			<img src=${img} alt="image of ${title}">                                             
			<${tag}>${title}</${tag}>                               
		</div>
	</article> 	
	`;
};

// -------------------------- Fetching comics -----------------------

const renderComics = (comics, section) => {
	comics.map((comic) => {
		displayCard(section, 'comic', 'img-container', comic.id, noAvailableImg(comic), 'p', comic.title);
	});
};

const fetchComics = (collection = 'comics', order = 'title') => {
	loader.classList.remove('hidden');

	fetch(`${baseURL}${collection}?apikey=${apiKey}&orderBy=${order}&offset=${currentPage * cardsPerPage}`)
		.then((res) => res.json())
		.then((data) => {
			const comics = data.data.results;
			resultsSection.innerHTML = '';
			renderComics(comics, resultsSection);

			// ----------------------- Updating shown results quantity ----------------------

			updateResultsQuantity(data.data.total);

			// ----------------------- Accessing each comic and unpdating pagination ----------

			eachComic('comics');
			updatePagination(data.data.total, collection, order);
			loader.classList.add('hidden');
		});
	// createRecord(collection, null, order);
};

fetchComics('comics', 'title');

const eachComic = (collection) => {
	const comics = document.querySelectorAll('.comic');
	comics.forEach((comic) => {
		comic.onclick = () => {
			accessComic(collection, comic.dataset.id);
		};
	});
};

// -------------------------------- Display comic details -----------------------------

const accessComic = (collection = 'comics', id) => {
	loader.classList.remove('hidden');
	aside.innerHTML = '';
	fetch(`${baseURL}${collection}/${id}?apikey=${apiKey}`).then((res) => res.json()).then((json) => {
		const pickedComic = json.data.results;
		pickedComic.map((comic) => {
			resultsSection.innerHTML = '';

			updateResultsQuantity(comic.characters.available);
			comic.characters.available === 0
				? (aside.innerHTML += `<p>No characters found 😕</p>`)
				: fetchCharacters('comics', comic.id);

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
	});
	// createRecord(collection, id, null);
};

// ----------------------- Fetching characters and accessing each of them --------------------------

const renderCharacters = (characters) =>
	characters.map((character) => {
		displayCard(aside, 'character', 'img-container', character.id, noAvailableImg(character), 'h2', character.name);
		accessCharacter();
	});

const fetchCharacters = (collection = 'comics', comicId) => {
	fetch(`${baseURL}${collection}/${comicId}/characters?apikey=${apiKey}`).then((res) => res.json()).then((json) => {
		const foundCharacters = json.data.results;
		renderCharacters(foundCharacters);
		loader.classList.add('hidden');
		createBackButton();
	});
	// createRecord(collection, comicId, null);
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
		displayCard(
			resultsSection,
			'picked-comic',
			'img-container',
			character.id,
			noAvailableImg(character),
			'h2',
			character.name
		);
		updatePagination(character.comics.available, 'comics', 'title');
	});
	// createRecord(collection, characterID, null);
};

// ------------------------ Fetching comics where characters participated on -------------------

const fetchComicsFromCharacters = (collection = 'characters', characterId) => {
	fetch(`${baseURL}${collection}/${characterId}/comics?apikey=${apiKey}`).then((res) => res.json()).then((json) => {
		const foundComics = json.data.results;

		renderComics(foundComics, aside);
		// foundComics.map((comic) => {
		// 	displayCard(aside, 'comic', 'img-container', comic.id, noAvailableImg(comic), 'p', comic.title);

		// -------------------- Accessing each comic according to character's ID ---------------------

		eachComic('comics');
		updateResultsQuantity(json.data.total);
	});
	loader.classList.add('hidden');
	// });
	// createRecord(collection, characterId, null);
};

// --------------------------- Updating pagination --------------------------------

const buttonsAvailable = (totalAmount) => {
	const isLastPage = currentPage === Math.floor(totalAmount / cardsPerPage);
	previousPage.disabled = currentPage <= 0;
	firstPage.disabled = currentPage <= 0;
	lastPage.disabled = isLastPage;
	nextPage.disabled = isLastPage;
};

const updatePagination = (totalAmount, collection, order) => {
	const runFetch = () => {
		collection !== 'comics' ? sortCharactersBy(order) : fetchComics(collection, order);
	};

	firstPage.onclick = () => {
		currentPage = 0;
		runFetch();
	};
	nextPage.onclick = () => {
		currentPage++;
		runFetch();
	};
	previousPage.onclick = () => {
		currentPage--;
		runFetch();
	};
	lastPage.onclick = () => {
		currentPage = Math.floor(totalAmount / cardsPerPage);
		runFetch();
	};
	buttonsAvailable(totalAmount);
};

// --------------------------------- Updating results quantity ---------------------------

const updateResultsQuantity = (cards) => {
	shownComics.textContent = '';
	let comicsQuantity = cards;
	return comicsQuantity !== 0
		? (shownComics.textContent = `Showing ${comicsQuantity} results`)
		: (shownComics.textContent = 'No further results 😪');
};

// ------------------------------ Search, type and order filters -------------------------

searchInput.value = '';
searchInput.oninput = () => {
	// search();
	// const word = searchInput.value;
	// resultsSection.innerHTML = '';
	// fetch(`${baseURL}comics?apikey=${apiKey}&titleStartsWith=${word}`).then((res) => res.json()).then((data) => {
	// 	const resultsFound = data.data.results;
	// 	// console.log(resultsFound);
	// 	resultsFound.map((userSearch) => {
	// 		console.log(userSearch.title);
	// 		displayCard(
	// 			resultsSection,
	// 			'comic',
	// 			'img-container',
	// 			userSearch.id,
	// 			noAvailableImg(userSearch),
	// 			'p',
	// 			userSearch.title
	// 		);
	// 		eachComic(collection);
	// 		searchInput.value = '';
	// 	});
	// });
};

searchButton.onsubmit = (e) => {
	e.preventDefault();
	search();
};

// typeSelect.onsubmit = () => {
// 	search();
// };

// orderSelect.onsubmit = () => {
// 	search();
// };

const search = () => {
	const orderOption = orderSelect.options[orderSelect.selectedIndex].value;
	console.log(orderOption);
	const typeOption = typeSelect.options[typeSelect.selectedIndex].value;
	console.log(typeOption);

	// const orderByOption = (order) => {
	// 	fetchComics('comics', order);
	// };
	if (typeOption === 'comics') {
		console.log('type option: Comics');
		if (orderOption === 'A-Z') {
			// orderByOption('title');
			fetchComics('comics', 'title');
		} else if (orderOption === 'Z-A') {
			// orderByOption('-title');
			fetchComics('comics', '-title');
		} else if (orderOption === 'most-updated-ones') {
			// orderByOption('-onsaleDate');
			fetchComics('comics', '-onsaleDate');
		} else if (orderOption === 'most-old-ones') {
			// orderByOption('onsaleDate');
			fetchComics('comics', 'onsaleDate');
		}
	} else if (typeOption === 'characters') {
		console.log('type option: Characters');
		if (orderOption === 'A-Z') {
			sortCharactersBy('name');
		} else if (orderOption === 'Z-A') {
			sortCharactersBy('-name');
		} else if (orderOption === 'most-updated-ones') {
			sortCharactersBy('modified');
		} else if (orderOption === 'most-old-ones') {
			sortCharactersBy('-modified');
		}
		// updatePagination(totalAmount, collection, order, currentPage)
		// updateResultsQuantity(collection);
	}
	// goBack(typeOption);
};

const sortCharactersBy = (order) => {
	fetch(`${baseURL}characters?apikey=${apiKey}&orderBy=${order}`).then((res) => res.json()).then((data) => {
		const characters = data.data.results;
		// console.log(characters);
		resultsSection.innerHTML = '';
		characters.map((character) => {
			displayCard(
				resultsSection,
				'character',
				'img-container',
				character.id,
				noAvailableImg(character),
				'h2',
				character.name
			);
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
			goBack();
		};
	}
};

// --------------------- "back" button function ------------------------

// const goBack = (collection) => {
// 	console.log('estas retrocediendo');
// 	resultsSection.innerHTML = '';
// 	aside.innerHTML = '';

// 	// if (collection === 'comics') {
// 	fetchComics(collection, 'title');
// 	// } else {
// 	// }
// };

// const history = [];

// const createRecord = (collection, id, order) => {
// 	history.push({ collection, id, order });
// };

// const goBack = () => {
// 	console.log('hiciste click');
// 	const { collection, id, order } = history[history.length - 2];
// 	console.log('history', history);
// 	console.log(collection, id, order);
// 	switch (collection) {
// 		case 'comics':
// 			fetchComics(collection, order);
// 			break;
// 		case 'characters':
// 			fetchCharacters(collection, id);
// 			break;
// 		default:
// 			break;
// 	}
// 	// history.pop();
// };
