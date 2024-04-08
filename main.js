//THINGS TO DO:
// polishing up the end game UI state and score value (1)
// creation of utility functions, better state objects, repeated code can be a function (cleanup 1)
//adjust speed with each level - create user selection and link to speed (1)
//add confetti (0.5)
// presentation: offsets - weigh pro and con, challenges etc

// const sugarsList = [
//   {
//     id: 1,
//     name: 'lollipop',
//     emoji: '🍭',
//     points: 100,
//     speedRange: [50,100]
//   }
// ]
// function randomPick(list) {
//  return list[parseInt(Math.random() * list.length)];
// }
// randomPick(sugarsList)

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

/* INITIALISE*/
function initialize() {
  canvas.width = canvas.clientWidth; //set canvasWidth = clientWidth
  canvas.height = canvas.clientHeight; //set canvasHeight = clientHeight
}
initialize();

let tomatoes = [];
let candies = [];
let mainPlayer;
let healthScore = document.querySelector("progress").value;
let changePoint = 50;

/* START GAME*/
function startGame() {
  const x = canvas.width / 2;
  const y = canvas.height / 2;
  mainPlayer = new Player("😀", x, y);

  healthScore = 100;
  document.querySelector("h4").innerHTML = `Health: ${healthScore}`;
}
startGame();

//randomise start points and direction
let nonSugars = [];
let theSugars = [];
let speed = 5;
let isGameover = false;

setInterval(createSugars, 1000);
function createSugars() {
  let sugarList = ["🍭", "🍬", "🍪"];
  let randomSugar = sugarList[parseInt(Math.random() * 3)];
  let randomX = Math.random() * canvas.width;
  let randomY = Math.random() * canvas.height;
  let randomAngle = Math.random() * 360;
  let horiSides = [100, 500];
  let fixedY = horiSides[parseInt(Math.random() * 2)];
  let verSides = [0, 1000];
  let fixedX = verSides[parseInt(Math.random() * 2)];

  theSugars.push(new Sugar(randomSugar, fixedX, randomY, randomAngle, speed));
  console.log(theSugars[theSugars.length - 1]);
  theSugars[theSugars.length - 1].draw();
}

setInterval(createNonSugars, 1000);
function createNonSugars() {
  let nonSugarList = ["🍅", "🥦", "🥕"];
  let randomNonSugar = nonSugarList[parseInt(Math.random() * 3)];
  let randomX = Math.random() * canvas.width;
  let randomY = Math.random() * canvas.height;
  let randomAngle = Math.random() * 360;
  let horiSides = [100, 500];
  let fixedY = horiSides[parseInt(Math.random() * 2)];
  let verSides = [0, 1000];
  let fixedX = verSides[parseInt(Math.random() * 2)];

  nonSugars.push(
    new nonSugar(randomNonSugar, fixedX, randomY, randomAngle, speed)
  );
  console.log(nonSugars[nonSugars.length - 1]);
  nonSugars[nonSugars.length - 1].draw();
}

/* ANIMATE FOOD*/
function animate(step) {
  initialize();
  mainPlayer.draw();

  if (!isGameover) {
    nonSugars.forEach(function (ns, nsIndex) {
      ns.update();
      if (mainPlayer.checkCollision(ns) && healthScore < 100) {
        nonSugars.splice(nsIndex, 1);
        document
          .querySelector("progress")
          .setAttribute("value", (healthScore += changePoint));
        document.querySelector("h4").innerHTML = `Health: ${healthScore}`;
      }
    });

    theSugars.forEach(function (sug, sugIndex) {
      sug.update();
      if (mainPlayer.checkCollision(sug)) {
        theSugars.splice(sugIndex, 1);
        document
          .querySelector("progress")
          .setAttribute("value", (healthScore -= changePoint));
        document.querySelector("h4").innerHTML = `Health: ${healthScore}`;
      }
    });
  }

  if (healthScore <= 0) {
    document.querySelector("progress").setAttribute("value", (healthScore = 0));
    document.querySelector("h4").innerHTML = `Health: ${healthScore}`;
    isGameover = true;
    handleGameover();
  }

  requestAnimationFrame(animate);
}

animate();

/*GAMEOVER*/
function handleGameover() {
  isGameover = true;
  document.getElementById("gameover").innerHTML = " You lose! ";
  document.getElementById("gameover").style.display = "block";
  document.getElementById("gameover").style.position = "fixed";
  document.getElementById("gameover").style.background = "pink";
  document.getElementById("gameover").style.fontSize = " 100px";
  document.getElementById("gameover").style.textAlign = "center";
}

/* RESTART*/
document.querySelector("button").addEventListener("click", restart);
function restart() {
  location.reload();
}

/* MOVE PLAYER*/
let players = [];
players.push(mainPlayer);
let is_dragging = false;
let curPlIndex = null;
let startX, startY;

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

const countdownEl = document.getElementById("time");
function countdown(time) {
  let timerID = setInterval(function () {
    const minutes = 0;
    let seconds = time % 60;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    countdownEl.innerHTML = `${minutes}:${seconds}`;
    time--;
    if (countdownEl.innerHTML === "0:00") {
      clearInterval(timerID);
      if (countdownEl.innerHTML === "0:00" && healthScore > 0) {
        isGameover = true;
        document.getElementById("gameover").innerHTML = " You win! ";
        document.getElementById("gameover").style.display = "block";
        document.getElementById("gameover").style.position = "fixed";
        document.getElementById("gameover").style.background = "pink";
        document.getElementById("gameover").style.fontSize = " 100px";
        document.getElementById("gameover").style.textAlign = "center";
      } else {
        return;
      }
    }
  }, 1000);
}
countdown(20);

// Variables:
// Health
// position of flying food
// speed of flying food - to change with level
// list of sugars
// list of nonSugars

// Constants:
// Player
// Sugar instance
// nonSugar instance

// Objects:
// sugars
// nonSugars
// 😀🍭🍬🍪🍅🥦🥕

// Initialise:
// canvas
// player in the middle
// food start to fly in

// EventListeners:
// player moves with mouse
// when hit sugar, lose points
// when hit nonSugar, gain points

// Functions:
// draw player, sugar, nonSugar
// player hit the sugar/nonSugar
// update health score
// Game over when health is zero

// Animations:
// update food position

// Reset:
// health is restored
// player goes to the middle
// no food items flying

//-----------------------------------------------------------
