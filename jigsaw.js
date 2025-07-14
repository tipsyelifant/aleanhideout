// Simple, foolproof jigsaw puzzle
function initializePuzzle() {
    console.log("Initializing simple puzzle...");
    
    // FIXED: Target the correct puzzle container in the visible screen
    const puzzleContainer = document.querySelector('#ingredient-puzzle-screen #puzzle-container');
    if (!puzzleContainer) {
        console.error("Puzzle container not found in ingredient-puzzle-screen!");
        return;
    }
    
    console.log("Found correct puzzle container!");

    // Clear container
    puzzleContainer.innerHTML = '';
    
    // Force container to be visible with simple styling
    puzzleContainer.style.cssText = `
        width: 800px !important;
        height: 400px !important;
        background-color: #444 !important;
        border: 3px solid white !important;
        margin: 20px auto !important;
        padding: 20px !important;
        display: block !important;
        position: relative !important;
        overflow: visible !important;
    `;

    // Show hints and answer box - target the correct ones
    const hintContainer = document.querySelector('#ingredient-puzzle-screen #hint-container');
    const answerContainer = document.querySelector('#ingredient-puzzle-screen #ingredient-answer-container');
    if (hintContainer) hintContainer.style.display = 'block';
    if (answerContainer) answerContainer.style.display = 'block';

    // Create pieces area
    const piecesArea = document.createElement('div');
    piecesArea.id = 'pieces-area';
    piecesArea.style.cssText = `
        width: 100%;
        min-height: 200px;
        background-color: #333;
        border: 2px dashed yellow;
        margin-bottom: 20px;
        padding: 10px;
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
    `;
    
    // Create slots area
    const slotsArea = document.createElement('div');
    slotsArea.id = 'slots-area';
    slotsArea.style.cssText = `
        width: 100%;
        min-height: 150px;
        background-color: #222;
        border: 2px dashed cyan;
        padding: 10px;
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
    `;

    puzzleContainer.appendChild(piecesArea);
    puzzleContainer.appendChild(slotsArea);

    // Create 9 puzzle pieces
    const pieces = [];
    for (let i = 1; i <= 9; i++) {
        const piece = document.createElement('img');
        piece.src = `images/p${i}.png`;
        piece.classList.add('puzzle-piece');
        piece.dataset.pieceIndex = i;
        piece.draggable = true;
        
        // Simple, consistent styling
        piece.style.cssText = `
            width: 80px !important;
            height: 80px !important;
            border: 3px solid yellow !important;
            cursor: grab !important;
            margin: 5px !important;
            display: block !important;
            background-color: white !important;
            object-fit: cover !important;
        `;
        
        pieces.push(piece);
        console.log(`Created piece p${i}`);
    }

    // Create 9 slots
    const slots = [];
    for (let i = 1; i <= 9; i++) {
        const slot = document.createElement('div');
        slot.classList.add('puzzle-slot');
        slot.dataset.slotIndex = i;
        slot.innerHTML = `<span style="color: white; font-size: 14px;">Slot ${i}</span>`;
        
        slot.style.cssText = `
            width: 80px !important;
            height: 80px !important;
            border: 3px dashed white !important;
            margin: 5px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            background-color: rgba(255,255,255,0.1) !important;
        `;
        
        slots.push(slot);
        console.log(`Created slot ${i}`);
    }

    // Shuffle pieces
    pieces.sort(() => Math.random() - 0.5);
    
    // Add pieces to pieces area
    pieces.forEach(piece => {
        piecesArea.appendChild(piece);
    });
    
    // Add slots to slots area
    slots.forEach(slot => {
        slotsArea.appendChild(slot);
    });

    console.log(`Added ${pieces.length} pieces and ${slots.length} slots`);

    // Simple drag and drop
    let draggedPiece = null;

    pieces.forEach(piece => {
        piece.addEventListener('dragstart', (e) => {
            draggedPiece = piece;
            piece.style.opacity = '0.5';
            console.log(`Dragging piece p${piece.dataset.pieceIndex}`);
        });

        piece.addEventListener('dragend', (e) => {
            piece.style.opacity = '1';
            draggedPiece = null;
        });
    });

    slots.forEach(slot => {
        slot.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        slot.addEventListener('drop', (e) => {
            e.preventDefault();
            if (draggedPiece) {
                const pieceIndex = parseInt(draggedPiece.dataset.pieceIndex);
                const slotIndex = parseInt(slot.dataset.slotIndex);
                
                console.log(`Dropped piece p${pieceIndex} on slot ${slotIndex}`);
                
                if (pieceIndex === slotIndex) {
                    // Correct match!
                    slot.innerHTML = '';
                    slot.appendChild(draggedPiece);
                    draggedPiece.style.border = '3px solid green';
                    draggedPiece.style.margin = '0';
                    console.log(`✅ Correct match: p${pieceIndex} in slot ${slotIndex}`);
                    checkCompletion();
                } else {
                    // Wrong match
                    draggedPiece.style.border = '3px solid red';
                    console.log(`❌ Wrong match: p${pieceIndex} in slot ${slotIndex}`);
                    setTimeout(() => {
                        draggedPiece.style.border = '3px solid yellow';
                    }, 1000);
                }
            }
        });
    });

    function checkCompletion() {
        let correctCount = 0;
        slots.forEach(slot => {
            const piece = slot.querySelector('.puzzle-piece');
            if (piece) {
                const pieceIndex = parseInt(piece.dataset.pieceIndex);
                const slotIndex = parseInt(slot.dataset.slotIndex);
                if (pieceIndex === slotIndex) {
                    correctCount++;
                }
            }
        });
        
        console.log(`${correctCount}/9 pieces correct`);
        
        if (correctCount === 9) {
            console.log("🎉 PUZZLE COMPLETED!");
            pieces.forEach(piece => {
                piece.style.border = '3px solid gold';
                piece.style.boxShadow = '0 0 10px gold';
            });
        }
    }

    console.log("Simple puzzle initialization complete!");
}

// Make sure it's available globally
window.initializePuzzle = initializePuzzle;

// Auto-initialize when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM loaded - puzzle ready");
});
