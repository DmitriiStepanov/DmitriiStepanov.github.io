const autorizedBlock = document.getElementById('username-autorized');
const calloriesNumber = document.getElementById('callories-number');

autorizedBlock.innerText = localStorage.getItem('username');
calloriesNumber.innerText = localStorage.getItem('callories');

const scoreSection = document.querySelector(".score");
const levelSpan = scoreSection.querySelector(".level");
const livesSpan = document.querySelector("#lives")


const sec = document.querySelector("#sec")
const mili = document.querySelector("#count")

const playAgainBtn = scoreSection.querySelector("#play-again-btn");

const draggableItems = document.querySelector(".draggable-items");
const matchingPairsLeft = document.querySelector(".matching-pairs-left");
const matchingPairsRight = document.querySelector(".matching-pairs-right");
let correct = 0;
let lives = 3
let level = 2

const totalDraggableItems = 8;

let timer = false;
let second = 15;

const getResultText = (mistake) => {
	switch (mistake) {
		case 0:
			return "Лучший из лучших! Настоящий победитель и король теории питания!"
		case 1:
			return "А ты хорош! Но это не предел!"
		case 2:
			return "Ты молодец! Даже несмотря на то, что потратил 2 попытки ;)"
		case 3:
			return "Подучи теорию и попробуй ещё разок!"
	}
}

function startTimer() {
	timer = true
	stopWatch()
}

function stopTimer() {
	timer = false
}

function resetTimer() {
	timer = false
	second = 15;
	sec.innerHTML = "15"
}

function stopWatch() {
	if (timer) {
		second--

		let secString = second

		if (second < 10) {
			secString = "0" + secString
		}

		if (second === 0) {
			timer = false
			--lives
			if (lives > 0) {
				levelSpan.innerText = level
			}
			if (lives === 0) {
				resultModal.style.display = "block"
			} else {
				playAgainBtn.style.display = "block";
				setTimeout(() => {
					resultModal.style.display = "block"
					const text = getResultText(3)
					resultTextDiv.innerText = text
					draggableItems.style.pointerEvents = 'none';
				}, 200);
			}
			livesSpan.textContent = lives
			draggableItems.style.pointerEvents = 'none';
		}
		sec.innerHTML = secString
		setTimeout(stopWatch, 1000)
	}
}

const categories = [
	{ category: 'carbohydrates' },
	{ category: 'cellular' },
	{ category: 'fats' },
	{ category: 'protein' },
]

const carbohydrates = [
	{ name: 'beet', category: 'carbohydrates', img: '../images/carbohydrates/beet.png' },
	{ name: 'buckwheat', category: 'carbohydrates', img: '../images/carbohydrates/buckwheat.png' },
	{ name: 'quinoa', category: 'carbohydrates', img: '../images/carbohydrates/quinoa.png' },
	{ name: 'sweet-potato', category: 'carbohydrates', img: '../images/carbohydrates/sweet-potato.png' }
]
const cellular = [
	{ name: 'apple', category: 'cellular', img: '../images/cellular/apple.png' },
	{ name: 'cabbage', category: 'cellular', img: '../images/cellular/cabbage.png' },
	{ name: 'dill', category: 'cellular', img: '../images/cellular/dill.png' },
	{ name: 'kiwi', category: 'cellular', img: '../images/cellular/kiwi.png' }
]
const fats = [
	{ name: 'avocado', category: 'fats', img: '../images/fats/avocado.png' },
	{ name: 'natural-yogurt', category: 'fats', img: '../images/fats/natural-yogurt.png' },
	{ name: 'nuts', category: 'fats', img: '../images/fats/nuts.png' },
	{ name: 'olives', category: 'fats', img: '../images/fats/olives.png' }
]
const protein = [
	{ name: 'beef', category: 'protein', img: '../images/protein/beef.png' },
	{ name: 'eggs', category: 'protein', img: '../images/protein/eggs.png' },
	{ name: 'salmon', category: 'protein', img: '../images/protein/salmon.png' },
	{ name: 'tofu', category: 'protein', img: '../images/protein/tofu.png' }
]

const rulesModal = document.getElementById('rules-modal');
const resultModal = document.getElementById('result-modal');
const resultTextDiv = document.getElementById("result-text");



const btnStart = document.getElementById("start");
const btnTryAgain = document.getElementById('try-again');
const btnExit = document.getElementById('exit');

let draggableElements;
let droppableElements;

initiateGame();


rulesModal.style.display = "block";

btnTryAgain.onclick = function () {
	window.location.href = `level2.html`
}

btnExit.onclick = function () {
	window.location.href = '../index.html'
}

function initiateGame() {
	btnStart.onclick = function () {
		rulesModal.style.display = "none";
		startTimer()
	}

	const randomDraggableBrands = generateRandomItemsArray(carbohydrates, cellular, fats, protein);

	for (let i = 0; i < randomDraggableBrands.length; i++) {
		console.log(randomDraggableBrands.length);
		draggableItems.insertAdjacentHTML("beforeend", `<img class="card draggable" category="${randomDraggableBrands[i].category}" id="${randomDraggableBrands[i].name}" src="${randomDraggableBrands[i].img}"/>`);
	}

	for (let i = 0; i < 4; i++) {
		matchingPairsLeft.insertAdjacentHTML("beforeend", `
       <div class="matching-pair">
         <div class="label">${categories[i].category}</div>
         <div class="droppable" data-brand="${categories[i].category}"></div>
			<div class="droppable" data-brand="${categories[i].category}"></div>
       </div>
     `);
	}

}


draggableElements = document.querySelectorAll(".draggable");
droppableElements = document.querySelectorAll(".droppable");

draggableElements.forEach(elem => {
	elem.addEventListener("dragstart", dragStart);
});

droppableElements.forEach(elem => {
	elem.addEventListener("dragenter", dragEnter);
	elem.addEventListener("dragover", dragOver);
	elem.addEventListener("dragleave", dragLeave);
	elem.addEventListener("drop", drop);
});

function dragStart(event) {
	event.dataTransfer.setData("text/html", event.target.getAttribute("category"));
	// Получаем id перетаскиваемого элемента
	const id = event.target.id;
	// Добавляем данные в объект 'DataTransfer'
	event.dataTransfer.setData("text/plain", id);
}

function dragEnter(event) {
	if (event.target.classList && event.target.classList.contains("droppable") && !event.target.classList.contains("dropped")) {
		event.target.classList.add("droppable-hover");
	}
}

function dragOver(event) {
	if (event.target.classList && event.target.classList.contains("droppable") && !event.target.classList.contains("dropped")) {
		event.preventDefault();
	}
}

function dragLeave(event) {
	if (event.target.classList && event.target.classList.contains("droppable") && !event.target.classList.contains("dropped")) {
		event.target.classList.remove("droppable-hover");
	}
}


function drop(event) {

	event.preventDefault();
	event.target.classList.remove("droppable-hover");
	const draggableElementBrand = event.dataTransfer.getData("text/html");
	console.log(draggableElementBrand);
	const droppableElementBrand = event.target.getAttribute("data-brand");
	const draggableProduct = event.dataTransfer.getData("text/plain");
	console.log(droppableElementBrand);
	console.log('obj',
		draggableElementBrand === droppableElementBrand ? true : `${draggableElementBrand}-level-2` === droppableElementBrand)


	const isCorrectMatching = draggableElementBrand === droppableElementBrand;
	console.log(isCorrectMatching);

	if (isCorrectMatching) {
		const draggableElement = document.getElementById(draggableProduct);
		event.target.classList.add("dropped");
		draggableElement.classList.add("dragged");
		draggableElement.setAttribute("draggable", "false");
		event.target.innerHTML = `<img draggable='false' src="${draggableElement.src}"/>`;
		correct++;
	} else {
		--lives
		livesSpan.textContent = lives
		if (lives === 0) {


			resultModal.style.display = "block"
			const text = getResultText(3 - lives)
			resultTextDiv.innerText = text
			stopTimer()
			draggableItems.style.pointerEvents = 'none';
		}

	}
	scoreSection.style.opacity = 0;
	setTimeout(() => {
		scoreSection.style.opacity = 1;
	}, 200);
	if (correct === totalDraggableItems) {
		window.location.href = '../pages/level3.html';
		if (level > lastLevel) {
			resultModal.style.display = "block"
			const text = getResultText(3 - lives)
			resultTextDiv.innerText = text
			stopTimer()
		} else {
			levelSpan.innerText = level
			stopTimer()
			playAgainBtn.style.display = "block";
			setTimeout(() => {
				playAgainBtn.classList.add("play-again-btn-entrance");
			}, 200);
		}
	}
}

// Other Event Listeners
playAgainBtn.addEventListener("click", playAgainBtnClick);

function playAgainBtnClick() {
	draggableItems.style.pointerEvents = null;

	playAgainBtn.classList.remove("play-again-btn-entrance");
	correct = 0;
	draggableItems.style.opacity = 0;
	matchingPairsLeft.style.opacity = 0;
	setTimeout(() => {
		scoreSection.style.opacity = 0;
	}, 100);
	setTimeout(() => {
		playAgainBtn.style.display = "none";
		while (draggableItems.firstChild) draggableItems.removeChild(draggableItems.firstChild);
		while (matchingPairsLeft.firstChild) matchingPairsLeft.removeChild(matchingPairsLeft.firstChild);
		initiateGame();
		draggableItems.style.opacity = 1;
		matchingPairsLeft.style.opacity = 1;
		scoreSection.style.opacity = 1;
		resetTimer()
		startTimer()
	}, 500);
}

function randomInteger(max) {
	let rand = Math.random() * max;
	return Math.floor(rand);
}

function shuffle(array) {

	const items = [...array]
	for (let i = items.length - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * (i + 1));
		[items[i], items[j]] = [items[j], items[i]];
	}
	return items
};

function generateRandomItemsArray(arrCarbohydrates, arrCellular, arrFats, arrProtein) {

	function getRandomIndex(max, excludedIndex) {
		let index = randomInteger(max);
		while (index === excludedIndex) {
			index = randomInteger(max);
		}
		return index;
	}

	const randomIndexCarbohydrates1 = randomInteger(arrCarbohydrates.length);
	const randomIndexCarbohydrates2 = getRandomIndex(arrCarbohydrates.length, randomIndexCarbohydrates1);
	const randomIndexCellular1 = randomInteger(arrCellular.length);
	const randomIndexCellular2 = getRandomIndex(arrCellular.length, randomIndexCellular1);
	const randomIndexFats1 = randomInteger(arrFats.length);
	const randomIndexFats2 = getRandomIndex(arrFats.length, randomIndexFats1);
	const randomIndexProtein1 = randomInteger(arrProtein.length);
	const randomIndexProtein2 = getRandomIndex(arrProtein.length, randomIndexProtein1);
	let res = []
	res = [arrCarbohydrates[randomIndexCarbohydrates1],
	arrCarbohydrates[randomIndexCarbohydrates2],
	arrCellular[randomIndexCellular1],
	arrCellular[randomIndexCellular2],
	arrFats[randomIndexFats1],
	arrFats[randomIndexFats2],
	arrProtein[randomIndexProtein1],
	arrProtein[randomIndexProtein2]
	];

	return shuffle(res);

}