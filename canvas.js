const canvas = document.querySelector("canvas");
const pencilColorsAdjuster = document.querySelectorAll(".pencil-color");
const pencilWidthAdjuster = document.querySelector(".pencil-width");
const eraserWidthAdjuster = document.querySelector(".eraser-width");
const redo = document.querySelector(".redo");
const undo = document.querySelector(".undo");

// Set canvas screen equal to window's screen
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

// Default values
let pencilColor = "black";
let pencilWidth = pencilToolAdjuster.value;
const eraserColor = "white";
let eraserWidth = eraserToolAdjuster.value;

// For Undo and Redo 
let undoRedoTracker = []; // Data
let track = 0; // Represent the index for the undoRedoTracker (or current track number)

// API
const tool = canvas.getContext("2d");

// Fill White Background
tool.fillStyle = "white";
tool.fillRect(0, 0, canvas.width, canvas.height);

/*
// ********* For Future Reference ******** 
// To set width and color
tool.strokeStyle = "blue";
tool.lineWidth = "9";

// To draw Lines/Graphic
tool.beginPath(); // To begin new Path (or NEW LINE)
tool.moveTo(10, 10); // Start point
tool.lineTo(100, 150); // End Point
tool.stroke(); // To Fill Color (Fill Graphic)
*/

// To set Initial width and color of graphic (LINE)
tool.strokeStyle = pencilColor;
tool.lineWidth = pencilWidth;

// Mouse-Down(Click start) -> Start new path
// Mouse-Up(Click Up) -> End the path
// Mouse-Move(Movie cursor) -> Fill color (in line)

let isMouseDown = false;

// So, We will add Event Listener on CANVAS
canvas.addEventListener("mousedown", (e) => {
    isMouseDown = true;
    // Begin Path Here
    // clientX and clientY are the locations where i am clicking on the window.
    beginPath({
      x: e.clientX,
      y: e.clientY,
    });
});

// Mouse-Move
canvas.addEventListener("mousemove", (e) => {
    if (isMouseDown) drawStroke({
        x: e.clientX,
        y: e.clientY,
        color: isEraserActive ? eraserColor : pencilColor,
        width: isEraserActive ? eraserWidth : pencilWidth
    });
});

canvas.addEventListener("mouseup", (e) => {
    isMouseDown = false;

    // For Undo Redo
    const url = canvas.toDataURL();
    undoRedoTracker.push(url);
    track = undoRedoTracker.length-1;
});

// Event on Undo and Redo
undo.addEventListener("click", (e) => {
    if (track > 0)
        track--;
    // Track Action
    const trackObj = {
        trackValue: track,
        undoRedoTracker
    }
    undoRedoCanvas(trackObj);
});

redo.addEventListener("click", (e) => {
    if (track < undoRedoTracker.length - 1) track++;
    // Track Action
    const trackObj = {
        trackValue: track,
        undoRedoTracker,
    };
    undoRedoCanvas(trackObj);
});

const undoRedoCanvas = (trackObj) => {
    track = trackObj.trackValue;
    undoRedoTracker = trackObj.undoRedoTracker;
    
    const url = undoRedoTracker[track];
    let img = new Image(); // New image reference element 
    img.src = url;

    img.onload = (e) => {
        tool.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
}

// Functions for Draw Graphics
const beginPath = (strokeObj) => {
    tool.beginPath();
    tool.moveTo(strokeObj.x, strokeObj.y);
}

const drawStroke = (strokeObj) => {
    tool.strokeStyle = strokeObj.color;
    tool.lineWidth = strokeObj.width;
    tool.lineTo(strokeObj.x, strokeObj.y);
    tool.stroke();
}

// Pencil Color Change
pencilColorsAdjuster.forEach((colorElement) => {
    colorElement.addEventListener("click", (e) => {
        let color = colorElement.classList[0];
        pencilColor = color;
        tool.strokeStyle = pencilColor;

    });
});

// Adjusr Pencil Width
pencilWidthAdjuster.addEventListener("change", (e) => {
    pencilWidth = pencilWidthAdjuster.value;
    tool.lineWidth = pencilWidth;
});


// Eraser 
// Adjust Eraser Width
eraserToolAdjuster.addEventListener("change", (e) => {
    eraserWidth = eraserWidthAdjuster.value;
    tool.lineWidth = eraserWidth;
})

eraser.addEventListener("click", (e) => {
    if (isEraserActive) {
        tool.strokeStyle = eraserColor;
        tool.lineWidth = eraserWidth;
    } else {
        tool.strokeStyle = pencilColor;
        tool.lineWidth = pencilWidth;
    }
});


// Download Image
const download = document.querySelector(".download");

download.addEventListener("click", (e) => {
    const url = canvas.toDataURL();
    const a = document.createElement("a");
    a.href = url;
    a.download = "board.jpg";
    a.click();
});