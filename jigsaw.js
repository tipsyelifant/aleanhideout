// Proportional dimensions based on actual mm sizes
// Container: 2940 x 1662mm - scale to fit screen (600px width max)
const SCALE_FACTOR = 600 / 2940; // Scale container to 600px width
const CONTAINER_WIDTH = 600;
const CONTAINER_HEIGHT = Math.round(1662 * SCALE_FACTOR); // ~338px

// Calculate piece dimensions proportionally
const PIECE_DIMENSIONS = {
    1: { width: Math.round(1012 * SCALE_FACTOR), height: Math.round(710 * SCALE_FACTOR) }, // ~206x145
    2: { width: Math.round(1218 * SCALE_FACTOR), height: Math.round(570 * SCALE_FACTOR) }, // ~248x116
    3: { width: Math.round(1205 * SCALE_FACTOR), height: Math.round(714 * SCALE_FACTOR) }, // ~246x146
    4: { width: Math.round(1241 * SCALE_FACTOR), height: Math.round(589 * SCALE_FACTOR) }, // ~253x120
    5: { width: Math.round(1041 * SCALE_FACTOR), height: Math.round(834 * SCALE_FACTOR) }, // ~212x170
    6: { width: Math.round(1187 * SCALE_FACTOR), height: Math.round(577 * SCALE_FACTOR) }, // ~242x118
    7: { width: Math.round(1022 * SCALE_FACTOR), height: Math.round(673 * SCALE_FACTOR) }, // ~208x137
    8: { width: Math.round(1253 * SCALE_FACTOR), height: Math.round(576 * SCALE_FACTOR) }, // ~255x117
    9: { width: Math.round(1215 * SCALE_FACTOR), height: Math.round(699 * SCALE_FACTOR) }  // ~248x143
};

// Function to initialize the puzzle
function initializePuzzle() {
    const puzzleContainer = document.getElementById('puzzle-container');
    const hintContainer = document.getElementById('hint-container');
    const answerContainer = document.getElementById('ingredient-answer-container');

    // Clear any existing content
    puzzleContainer.innerHTML = '';
    
    // Set container to proper proportional size
    puzzleContainer.style.width = CONTAINER_WIDTH + 'px';
    puzzleContainer.style.height = CONTAINER_HEIGHT + 'px';
    puzzleContainer.style.position = 'relative';
    puzzleContainer.style.border = '2px solid white';
    puzzleContainer.style.backgroundColor = '#333';

    const pieces = [];
    const slots = [];

    // Create puzzle pieces with correct proportional dimensions
    for (let i = 1; i <= 9; i++) {
        const piece = document.createElement('img');
        piece.src = `images/p${i}.png`;
        piece.classList.add('puzzle-piece');
        piece.dataset.pieceIndex = i;
        piece.draggable = true;
        
        // Set proportional dimensions
        const dims = PIECE_DIMENSIONS[i];
        piece.style.width = dims.width + 'px';
        piece.style.height = dims.height + 'px';
        piece.style.border = '2px solid yellow';
        piece.style.margin = '5px';
        piece.style.cursor = 'grab';
        piece.style.position = 'relative';
        piece.style.display = 'inline-block';
        
        pieces.push(piece);
    }

    // Create puzzle slots - these will be positioned absolutely to match piece layout
    for (let i = 1; i <= 9; i++) {
        const slot = document.createElement('div');
        slot.classList.add('puzzle-slot');
        slot.dataset.slotIndex = i;
        
        // Set same dimensions as corresponding piece
        const dims = PIECE_DIMENSIONS[i];
        slot.style.width = dims.width + 'px';
        slot.style.height = dims.height + 'px';
        slot.style.border = '2px dashed rgba(255,255,255,0.5)';
        slot.style.position = 'absolute';
        slot.style.backgroundColor = 'rgba(255,255,255,0.1)';
        
        // Position slots in a 3x3 grid layout (adjust positions as needed)
        const row = Math.floor((i - 1) / 3);
        const col = (i - 1) % 3;
        slot.style.top = (row * (CONTAINER_HEIGHT / 3)) + 'px';
        slot.style.left = (col * (CONTAINER_WIDTH / 3)) + 'px';
        
        slots.push(slot);
    }

    // Randomize pieces order
    pieces.sort(() => Math.random() - 0.5);
    
    // Add pieces to container first
    pieces.forEach(piece => {
        puzzleContainer.appendChild(piece);
    });
    
    // Add slots to container
    slots.forEach(slot => {
        puzzleContainer.appendChild(slot);
    });

    let draggedPiece = null;

    puzzleContainer.addEventListener('dragstart', (e) => {
        if (e.target.classList.contains('puzzle-piece')) {
            draggedPiece = e.target;
            e.target.style.opacity = '0.5';
        }
    });

    puzzleContainer.addEventListener('dragend', (e) => {
        if (e.target.classList.contains('puzzle-piece')) {
            e.target.style.opacity = '1';
            draggedPiece = null;
        }
    });

    slots.forEach(slot => {
        slot.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        slot.addEventListener('drop', (e) => {
            e.preventDefault();
            if (draggedPiece) {
                // FIXED: Check if the piece matches this slot
                const pieceIndex = parseInt(draggedPiece.dataset.pieceIndex);
                const slotIndex = parseInt(slot.dataset.slotIndex);
                
                if (pieceIndex === slotIndex && !slot.firstElementChild) {
                    // Correct piece in correct slot!
                    slot.appendChild(draggedPiece);
                    draggedPiece.style.position = 'absolute';
                    draggedPiece.style.top = '0';
                    draggedPiece.style.left = '0';
                    draggedPiece.style.margin = '0';
                    draggedPiece.style.border = '2px solid green'; // Green border when correct
                    
                    checkCompletion();
                } else {
                    // Wrong piece - visual feedback
                    draggedPiece.style.border = '2px solid red';
                    setTimeout(() => {
                        draggedPiece.style.border = '2px solid yellow';
                    }, 1000);
                }
            }
        });
    });

    // Allow pieces to be removed from slots by dragging back to puzzle area
    puzzleContainer.addEventListener('drop', (e) => {
        e.preventDefault();
        if (draggedPiece && !e.target.classList.contains('puzzle-slot')) {
            // Remove from slot and put back in general area
            if (draggedPiece.parentElement.classList.contains('puzzle-slot')) {
                puzzleContainer.appendChild(draggedPiece);
                draggedPiece.style.position = 'relative';
                draggedPiece.style.top = 'auto';
                draggedPiece.style.left = 'auto';
                draggedPiece.style.margin = '5px';
                draggedPiece.style.border = '2px solid yellow';
            }
        }
    });

    puzzleContainer.addEventListener('dragover', (e) => {
        e.preventDefault();
    });

    function checkCompletion() {
        let correctPieces = 0;
        slots.forEach((slot) => {
            const piece = slot.firstElementChild;
            if (piece && piece.classList.contains('puzzle-piece')) {
                const pieceIndex = parseInt(piece.dataset.pieceIndex);
                const slotIndex = parseInt(slot.dataset.slotIndex);
                if (pieceIndex === slotIndex) {
                    correctPieces++;
                }
            }
        });

        console.log(`${correctPieces}/9 pieces correct`);

        if (correctPieces === 9) {
            console.log("Puzzle completed!");
            hintContainer.style.display = 'block';
            answerContainer.style.display = 'block';
            
            // Add completion effect
            pieces.forEach(piece => {
                piece.style.border = '3px solid gold';
            });
        }
    }
}

// Run when DOM is ready OR when called manually
document.addEventListener('DOMContentLoaded', initializePuzzle);

// Also make it available globally so we can call it manually
window.initializePuzzle = initializePuzzle;
