// --------------------------------- Variable declaration ----------------------------

const baseURL = 'https://gateway.marvel.com/v1/public/';
const apiKey = '5815682df904a6080be6caaebd915b02';
const form = document.forms[0];
const searchInput = document.querySelector('#search-input');
// El value del input en la carga de la pagina ya es un string vacio: no deberia ser necesario esto
searchInput.value = '';
const typeSelect = document.querySelector('#type');
const orderSelect = document.querySelector('#order');
const resultsSection = document.querySelector('.results');
const aside = document.querySelector('aside');
const shownComics = document.querySelector('.title > p');
// Este textContent en la carga de la pagina ya es un string vacio: no deberia ser necesario esto
shownComics.textContent = '';
const loader = document.querySelector('.overlay');
const body = document.body;
// Por que creamos aqui esto en lugar de tenerlo en el HTML y seleccionarlo desde JS?
const paginationButtons = document.createElement('div');
paginationButtons.setAttribute('class', 'center-button');
body.appendChild(paginationButtons);
const buttonsContainer = document.querySelector('.center-button');
const backButton = document.createElement('button');
backButton.textContent = 'BACK';
const cardsPerPage = 20;
let currentPage = 0;
let executed = false;
// let lastVisited = [];

// ------------------------------ Creating pagination buttons ------------------------

// Es mejor usar iconos con un alt para los botones que un texto: un lector de pantalla
// va a tratar de leer "<", dejando al usuario no-vidente muy confundido
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

// ------------------------ Creating a "back" button just once ----------------------

const createBackButton = () => {
	if (!executed) {
		executed = true;
		buttonsContainer.appendChild(backButton);
	}
};

// -------------------------- Cards display -----------------------------

// imgClass siempre es "img-container", por que agregarlo como param?
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

const renderComics = (comics, section) => {
	comics.map((comic) => {
		displayCard(section, 'comic', 'img-container', comic.id, noAvailableImg(comic), 'p', comic.title);
	});
	loader.classList.add('hidden');
};

const renderInfoComic = (comic) => {
	const date = new Date(comic.modified);
			// Aqui podriamos decir: !comic.creators.available  ?
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
};

const renderCharacters = (characters, section) => {
	characters.map((character) => {
		displayCard(
			section,
			'character',
			'img-container',
			character.id,
			noAvailableImg(character),
			'h2',
			character.name
		);
		accessCharacter();
	});
};

// -------------------------- When fetched card has no img to show -----------------

const noAvailableImg = (data) => {
	return data.thumbnail.path.includes('not_available')
		? `./assets/noPhotoAvailable.jpg`
		: `${data.thumbnail.path}.${data.thumbnail.extension}`;
};

// -------------------------- Fetching comics -----------------------

const fetchComics = (order = 'title') => {
	loader.classList.remove('hidden');
	fetch(`${baseURL}comics?apikey=${apiKey}&orderBy=${order}&offset=${currentPage * cardsPerPage}`)
		.then((res) => res.json())
		.then((data) => {
			const comics = data.data.results;
			resultsSection.innerHTML = '';
			renderComics(comics, resultsSection);

			// ----------------------- Updating shown results quantity ----------------------

			updateResultsQuantity(data.data.total);

			// ----------------------- Accessing each comic and unpdating pagination ----------

			eachComic('comics');
			updatePagination(data.data.total, 'comics');
		});
};

fetchComics();

const eachComic = () => {
	const comics = document.querySelectorAll('.comic');
	comics.forEach((comic) => {
		comic.onclick = () => {
			loader.classList.remove('hidden');
			accessComic(comic.dataset.id);
		};
	});
};

const accessComic = (id) => {
	aside.innerHTML = '';
	fetch(`${baseURL}comics/${id}?apikey=${apiKey}`).then((res) => res.json()).then((json) => {
		const pickedComic = json.data.results;
		pickedComic.map((comic) => {
			resultsSection.innerHTML = '';
			updateResultsQuantity(comic.characters.available);
			// !comic.characters.available en lugar de igual a 0
			comic.characters.available === 0
				? (aside.innerHTML += `<p>No characters found 😕</p>`)
				: fetchCharacters(comic.id);

			// ---------------------- Enable to retrieve this function ------------------

			// goBack(accessComic, comic.id);
			loader.classList.add('hidden');

			// -------------------- Show comic details ------------------
			renderInfoComic(comic);
		});
		createBackButton();
	});
};

// ----------------------- Fetching characters and accessing each of them --------------------------

const fetchCharacters = (comicId) => {
	fetch(`${baseURL}comics/${comicId}/characters?apikey=${apiKey}`).then((res) => res.json()).then((json) => {
		const foundCharacters = json.data.results;
		renderCharacters(foundCharacters, aside);
	});
};

const fetchCharacterID = (characterID) => {
	fetch(`${baseURL}characters/${characterID}?apikey=${apiKey}`).then((res) => res.json()).then((json) => {
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
		updatePagination(character.comics.available, 'characters');
	});
};

const eachCharacter = (characters) => {
	characters.forEach((character) => {
		character.onclick = () => {
			resultsSection.innerHTML = '';
			loader.classList.remove('hidden');
			fetchCharacterID(character.dataset.id);
			fetchComicsFromCharacters(character.dataset.id);
		};
	});
};

const accessCharacter = () => {
	// estos son muchos personajes, una lista. El nombre es confuso. Mejor pickedCharacters
	const pickedCharacter = document.querySelectorAll('.character');
	eachCharacter(pickedCharacter);
};

// ------------------------ Fetching comics where characters participated on -------------------

const fetchComicsFromCharacters = (characterId) => {
	fetch(`${baseURL}characters/${characterId}/comics?apikey=${apiKey}`).then((res) => res.json()).then((json) => {
		const foundComics = json.data.results;
		renderComics(foundComics, aside);
		// goBack(fetchComicsFromCharacters, characterId);

		// -------------------- Accessing each comic according to character's ID ---------------------

		eachComic();

		// --------- Updating results quantity --------------

		updateResultsQuantity(json.data.total);
	});
};

// --------------------------- Updating pagination --------------------------------

const buttonsAvailable = (totalAmount) => {
	const isLastPage = currentPage === Math.floor(totalAmount / cardsPerPage);
	previousPage.disabled = currentPage <= 0;
	firstPage.disabled = currentPage <= 0;
	lastPage.disabled = isLastPage;
	nextPage.disabled = isLastPage;
};

const updatePagination = (totalAmount, collection) => {
	const runFetch = () => {
		aside.innerHTML = '';
		collection !== 'comics'
			? fetch(`${baseURL}characters?apikey=${apiKey}&offset=${currentPage * cardsPerPage}`)
					.then((res) => res.json())
					.then((json) => {
						const results = json.data.results;
						resultsSection.innerHTML = '';
						renderCharacters(results, resultsSection);
					})
			: fetchComics();
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

	backButton.onclick = () => {
		// Como aqui no estamos definiendo que currentPage es 0, la paginacion se rompe al usar este boton
		aside.innerHTML = '';
		fetchComics();
	};
	buttonsAvailable(totalAmount);
};

// --------------------------------- Updating results quantity ---------------------------

const updateResultsQuantity = (cards) => {
	let comicsQuantity = cards;
	return comicsQuantity !== 0
		? (shownComics.textContent = `Showing ${comicsQuantity} results`)
		: (shownComics.textContent = 'No further results 😪');
};

// ------------------------------ Search, type and order filters -------------------------

form.onsubmit = (e) => {
	e.preventDefault();
	createBackButton();
	loader.classList.remove('hidden');
	search();
};

const params = (userInput) => {
	const orderOption = orderSelect.value;
	const typeOption = typeSelect.value;
	// Evitamos los ternarios anidados porque son muy dificiles de leer. Aqui es prefefrible un if:
	// menos abstracto, pero mas explicito. 
	return `${baseURL}${typeOption}?apikey=${apiKey}${userInput}&orderBy=${orderOption == 'A-Z' &&
	typeOption == 'comics'
		? 'title'
		: orderOption == 'Z-A' && typeOption == 'comics'
			? '-title'
			: orderOption == 'most-updated-ones' && typeOption == 'comics'
				? '-onsaleDate'
				: orderOption == 'most-old-ones' && typeOption == 'comics'
					? 'onsaleDate'
					: orderOption == 'A-Z' && typeOption == 'characters'
						? 'name'
						: orderOption == 'Z-A' && typeOption == 'characters'
							? '-name'
							: orderOption == 'most-updated-ones' && typeOption == 'characters'
								? 'modified'
								: orderOption == 'characters' && typeOption == 'characters' ? '-modified' : 'name'}`;
};

const displayContent = (info) => {
	const typeOption = typeSelect.value;
	typeOption == 'comics' ? renderComics(info, resultsSection) : renderCharacters(info, resultsSection);
	eachComic();
	loader.classList.add('hidden');
};

// No dejemos codigo comentado en una entrega

// const ignore = (userInput, outcome) => {
// 	let str1 = userInput.toUpperCase();
// 	let str2 = outcome.toUpperCase();
// 	let find = -1;
// 	for (let i = 0; i < str1.length; i++) {
// 		find = str2.indexOf(str1.charAt(i));
// 		if (find > -1) {
// 			str2 = str2.substr(0, find) + str2.substr(find + 1);
// 		}
// 	}
// 	console.log('userInput:', str1, 'outcome:', str2);
// };

// ignore('Spiderman', 'Spider-man: #100.');

const search = () => {
	resultsSection.innerHTML = '';
	aside.innerHTML = '';
	const typeOption = typeSelect.value;
	// mejor asi: if (searchInput.value) {
	if (searchInput.value !== '') {
		// console.log(searchInput.value.replace(/[^a-zA-Z ]/g, ''));
		fetch(params(`&${typeOption == 'comics' ? 'title' : 'name'}StartsWith=${searchInput.value}`))
			.then((res) => res.json())
			.then((data) => {
				displayContent(data.data.results);
				updateResultsQuantity(data.data.total);
				updatePagination(data.data.total, data.data.results);
			});
	} else {
		fetch(params('')).then((res) => res.json()).then((data) => {
			displayContent(data.data.results);
			updateResultsQuantity(data.data.total);
			updatePagination(data.data.total, data.data.results);
		});
	}
};

// --------------------- "back" button function ------------------------

// const goBack = (history, param1, param2) => {
// 	backButton.onclick = () => {
// 		// console.log(history, param1, param2);
// 		aside.innerHTML = '';

// 		if (!history.toString().includes('pickedComic') || !history.toString().includes('foundC')) {
// 			fetchComics('title');
// 		} else history(param1, param2);
// 	};
// };
