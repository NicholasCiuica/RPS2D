const canvas = document.querySelector('#game');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function drawText(x, y, radius, text) {
  ctx.font = `${radius}px serif`;
  ctx.textAlign = "center"; 
  ctx.textBaseline = "middle";
  ctx.fillText(text, x, y);
}

function titleCase(string) {
  return string.split(' ').map(word => word[0].toUpperCase() + word.slice(1)).join(' ');
}

const mouse = {'x': 0, 'y': 0};
const previousMouse = {'x': 0, 'y': 0};

document.addEventListener('mousemove', (e) => {
  mouse.x = e.x;
  mouse.y = e.y;
});

  document.addEventListener('touchmove', (e) => {
  mouse.x = e.touches[0].clientX;
  mouse.y = e.touches[0].clientY;
});

//--------------------------------
// creating the grid and some functions to draw it

const rows = 28;
const columns = 28;
const cellSize = 28;
const emojiSize = cellSize * 0.8;

const themes = [rpsData, colorData, flowerData];
let currentThemeIndex = 0;
let currentTheme = themes[currentThemeIndex];

const grid = new Grid(rows, columns, currentTheme.factions, currentTheme.rules);

function drawCell(cell) {
  const x = canvas.width / 2 + (cell.column - columns / 2 + 0.5) * cellSize;
  const y = canvas.height / 2 + (cell.row - rows / 2 + 0.5) * cellSize;
  drawText(x, y, emojiSize, cell.faction.symbol);
}

function drawGrid() {
  grid.cells.forEach(drawCell);
}

//--------------------------------
// dynamically filling the info div with different types of information

const infoContainer = document.querySelector('#info');
const infoTypes = ['percentages', 'rules'];

// object that stores references to elements within the info div

const infoObjects = {};
infoTypes.forEach(infoType => {
  const item = document.createElement('div');
  
  const button = document.createElement('span');
  button.classList.add('Button');
  const icon = document.createElement('span');
  icon.classList.add('icon');
  const label = document.createElement('span');
  label.classList.add('label');
  
  const content = document.createElement('p');

  button.appendChild(icon);
  button.append(' ');
  button.appendChild(label);
  
  item.appendChild(button);
  item.appendChild(content);
  infoContainer.appendChild(item);

  label.textContent = infoType.charAt(0).toUpperCase() + infoType.slice(1);

  infoObjects[infoType] = {
    button: button,
    toggle: icon,
    title: label,
    content: content,
  };
});

//functions that allow the contents (paragraph in each info item) to be toggled by collapsing it

function toggleContent(infoObject) {
  const content = infoObject.content;
  content.style.height = (!content.style.height || content.style.height == '0px' ? content.scrollHeight + 'px' :'0px');
  infoObject.toggle.textContent = (!content.style.height || content.style.height == '0px' ? '⬇️' : '⬆️');
}

function closeContent(infoObject) {
  const content = infoObject.content;
  content.style.height = '0px';
  infoObject.toggle.textContent = '⬇️';
}

function openContent(infoObject) {
  const content = infoObject.content;
  content.style.height = content.scrollHeight + 'px';
  infoObject.toggle.textContent = '⬆️';
}

//this function is only used to check if content was open before themes switch
function isOpen(infoObject) {
  const content = infoObject.content;
  return !(!content.style.height || content.style.height == '0px');
}

// clicking the toggle icon or title within the info item will toggle the content

Object.values(infoObjects).forEach(infoObject => {
  infoObject.button.addEventListener('click', (e) => { toggleContent(infoObject); });
  closeContent(infoObject);
  setTimeout(() => { openContent(infoObject); }, 250);
});

// functions to update the text within each content paragraph

function updatePercentages() {
  const factionCounts = grid.getFactionCounts();
  let percentagesInfo = '';
  grid.factions.forEach(faction => {
    const percentage = (factionCounts[faction.name] / grid.cells.length * 100).toFixed(2);;
    percentagesInfo += `${titleCase(faction.name)} (${faction.symbol}): ${percentage}%\n`;
  });
  infoObjects.percentages.content.innerHTML = percentagesInfo.replace(/\n/g, '<br>');
}

function updateRules() {
  let rulesInfo = '';
  grid.factions.forEach(faction => {
      rulesInfo += `${faction.symbol} beats `;
    const losers = grid.rules.find(rule => rule.winner == faction.name).loser;
    (losers instanceof Array ? losers : new Array(losers)).forEach(loser => {
      rulesInfo += `${grid.factions.find(faction => faction.name == loser).symbol}`;
    });
    rulesInfo += '\n';
  });
  infoObjects.rules.content.innerHTML = rulesInfo.replace(/\n/g, '<br>');
}

// function to update the winner display whenever one faction overtakes the grid

const winnerDisplay = document.querySelector('#winner');

function updateWinner() {
  const factionCounts = grid.getFactionCounts();
  winner.style.opacity = '0';
  grid.factions.forEach(faction => {
    if(factionCounts[faction.name] == grid.cells.length) {
      winner.textContent = `${titleCase(faction.name)} Wins!`;
      winner.style.opacity = '1';
    }
  });
}

//--------------------------------
// creating the bottom panel that contains control buttons and sliders

const bottomPanel = document.querySelector('#bottom-panel');
const toggleButton = document.querySelector('#bottom-panel-toggle');

// button to toggle whether bottom panel is collapsed

const buttonTranslate = getComputedStyle(toggleButton).transform.toString();
function updateToggleButton() {
  const buttonRotate = bottomPanel.style.transform.includes('translateY(100%)') ? 'rotate(0deg)' : 'rotate(180deg)';
  toggleButton.style.transform = buttonTranslate + ' ' + buttonRotate;
}
updateToggleButton();

//bottom panel can be collapsed

bottomPanel.style.transform = 'translateY(0%)';
function toggleBottomPanel() {
  bottomPanel.style.transform = bottomPanel.style.transform == 'translateY(100%)' ? 'translateY(0%)' : 'translateY(100%)';
  updateToggleButton();
}
toggleButton.addEventListener('click', toggleBottomPanel);

//various buttons in the bottom panel to trigger commands

let isRunning = true;

const pauseButton = document.querySelector('#pause-button');
pauseButton.addEventListener('click', (e) => {
  isRunning = !isRunning;
  pauseButton.querySelector('.label').textContent = isRunning ? 'Pause' : 'Play';
  pauseButton.querySelector('.icon').textContent = isRunning ? '⏸️' : '▶️';
});

const resetButton = document.querySelector('#reset-button');
resetButton.addEventListener('click', (e) => {
  grid.randomizeFactions();
});

const themeButton = document.querySelector('#theme-button');
themeButton.addEventListener('click', (e) => {
  switchTheme();
  grid.randomizeFactions();
});

document.addEventListener('keyup', (e) => {
  if(e.key == 'Shift') {
    isRunning = !isRunning;
    pauseButton.querySelector('.label').textContent = isRunning ? 'Pause' : 'Play';
    pauseButton.querySelector('.icon').textContent = isRunning ? '⏸️' : '▶️';
    pauseButton.style.color = '#aaa'; 
    setTimeout(() => { pauseButton.style.color = ''; }, 100);
  }else if(e.key == ' ') {
    grid.randomizeFactions();
    resetButton.style.color = '#aaa'; 
    setTimeout(() => { resetButton.style.color = ''; }, 100);
  } else if(e.key == 'Enter') {
    switchTheme();
    grid.randomizeFactions();
    themeButton.style.color = '#aaa';
    setTimeout(() => { themeButton.style.color = ''; }, 100);
  }
});

// slider to control the speed of the simulation

const updatesPerSecondSlider = document.querySelector('#ups-slider');
const updatesPerSecondDisplay = document.querySelector('#ups');
let updatesPerSecond = updatesPerSecondSlider.value;
updatesPerSecondSlider.value = updatesPerSecond;
updatesPerSecondSlider.addEventListener('input', (e) => {
  updatesPerSecond = e.target.value;
});

//--------------------------------
// update function for UI to be called every frame

function updateUI() {
  // info panel items stop being updated if they are closed or closing
  if(infoObjects.percentages.content.style.height != '0px') {
    updatePercentages();
  }
  if(infoObjects.rules.content.style.height != '0px') {
    updateRules();
  }
  updateWinner();
  updatesPerSecondDisplay.textContent = updatesPerSecond;
}

updatePercentages();
updateRules();

//--------------------------------
// function called whenever the theme of the grid is switched

function switchTheme() {
  currentThemeIndex = (currentThemeIndex + 1) % themes.length;
  currentTheme = themes[currentThemeIndex];
  grid.factions = currentTheme.factions;
  grid.rules = currentTheme.rules;
  // info items are collapsed and reopened every time the theme is switched
  Object.values(infoObjects).forEach(infoObject => {
    const contentWasOpen = isOpen(infoObject);
    closeContent(infoObject);
    setTimeout(() => { 
      updatePercentages();
      updateRules();
      if(contentWasOpen) {
        openContent(infoObject); 
      }
    }, 500);
  });
}

//--------------------------------

const startTime = Date.now();
let initialFrameTime = startTime;
let totalFrameTime = 0;

function update() {
  const currentTime = Date.now();
  const deltaTime = currentTime - initialFrameTime;
  initialFrameTime = currentTime;
  totalFrameTime += deltaTime;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawGrid();
  updateUI();

  const timeBetweenUpdates = 1000 / updatesPerSecond;
  while(totalFrameTime > timeBetweenUpdates) {
    totalFrameTime -= timeBetweenUpdates;
    if(isRunning) {
      grid.update();
    }
  }

  /* drawText(mouse.x + emojiSize / 3, mouse.y + emojiSize, emojiSize * 1.5, '👆'); */

  previousMouse.x = mouse.x;
  previousMouse.y = mouse.y;
  
  window.requestAnimationFrame(update);
}

update();