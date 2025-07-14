// Function to initialize the puzzle
function initializePuzzle() {
    const puzzleContainer = document.getElementById('puzzle-container');
    const hintContainer = document.getElementById('hint-container');
    const answerContainer = document.getElementById('ingredient-answer-container');

    // Clear any existing content
    puzzleContainer.innerHTML = '';

    const pieces = [];
    for (let i = 1; i <= 9; i++) {
        const piece = document.createElement('img');
        piece.src = `images/p${i}.png`;
        piece.classList.add('puzzle-piece');
        piece.dataset.pieceIndex = i;
        piece.draggable = true;
        pieces.push(piece);
    }

    // Randomize pieces
    pieces.sort(() => Math.random() - 0.5);
    pieces.forEach(piece => {
        puzzleContainer.appendChild(piece);
    });

    const slots = [];
    for (let i = 0; i < 9; i++) {
        const slot = document.createElement('div');
        slot.classList.add('puzzle-slot');
        slot.dataset.slotIndex = i + 1;
        slots.push(slot);
        puzzleContainer.appendChild(slot);
    }

    let draggedPiece = null;

    puzzleContainer.addEventListener('dragstart', (e) => {
        if (e.target.classList.contains('puzzle-piece')) {
            draggedPiece = e.target;
            setTimeout(() => {
                e.target.style.display = 'none';
            }, 0);
        }
    });

    puzzleContainer.addEventListener('dragend', (e) => {
        if (draggedPiece) {
            draggedPiece.style.display = 'block';
            draggedPiece = null;
        }
    });

    slots.forEach(slot => {
        slot.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        slot.addEventListener('drop', (e) => {
            e.preventDefault();
            if (draggedPiece && !slot.firstChild) {
                slot.appendChild(draggedPiece);
                checkCompletion();
            }
        });
    });

    function checkCompletion() {
        let correctPieces = 0;
        slots.forEach((slot, index) => {
            const piece = slot.firstChild;
            if (piece && parseInt(piece.dataset.pieceIndex) === (index + 1)) {
                correctPieces++;
            }
        });

        if (correctPieces === 9) {
            hintContainer.style.display = 'block';
            answerContainer.style.display = 'block';
        }
    }
}

// Run when DOM is ready OR when called manually
document.addEventListener('DOMContentLoaded', initializePuzzle);

// Also make it available globally so we can call it manually
window.initializePuzzle = initializePuzzle;
