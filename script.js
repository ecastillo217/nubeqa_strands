const board = document.getElementById('board');
const hintsRemaining = document.getElementById('hints-remaining');
let hintsLeft = 3;

// Example board generation
const letters = "NUBEAQRANOTE".split('');
while (letters.length < 25) {
    letters.push(String.fromCharCode(65 + Math.floor(Math.random() * 26)));
}
letters.sort(() => Math.random() - 0.5);

letters.forEach(letter => {
    const tile = document.createElement('div');
    tile.textContent = letter;
    board.appendChild(tile);
});

function useHint() {
    if (hintsLeft > 0) {
        hintsLeft--;
        hintsRemaining.textContent = `${hintsLeft} hints left`;
        alert('Try focusing on "ARANOTE"!');
    } else {
        alert('No hints left!');
    }
}
