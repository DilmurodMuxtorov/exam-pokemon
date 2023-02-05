// Selectors
const elSavedBtn = document.querySelector(".poke-saved-btn");
const elSavedPokemonsCount = document.querySelector(".saved-pokemons-count");
const elform = document.querySelector(".poke-search-form");
const elPokeTypeSelect = document.querySelector(".poke-type-select");
const elSearchPokeInput = document.querySelector(".search-poke-input");
const elSortPoke = document.querySelector(".sort-poke-select");
const elPokeResultList = document.querySelector(".poke-results-list");
const elSavedPokemonsWrapper = document.querySelector(".saved-pokemons-wrapper");
const elSavedPokemonsList = document.querySelector(".saved-pokemons-list");
const elCloseModalBtn = document.querySelector(".close-modal-btn");
const elPokeTemplate = document.querySelector(".poke-template").content;
const elSavedPokeTemplate = document.querySelector(".saved-poke-template").content;

const POKEMON_API = "https://63a1743de3113e5a5c55c4de.mockapi.io/api/exam/pokemons";
const newFragment = new DocumentFragment();

elSavedPokemonsCount.textContent = 0;

// Events
elform.addEventListener("submit", (evt) => {
    evt.preventDefault();
    const elSearchPokeInputValue = elSearchPokeInput.value.trim()
    const elPokeTypeSelectValue = elPokeTypeSelect.value;
    const elSortPokeValue = elSortPoke.value;

    const regExp = new RegExp(elSearchPokeInputValue, "gi");

    const res = resolve.filter(item => item.name.match(regExp) && (item.type == elPokeTypeSelectValue || elPokeTypeSelectValue == "gross"));

    if (elSortPokeValue === "a-z") {
        res.sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1);
    } else {
        res.sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? -1 : 1)
    }

    renderElements(res, elPokeResultList);
})

// Saved button click
elSavedBtn.addEventListener("click", () => {
    elSavedPokemonsWrapper.style.transform = "translateX(0)";
    document.body.style.overflow = "hidden";
})

// Close button click
elCloseModalBtn.addEventListener("click", () => {
    elSavedPokemonsWrapper.style.transform = "translateX(100%)";
    document.body.style.overflow = "scroll";
})

elSavedPokemonsList.addEventListener("click", evt => {
    if (evt.target.matches(".poke-remove-btn")) {
        const removedObkect = savedElements.find(item => item.id == evt.target.dataset.id);
        savedElements.splice(removedObkect, 1);
        elSavedPokemonsCount.textContent = savedElements.length;
        localStorage.setItem("object", JSON.stringify(savedElements));
        renderSavedElements(savedElements, elSavedPokemonsList);
        console.log(savedElements);
    }
})


let resolve = [];
// Functions
// Fetch elements
async function fetchElemetns() {
    try {
        const response = await fetch(POKEMON_API);
        const body = await response.json();
        resolve = [...body];
        renderElements(resolve, elPokeResultList);
    } catch (error) {
        console.log(error.message);
    }
}

const savedElements = JSON.parse(localStorage.getItem("object")) || [];

renderSavedElements(savedElements, elSavedPokemonsList);
// console.log(savedElements);
elPokeResultList.addEventListener("click", (evt) => {
    if (evt.target.matches(".poke-save-btn")) {
        const savedObject = resolve.find(item => item.id == evt.target.dataset.id);

        if (!savedElements.includes(savedObject)) {
            savedElements.push(savedObject);

            localStorage.setItem("object", JSON.stringify(savedElements));
        }
        console.log(savedElements);
        renderSavedElements(savedElements, elSavedPokemonsList);
    }
})

// Saving element to local storage
function saveLocalElement(element) {
    let elements;
    if (localStorage.getItem("elements") === null) {
        elements = [];
    } else {
        elements = JSON.parse(localStorage.getItem("elements"));
    }
    elements.unshift(element);
    localStorage.setItem("elements", JSON.stringify(elements));
}

// Geting element from local storage
function getLocalElement(element) {
    let elements;
    if (localStorage.getItem("elements") === null) {
        elements = [];
    } else {
        elements = JSON.parse(localStorage.getItem("elements"));
    }

    console.log(elements);
}

// Render elements
async function renderElements(data, node) {
    node.innerHTML = "";
    data.forEach(item => {
        const elPokeTemplateCloned = elPokeTemplate.cloneNode(true);

        elPokeTemplateCloned.querySelector(".poke-img").src = item.img;
        elPokeTemplateCloned.querySelector(".poke-name").textContent = item.name;
        elPokeTemplateCloned.querySelector(".poke-type").textContent = item.type;
        elPokeTemplateCloned.querySelector(".poke-weight").textContent = `${item.weight} kg`;
        elPokeTemplateCloned.querySelector(".poke-age").textContent = `${item.age} age`;
        elPokeTemplateCloned.querySelector(".poke-save-btn").dataset.id = item.id;

        newFragment.appendChild(elPokeTemplateCloned);
    });

    node.appendChild(newFragment);
}

// Render saved elements
function renderSavedElements(data, node) {

    node.innerHTML = "";
    data.forEach(item => {
        const elSavedPokeTemplateCloned = elSavedPokeTemplate.cloneNode(true);
        // console.log(item);

        elSavedPokeTemplateCloned.querySelector(".poke-img").src = item.img;
        elSavedPokeTemplateCloned.querySelector(".poke-name").textContent = item.name;
        elSavedPokeTemplateCloned.querySelector(".poke-type").textContent = item.type;
        elSavedPokeTemplateCloned.querySelector(".poke-weight").textContent = `${item.weight} kg`;
        elSavedPokeTemplateCloned.querySelector(".poke-age").textContent = `${item.age} age`;
        elSavedPokeTemplateCloned.querySelector(".poke-remove-btn").dataset.id = item.id;

        newFragment.appendChild(elSavedPokeTemplateCloned);
    });

    node.appendChild(newFragment);
    elSavedPokemonsCount.textContent = data.length;
}

fetchElemetns();