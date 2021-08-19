"use strict";

const div = document.getElementById("container");
const root = document.documentElement;
let dimensions = parseFloat(window.getComputedStyle(root)
    .getPropertyValue('--dimensions'));
console.log(dimensions);
let squareColor = "black";
let hslCounter = 0;
let askGridSize = false;


const defaultChangeColor = (e, target) => {
  if (!target) {
    target = e.target;
  }
  target.style.backgroundColor = squareColor;
}

let changeColor = defaultChangeColor;

function isColor(strColor) {
  const test = document.createElement("div");
  test.style.backgroundColor = strColor;
  return test.style.backgroundColor == strColor;
}

function changeSqaureColor(e) {
  const message = document.querySelector("#color-error");
  const targetColor = colorInput.value;
  if (isColor(targetColor)) {
    changeColor = defaultChangeColor;
    squareColor = targetColor;
    colorInput.setAttribute("placeholder", `Current: ${squareColor}`);
    message.textContent = "";
  } else {
    message.textContent = "Error: Invalid HTML color";
  }
  colorInput.value = "";
}

function clearGrid(e) {
  const squares = Array.from(div.children);
  squares.forEach(square => square.style.backgroundColor = "white");
}

function resetColor(e) {
  const message = document.querySelector("#color-error");
  message.textContent = "";
  if (squareColor == "rainbow") {
    hslCounter = 0;
    changeColor = defaultChangeColor;
    clearGrid();
    drawGrid(dimensions);
  }
  squareColor = "black"
  colorInput.setAttribute("placeholder", `Current: ${squareColor}`);
}


function changeSquareSize() {
  const targetValue = pixelInput.value;
  console.log(targetValue);
  const message = document.querySelector("#pixel-error");
  if (! (targetValue >= 1 && targetValue <= 100)) {
    message.textContent = "Error: Invalid Value";
  } else {
    message.textContent = "";
    dimensions = Number(targetValue);
    root.style.setProperty("--dimensions", dimensions);
    drawGrid(dimensions);
  }
  pixelInput.setAttribute("placeholder", `Current: ${dimensions}`);
  pixelInput.value = "";
}

function drawGrid(dim) {
  div.innerHTML = "";
  for (let i = 0; i < dim ** 2; i++) {
    let squareDiv = document.createElement("div");
    squareDiv.addEventListener("mouseover", changeColor);
    div.appendChild(squareDiv);
  }
}

function rainbowColorInit() {
  changeColor = (e, target) => {
    if (!target) {
      target = e.target;
    }
    target.style.backgroundColor = `hsl(${hslCounter % 360}, 100%, 50%)`;
    hslCounter++;
  }
  clearGrid();
  drawGrid(dimensions);
  squareColor = "rainbow";
  colorInput.setAttribute("placeholder", `Current: ${squareColor}`);
}


function clearGridInit(e) {
  clearGrid(e)
  if (askGridSize) {
    let message = "Change grid size?";
    let changeValue;
    do {
      changeValue = prompt(message);
      if (changeValue >= 1 && changeValue <= 100) {
        dimensions = Number(changeValue);
        root.style.setProperty("--dimensions", dimensions);
        drawGrid(dimensions);
        break;
      }
      message = "Invalid Value. Enter correct value or cancel.";
    } while (changeValue);
  }
}

function toggleAsk(e) {
  if (askGridSize) askGridSize = false;
  else askGridSize = true;
}


drawGrid(dimensions);

const clearBtn = document.querySelector("#clear");
clearBtn.addEventListener("click", clearGridInit);

const pixelBtn = document.querySelector("#pixels-btn");
pixelBtn.addEventListener("click", () => {
  changeSquareSize();
  initTouchScreen();
});

const pixelInput = document.querySelector("#pixels");
pixelInput.setAttribute("placeholder", `Current: ${dimensions}`);

const colorButton = document.querySelector("#color-btn");
colorButton.addEventListener("click", changeSqaureColor);

const colorInput = document.querySelector("#color");
colorInput.setAttribute("placeholder", `Current: ${squareColor}`);

const resetColorButton = document.querySelector("#color-reset");
resetColorButton.addEventListener("click", resetColor);

const RainbowButton = document.querySelector("#rainbow");
RainbowButton.addEventListener("click", rainbowColorInit);

const askCheckbox = document.querySelector("#ask");
askCheckbox.addEventListener("input", toggleAsk);

// TODO change this on screen resize
let rectStart;
let rectActualSize;
let squareActualSize;
let matrix;

function initTouchScreen() {
  const rect = div.getBoundingClientRect();
  rectStart = rect.left;
  rectActualSize = rect.right - rect.left;
  squareActualSize = rectActualSize / dimensions
  
  let squares = Array.from(div.children);
  
  matrix = [];
  for (let i = 0; i < dimensions; i++) {
    const start = i * dimensions;
    const row = squares.slice(start, start + dimensions);
    matrix.push(row);
  }
}

initTouchScreen();
window.addEventListener("resize", initTouchScreen)


document.addEventListener("touchstart", e => {
  if (div.contains(e.target)) {
    root.classList.add("not-scrolling");
    document.querySelector("body").classList.add("not-scrolling");
  } else {
    root.classList.remove("not-scrolling")
    document.querySelector("body").classList.remove("not-scrolling");
  }
});

document.addEventListener("touchmove", (e) => {
  const touchX = e.touches[0].clientX;
  const indexX = Math.floor((touchX - rectStart) / squareActualSize);
  const touchY = e.touches[0].clientY;
  const indexY = Math.floor((touchY - rectStart) / squareActualSize);
  if (indexX >= dimensions || indexY >= dimensions) {
    return;
  }
  changeColor(e, matrix[indexY][indexX])
  // console.log(e.touches[0].clientY);
})
