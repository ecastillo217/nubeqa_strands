const board = document.getElementById('board');
const currentWordDiv = document.getElementById('current-word');
const foundWordsDiv = document.getElementById('found-words');
const bonusWordsDiv = document.getElementById('bonus-words');
const leaderboardDiv = document.getElementById('leaderboard');
const victoryModal = document.getElementById('victory-modal');
const victorySummary = document.getElementById('victory-summary');

let selectedTiles = [];
let selectedWord = "";
let foundWords = [];
let bonusWords = [];
let hintsLeft = 3;

// Puzzle Words (important for theme)
const puzzleWords = ["nubeqa", "aranote", "cancer", "treat"];

// Build board letters
let letters = "NUBEQAARANOTECANCER".split('');
while (letters.length < 25) {
  letters.push(String.fromCharCode(65 + Math.floor(Math.random() * 26)));
}
letters.sort(() => Math.random() - 0.5);

// Create board
letters.forEach((letter, index) => {
  const tile = document.createElement('div');
  tile.classList.add('tile');
  tile.textContent = letter;
  tile.dataset.index = index;
  tile.addEventListener('mousedown', () => selectTile(tile));
  tile.addEventListener('touchstart', (e) => {
    e.preventDefault();
    selectTile(tile);
  });
  board.appendChild(tile);
});

// Select tile
function selectTile(tile) {
  const index = parseInt(tile.dataset.index);
  if (tile.classList.contains('selected')) return;
  if (selectedTiles.length === 0 || isAdjacent(index)) {
    tile.classList.add('selected');
    selectedTiles.push(tile);
    selectedWord += tile.textContent;
    currentWordDiv.textContent = selectedWord;
  } else {
    alert('You must select adjacent tiles!');
  }
}

// Check adjacency
function isAdjacent(index) {
  const lastTileIndex = parseInt(selectedTiles[selectedTiles.length - 1].dataset.index);
  const lastRow = Math.floor(lastTileIndex / 5);
  const lastCol = lastTileIndex % 5;
  const newRow = Math.floor(index / 5);
  const newCol = index % 5;
  return Math.abs(lastRow - newRow) <= 1 && Math.abs(lastCol - newCol) <= 1;
}

// Submit word
function submitWord() {
  if (selectedWord.length < 4) {
    alert('Words must be at least 4 letters.');
    resetSelection();
    return;
  }
  validateWord(selectedWord.toLowerCase());
}

// Validate word using DictionaryAPI
async function validateWord(word) {
  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    if (response.ok) {
      if (puzzleWords.includes(word) && !foundWords.includes(word.toUpperCase())) {
        foundWords.push(word.toUpperCase());
        updateFoundWords();
        flashTiles();
        alert(`Great! Puzzle word found: ${word}`);
      } else if (!bonusWords.includes(word.toUpperCase())) {
        bonusWords.push(word.toUpperCase());
        updateBonusWords();
        flashTiles();
        alert(`Bonus word found: ${word}`);
      }
    } else {
      alert('Not a valid English word.');
    }
  } catch (error) {
    console.error('Error validating word:', error);
    alert('Problem validating word.');
  }
  resetSelection();
}

// Update found words
function updateFoundWords() {
  foundWordsDiv.innerHTML = foundWords.join(', ');
}

// Update bonus words
function updateBonusWords() {
  bonusWordsDiv.innerHTML = bonusWords.join(', ');
}

// Reset selection
function resetSelection() {
  selectedTiles.forEach(tile => tile.classList.remove('selected'));
  selectedTiles = [];
  selectedWord = "";
  currentWordDiv.textContent = "";
}

// Flash tiles on success
function flashTiles() {
  selectedTiles.forEach(tile => {
    tile.style.backgroundColor = '#90ee90';
    setTimeout(() => {
      tile.style.backgroundColor = '#e0e0e0';
    }, 500);
  });
}

// Timer and Leaderboard
let timeLeft = 180;
let timerInterval;

function startTimer() {
  timerInterval = setInterval(() => {
    timeLeft--;
    document.getElementById('timer').textContent = `Time Left: ${timeLeft}s`;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      endGame();
    }
  }, 1000);
}

function endGame() {
  showVictoryScreen();
  saveHighScore(foundWords.length + bonusWords.length);
}

function saveHighScore(score) {
  const bestScore = localStorage.getItem('nubeqaBestScore') || 0;
  if (score > bestScore) {
    localStorage.setItem('nubeqaBestScore', score);
    alert('New High Score!');
  }
  updateLeaderboard();
}

function updateLeaderboard() {
  const bestScore = localStorage.getItem('nubeqaBestScore') || 0;
  leaderboardDiv.innerHTML = `🏆 Best Words Found: ${bestScore}`;
}

// Victory Screen
