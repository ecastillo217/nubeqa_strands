const board = document.getElementById('board');
const currentWordDiv = document.getElementById('current-word');
const foundWordsDiv = document.getElementById('found-words');
const leaderboardDiv = document.getElementById('leaderboard');

let selectedTiles = [];
let selectedWord = "";
let foundWords = [];
let hintsLeft = 3;

const wordsToFind = ["NUBEQA", "ARANOTE", "CANCER", "TREAT"];
let letters = "NUBEQAARANOTECANCER".split('');

// Fill remaining board randomly
while (letters.length < 25) {
  letters.push(String.fromCharCode(65 + Math.floor(Math.random() * 26)));
}
letters.sort(() => Math.random() - 0.5);

letters.forEach((letter, index) => {
  const tile = document.createElement('div');
  tile.classList.add('tile');
  tile.textContent = letter;
  tile.dataset.index = index;
  tile.addEventListener('click', () => selectTile(tile));
  board.appendChild(tile);
});

function selectTile(tile) {
  if (!tile.classList.contains('selected')) {
    tile.classList.add('selected');
    selectedTiles.push(tile);
    selectedWord += tile.textContent;
    currentWordDiv.textContent = selectedWord;
  }
}

function submitWord() {
  if (wordsToFind.includes(selectedWord.toUpperCase()) && !foundWords.includes(selectedWord.toUpperCase())) {
    foundWords.push(selectedWord.toUpperCase());
    updateFoundWords();
    alert(`Great! You found: ${selectedWord}`);
  } else {
    alert('Not a valid word.');
  }
  resetSelection();
}

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

function updateFoundWords() {
  foundWordsDiv.innerHTML = foundWords.join(', ');
}

function resetSelection() {
  selectedTiles.forEach(tile => tile.classList.remove('selected'));
  selectedTiles = [];
  selectedWord = "";
  currentWordDiv.textContent = "";
}
