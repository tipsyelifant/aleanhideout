function initializePuzzle() {
    console.log("Starting jigsaw puzzle with correct layout and 1.5x bigger size...");
    
    var puzzleContainer = document.querySelector('#ingredient-puzzle-screen #puzzle-container');
    if (!puzzleContainer) {
        console.error("Container not found!");
        return;
    }

    // Clear and setup container - 1.5x bigger: 900x510
    puzzleContainer.innerHTML = '';
    puzzleContainer.style.width = '900px';  // 600 × 1.5 = 900
    puzzleContainer.style.height = '510px'; // 340 × 1.5 = 510
    puzzleContainer.style.backgroundColor = '#333';
    puzzleContainer.style.border = '3px solid white';
    puzzleContainer.style.margin = '20px auto';
    puzzleContainer.style.position = 'relative';
    puzzleContainer.style.display = 'block';
    puzzleContainer.style.overflow = 'visible';

    // Create pieces areas on left and right sides of the container
    var leftPiecesArea = document.createElement('div');
    leftPiecesArea.id = 'left-pieces-area';
    leftPiecesArea.style.cssText = `
        position: absolute;
        left: -220px;
        top: 0;
        width: 200px;
        height: 510px;
        padding: 15px;
        border: 2px dashed #FFD700;
        border-radius: 8px;
        background-color: rgba(255, 215, 0, 0.1);
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        gap: 10px;
        overflow: visible;
    `;
    
    var rightPiecesArea = document.createElement('div');
    rightPiecesArea.id = 'right-pieces-area';
    rightPiecesArea.style.cssText = `
        position: absolute;
        right: -220px;
        top: 0;
        width: 200px;
        height: 510px;
        padding: 15px;
        border: 2px dashed #FFD700;
        border-radius: 8px;
        background-color: rgba(255, 215, 0, 0.1);
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        gap: 10px;
        overflow: visible;
    `;
    
    // Add pieces areas to the puzzle container
    puzzleContainer.appendChild(leftPiecesArea);
    puzzleContainer.appendChild(rightPiecesArea);

    // Define correct positions for 3x3 grid - 1.5x bigger
    var correctPositions = {
        1: { x: 0, y: 0 },           // Top-left
        2: { x: 300, y: 0 },         // Top-center (200 × 1.5 = 300)
        3: { x: 600, y: 0 },         // Top-right (400 × 1.5 = 600)
        4: { x: 0, y: 170 },         // Middle-left (113.33 × 1.5 = 170)
        5: { x: 300, y: 170 },       // Middle-center
        6: { x: 600, y: 170 },       // Middle-right
        7: { x: 0, y: 340 },         // Bottom-left (226.66 × 1.5 = 340)
        8: { x: 300, y: 340 },       // Bottom-center
        9: { x: 600, y: 340 }        // Bottom-right
    };

    var pieceWidth = 300;        // 200 × 1.5 = 300
    var pieceHeight = 170;       // 113.33 × 1.5 = 170
    var snapDistance = 75;       // 50 × 1.5 = 75

    // Create 9 pieces
    var pieces = [];
    var placedPieces = {};
    var isDragging = false;

    for (var i = 1; i <= 9; i++) {
        var piece = document.createElement('img');
        piece.src = 'images/p' + i + '.png';
        piece.classList.add('puzzle-piece');
        piece.dataset.pieceNumber = i;
        piece.dataset.isPlaced = 'false';
        piece.dataset.originalParent = i <= 5 ? 'left-pieces-area' : 'right-pieces-area';
        
        // Piece styling - smaller for side areas (1.5x bigger than before)
        piece.style.width = '150px';  // 100 × 1.5 = 150
        piece.style.height = '85px';  // 57 × 1.5 = 85
        piece.style.border = '2px solid #FFD700';
        piece.style.cursor = 'grab';
        piece.style.zIndex = '10';
        piece.style.borderRadius = '4px';
        piece.style.margin = '0';
        piece.style.padding = '0';
        piece.style.userSelect = 'none';
        piece.style.transition = 'all 0.2s ease';
        
        pieces.push(piece);
        
        console.log("Created piece " + i + " for side areas (1.5x bigger)");
    }

    // Shuffle pieces and distribute to left and right areas
    pieces.sort(function() { return Math.random() - 0.5; });
    pieces.forEach(function(piece, index) {
        if (index < 5) {
            leftPiecesArea.appendChild(piece);
        } else {
            rightPiecesArea.appendChild(piece);
        }
    });

    // Drag functionality
    var draggedPiece = null;
    var mouseOffset = { x: 0, y: 0 };
    var lastMousePos = { x: 0, y: 0 };

    pieces.forEach(function(piece) {
        // Mouse down - start drag
        piece.addEventListener('mousedown', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            if (piece.dataset.isPlaced === 'true') return;
            
            isDragging = true;
            draggedPiece = piece;
            
            var rect = piece.getBoundingClientRect();
            mouseOffset.x = e.clientX - rect.left;
            mouseOffset.y = e.clientY - rect.top;
            
            // When dragging starts, resize to full size and make absolute
            piece.style.position = 'fixed';
            piece.style.width = pieceWidth + 'px';
            piece.style.height = pieceHeight + 'px';
            piece.style.zIndex = '1000';
            piece.style.cursor = 'grabbing';
            piece.style.transform = 'scale(1.02) rotate(2deg)';
            piece.style.border = '3px solid #FFF700';
            piece.style.boxShadow = '0 8px 16px rgba(0,0,0,0.3)';
            piece.style.borderRadius = '4px';
            
            // Position at mouse
            piece.style.left = (e.clientX - mouseOffset.x) + 'px';
            piece.style.top = (e.clientY - mouseOffset.y) + 'px';
            
            document.body.style.userSelect = 'none';
            
            console.log("Started dragging piece " + piece.dataset.pieceNumber);
        });

        // Touch support
        piece.addEventListener('touchstart', function(e) {
            e.preventDefault();
            var touch = e.touches[0];
            var mouseEvent = new MouseEvent('mousedown', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            piece.dispatchEvent(mouseEvent);
        });
    });

    // Global mouse move
    document.addEventListener('mousemove', function(e) {
        if (draggedPiece && isDragging) {
            e.preventDefault();
            
            requestAnimationFrame(function() {
                if (draggedPiece) {
                    draggedPiece.style.left = (e.clientX - mouseOffset.x) + 'px';
                    draggedPiece.style.top = (e.clientY - mouseOffset.y) + 'px';
                }
            });
            
            lastMousePos.x = e.clientX;
            lastMousePos.y = e.clientY;
        }
    });

    // Touch move
    document.addEventListener('touchmove', function(e) {
        if (draggedPiece) {
            e.preventDefault();
            var touch = e.touches[0];
            var mouseEvent = new MouseEvent('mousemove', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            document.dispatchEvent(mouseEvent);
        }
    });

    // Global mouse up
    document.addEventListener('mouseup', function(e) {
        if (draggedPiece) {
            var piece = draggedPiece;
            var pieceNumber = parseInt(piece.dataset.pieceNumber);
            var correctPos = correctPositions[pieceNumber];
            
            // Check if dropped over puzzle container
            var containerRect = puzzleContainer.getBoundingClientRect();
            var pieceRect = piece.getBoundingClientRect();
            
            var relativeX = pieceRect.left - containerRect.left;
            var relativeY = pieceRect.top - containerRect.top;
            
            var distanceX = Math.abs(relativeX - correctPos.x);
            var distanceY = Math.abs(relativeY - correctPos.y);
            var distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
            
            console.log("Piece " + pieceNumber + " dropped. Distance to target: " + Math.round(distance));
            
            if (distance < snapDistance && 
                relativeX >= -75 && relativeX <= 975 && 
                relativeY >= -75 && relativeY <= 585) {
                
                // SNAP INTO PLACE!
                piece.style.position = 'absolute';
                piece.style.left = correctPos.x + 'px';
                piece.style.top = correctPos.y + 'px';
                piece.style.width = pieceWidth + 'px';
                piece.style.height = pieceHeight + 'px';
                piece.style.border = 'none';
                piece.style.borderRadius = '0';
                piece.style.transform = 'scale(1) rotate(0deg)';
                piece.style.cursor = 'default';
                piece.style.zIndex = '50';
                piece.style.boxShadow = 'none';
                piece.style.transition = 'all 0.3s ease-out';
                piece.dataset.isPlaced = 'true';
                piece.classList.add('placed');
                
                // Move to puzzle container
                puzzleContainer.appendChild(piece);
                placedPieces[pieceNumber] = true;
                
                console.log("✅ Piece " + pieceNumber + " SNAPPED into place!");
                
                setTimeout(function() {
                    piece.style.transition = 'none';
                }, 300);
                
                checkCompletion();
                
            } else {
                // Return to pieces area
                returnToPiecesArea(piece);
            }
            
            // Reset drag state
            isDragging = false;
            draggedPiece = null;
            document.body.style.userSelect = '';
        }
    });

    // Touch end
    document.addEventListener('touchend', function(e) {
        if (draggedPiece) {
            e.preventDefault();
            var mouseEvent = new MouseEvent('mouseup', {
                clientX: lastMousePos.x,
                clientY: lastMousePos.y
            });
            document.dispatchEvent(mouseEvent);
        }
    });

    function returnToPiecesArea(piece) {
        piece.style.position = 'static';
        piece.style.width = '150px';  // 1.5x bigger side piece size
        piece.style.height = '85px';  // 1.5x bigger side piece size
        piece.style.border = '2px solid #FFD700';
        piece.style.cursor = 'grab';
        piece.style.zIndex = '10';
        piece.style.transform = 'scale(1) rotate(0deg)';
        piece.style.boxShadow = 'none';
        piece.style.borderRadius = '4px';
        piece.style.transition = 'all 0.2s ease';
        
        // Return to original side (left or right)
        var originalSide = piece.dataset.originalParent;
        if (originalSide === 'left-pieces-area') {
            leftPiecesArea.appendChild(piece);
        } else {
            rightPiecesArea.appendChild(piece);
        }
        
        console.log("❌ Piece returned to " + originalSide);
    }

    function checkCompletion() {
        var placedCount = Object.keys(placedPieces).length;
        console.log("Pieces placed: " + placedCount + "/9");
        
        if (placedCount === 9) {
            console.log("🎉 PUZZLE COMPLETED!");
            
            // Hide both pieces areas
            leftPiecesArea.style.display = 'none';
            rightPiecesArea.style.display = 'none';
            
            // Create clean overlay image
            var cleanOverlay = document.createElement('img');
            cleanOverlay.src = 'images/puzzle1.png'; // Clean complete image
            cleanOverlay.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 900px;
                height: 510px;
                z-index: 100;
                border: none;
                border-radius: 0;
                opacity: 0;
                transition: opacity 0.8s ease-in;
            `;
            
            puzzleContainer.appendChild(cleanOverlay);
            
            // Fade in the clean image
            setTimeout(function() {
                cleanOverlay.style.opacity = '1';
                
                // Add completion glow to entire container
                puzzleContainer.style.transition = 'all 0.5s ease-out';
                puzzleContainer.style.boxShadow = '0 0 40px rgba(255, 215, 0, 0.8)';
                
                setTimeout(function() {
                    alert("🎉 Puzzle Complete! The kitchen scene is restored.");
                }, 800);
            }, 500);
        }
    }

    // Double-click to return pieces from puzzle to pieces area
    pieces.forEach(function(piece) {
        piece.addEventListener('dblclick', function() {
            if (piece.dataset.isPlaced === 'true') {
                var pieceNumber = parseInt(piece.dataset.pieceNumber);
                delete placedPieces[pieceNumber];
                piece.dataset.isPlaced = 'false';
                piece.classList.remove('placed');
                
                returnToPiecesArea(piece);
                
                console.log("Piece " + pieceNumber + " returned to pieces area");
            }
        });
    });

    console.log("Jigsaw puzzle initialized! Container: 900x510px (1.5x bigger), Pieces: 300x170px");
}

// Make function available globally
window.initializePuzzle = initializePuzzle;

console.log("Correct layout jigsaw script loaded (1.5x bigger)!");
