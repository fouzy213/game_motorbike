//BOUTON DE DEMARRAGE//
const startButton = document.createElement("button");
startButton.textContent = "START";
startButton.style.position = "fixed";
startButton.style.background ="blue";
startButton.style.color ="white";
startButton.style.top = "50%";
startButton.style.left = "50%";
startButton.style.transform = "translate(-50%, -50%)";
startButton.style.padding = "12px 24px";
startButton.style.fontSize = "20px";
document.body.appendChild(startButton);
const instruction = document.createElement("p")
instruction.innerHTML ="<= clavier déplacement gauche / => clavier déplacement droite ";
instruction.style.position = "fixed";
instruction.style.background ="blue";
instruction.style.color ="white";
instruction.style.top = "60%";
instruction.style.left = "50%";
instruction.style.transform = "translate(-50%, -50%)";
instruction.style.padding = "12px 24px";
instruction.style.fontSize = "20px";
document.body.appendChild(instruction);

const rules = document.createElement("p")
rules.innerHTML ="Attention : le niveau augmente toutes les 10 secondes. Bonne chance !"
rules.style.position = "fixed";
rules.style.background ="blue";
rules.style.color ="white";
rules.style.top = "75%";
rules.style.left = "50%";
rules.style.transform = "translate(-50%, -50%)";
rules.style.padding = "12px 24px";
rules.style.fontSize = "20px";
document.body.appendChild(rules);

//function demarrage jeu//
startButton.addEventListener("click", () => {
  startButton.style.display = "none"; 
  instruction.style.display ="none";
  rules.style.display="none";
  startGame();
});

const bikeSound = new Audio('./src/sound/motorcycle_sound.mp3');
bikeSound.loop = true;
bikeSound.volume = 0.5;


//demarrage jeu//
function startGame() {
 bikeSound.play();
  const road: HTMLElement | null = document.getElementById("road");
  if (!road) return;
//config moto//
  const moto = document.createElement("div");
  moto.id = "moto";
  moto.style.width = "90px";
  moto.style.height = "110px";
  moto.style.backgroundImage = "url('./src/images/pilote_neutre.png')";
  moto.style.position = "absolute";
  moto.style.bottom = "10px";
  moto.style.backgroundSize = "cover";
  moto.style.backgroundRepeat = "no-repeat";
  road.appendChild(moto);

  const motoWidth = 90;
  let offsetX = (road.clientWidth - motoWidth) / 2;
  const leftLimit = 0;
  let rightLimit = road.clientWidth - motoWidth;

  function updateMotoPosition(): void {
    offsetX = Math.max(leftLimit, Math.min(offsetX, rightLimit));
    moto.style.left = `${offsetX}px`;
  }

  updateMotoPosition();
//deplacement moto//
  document.addEventListener("keydown", (e: KeyboardEvent): void => {
    if (e.key === "ArrowLeft") {
      offsetX -= 10;
      moto.style.backgroundImage = "url('./src/images/sprite_left.png')";
    } else if (e.key === "ArrowRight") {
      offsetX += 10;
      moto.style.backgroundImage = "url('./src/images/SPRITE_RIGHT.png')";
    }
    updateMotoPosition();
  });

  document.addEventListener("keyup", (e: KeyboardEvent): void => {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      moto.style.backgroundImage = "url('./src/images/pilote_neutre.png')";
    }
  });
  
  // Création et insertion du compteur à l'écran
  const counterDisplay = document.createElement("div");
  counterDisplay.style.position = "fixed";
  counterDisplay.style.top = "10px";
  counterDisplay.style.right = "10px";
  counterDisplay.style.padding = "8px 12px";
  counterDisplay.style.backgroundColor = "rgba(0,0,0,0.5)";
  counterDisplay.style.color = "white";
  counterDisplay.style.fontFamily = "monospace";
  counterDisplay.style.fontSize = "18px";
  counterDisplay.style.borderRadius = "5px";
  counterDisplay.style.zIndex ="9999";
  document.body.appendChild(counterDisplay);
  
  
  // config temps et vitess//
  let scrollSpeed: number = 6;
  let timenow = 0; 
  let speedIndex = 0;
  const speedSteps = [8, 12, 14, 20];
  let backgroundY: number = 0;

function updateSpeed(): void {
  if (speedIndex < speedSteps.length - 1) {
    speedIndex++;
    scrollSpeed = speedSteps[speedIndex];
  }
  // si speedIndex est déjà à la dernière valeur (20)
}

  function updateCounter(): void {
    timenow++;
    if (timenow % 10 === 0) {
      updateSpeed();
    }
    counterDisplay.textContent = `Temps : ${timenow}s | Vitesse : ${scrollSpeed}`;
  }

  setInterval(updateCounter, 1000);

// creation obstacle//
let obstacles: HTMLElement[] = [];
  function createObstacle(): void {
    if (!road) return;

    const obstacle = document.createElement("div");
    obstacle.className = "obstacle";
    obstacle.style.position = "absolute";
    obstacle.style.width = "60px";
    obstacle.style.height = "60px";
    obstacle.style.top = "-60px";
    obstacle.style.backgroundImage = "url('./src/images/obstacle.png')";
    obstacle.style.backgroundSize = "cover";
    obstacle.style.backgroundRepeat = "no-repeat";

    const obstacleWidth = 60;
    const randomX = Math.random() * (road.clientWidth - obstacleWidth);
    obstacle.style.left = `${randomX}px`;

    road.appendChild(obstacle);
    obstacles.push(obstacle);
  }
// affichage des obstacles si en dehors de la zone delete//
  function moveObstacles(): void {
    if (!road) return;

    obstacles = obstacles.filter((obs) => {
      const top = parseFloat(obs.style.top || "0") + scrollSpeed;
      if (top > road.clientHeight) {
        obs.remove();
        return false;
      } else {
        obs.style.top = `${top}px`;
        return true;
      }
    });
  }
// detection si colision//
  function checkCollision(a: HTMLElement | null, b: HTMLElement | null): boolean {
    if (!a || !b) return false;

    const rectA = a.getBoundingClientRect();
    const rectB = b.getBoundingClientRect();

    return !(
      rectA.bottom < rectB.top ||
      rectA.top > rectB.bottom ||
      rectA.right < rectB.left ||
      rectA.left > rectB.right
    );
  }
// colision alert fin du jeu//
  function endGame(): void {
    bikeSound.pause()
    alert("Game Over !");
    window.location.reload();
  }
 // === 10. BOUCLE PRINCIPALE DU JEU ===
  function gameLoop(): void {
    moveObstacles();

    for (const obs of obstacles) {
      if (checkCollision(moto, obs)) {
        endGame();
        return;
      }
    }

    backgroundY += scrollSpeed;
    document.body.style.backgroundPosition = `center ${backgroundY}px`;

    requestAnimationFrame(gameLoop);
  }
//genere que les obstacle 
  setInterval(() => {
    if (obstacles.length < 3) {
      createObstacle();
    }
  }, 2000);

  gameLoop();
}
