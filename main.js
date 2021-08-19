"use strict";

// TODO refactor repeating code

const div = document.getElementById("container");
const root = document.documentElement;
let dimensions = parseFloat(window.getComputedStyle(root)
    .getPropertyValue('--dimensions'));
const body = document.querySelector("body");
const outerWrapper = document.querySelector(".outer-wrapper");
const innerWrapper = document.querySelector(".inner-wrapper");
const scrollPrompt = document.querySelector(".scroll-prompt")
const hidableControls = document.querySelectorAll(".scroll-prompt ~ *")
const controls = document.getElementById("controls")
let squareColor = "black";
let hslCounter = 0;
let askGridSize = false;

// Add icons for rainbow and eraser
const iconWrapper = document.querySelector(".icon-wrapper")
const rainbowIcon = document.createElement("div");
rainbowIcon.classList.add("icon");
rainbowIcon.classList.add("rainbow-icon");
rainbowIcon.style.display = "none";
iconWrapper.append(rainbowIcon);

const eraserIcon = document.createElement("div");
eraserIcon.classList.add("icon");
eraserIcon.classList.add("eraser-icon");
eraserIcon.style.display = "none";
iconWrapper.append(eraserIcon);


function decToHex(number) {
  let hexNumber = number.toString(16);
  return hexNumber.length == 1 ? "0" + hexNumber : hexNumber;
}

function rgbToHex(rgb) {
  let hex = Array.from(rgb).map(value => decToHex(Number(value)));
  return "#" + hex.join("");
}

function colorToRGB(color) {
  var cvs, ctx;
  cvs = document.createElement('canvas');
  cvs.height = 1;
  cvs.width = 1;
  ctx = cvs.getContext('2d');
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 1, 1);
  return ctx.getImageData(0, 0, 1, 1).data.slice(0, 3);
}

function colorToHex(color) {
  return rgbToHex(colorToRGB(color));
}

const changeColor = (e, target) => {
  if (!target) {
    target = e.target;
  }
  if (squareColor === "rainbow") {
    target.style.backgroundColor = `hsl(${hslCounter % 360}, 100%, 50%)`;
    hslCounter++;
  } else {
    target.style.backgroundColor = squareColor;
  }
}


function isColor(strColor) {
  const test = document.createElement("div");
  test.style.backgroundColor = strColor;
  return colorToHex(test.style.backgroundColor) == colorToHex(strColor);
}

function changeSquareColor(e) {
  const message = document.querySelector("#color-error");
  const targetColor = colorInput.value.toLowerCase();
  const hexColor = colorToHex(targetColor);
  colorPicker.value = hexColor;
  if (isColor(targetColor)) {
    squareColor = targetColor;
    colorInput.setAttribute("placeholder", `Current: ${squareColor}`);
    rainbowIcon.style.display = "none";
    eraserIcon.style.display = "none";
    colorPicker.style.opacity = "1";
    message.textContent = "";
  } else {
    message.textContent = "Error: Invalid HTML color";
  }
  if (targetColor === "") {
    colorInput.setAttribute("placeholder", `Easter-egg: eraser`);
    eraserIcon.style.display = "block";
    rainbowIcon.style.display = "none"
    colorPicker.style.opacity = "0";
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
  if (squareColor === "rainbow") {
    hslCounter = 0;
  }
  squareColor = "black";
  rainbowIcon.style.display = "none";
  eraserIcon.style.display = "none";
  colorPicker.style.opacity = "1";
  colorPicker.value = "";
  colorInput.setAttribute("placeholder", `Current: ${squareColor}`);
}


function changeSquareSize() {
  const targetValue = pixelInput.value;
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
  squareColor = "rainbow";
  colorInput.setAttribute("placeholder", `Current: ${squareColor}`);
  colorPicker.style.opacity = "0";
  eraserIcon.style.display = "none";
  rainbowIcon.style.display = "block";
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
colorButton.addEventListener("click", changeSquareColor);

const colorInput = document.querySelector("#color");
const colorPicker = document.querySelector("#color-picker");
colorPicker.value = colorToHex(squareColor)
colorPicker.addEventListener("change", function() {
  squareColor = this.value;
  colorInput.setAttribute("placeholder", `Current: ${squareColor}`);
  rainbowIcon.style.display = "none";
  colorPicker.style.opacity = "1";
})
colorInput.setAttribute("placeholder", `Current: ${squareColor}`);

const resetColorButton = document.querySelector("#color-reset");
resetColorButton.addEventListener("click", resetColor);

const RainbowButton = document.querySelector("#rainbow");
RainbowButton.addEventListener("click", rainbowColorInit);

const askCheckbox = document.querySelector("#ask");
askCheckbox.addEventListener("input", toggleAsk);

// change this on screen and pixel density resize
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
window.addEventListener("resize", () => {
  initTouchScreen();
  initScrollPrompt();
})


document.addEventListener("touchstart", e => {
  if (div.contains(e.target)) {
    body.classList.add("not-scrolling");
    outerWrapper.classList.add("not-scrolling");
    controls.classList.add("with-prompt");
    scrollPrompt.style.display = "block";
    hidableControls.forEach(control => control.style.display = "none");
  } else {
    body.classList.remove("not-scrolling")
    outerWrapper.classList.remove("not-scrolling");
    controls.classList.remove("with-prompt");
    scrollPrompt.style.display = "none";
    hidableControls.forEach(control => control.style.display = "block");
  }
});

function initScrollPrompt() {
  scrollPrompt.style.display = "none";
  if (window.innerHeight > window.innerWidth && 
      parseFloat(window.getComputedStyle(innerWrapper).height)
      > parseFloat(window.getComputedStyle(outerWrapper).height)) {
    scrollPrompt.style.display = "block";
    controls.classList.add("with-prompt");
    hidableControls.forEach(control => control.style.display = "none");
  } else {
    controls.classList.remove("with-prompt");
    hidableControls.forEach(control => control.style.display = "block");
  }
}

initScrollPrompt();

document.addEventListener("touchmove", (e) => {
  const touchX = e.touches[0].clientX;
  const indexX = Math.floor((touchX - rectStart) / squareActualSize);
  const touchY = e.touches[0].clientY;
  const indexY = Math.floor((touchY - rectStart) / squareActualSize);
  if (indexX >= dimensions || indexY >= dimensions) {
    return;
  }
  if (outerWrapper.className.includes("not-scrolling")) {
    changeColor(e, matrix[indexY][indexX])
  }
})
