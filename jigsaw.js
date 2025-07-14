function initializePuzzle() {
    console.log("Starting clean jigsaw puzzle...");
    
    // Find the correct container
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

    console.log("Container setup complete");

    // Create 9 pieces
    var pieces = [];
    for (var i = 1; i <= 9; i++) {
        var piece = document.createElement('img');
        piece.src = 'images/p' + i + '.png';
        piece.style.width = '150px';
        piece.style.height = '100px';
        piece.style.position = 'absolute';
        piece.style.border = '2px solid yellow';
        piece.style.cursor = 'move';
        
        // Random starting position
        var startX = Math.random() * 400;
        var startY = Math.random() * 250;
        piece.style.left = startX + 'px';
        piece.style.top = startY + 'px';
        
        pieces.push(piece);
        puzzleContainer.appendChild(piece);
        
        console.log("Created piece " + i);
    }

    console.log("All pieces created successfully!");

    // Add drag functionality
    var draggedPiece = null;
    var mouseOffset = {x: 0, y: 0};

    pieces.forEach(function(piece) {
        piece.addEventListener('mousedown', function(e) {
            draggedPiece = piece;
            var rect = piece.getBoundingClientRect();
            mouseOffset.x = e.clientX - rect.left;
            mouseOffset.y = e.clientY - rect.top;
            piece.style.zIndex = '100';
            console.log("Started dragging piece");
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
            draggedPiece.style.zIndex = '1';
            draggedPiece = null;
            console.log("Dropped piece");
        }
    });

    console.log("Drag functionality added");
}

// Make function available globally
window.initializePuzzle = initializePuzzle;

console.log("Jigsaw script loaded successfully!");
