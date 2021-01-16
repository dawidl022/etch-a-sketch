const div = document.getElementById("container");
let dimentions = 20
const root = document.documentElement
root.style.setProperty("--dimentions", dimentions)
root.style.setProperty("--squareSize", `${(window.innerHeight - 50) / dimentions}px`)
let squareColor = "black"
let hslCounter = 0
let askGridSize = false

const defaultChangeColor = (e) => {
  e.target.style.backgroundColor = squareColor;
}

let changeColor = defaultChangeColor

function isColor(strColor) {
  const test = document.createElement("div");
  test.style.backgroundColor = strColor;
  return test.style.backgroundColor == strColor;
}

function changeSqaureColor(e) {
  const message = document.querySelector("#color-error")
  const targetColor = colorInput.value
  if (isColor(targetColor)) {
    changeColor = defaultChangeColor
    squareColor = targetColor
    colorInput.setAttribute("placeholder", `Current: ${squareColor}`)
    message.textContent = ""
  } else {
    message.textContent = "Error: Invalid HTML color"
  }
  colorInput.value = ""
}

function clearGrid(e) {
  const squares = Array.from(div.children);
  squares.forEach(square => square.style.backgroundColor = "white")
}

function resetColor(e) {
  const message = document.querySelector("#color-error")
  message.textContent = ""
  if (squareColor == "rainbow") {
    hslCounter = 0
    changeColor = defaultChangeColor
    clearGrid()
    drawGrid(dimentions)
  }
  squareColor = "black"
  colorInput.setAttribute("placeholder", `Current: ${squareColor}`)
}


function changeSquareSize(e) {
  const targetValue = pixelInput.value;
  console.log(targetValue);
  const message = document.querySelector("#pixel-error")
  if (! (targetValue >= 1 && targetValue <= 100)) {
    message.textContent = "Error: Invalid Value"
  } else {
    message.textContent = ""
    dimentions = Number(targetValue)
    root.style.setProperty("--dimentions", dimentions)
    root.style.setProperty("--squareSize", `${(window.innerHeight - 50) / dimentions}px`)
    drawGrid(dimentions)
  }
  pixelInput.setAttribute("placeholder", `Current: ${dimentions}`)
  pixelInput.value = ""
}

function drawGrid(dim) {
  div.innerHTML = "";
  for (let i = 0; i < dim ** 2; i++) {
    let squareDiv = document.createElement("div");
    squareDiv.addEventListener("mouseover", changeColor);
    div.appendChild(squareDiv);
  }
}


// function genRbgColor() {
//   let result = "#";
//   const digits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];
//   for (let i = 0; i < 6; i++) {
//     let choise = Math.floor(Math.random() * 16);
//     result += digits[choise]
//   } return result
// }


function rainbowColorInit() {
  changeColor = (e) => {
    e.target.style.backgroundColor = `hsl(${hslCounter % 360}, 100%, 50%)`
    hslCounter++
  }
  clearGrid()
  drawGrid(dimentions)
  squareColor = "rainbow"
  colorInput.setAttribute("placeholder", `Current: ${squareColor}`)
}


function clearGridInit(e) {
  clearGrid(e)
  if (askGridSize) {
    let message = "Change grid size?";
    let changeValue
    do {
      changeValue = prompt(message);
      if (changeValue >= 1 && changeValue <= 100) {
        dimentions = Number(changeValue)
        root.style.setProperty("--dimentions", dimentions)
        root.style.setProperty("--squareSize", `${(window.innerHeight - 50) / dimentions}px`)
        drawGrid(dimentions)
        break;
      }
      message = "Invalid Value. Enter correct value or cancel.";
    } while (changeValue);
  }
}

function toggleAsk(e) {
  if (askGridSize) askGridSize = false
  else askGridSize = true
}


drawGrid(dimentions)

const clearBtn = document.querySelector("#clear")
clearBtn.addEventListener("click", clearGridInit)

const pixelBtn = document.querySelector("#pixels-btn")
pixelBtn.addEventListener("click", changeSquareSize)

const pixelInput = document.querySelector("#pixels")
pixelInput.setAttribute("placeholder", `Current: ${dimentions}`)

const colorButton = document.querySelector("#color-btn")
colorButton.addEventListener("click", changeSqaureColor)

const colorInput = document.querySelector("#color")
colorInput.setAttribute("placeholder", `Current: ${squareColor}`)

const resetColorButton = document.querySelector("#color-reset")
resetColorButton.addEventListener("click", resetColor)

const RainbowButton = document.querySelector("#rainbow")
RainbowButton.addEventListener("click", rainbowColorInit)

const askCheckbox = document.querySelector("#ask")
askCheckbox.addEventListener("input", toggleAsk);
