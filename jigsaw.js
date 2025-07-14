/* Add these styles to your CSS for the traditional jigsaw */

#puzzle-container {
    background-color: #2a2a2a !important;
    border: 3px solid white !important;
    position: relative !important;
    overflow: visible !important;
    margin: 20px auto !important;
}

.puzzle-piece {
    position: absolute !important;
    cursor: grab !important;
    user-select: none !important;
    transition: box-shadow 0.3s ease !important;
    border-radius: 4px !important;
}

.puzzle-piece:hover {
    box-shadow: 0 0 10px rgba(255, 215, 0, 0.6) !important;
}

.puzzle-piece:active,
.puzzle-piece.dragging {
    cursor: grabbing !important;
    box-shadow: 0 0 15px rgba(255, 215, 0, 0.8) !important;
    transform: scale(1.02) !important;
}

/* Hide any existing puzzle slots since we don't need them */
.puzzle-slot {
    display: none !important;
}

/* Ensure the puzzle area is large enough */
#ingredient-puzzle-screen {
    min-height: 100vh;
    padding: 20px;
    overflow: visible;
}

/* Style the completion state */
.puzzle-piece.completed {
    border: none !important;
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.8) !important;
}
