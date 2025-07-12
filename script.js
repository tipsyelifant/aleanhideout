document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('start-btn');
    const startScreen = document.getElementById('start-screen');
    const registrationGate = document.getElementById('registration-gate');
    const submitCodeBtn = document.getElementById('submit-code-btn');
    const verificationCodeInput = document.getElementById('verification-code');
    const errorMessage = document.getElementById('error-message');
    const storyScreen = document.getElementById('story-screen');
    const dialogueText = document.getElementById('dialogue-text');
    const nextDialogueBtn = document.getElementById('next-dialogue-btn');

    const CORRECT_CODE = "GEMBA"; // Dummy code for now

    const story = [
        { character: "heidi", text: "Welcome to the kitchen! It's a mess, isn't it?" },
        { character: "heidi", text: "The customers are angry because their orders are taking too long." },
        { character: "heidi", text: "I need your help to sort this out. Let's start by looking at this photo..." }
    ];
    let currentDialogue = 0;

    startBtn.addEventListener('click', () => {
        startScreen.style.display = 'none';
        registrationGate.style.display = 'block';
    });

    submitCodeBtn.addEventListener('click', () => {
        if (verificationCodeInput.value.toUpperCase() === CORRECT_CODE) {
            registrationGate.style.display = 'none';
            storyScreen.style.display = 'block';
            showDialogue();
        } else {
            errorMessage.style.display = 'block';
        }
    });

    nextDialogueBtn.addEventListener('click', () => {
        currentDialogue++;
        if (currentDialogue < story.length) {
            showDialogue();
        } else {
            storyScreen.style.display = 'none';
            document.getElementById('puzzle-screen').style.display = 'block';
            initializePuzzle();
        }
    });

    function showDialogue() {
        dialogueText.textContent = story[currentDialogue].text;
        // document.getElementById('character-illustration').src = `images/${story[currentDialogue].character}.png`;
    }

    function initializePuzzle() {
        const puzzle = new Puzzle(
            'puzzle-container',
            'https://picsum.photos/800/600', // Placeholder image
            {
                rows: 3,
                cols: 3,
                onComplete: () => {
                    document.getElementById('next-puzzle-btn').disabled = false;
                }
            }
        );
    }

    document.getElementById('next-puzzle-btn').addEventListener('click', () => {
        document.getElementById('puzzle-screen').style.display = 'none';
        document.getElementById('ingredient-puzzle-screen').style.display = 'block';
    });

    document.getElementById('submit-ingredient-answer-btn').addEventListener('click', () => {
        const answer = document.getElementById('ingredient-answer').value.toUpperCase();
        if (answer === 'GEMBA') {
            document.getElementById('ingredient-puzzle-screen').style.display = 'none';
            document.getElementById('answer-reveal-screen').style.display = 'block';
        } else {
            document.getElementById('ingredient-error-message').style.display = 'block';
        }
    });

    document.getElementById('reflection-btn').addEventListener('click', () => {
        document.getElementById('answer-reveal-screen').style.display = 'none';
        document.getElementById('reflection-screen').style.display = 'block';
    });

    document.getElementById('finish-btn').addEventListener('click', () => {
        // End of the game
        console.log("Game finished!");
        document.getElementById('reflection-screen').style.display = 'none';
        document.getElementById('start-screen').style.display = 'block';
    });

    const hintTitles = document.querySelectorAll('.hint-title');
    hintTitles.forEach(title => {
        title.addEventListener('click', () => {
            title.nextElementSibling.style.display = title.nextElementSibling.style.display === 'block' ? 'none' : 'block';
        });
    });
});
