document.addEventListener('DOMContentLoaded', () => {
    const puzzle4Screen = document.getElementById('puzzle-4-screen');
    if (!puzzle4Screen) return;

    const draggables = document.querySelectorAll('.draggable-quote');
    const dropzones = document.querySelectorAll('.drop-zone');
    const answerInput = document.getElementById('puzzle-4-answer');
    const submitBtn = document.getElementById('submit-puzzle-4-answer-btn');
    const feedback = document.getElementById('puzzle-4-feedback');

    const correctMatches = {
        'intellect-zone': 'chef-whine',
        'motion-zone': 'chopping-clash',
        'defects-zone': 'rotating-stove',
        'transport-zone': 'ingredient-run'
    };

    let correctlyPlacedCount = 0;

    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', () => {
            draggable.classList.add('dragging');
        });

        draggable.addEventListener('dragend', () => {
            draggable.classList.remove('dragging');
        });
    });

    dropzones.forEach(dropzone => {
        dropzone.addEventListener('dragover', e => {
            e.preventDefault();
            dropzone.classList.add('over');
        });

        dropzone.addEventListener('dragleave', () => {
            dropzone.classList.remove('over');
        });

        dropzone.addEventListener('drop', e => {
            e.preventDefault();
            dropzone.classList.remove('over');
            const draggableId = document.querySelector('.dragging').id;
            const dropzoneId = dropzone.id;

            if (correctMatches[dropzoneId] === draggableId) {
                const draggableElement = document.getElementById(draggableId);
                dropzone.appendChild(draggableElement);
                draggableElement.classList.add('placed');
                draggableElement.setAttribute('draggable', 'false');
                dropzone.style.border = '2px solid green';
                correctlyPlacedCount++;
                if (correctlyPlacedCount === 4) {
                    answerInput.disabled = false;
                    answerInput.focus();
                }
            } else {
                dropzone.style.border = '2px solid red';
                setTimeout(() => {
                    dropzone.style.border = '2px dashed #ccc';
                }, 1000);
            }
        });
    });

    submitBtn.addEventListener('click', () => {
        if (answerInput.value.trim().toUpperCase() === 'WASTE') {
            // feedback.textContent = 'Correct!';
            // feedback.style.color = 'green';
            // feedback.style.display = 'block';
            // setTimeout(() => {
            //     puzzle4Screen.style.display = 'none';
            //     document.getElementById('puzzle-4-did-you-know-screen').style.display = 'flex';
            // }, 1000);
            document.getElementById('puzzle-4-did-you-know-screen').style.display = 'flex';
            document.getElementById('puzzle-4-screen').style.display = 'none';
        } else {
            feedback.textContent = 'Incorrect, please try again';
            feedback.style.color = 'red';
            feedback.style.display = 'block';
        }
    });

});
