let name;
let rivalReady = false;

const playerData = {
  name: "...",
  character: "???",
  state: "Conectándose",
  ready: false,
};

const player = document.getElementById("player");
const playerName = document.getElementById("name1");
const playerCharacter = document.getElementById("character1");
const playerState = document.getElementById("playerState");
const questionsPlayer = document.getElementById("questionsPlayer");

const rival = document.getElementById("rival");
const rivalName = document.getElementById("name2");
const rivalCharacter = document.getElementById("character2");
const rivalState = document.getElementById("rivalState");
const questionsRival = document.getElementById("questionsRival");

const nameModal = document.getElementById("setName");
const formName = document.getElementById("nameForm");
const inName = document.getElementById("name");

const characterModal = document.getElementById("setCharacter");
const formCharacter = document.getElementById("characterForm");
const inCharacter = document.getElementById("character");

const answerModal = document.getElementById("answerModal");
const question = document.getElementById("question");
const falseButton = document.getElementById("false");
const trueButton = document.getElementById("true");
const otherButton = document.getElementById("other");

const questionModal = document.getElementById("questionModal");
const questionForm = document.getElementById("questionForm");
const questionInput = document.getElementById("questionInput");

const guessModal = document.getElementById("guessModal");
const guessButton = document.getElementById("guess");
const guessForm = document.getElementById("guessForm");
const guessInput = document.getElementById("guessInput");

const resultModal = document.getElementById("resultsModal");
const titleResult = document.getElementById("titleResult");
const descResult = document.getElementById("descResult");

nameModal.style.display = "flex";

const socket = io();

formName.addEventListener("submit", (evt) => {
  evt.preventDefault();
  playerData.name = inName.value;
  socket.emit("setName", playerData.name);
  nameModal.style.display = "none";
  characterModal.style.display = "flex";
  playerName.innerHTML = playerData.name;
  playerData.state = "Seleccionando.";
  playerState.innerHTML = playerData.state;
});

formCharacter.addEventListener("submit", (evt) => {
  evt.preventDefault();
  playerData.character = inCharacter.value;
  playerData.ready = true;
  socket.emit("setCharacter");
  characterModal.style.display = "none";
  playerData.character = playerData.character;
  playerState.innerHTML = "¡¡¡Listo!!!";
  playerCharacter.innerHTML = `Personaje: ${playerData.character}`;
  if (rivalReady) {
    rivalState.innerHTML = "Creando pregunta...";
  }
});

questionForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  socket.emit("request", questionInput.value);
  rivalState.innerHTML = "Respondiendo...";
  questionModal.style.display = "none";
});

falseButton.addEventListener("click", () => {
  socket.emit("false");
  answerModal.style.display = "none";
  questionModal.style.display = "flex";
  questionsPlayer.innerHTML += `<li class='false'>${question.innerHTML} : Falso</li>`;
});

trueButton.addEventListener("click", () => {
  socket.emit("true");
  answerModal.style.display = "none";
  questionModal.style.display = "flex";
  questionsPlayer.innerHTML += `<li class='true'>${question.innerHTML} : Verdadero</li>`;
});

otherButton.addEventListener("click", () => {
  socket.emit("other");
  answerModal.style.display = "none";
  rivalState.innerHTML = "Creando pregunta...";
  questionsPlayer.innerHTML += `<li class='other'>${question.innerHTML} : Sin respuesta...</li>`;
});

guessButton.addEventListener("click", () => {
  questionModal.style.display = "none";
  guessModal.style.display = "flex";
  socket.emit("guessing");
});

guessForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  guessModal.style.display = "none";
  socket.emit("reqGuess", guessInput.value);
});

/////////
socket.on("playerConnected", () => {
  rival.style.backgroundColor = "blue";
  rivalState.innerHTML = "Conectándose";
  socket.emit("rivalData", playerData);
});

socket.on("rivalData", (data) => {
  rival.style.backgroundColor = "blue";
  rivalName.innerHTML = data.name;
  rivalState.innerHTML = data.state;
  rivalReady = data.ready;
});

socket.on("setName", (name) => {
  rivalName.innerHTML = name;
  rivalState.innerHTML = "Seleccionando...";
});

socket.on("setCharacter", () => {
  rivalState.innerHTML = "¡¡¡Listo!!!";
  rivalReady = true;
  if (playerData.ready) {
    questionModal.style.display = "flex";
    rivalState.innerHTML = "En espera...";
  }
});

socket.on("request", (quest) => {
  question.innerHTML = quest;
  answerModal.style.display = "flex";
  rivalState.innerHTML = "En espera...";
});

socket.on("true", () => {
  questionsRival.innerHTML += `<li class='true'>${questionInput.value} : Verdadero</li>`;
  questionInput.value = "";
  rivalState.innerHTML = "Creando pregunta...";
});

socket.on("false", () => {
  questionsRival.innerHTML += `<li class='false'>${questionInput.value} : Falso</li>`;
  questionInput.value = "";
  rivalState.innerHTML = "Creando pregunta...";
});

socket.on("other", () => {
  questionModal.style.display = "flex";
  questionsRival.innerHTML += `<li class='other'>${questionInput.value} : Sin respuesta...</li>`;
  questionInput.value = "";
  rivalState.innerHTML = "Creando pregunta...";
});

socket.on("guessing", () => {
  rivalState.innerHTML = "Adivinando...";
});

socket.on("reqCharacter", () => {
  socket.emit("guessWho", playerData.character);
});

socket.on("gameOver", () => {
  console.log("gameOver");
  resultModal.style.display = "flex";
});

socket.on("Victory", (rivalCharacter) => {
  titleResult.innerHTML = "¡¡¡Has ganado!!!";
  descResult.innerHTML = `El personaje rival es: ${rivalCharacter}`;
});

socket.on("FailedGuess", (guessed) => {
  const string = `<li class='other'>Predicción fallida : ${guessed}</li>`;
  if (guessed != guessInput.value) {
    questionsPlayer.innerHTML += string;
  } else {
    questionsRival.innerHTML += string;
  }
});
