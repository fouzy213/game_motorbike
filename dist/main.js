"use strict";
const container = document.getElementById("game");
let offsetX = 0;
const right_limit = 420;
const left_limit = -470;
const inside_countainer = document.createElement("div");
inside_countainer.style.width = "300px";
inside_countainer.style.height = "300px";
inside_countainer.style.backgroundImage = "url('./src/images/pilote_neutre.png')";
inside_countainer.style.backgroundSize = "cover";
inside_countainer.style.backgroundRepeat = "no-repeat";
inside_countainer.style.position = "absolute";
inside_countainer.style.bottom = "0px";
inside_countainer.style.left = "50%";
inside_countainer.style.transform = `translateX(calc(-50% + ${offsetX}px))`;
if (container) {
    container.appendChild(inside_countainer);
    document.addEventListener("keydown", function (event) {
        event.preventDefault();
        if (event.key === "ArrowLeft" && offsetX > left_limit) {
            offsetX -= 10;
        }
        else if (event.key === "ArrowRight" && offsetX < right_limit) {
            offsetX += 10;
        }
        inside_countainer.style.transform = `translateX(calc(-50% + ${offsetX}px))`;
    });
}
//function route
let backgroundPositionY = 0;
let vitesseScroll = 4; 
function scrollBackground() {
    backgroundPositionY += vitesseScroll;
    document.body.style.backgroundPosition = `center ${backgroundPositionY}px`;
    requestAnimationFrame(scrollBackground);
}
scrollBackground();




document.addEventListener("keydown", function (e) {
    if (e.key === "1") {
        vitesseScroll = 8;
    }
    else if (e.key === "2") {
        vitesseScroll = 12;
    }
    else if (e.key === "3") {
        vitesseScroll = 20; 
    }
});
