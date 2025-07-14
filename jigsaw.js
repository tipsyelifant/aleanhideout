function initializePuzzle() {
    console.log("Starting snapping jigsaw puzzle...");
    
    var puzzleContainer = document.querySelector('#ingredient-puzzle-screen #puzzle-container');
    if (!puzzleContainer) {
        console.error("Container not found!");
        return;
    }

    // Clear and setup container
    puzzleContainer.innerHTML = '';
    puzzleContainer.style.width = '600px';
    puzzleContainer.style.height = '400px';
    puzzleContainer.style.backgroundColor = '#333';
    puzzleContainer.style.border = '3px solid white';
    puzzleContainer.style.margin = '20px auto';
    puzzleContainer.style.position = 'relative';
    puzzleContainer.style.display = 'block';

    // Define correct positions for 3x3 grid (where pieces should end up)
    var correctPositions = {
        1: { x: 0, y: 0 },         // Top-left
        2: { x: 200, y: 0 },       // Top-center  
        3: { x: 400, y: 0 },       // Top-right
        4: { x: 0, y: 133 },       // Middle-left
        5: { x: 200, y: 133 },     // Middle-center
        6: { x: 400, y: 133 },     // Middle-right
        7: { x: 0, y: 266 },       // Bottom-left
        8: { x: 200, y: 266 },     // Bottom-center
        9: { x: 400, y: 266 }      // Bottom-right
    };

    var pieceWidth = 200;
    var pieceHeight = 134;
    var snapDistance = 40; // How close to snap

    // Create 9 pieces
    var pieces = [];
    var placedPieces = {};

    for (var i = 1; i <= 9; i++) {
        var piece = document.createElement('img');
        piece.src = 'images/p' + i + '.png';
        piece.classList.add('puzzle-piece');
        piece.dataset.pieceNumber = i;
        piece.dataset.isPlaced = 'false';
        
        piece.style.width = pieceWidth + 'px';
        piece.style.height = pieceHeight + 'px';
        piece.style.position = 'absolute';
        piece.style.border = '2px solid #FFD700';
        piece.style.cursor = 'move';
        piece.style.zIndex = '10';
        piece.style.boxSizing = 'content-box'; // Ensure borders don't affect size
        piece.style.margin = '0'; // Remove any margins
        piece.style.padding = '0'; // Remove any padding
        
        // Scatter pieces randomly outside the center area
        var startX, startY;
        if (i <= 3) {
            // Top pieces - scatter above
            startX = Math.random() * 400 + 50;
            startY = Math.random() * 50 - 150;
        } else if (i <= 6) {
            // Middle pieces - scatter to sides
            startX = Math.random() > 0.5 ? Math.random() * 100 - 200 : Math.random() * 100 + 650;
            startY = Math.random() * 200 + 50;
        } else {
            // Bottom pieces - scatter below
            startX = Math.random() * 400 + 50;
            startY = Math.random() * 50 + 450;
        }
        
        piece.style.left = startX + 'px';
        piece.style.top = startY + 'px';
        
        pieces.push(piece);
        puzzleContainer.appendChild(piece);
        
        console.log("Created piece " + i + " at position " + startX + ", " + startY);
    }

    // Drag functionality with snapping
    var draggedPiece = null;
    var mouseOffset = { x: 0, y: 0 };
    var originalPosition = { x: 0, y: 0 };

    pieces.forEach(function(piece) {
        piece.addEventListener('mousedown', function(e) {
            if (piece.dataset.isPlaced === 'true') return; // Don't move placed pieces
            
            draggedPiece = piece;
            var rect = piece.getBoundingClientRect();
            var containerRect = puzzleContainer.getBoundingClientRect();
            
            mouseOffset.x = e.clientX - rect.left;
            mouseOffset.y = e.clientY - rect.top;
            
            // Store original position in case we need to return it
            originalPosition.x = parseInt(piece.style.left);
            originalPosition.y = parseInt(piece.style.top);
            
            piece.style.zIndex = '100';
            piece.style.transform = 'scale(1.05)';
            piece.style.border = '2px solid #FFF700';
            
            console.log("Started dragging piece " + piece.dataset.pieceNumber);
        });
    });

    document.addEventListener('mousemove', function(e) {
        if (draggedPiece) {
            var containerRect = puzzleContainer.getBoundingClientRect();
            var newX = e.clientX - containerRect.left - mouseOffset.x;
            var newY = e.clientY - containerRect.top - mouseOffset.y;
            
            draggedPiece.style.left = newX + 'px';
            draggedPiece.style.top = newY + 'px';
        }
    });

    document.addEventListener('mouseup', function() {
        if (draggedPiece) {
            var piece = draggedPiece;
            var pieceNumber = parseInt(piece.dataset.pieceNumber);
            var correctPos = correctPositions[pieceNumber];
            
            var currentX = parseInt(piece.style.left);
            var currentY = parseInt(piece.style.top);
            
            var distanceX = Math.abs(currentX - correctPos.x);
            var distanceY = Math.abs(currentY - correctPos.y);
            var distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
            
            console.log("Piece " + pieceNumber + " dropped. Distance to target: " + distance);
            
            if (distance < snapDistance) {
                // SNAP INTO PLACE!
                piece.style.left = correctPos.x + 'px';
                piece.style.top = correctPos.y + 'px';
                piece.style.border = 'none'; // Remove border immediately for seamless look
                piece.style.borderRadius = '0'; // Remove rounded corners
                piece.style.zIndex = '50';
                piece.style.transform = 'scale(1)';
                piece.style.cursor = 'default';
                piece.style.margin = '0';
                piece.style.padding = '0';
                piece.dataset.isPlaced = 'true';
                piece.classList.add('placed'); // Add CSS class for placed pieces
                
                placedPieces[pieceNumber] = true;
                
                console.log("✅ Piece " + pieceNumber + " SNAPPED into place!");
                
                // Check if puzzle is complete
                checkCompletion();
                
            } else {
                // Return to normal draggable state
                piece.style.zIndex = '10';
                piece.style.transform = 'scale(1)';
                piece.style.border = '2px solid #FFD700';
                piece.style.cursor = 'move';
                
                console.log("❌ Piece " + pieceNumber + " not close enough to target");
            }
            
            draggedPiece = null;
        }
    });

    function checkCompletion() {
        var placedCount = Object.keys(placedPieces).length;
        console.log("Pieces placed: " + placedCount + "/9");
        
        if (placedCount === 9) {
            console.log("🎉 PUZZLE COMPLETED!");
            
            // Ensure all pieces are seamless (no borders, perfect positioning)
            pieces.forEach(function(piece) {
                piece.style.border = 'none';
                piece.style.margin = '0';
                piece.style.padding = '0';
                piece.style.boxShadow = 'none'; // Remove any shadows that might create gaps
            });
            
            // Add subtle completion glow effect to the entire puzzle
            puzzleContainer.style.boxShadow = '0 0 30px rgba(255, 215, 0, 0.6)';
            
            // Show completion message after a brief delay
            setTimeout(function() {
                alert("🎉 Puzzle Complete! The kitchen scene is restored. Now find the GEMBA clues in the image!");
            }, 500);
        }
    }

    // Double-click to return piece to original scattered position
    pieces.forEach(function(piece) {
        piece.addEventListener('dblclick', function() {
            if (piece.dataset.isPlaced === 'true') {
                // Remove from placed pieces
                var pieceNumber = parseInt(piece.dataset.pieceNumber);
                delete placedPieces[pieceNumber];
                piece.dataset.isPlaced = 'false';
                
                // Return to original scattered position
                piece.style.border = '2px solid #FFD700';
                piece.style.borderRadius = '4px';
                piece.style.cursor = 'move';
                piece.style.zIndex = '10';
                piece.style.boxShadow = 'none';
                piece.style.margin = '0';
                piece.style.padding = '0';
                piece.classList.remove('placed'); // Remove placed class
                
                console.log("Piece " + pieceNumber + " returned to scattered position");
            }
        });
    });

    console.log("Snapping jigsaw puzzle initialized! Drag pieces near their correct positions to snap them into place.");
}

// Make function available globally
window.initializePuzzle = initializePuzzle;

console.log("Snapping jigsaw script loaded!");
