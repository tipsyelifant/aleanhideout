function initializePuzzle() {
    console.log("Starting jigsaw puzzle with updated dimensions...");
    
    var puzzleContainer = document.querySelector('#ingredient-puzzle-screen #puzzle-container');
    if (!puzzleContainer) {
        console.error("Container not found!");
        return;
    }

    // Clear and setup container with NEW DIMENSIONS
    puzzleContainer.innerHTML = '';
    puzzleContainer.style.width = '600px';  // 600px width
    puzzleContainer.style.height = '340px'; // 340px height (updated)
    puzzleContainer.style.backgroundColor = '#333';
    puzzleContainer.style.border = '3px solid white';
    puzzleContainer.style.margin = '20px auto';
    puzzleContainer.style.position = 'relative';
    puzzleContainer.style.display = 'block';
    puzzleContainer.style.overflow = 'visible';

    // Define correct positions for 3x3 grid with NEW DIMENSIONS
    var correctPositions = {
        1: { x: 0, y: 0 },           // Top-left
        2: { x: 200, y: 0 },         // Top-center  
        3: { x: 400, y: 0 },         // Top-right
        4: { x: 0, y: 113.33 },      // Middle-left (updated Y)
        5: { x: 200, y: 113.33 },    // Middle-center (updated Y)
        6: { x: 400, y: 113.33 },    // Middle-right (updated Y)
        7: { x: 0, y: 226.66 },      // Bottom-left (updated Y)
        8: { x: 200, y: 226.66 },    // Bottom-center (updated Y)
        9: { x: 400, y: 226.66 }     // Bottom-right (updated Y)
    };

    var pieceWidth = 200;        // 200px width
    var pieceHeight = 113.33;    // 113.33px height (updated)
    var snapDistance = 50;       // Snap distance

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
        
        // UPDATED SIZING
        piece.style.width = pieceWidth + 'px';
        piece.style.height = pieceHeight + 'px';
        piece.style.position = 'absolute';
        piece.style.border = '3px solid #FFD700';
        piece.style.cursor = 'grab';
        piece.style.zIndex = '10';
        piece.style.boxSizing = 'border-box';
        piece.style.margin = '0';
        piece.style.padding = '0';
        piece.style.userSelect = 'none';
        piece.style.pointerEvents = 'auto';
        
        // Scatter pieces around the NEW container size
        var startX, startY;
        if (i <= 3) {
            // Top pieces - scatter above
            startX = (i - 1) * 150 + 50;
            startY = -180; // Adjusted for new height
        } else if (i <= 6) {
            // Middle pieces - scatter to sides
            startX = (i <= 4) ? -250 : 750;
            startY = ((i - 4) % 3) * 80 + 50; // Adjusted spacing
        } else {
            // Bottom pieces - scatter below
            startX = (i - 7) * 150 + 50;
            startY = 420; // Adjusted for new height (340 + 80)
        }
        
        piece.style.left = startX + 'px';
        piece.style.top = startY + 'px';
        
        pieces.push(piece);
        puzzleContainer.appendChild(piece);
        
        console.log("Created piece " + i + " (200x113.33) at position " + startX + ", " + startY);
    }

    // Improved drag functionality
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
            var containerRect = puzzleContainer.getBoundingClientRect();
            
            mouseOffset.x = e.clientX - rect.left;
            mouseOffset.y = e.clientY - rect.top;
            
            // Visual feedback
            piece.style.zIndex = '1000';
            piece.style.cursor = 'grabbing';
            piece.style.transform = 'scale(1.05) rotate(2deg)';
            piece.style.border = '3px solid #FFF700';
            piece.style.boxShadow = '0 8px 16px rgba(0,0,0,0.3)';
            
            document.body.style.userSelect = 'none';
            
            console.log("Started dragging piece " + piece.dataset.pieceNumber);
        });

        // Touch support for mobile
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

    // Global mouse move - smooth dragging
    document.addEventListener('mousemove', function(e) {
        if (draggedPiece && isDragging) {
            e.preventDefault();
            
            var containerRect = puzzleContainer.getBoundingClientRect();
            var newX = e.clientX - containerRect.left - mouseOffset.x;
            var newY = e.clientY - containerRect.top - mouseOffset.y;
            
            // Smooth movement with requestAnimationFrame
            requestAnimationFrame(function() {
                if (draggedPiece) {
                    draggedPiece.style.left = newX + 'px';
                    draggedPiece.style.top = newY + 'px';
                }
            });
            
            lastMousePos.x = e.clientX;
            lastMousePos.y = e.clientY;
        }
    });

    // Touch move support
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

    // Global mouse up - drop piece
    document.addEventListener('mouseup', function(e) {
        if (draggedPiece) {
            var piece = draggedPiece;
            var pieceNumber = parseInt(piece.dataset.pieceNumber);
            var correctPos = correctPositions[pieceNumber];
            
            var currentX = parseInt(piece.style.left);
            var currentY = parseInt(piece.style.top);
            
            var distanceX = Math.abs(currentX - correctPos.x);
            var distanceY = Math.abs(currentY - correctPos.y);
            var distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
            
            console.log("Piece " + pieceNumber + " dropped. Distance to target: " + Math.round(distance));
            
            if (distance < snapDistance) {
                // SNAP INTO PLACE with animation!
                piece.style.transition = 'all 0.3s ease-out';
                piece.style.left = correctPos.x + 'px';
                piece.style.top = correctPos.y + 'px';
                piece.style.border = 'none';
                piece.style.borderRadius = '0';
                piece.style.transform = 'scale(1) rotate(0deg)';
                piece.style.cursor = 'default';
                piece.style.zIndex = '50';
                piece.style.boxShadow = 'none';
                piece.dataset.isPlaced = 'true';
                piece.classList.add('placed');
                
                placedPieces[pieceNumber] = true;
                
                // Remove transition after animation
                setTimeout(function() {
                    piece.style.transition = 'none';
                }, 300);
                
                console.log("✅ Piece " + pieceNumber + " SNAPPED into place!");
                
                checkCompletion();
                
            } else {
                // Return to normal state with animation
                piece.style.transition = 'all 0.2s ease-out';
                piece.style.transform = 'scale(1) rotate(0deg)';
                piece.style.border = '3px solid #FFD700';
                piece.style.cursor = 'grab';
                piece.style.zIndex = '10';
                piece.style.boxShadow = 'none';
                
                setTimeout(function() {
                    piece.style.transition = 'none';
                }, 200);
                
                console.log("❌ Piece " + pieceNumber + " not close enough (distance: " + Math.round(distance) + ")");
            }
            
            // Reset drag state
            isDragging = false;
            draggedPiece = null;
            document.body.style.userSelect = '';
        }
    });

    // Touch end support
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

    function checkCompletion() {
        var placedCount = Object.keys(placedPieces).length;
        console.log("Pieces placed: " + placedCount + "/9");
        
        if (placedCount === 9) {
            console.log("🎉 PUZZLE COMPLETED!");
            
            // Final seamless positioning with EXACT coordinates
            pieces.forEach(function(piece, index) {
                var pieceNumber = parseInt(piece.dataset.pieceNumber);
                var correctPos = correctPositions[pieceNumber];
                
                piece.style.transition = 'all 0.5s ease-out';
                piece.style.left = correctPos.x + 'px';
                piece.style.top = correctPos.y + 'px';
                piece.style.border = 'none';
                piece.style.borderRadius = '0';
                piece.style.margin = '0';
                piece.style.padding = '0';
                piece.style.transform = 'scale(1)';
                piece.style.boxShadow = 'none';
            });
            
            // Add completion glow to entire puzzle
            setTimeout(function() {
                puzzleContainer.style.transition = 'all 0.5s ease-out';
                puzzleContainer.style.boxShadow = '0 0 40px rgba(255, 215, 0, 0.8)';
                
                alert("🎉 Puzzle Complete! The kitchen scene is restored. Now find the GEMBA clues in the completed image!");
            }, 600);
        }
    }

    // Double-click to return pieces
    pieces.forEach(function(piece) {
        piece.addEventListener('dblclick', function() {
            if (piece.dataset.isPlaced === 'true') {
                var pieceNumber = parseInt(piece.dataset.pieceNumber);
                delete placedPieces[pieceNumber];
                piece.dataset.isPlaced = 'false';
                
                piece.style.transition = 'all 0.3s ease-out';
                piece.style.border = '3px solid #FFD700';
                piece.style.borderRadius = '4px';
                piece.style.cursor = 'grab';
                piece.style.zIndex = '10';
                piece.style.transform = 'scale(1.1)';
                piece.classList.remove('placed');
                
                setTimeout(function() {
                    piece.style.transform = 'scale(1)';
                    piece.style.transition = 'none';
                }, 300);
                
                console.log("Piece " + pieceNumber + " returned to moveable state");
            }
        });
    });

    console.log("Jigsaw puzzle initialized! Container: 600x340px, Pieces: 200x113.33px");
}

// Make function available globally
window.initializePuzzle = initializePuzzle;

console.log("Updated dimension jigsaw script loaded!");
