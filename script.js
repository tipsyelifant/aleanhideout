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

    const CORRECT_CODE = "aleanhideout!";

    startBtn.addEventListener('click', () => {
        startScreen.style.display = 'none';
        registrationGate.style.display = 'flex';
    });

    submitCodeBtn.addEventListener('click', () => {
        if (verificationCodeInput.value.trim().toLowerCase() === CORRECT_CODE) {
            registrationGate.style.display = 'none';
            storyScreen.style.display = 'flex';
        } else {
            errorMessage.style.display = 'block';
        }
    });

    nextDialogueBtn.addEventListener('click', () => {
        storyScreen.style.display = 'none';
        document.getElementById('angry-customer-screen').style.display = 'grid';
    });

    document.getElementById('customer-scene-next-btn').addEventListener('click', () => {
        document.getElementById('angry-customer-screen').style.display = 'none';
        document.getElementById('dialogue-puzzle-intro-screen').style.display = 'flex';
    });

    // FIXED: Single unlock-kit-btn listener with puzzle initialization
    document.getElementById('unlock-kit-btn').addEventListener('click', () => {
        document.getElementById('dialogue-puzzle-intro-screen').style.display = 'none';
        document.getElementById('ingredient-puzzle-screen').style.display = 'block';
        
        // Initialize the puzzle when screen becomes visible
        if (window.initializePuzzle) {
            window.initializePuzzle();
        }
    });

    document.getElementById('customer-scene-back-btn').addEventListener('click', () => {
        document.getElementById('angry-customer-screen').style.display = 'none';
        storyScreen.style.display = 'flex';
    });

    document.getElementById('puzzle-intro-back-btn').addEventListener('click', () => {
        document.getElementById('dialogue-puzzle-intro-screen').style.display = 'none';
        document.getElementById('angry-customer-screen').style.display = 'flex';
    });

    document.getElementById('submit-ingredient-answer-btn').addEventListener('click', () => {
        const answer = document.getElementById('ingredient-answer').value.toUpperCase();
        if (answer === 'GEMBA') {
            document.getElementById('ingredient-puzzle-screen').style.display = 'none';
            const didYouKnowScreen = document.getElementById('did-you-know-screen');
            didYouKnowScreen.style.display = 'flex';

            const backBtn = document.getElementById('did-you-know-back-btn');
            const nextBtn = document.getElementById('did-you-know-next-btn');

            backBtn.style.visibility = 'hidden';
            nextBtn.style.visibility = 'hidden';

            setTimeout(() => {
                backBtn.style.visibility = 'visible';
                nextBtn.style.visibility = 'visible';
            }, 2000);
        } else {
            document.getElementById('ingredient-error-message').style.display = 'block';
        }
    });

    document.getElementById('ingredient-puzzle-back-btn').addEventListener('click', () => {
        document.getElementById('ingredient-puzzle-screen').style.display = 'none';
        document.getElementById('dialogue-puzzle-intro-screen').style.display = 'flex';
    });

    document.getElementById('did-you-know-back-btn').addEventListener('click', () => {
        document.getElementById('did-you-know-screen').style.display = 'none';
        document.getElementById('ingredient-puzzle-screen').style.display = 'block';
    });

    document.getElementById('did-you-know-next-btn').addEventListener('click', () => {
        document.getElementById('did-you-know-screen').style.display = 'none';
        document.getElementById('puzzle-2-intro-screen').style.display = 'flex';
    });

    document.getElementById('puzzle-2-intro-back-btn').addEventListener('click', () => {
        document.getElementById('puzzle-2-intro-screen').style.display = 'none';
        document.getElementById('did-you-know-screen').style.display = 'flex';
    });

    document.getElementById('puzzle-2-intro-next-btn').addEventListener('click', () => {
        document.getElementById('puzzle-2-intro-screen').style.display = 'none';
        document.getElementById('puzzle-2-screen').style.display = 'flex';
    });

    document.getElementById('puzzle-2-back-btn').addEventListener('click', () => {
        document.getElementById('puzzle-2-screen').style.display = 'none';
        document.getElementById('puzzle-2-intro-screen').style.display = 'flex';
    });

    document.getElementById('submit-puzzle-2-answer-btn').addEventListener('click', () => {
        const answer = document.getElementById('puzzle-2-answer').value.toUpperCase();
        if (answer === 'VALUEADD') {
            document.getElementById('puzzle-2-screen').style.display = 'none';
            document.getElementById('puzzle-2-did-you-know-screen').style.display = 'flex';
        } else {
            document.getElementById('puzzle-2-error-message').style.display = 'block';
        }
    });

    document.getElementById('puzzle-2-did-you-know-back-btn').addEventListener('click', () => {
        document.getElementById('puzzle-2-did-you-know-screen').style.display = 'none';
        document.getElementById('puzzle-2-screen').style.display = 'flex';
    });

    document.getElementById('puzzle-2-did-you-know-next-btn').addEventListener('click', () => {
        document.getElementById('puzzle-2-did-you-know-screen').style.display = 'none';
        document.getElementById('puzzle-3-intro-screen').style.display = 'flex';
    });

    document.getElementById('puzzle-3-intro-back-btn').addEventListener('click', () => {
        document.getElementById('puzzle-3-intro-screen').style.display = 'none';
        document.getElementById('puzzle-2-did-you-know-screen').style.display = 'flex';
    });

    document.getElementById('puzzle-3-intro-next-btn').addEventListener('click', () => {
        document.getElementById('puzzle-3-intro-screen').style.display = 'none';
        document.getElementById('puzzle-3-main-screen').style.display = 'flex';
    });

    const hintTitles = document.querySelectorAll('.hint-title');
    hintTitles.forEach(title => {
        title.addEventListener('click', () => {
            const content = title.nextElementSibling;
            const isVisible = content.style.display === 'block';

            // Close all hint contents
            hintTitles.forEach(otherTitle => {
                otherTitle.nextElementSibling.style.display = 'none';
            });

            // Toggle the clicked one
            content.style.display = isVisible ? 'none' : 'block';
        });
    });

    document.getElementById('submit-puzzle-3-answer-btn').addEventListener('click', () => {
        const answer = document.getElementById('puzzle-3-answer').value;
        if (answer === '96') {
            document.getElementById('puzzle-3-main-screen').style.display = 'none';
            document.getElementById('puzzle-3-did-you-know-screen').style.display = 'flex';
        } else {
            document.getElementById('puzzle-3-error-message').style.display = 'block';
        }
    });

    document.getElementById('puzzle-3-did-you-know-back-btn').addEventListener('click', () => {
        document.getElementById('puzzle-3-did-you-know-screen').style.display = 'none';
        document.getElementById('puzzle-3-main-screen').style.display = 'flex';
    });

    document.getElementById('puzzle-3-did-you-know-next-btn').addEventListener('click', () => {
        document.getElementById('puzzle-3-did-you-know-screen').style.display = 'none';
        document.getElementById('puzzle-4-intro-screen').style.display = 'flex';
    });

    document.getElementById('puzzle-4-intro-back-btn').addEventListener('click', () => {
        document.getElementById('puzzle-4-intro-screen').style.display = 'none';
        document.getElementById('puzzle-3-did-you-know-screen').style.display = 'flex';
    });

    document.getElementById('puzzle-4-intro-next-btn').addEventListener('click', () => {
        // This will eventually lead to the puzzle 4 main screen
        // For now, just go back to the start screen.
        document.getElementById('puzzle-4-intro-screen').style.display = 'none';
        document.getElementById('start-screen').style.display = 'block';
    });
});
