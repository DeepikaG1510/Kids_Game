document.addEventListener('DOMContentLoaded', (event) => {
    const level1Button = document.getElementById('level-1');
    const retryButton = document.getElementById('retry-level');
    const backButton = document.getElementById('back-to-home');
    const homeScreen = document.getElementById('home-screen');
    const gameScreen = document.getElementById('game-screen');
    const resultScreen = document.getElementById('result-screen');
    const resultMessage = document.getElementById('result-message');

    level1Button.addEventListener('click', startLevel1);
    retryButton.addEventListener('click', retryLevel);
    backButton.addEventListener('click', backToHome);

    function startLevel1() {
        homeScreen.style.display = 'none';
        gameScreen.style.display = 'block';
        generateSudoku();
        enableDragAndDrop();
    }

    function retryLevel() {
        resultScreen.style.display = 'none';
        gameScreen.style.display = 'block';
        generateSudoku();
        enableDragAndDrop();
    }

    function backToHome() {
        resultScreen.style.display = 'none';
        homeScreen.style.display = 'block';
    }

    function generateSudoku() {
        const grid = document.getElementById('sudoku-grid');
        grid.innerHTML = '';
    
        // Initialize a set to track used hint images
        const usedHints = new Set();
        const totalHints = 4; // Total number of unique hint images available
    
        // Generate grid and attach event listeners
        for (let i = 0; i < 4; i++) {
            const row = document.createElement('tr');
            for (let j = 0; j < 4; j++) {
                const cell = document.createElement('td');
                cell.dataset.row = i;
                cell.dataset.col = j;
                cell.dataset.value = '';
                cell.addEventListener('dragover', allowDrop);
                cell.addEventListener('drop', drop);
                row.appendChild(cell);
            }
            grid.appendChild(row);
        }
    
        // Place hints
        while (usedHints.size < totalHints) {
            const randomRow = Math.floor(Math.random() * 4);
            const randomCol = Math.floor(Math.random() * 4);
            const cell = grid.querySelector(`td[data-row="${randomRow}"][data-col="${randomCol}"]`);
            
            if (!cell.dataset.value) {
                const hintValue = `${usedHints.size + 1}-Photoroom`; // Adjust based on your hint naming convention
                if (!usedHints.has(hintValue)) {
                    cell.innerHTML = `<img src="images/${hintValue}.png" alt="${hintValue}" draggable="false">`;
                    cell.dataset.value = hintValue;
                    cell.classList.add('hint');
                    usedHints.add(hintValue); // Track the used hint
                }
            }
        }
    }
    

    // Enable dragging for draggable elements
function enableDragAndDrop() {
    const draggables = document.querySelectorAll('.draggable');
    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', dragStart);
    });
}

function dragStart(event) {
    // Ensure only non-hint images can be dragged
    if (!event.target.parentElement.classList.contains('hint')) {
        event.dataTransfer.setData('text/plain', event.target.src);
    } else {
        event.preventDefault();
    }
}

function allowDrop(event) {
    event.preventDefault();
}

function drop(event) {
    event.preventDefault();
    const value = event.dataTransfer.getData('text/plain');
    const imageName = value.split('/').pop().split('.')[0];
    const target = event.target.closest('td'); // Ensure target is a td element

    // Allow drops only on non-hint cells
    if (target && target.tagName === 'TD' && !target.classList.contains('hint')) {
        target.innerHTML = `<img src="${value}" alt="${imageName}" draggable="false">`;
        target.dataset.value = imageName;
        checkSudoku();
    }
}

    

    function checkSudoku() {
        const grid = document.getElementById('sudoku-grid');
        const rows = Array.from({ length: 4 }, () => new Set());

        let isComplete = true;
        let isCorrect = true;

        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                const cell = grid.querySelector(`td[data-row="${i}"][data-col="${j}"]`);
                const value = cell.dataset.value;

                if (!value) {
                    isComplete = false;
                    continue;
                }

                if (rows[i].has(value)) {
                    isCorrect = false;
                }

                rows[i].add(value);
            }
        }

        if (isComplete) {
            gameScreen.style.display = 'none';
            resultScreen.style.display = 'block';
            if (isCorrect) {
                resultMessage.textContent = 'Correct! Well done!';
            } else {
                resultMessage.textContent = 'Incorrect. Please try again.';
            }
        }
    }
});

