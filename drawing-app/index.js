const canvas = document.querySelector('canvas'),
    toolBtns = document.querySelectorAll('.tool'),
    fillColor = document.querySelector('#fill-color'),
    sizeSlider = document.querySelector('#size-slider'),
    colorBtns = document.querySelectorAll('.colors .option'),
    colorPicker = document.querySelector('#color-picker'),
    clearCanvas = document.querySelector('.clear-canvas'),
    saveImg = document.querySelector('.save-img'),
    ctx = canvas.getContext("2d");

// global variables with default value
let prevMouseX, prevMouseY, snapshot,
    isDrawing = false,
    selectedTool = "brush",
    brushWidth = 5,
    selectedColor = "#000";

const setCanvasBackground = () => {
    /**
     * setting canvas width/height...
     * offsetwidth/height returns viewable width/height 
     * of an element
     */
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // setting fillstyle back to the selectedColor, it'll be the brush color
    ctx.fillStyle = selectedColor;
}

window.addEventListener("load", () => {
    // 
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    setCanvasBackground();
});

const drawReact = (e) => {
    // if fillcolor isn't checked draw a rect with border else draw rect with background
    if (!fillColor.checked) {
        // creating circle according to the mouse pointer
        return ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
    }
    ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
}

const drawCircle = (e) => {
    // creating new path to draw circle
    ctx.beginPath();
    // getting radius for circle according to the mouse pointer
    let radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2) + Math.pow((prevMouseY - e.offsetY), 2));
    // creating circle according to the mouse pointer
    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);
    // if fillColor is checked fill circle else draw border circle
    fillColor.checked ? ctx.fill() : ctx.stroke();
}

const drawTriangle = (e) => {
    // creating new path to draw circle
    ctx.beginPath();
    // moving triangle to the mouse pointer
    ctx.moveTo(prevMouseX, prevMouseY);
    // creating first line according to the mouse pointer
    ctx.lineTo(e.offsetX, e.offsetY);
    // creating bottom line of triangle
    ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY);
    // closing path of a triangle so the third line draw automatically
    ctx.closePath();
    // if fillColor is checked fill triangle else draw border
    fillColor.checked ? ctx.fill() : ctx.stroke();
}

const startDraw = (e) => {
    isDrawing = true;
    // passing current mouseX position as prevMouseX value
    prevMouseX = e.offsetX;
    // passing current mouseY position as prevMouseY value
    prevMouseY = e.offsetY;
    // creating new path to draw
    ctx.beginPath();
    // passing brushSize as line width
    ctx.lineWidth = brushWidth;
    // passing selectedColor as stroke style
    ctx.strokeStyle = selectedColor;
    // passing selectedColor as fill style
    ctx.fillStyle = selectedColor;
    // copying canvas data & passing as snapshot value.. this avoids dragging the image
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

const drawing = (e) => {
    // if isDrawing is false return from here
    if (!isDrawing) return;
    // adding copied canvas data on to this canvas
    ctx.putImageData(snapshot, 0, 0);

    if (selectedTool === "brush" || selectedTool === "eraser") {
        // if selected tool is eraser then set strokeStyle to white
        // to paint white color on to the existing canvas content else set the stroke color to selected color
        ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor;
        // creating line according to the mouse pointer
        ctx.lineTo(e.offsetX, e.offsetY);
        // drawing/filling line with color
        ctx.stroke();
    } else if (selectedTool === "rectangle") {
        drawReact(e);
    } else if (selectedTool === "circle") {
        drawCircle(e);
    } else {
        drawTriangle(e);
    }
}

toolBtns.forEach(btn => {
    // adding click event to all tool option
    btn.addEventListener("click", () => {
        // removing active class from the previous option and adding on current clicked option
        document.querySelector(".options .active").classList.remove("active");
        btn.classList.add("active");
        selectedTool = btn.id;
    });
});


// passing slider value as brushSize
sizeSlider.addEventListener("change", () => brushWidth = sizeSlider.value);

colorBtns.forEach(btn => {
    // adding click event to all color button
    btn.addEventListener("click", () => {
        // removing selected class from the previous option and adding on current clicked option
        document.querySelector(".options .selected").classList.remove("selected");
        btn.classList.add("selected");
        // passing selected btn background color as selectedColor value
        selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color");
    });
});

colorPicker.addEventListener("change", () => {
    // passing picked color value from color picker to last color btn background
    colorPicker.parentElement.style.background = colorPicker.value;
    colorPicker.parentElement.click();
});

clearCanvas.addEventListener("click", () => {
    // clearing whole canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setCanvasBackground();
});

saveImg.addEventListener("click", () => {
    // creating <a> element
    const link = document.createElement("a");
    // passing current data as link donwload value
    link.download = `${Date.now()}.jpg`;
    // passing canvasData as link href value
    link.href = canvas.toDataURL();
    // clicking link to download image
    link.click();
});

canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", () => isDrawing = false);

