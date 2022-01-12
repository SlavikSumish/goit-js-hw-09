
const refs = {
  btnStart: document.querySelector('button[data-start]'),
  btnStop: document.querySelector('button[data-stop]')
}
let colorPickerId = null;

refs.btnStart.addEventListener('click', onBtnStart);
refs.btnStop.addEventListener('click', onBtnStop);

refs.btnStop.setAttribute("disabled", "disabled");

function onBtnStart() {
  colorPickerId = setInterval(() => { document.body.style.backgroundColor = getRandomHexColor();}, 1000);
  refs.btnStart.setAttribute("disabled", "disabled");
  refs.btnStop.removeAttribute("disabled", "disabled");
}

function onBtnStop() {
  clearInterval(colorPickerId);
  refs.btnStart.removeAttribute("disabled", "disabled");
  refs.btnStop.setAttribute("disabled", "disabled");
}

function getRandomHexColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}