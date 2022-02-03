const optionsContainer = document.querySelector(".options-container");
const toolsContainer = document.querySelector(".tools-container");

// We are using *True* for Showing tools and *False* for Hiding tools
let optionsActive = true;

const pencilToolAdjuster = document.querySelector(".pencil-tool-adjuster");
const pencil = document.querySelector(".pencil");
const eraserToolAdjuster = document.querySelector(".eraser-tool-adjuster");
const eraser = document.querySelector(".eraser");

// Simalarly two falgs for PENCIL and ERASER.
let isPencilActive = false;
let isEraserActive = false;

optionsContainer.addEventListener("click", (e) => {
  optionsActive = !optionsActive;
  if (optionsActive) {
    // For Showing tools
    showTools();
  } else {
    // For Hiding tools
    hideTools();
  }
});

const showTools = () => {
  const iconElement = optionsContainer.children[0];
  iconElement.classList.remove("fa-times");
  iconElement.classList.add("fa-bars");
  toolsContainer.style.display = "flex";
};

const hideTools = () => {
  const iconElement = optionsContainer.children[0];
  iconElement.classList.remove("fa-bars");
  iconElement.classList.add("fa-times");
  toolsContainer.style.display = "none";

  pencilToolAdjuster.style.display = "none";
  eraserToolAdjuster.style.display = "none";
};

pencil.addEventListener("click", (e) => {
  // True -> show pencil Tool
  // False -> Hide pencil Tool
  isPencilActive = !isPencilActive;

  if (isPencilActive) {
    pencilToolAdjuster.style.display = "block";
  } else {
    pencilToolAdjuster.style.display = "none";
  }
});

eraser.addEventListener("click", (e) => {
  // True -> show pencil Tool
  // False -> Hide pencil Tool
  isEraserActive = !isEraserActive;

  if (isEraserActive) {
    eraserToolAdjuster.style.display = "flex";
  } else {
    eraserToolAdjuster.style.display = "none";
  }
});

/* -------------- Sticky Notes And Upload Images ------------- */
const sticky = document.querySelector(".sticky"); // Sticky Notes
const upload = document.querySelector(".upload"); // For Images

// Sticky Notes
sticky.addEventListener("click", (e) => {
  const stickyTemplateHtml = `
        <div class="header-container">
            <div class="minimize"></div>
            <div class="remove"></div>
        </div>
        <div class="note-container">
            <textarea spellcheck="false"></textarea>
        </div>
    `;

  createSticky(stickyTemplateHtml);
});

// Upload Images
upload.addEventListener("click", (e) => {
  // To Open File Explorer
  const input = document.createElement("input");
  input.setAttribute("type", "file");
  input.click();

  input.addEventListener("change", (e) => {
    const file = input.files[0];
    const urlOfImage = URL.createObjectURL(file);
    const stickyTemplateHtml = `
        <div class="header-container">
            <div class="minimize"></div>
            <div class="remove"></div>
        </div>
        <div class="note-container">
            <img src="${urlOfImage}"/>
        </div>
        `;
    createSticky(stickyTemplateHtml);
  });
});

const createSticky = (stickyTemplateHtml) => {
  let stickyContainer = document.createElement("div");
  stickyContainer.setAttribute("class", "sticky-container");
  stickyContainer.innerHTML = stickyTemplateHtml;
  document.body.appendChild(stickyContainer);

  // Actions on Sticky Notes - Minimize, and Remove Notes
  let minimize = stickyContainer.querySelector(".minimize");
  let remove = stickyContainer.querySelector(".remove");
  stickyNotesActions(minimize, remove, stickyContainer);

  // Drag and Drop Feature
  stickyContainer.onmousedown = function (event) {
    dragAndDrop(stickyContainer, event);
  };

  stickyContainer.ondragstart = function () {
    return false;
  };
};

// Actions on Sticky Notes
const stickyNotesActions = (minimize, remove, stickyContainer) => {
    // To Remove the Note
    remove.addEventListener("click", (e) => {
        stickyContainer.remove();
    });

    // To Minimize the Note
    minimize.addEventListener("click", (e) => {
        let noteContainer = stickyContainer.querySelector(".note-container");
        let display = getComputedStyle(noteContainer).getPropertyValue("display");
        if (display === "none") {
            noteContainer.style.display = "block";
        }
        else {
            noteContainer.style.display = "none";
        }
    });
};

// Drag and Drop
const dragAndDrop = (element, event) => {
    let shiftX = event.clientX - element.getBoundingClientRect().left;
    let shiftY = event.clientY - element.getBoundingClientRect().top;

    element.style.position = "absolute";
    element.style.zIndex = 1000;

    moveAt(event.pageX, event.pageY);

    // moves the ball at (pageX, pageY) coordinates
    // taking initial shifts into account
    function moveAt(pageX, pageY) {
        element.style.left = pageX - shiftX + "px";
        element.style.top = pageY - shiftY + "px";
    }

    function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);
    }

    // move the ball on mousemove
    document.addEventListener("mousemove", onMouseMove);

    // drop the ball, remove unneeded handlers
    element.onmouseup = function () {
        document.removeEventListener("mousemove", onMouseMove);
        element.onmouseup = null;
    };
};


