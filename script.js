const board = document.getElementById('board');
const currentWordDiv = document.getElementById('current-word');
const foundWordsDiv = document.getElementById('found-words');
const leaderboardDiv = document.getElementById('leaderboard');
let selectedTiles = [];
let selectedWord = "";
let foundWords = [];
let hintsLeft = 3;

// Words players must find
const wordsToFind = ["NUBEQA", "ARANOTE", "CANCER", "TREAT"];

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

// Select tile with adjacency check
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
  if (wordsToFind.includes(selectedWord.toUpperCase()) && !foundWords.includes(selectedWord.toUpperCase())) {
    foundWords.push(selectedWord.toUpperCase());
    updateFoundWords();
    flashTiles();
    alert(`Great! You found: ${selectedWord}`);
  } else {
    alert('Not a valid word.');
  }
  resetSelection();
}

// Use hint
function useHint() {
  if (hintsLeft > 0) {
    const remainingWords = wordsToFind.filter(word => !foundWords.includes(word));
    if (remainingWords.length > 0) {
      const hintWord = remainingWords[Math.floor(Math.random() * remainingWords.length)];
      alert(`Hint: The word starts with "${hintWord.charAt(0)}"`);
      hintsLeft--;
      document.querySelector('button[onclick="useHint()"]').textContent = `Hint (${hintsLeft} left)`;
    }
  } else {
    alert('No hints left!');
  }
}

// Update found words
function updateFoundWords() {
  foundWordsDiv.innerHTML = foundWords.join(', ');
}

// Reset selection
function resetSelection() {
  selectedTiles.forEach(tile => tile.classList.remove('selected'));
  selectedTiles = [];
  selectedWord = "";
  currentWordDiv.textContent = "";
}

// Flash animation
function flashTiles() {
  selectedTiles.forEach(tile => {
    tile.style.backgroundColor = '#90ee90';
    setTimeout(() => {
      tile.style.backgroundColor = '#e0e0e0';
    }, 500);
  });
}

// Timer + Leaderboard
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
  alert(`Time's up! You found ${foundWords.length} words.`);
  saveHighScore(foundWords.length);
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

// Initialize
startTimer();
updateLeaderboard();

