let mainPlayer;
let changePoint = 50;
let nonSugars = [];
let theSugars = [];
let speed;
let isGameover = false;
let players = [];
let is_dragging = false;
let curPlIndex = null;
let startX, startY;
let sugarList = ["🍭", "🍬", "🍪"];
let nonSugarList = ["🍅", "🥦", "🥕"];
let horiSides = [0, 500];
let verSides = [0, 1000];

let gameOverDiv = document.getElementById("gameover");
let healthScore = document.querySelector("progress");
let scoreDisplay = document.querySelector("h4");
let levelDiv = document.getElementById("level");
let levelForm = document.getElementById("levelForm");
const countdownEl = document.getElementById("time");

const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
/* FIX OFFSET*/
let offset_x, offset_y;
let get_offset = function () {
  let canvas_offsets = canvas.getBoundingClientRect();
  offset_x = canvas_offsets.left;
  offset_y = canvas_offsets.top;
};
get_offset();
window.onscroll = function () {
  get_offset();
};
get_offset();
window.onresize = function () {
  get_offset();
};
get_offset();
canvas.resize = function () {
  get_offset();
};

/* CLASSES */
class Player {
  constructor(text, x, y, width, height) {
    this.text = text;
    this.x = x;
    this.y = y;
    this.emoji = 50;
    this.width = width;
    this.height = height;
  }
  //getter

  getTop() {
    return this.y + this.emoji;
  }
  getBtm() {
    return this.y + 2 * this.emoji;
  }
  getLeft() {
    return this.x;
  }
  getRight() {
    return this.x + this.emoji;
  }

  checkCollision(food) {
    let isHit = false;
    if (
      food.getBtm() >= this.getTop() &&
      food.getTop() <= this.getTop() &&
      food.getRight() >= this.getLeft() &&
      food.getLeft() <= this.getRight()
    ) {
      return (isHit = true);
    }
    if (
      food.getTop() <= this.getBtm() &&
      food.getBtm() >= this.getBtm() &&
      food.getRight() >= this.getLeft() &&
      food.getLeft() <= this.getRight()
    ) {
      return (isHit = true);
    }
    if (
      food.getRight() >= this.getLeft() &&
      food.getRight() <= this.getRight() &&
      food.getBtm() >= this.getTop() &&
      food.getTop() <= this.getBtm()
    ) {
      return (isHit = true);
    }
    if (
      food.getLeft() <= this.getRight() &&
      food.getLeft() >= this.getLeft() &&
      food.getBtm() >= this.getTop() &&
      food.getTop() <= this.getBtm()
    ) {
      return (isHit = true);
    }
    return (isHit = false);
  }

  draw() {
    c.font = "50px serif";
    c.fillText(this.text, this.x, this.y);
  }

  update() {
    this.x += this.dx * Math.sin(this.angle);
    this.y += this.dy * Math.cos(this.angle);
    this.draw();
  }
}
class nonSugar extends Player {
  constructor(text, x, y, angle, speed) {
    super(text, x, y);
    this.angle = angle;
    this.speed = speed;
    this.dx = 1 * this.speed;
    this.dy = 1 * this.speed;
  }
}
class Sugar extends Player {
  constructor(text, x, y, angle, speed) {
    super(text, x, y);
    this.angle = angle;
    this.speed = speed;
    this.dx = 1 * this.speed;
    this.dy = 1 * this.speed;
  }
}

// UTILITY FUNCTIONS

function handleLevelSubmit(e) {
  e.preventDefault();
  const level = e.target.levelSelect.value;
  if (level === "easy") {
    speed = "3";
  } else if (level === "normal") {
    speed = "5";
  } else if (level === "hard") {
    speed = "8";
  }

  levelDiv.style.display = "none";

  startGame();
}
function createSugars() {
  let randomSugar = sugarList[parseInt(Math.random() * 3)];
  let randomX = Math.random() * canvas.width;
  let randomY = Math.random() * canvas.height;
  let randomAngle = Math.random() * 360;
  let fixedY = horiSides[parseInt(Math.random() * 2)];
  let fixedX = verSides[parseInt(Math.random() * 2)];

  theSugars.push(new Sugar(randomSugar, fixedX, randomY, randomAngle, speed));
  console.log(theSugars[theSugars.length - 1]);
  theSugars[theSugars.length - 1].draw();

  theSugars.push(new Sugar(randomSugar, randomX, fixedY, randomAngle, speed));
  console.log(theSugars[theSugars.length - 1]);
  theSugars[theSugars.length - 1].draw();
}
function createNonSugars() {
  let randomNonSugar = nonSugarList[parseInt(Math.random() * 3)];
  let randomX = Math.random() * canvas.width;
  let randomY = Math.random() * canvas.height;
  let randomAngle = Math.random() * 360;
  let fixedY = horiSides[parseInt(Math.random() * 2)];
  let fixedX = verSides[parseInt(Math.random() * 2)];

  nonSugars.push(
    new nonSugar(randomNonSugar, fixedX, randomY, randomAngle, speed)
  );
  console.log(nonSugars[nonSugars.length - 1]);
  nonSugars[nonSugars.length - 1].draw();

  nonSugars.push(
    new nonSugar(randomNonSugar, randomX, fixedY, randomAngle, speed)
  );
  console.log(nonSugars[nonSugars.length - 1]);
  nonSugars[nonSugars.length - 1].draw();
}

const jsConfetti = new JSConfetti({ canvas });
function triggerConfetti() {
  jsConfetti.addConfetti({
    emojis: ["😀", "🍭", "🍬", "🍪", "🍅", "🥦", "🥕"],
  });
}

function handleGameover() {
  isGameover = true;
  gameOverDiv.innerHTML = " You lose! ";
  gameOverDiv.style.display = "block";
  gameOverDiv.style.position = "fixed";
  gameOverDiv.style.background = "pink";
  gameOverDiv.style.fontSize = " 100px";
  gameOverDiv.style.textAlign = "center";
  setTimeout(triggerConfetti, 300);
}
function animate(step) {
  getBoard();
  mainPlayer.draw();

  if (!isGameover) {
    nonSugars.forEach(function (ns, nsIndex) {
      ns.update();
      if (mainPlayer.checkCollision(ns) && healthScore.value < 100) {
        nonSugars.splice(nsIndex, 1);
        healthScore.setAttribute("value", (healthScore.value += changePoint));
        scoreDisplay.innerHTML = `Health: ${healthScore.value}`;
      }
    });

    theSugars.forEach(function (sug, sugIndex) {
      sug.update();
      if (mainPlayer.checkCollision(sug)) {
        theSugars.splice(sugIndex, 1);
        healthScore.setAttribute("value", (healthScore.value -= changePoint));
        scoreDisplay.innerHTML = `Health: ${healthScore.value}`;
      }
    });
  }

  if (healthScore.value <= 0) {
    healthScore.setAttribute("value", (healthScore.value = 0));
    scoreDisplay.innerHTML = `Health: ${healthScore.value}`;
    handleGameover();
  }

  requestAnimationFrame(animate);
}
function countdown(time) {
  let timerID = setInterval(function () {
    const minutes = 0;
    let seconds = time % 60;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    countdownEl.innerHTML = `${minutes}:${seconds}`;
    time--;
    if (countdownEl.innerHTML === "0:00") {
      clearInterval(timerID);
      if (countdownEl.innerHTML === "0:00" && healthScore.value > 0) {
        isGameover = true;
        gameOverDiv.innerHTML = " You win! ";
        gameOverDiv.style.display = "block";
        gameOverDiv.style.position = "fixed";
        gameOverDiv.style.background = "pink";
        gameOverDiv.style.fontSize = " 100px";
        gameOverDiv.style.textAlign = "center";
      } else {
        return;
      }
    }
  }, 1000);
}
function restart() {
  location.reload();
}

//EVENT LISTENERS
levelForm.addEventListener("submit", handleLevelSubmit);

document.querySelector("button").addEventListener("click", restart);

/* INITIALISE*/
function getBoard() {
  canvas.width = canvas.clientWidth; //set canvasWidth = clientWidth
  canvas.height = canvas.clientHeight; //set canvasHeight = clientHeight
}
getBoard();

/* START GAME*/
function startGame() {
  mainPlayer = new Player("😀", canvas.width / 2, canvas.height / 2);
  players.push(mainPlayer);

  healthScore.value = 100;
  healthScore.style.display = "block";
  document.querySelector("h4").innerHTML = `Health: ${healthScore.value}`;
  countdown(20);

  setInterval(createSugars, 1000);
  setInterval(createNonSugars, 1000);

  animate();
}

function isMouseInPlayer(x, y, pl) {
  if (
    x > pl.getLeft() &&
    x < pl.getRight() &&
    y > pl.getTop() &&
    y < pl.getBtm()
  ) {
    return true;
  }
  return false;
}
let mouse_down = function (event) {
  event.preventDefault();
  startX = parseInt(event.clientX - offset_x);
  startY = parseInt(event.clientY - offset_y + 50);
  let index = 0;
  for (let pl of players) {
    if (isMouseInPlayer(startX, startY, pl)) {
      is_dragging = true;
      curPlIndex = index;
      canvas.style.cursor = "grabbing";
      return;
    } else {
    }
    index++;
  }
};
let mouse_up = function (event) {
  if (!is_dragging) {
    return;
  }

  canvas.style.cursor = "default";
  event.preventDefault();
  is_dragging = false;
};
let mouse_out = function (event) {
  if (!is_dragging) {
    return;
  }
  event.preventDefault();
  is_dragging = false;
};
let mouse_move = function (event) {
  if (!is_dragging) {
    return;
  } else {
    event.preventDefault();
    let mouseX = parseInt(event.clientX - offset_x);
    let mouseY = parseInt(event.clientY - offset_y + 50);

    let dx = mouseX - startX;
    let dy = mouseY - startY;

    let current_pl = players[curPlIndex];
    current_pl.x += dx;
    current_pl.y += dy;

    startX = mouseX;
    startY = mouseY;
  }
};
canvas.onmousedown = mouse_down;
canvas.onmouseup = mouse_up;
canvas.onmouseout = mouse_out;
canvas.onmousemove = mouse_move;
