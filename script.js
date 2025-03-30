document.addEventListener('DOMContentLoaded', () => {
    // Definizione del cruciverba
    const crosswordData = {
        grid: [
            [1, 2, 3, 4, 5, '*', 6, 7, 8, 9],
            [10, ' ', ' ', ' ', ' ', ' ', 11, ' ', ' ', ' '],
            [12, ' ', ' ', ' ', ' ', '*', ' ', ' ', ' ', ' '],
            [13, ' ', ' ', '*', 14, 15, ' ', ' ', ' ', ' '],
            ['*', '*', 16, 17, ' ', ' ', ' ', '*', '*', '*'],
            ['*', '*', ' ', ' ', ' ', '*', 18, 19, 20, 21],
            [22, 23, ' ', ' ', '*', 24, ' ', ' ', ' ', ' '],
            [25, ' ', ' ', ' ', 26, ' ', ' ', ' ', ' ', ' '],
            [27, ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
            [28, ' ', ' ', ' ', ' ', '*', 29, ' ', ' ', ' ']
        ],
        words: {
            across: [
                { number: 1, clue: "La capitale d'Italia", answer: "ROMA" },
                { number: 6, clue: "Piccolo strumento a fiato", answer: "FLAUTO" },
                { number: 10, clue: "Animale che vola di notte", answer: "PIPISTRELLO" },
                { number: 12, clue: "La penisola con la Spagna", answer: "IBERICA" },
                { number: 13, clue: "Re di Troia, padre di Ettore", answer: "PRIAMO" },
                { number: 14, clue: "Si battono per applaudire", answer: "MANI" },
                { number: 16, clue: "Tipico dolce di carnevale", answer: "FRITTELLA" },
                { number: 18, clue: "Può essere musicale o di sangue", answer: "GRUPPO" },
                { number: 22, clue: "Il frutto della quercia", answer: "GHIANDA" },
                { number: 25, clue: "Famosa città toscana con la torre pendente", answer: "PISA" },
                { number: 27, clue: "Il colore del cielo sereno", answer: "AZZURRO" },
                { number: 28, clue: "Il continente più vasto", answer: "ASIA" },
                { number: 29, clue: "Lo zaino dello scolaro", answer: "CARTELLA" }
            ],
            down: [
                { number: 1, clue: "Calzatura estiva", answer: "SANDALO" },
                { number: 2, clue: "Può essere a vela o a motore", answer: "BARCA" },
                { number: 3, clue: "Lo è il vino di ottima qualità", answer: "PREGIATO" },
                { number: 4, clue: "Crostaceo con chele", answer: "GRANCHIO" },
                { number: 5, clue: "Recipiente per fiori", answer: "VASO" },
                { number: 7, clue: "La città con il Vesuvio", answer: "NAPOLI" },
                { number: 8, clue: "La città con il Colosseo", answer: "ROMA" },
                { number: 9, clue: "Frutto giallo tropicale", answer: "ANANAS" },
                { number: 11, clue: "Sostanza che dà energia", answer: "PROTEINA" },
                { number: 15, clue: "Il contrario di giorno", answer: "NOTTE" },
                { number: 17, clue: "Il contrario di entrare", answer: "USCIRE" },
                { number: 19, clue: "Strumento per misurare la febbre", answer: "TERMOMETRO" },
                { number: 20, clue: "Fiore simbolo dell'Olanda", answer: "TULIPANO" },
                { number: 21, clue: "La bevanda del mattino", answer: "CAFFÈ" },
                { number: 23, clue: "Uccello che miagola", answer: "GABBIANO" },
                { number: 24, clue: "La città con la Torre Eiffel", answer: "PARIGI" },
                { number: 26, clue: "Una nota musicale", answer: "SI" }
            ]
        }
    };

    const crosswordContainer = document.getElementById('crossword');
    const horizontalCluesList = document.getElementById('horizontal-clues');
    const verticalCluesList = document.getElementById('vertical-clues');
    const messageEl = document.getElementById('message');
    const checkBtn = document.getElementById('check-btn');
    const revealBtn = document.getElementById('reveal-btn');
    const resetBtn = document.getElementById('reset-btn');

    let selectedCell = null;
    let selectedDirection = 'across'; // 'across' o 'down'
    let grid = [];
    let cells = [];
    
    // Inizializza il cruciverba
    function initCrossword() {
        // Pulisci container
        crosswordContainer.innerHTML = '';
        horizontalCluesList.innerHTML = '';
        verticalCluesList.innerHTML = '';
        messageEl.innerHTML = '';
        
        cells = [];
        grid = JSON.parse(JSON.stringify(crosswordData.grid)); // Deep copy
        
        // Crea la griglia
        for (let row = 0; row < grid.length; row++) {
            for (let col = 0; col < grid[row].length; col++) {
                const cellValue = grid[row][col];
                const cellElement = document.createElement('div');
                cellElement.classList.add('cell');
                
                if (cellValue === '*') {
                    cellElement.classList.add('black');
                } else {
                    const input = document.createElement('input');
                    input.setAttribute('maxlength', 1);
                    input.setAttribute('data-row', row);
                    input.setAttribute('data-col', col);
                    cellElement.appendChild(input);
                    
                    input.addEventListener('focus', (e) => {
                        selectCell(row, col);
                    });
                    
                    input.addEventListener('input', (e) => {
                        e.target.value = e.target.value.toUpperCase();
                        moveToNextCell();
                    });
                    
                    input.addEventListener('keydown', handleKeyDown);
                    
                    if (cellValue !== ' ') {
                        const numberElement = document.createElement('div');
                        numberElement.classList.add('cell-number');
                        numberElement.textContent = cellValue;
                        cellElement.appendChild(numberElement);
                    }
                    
                    cells.push({
                        row,
                        col,
                        element: cellElement,
                        input,
                        number: cellValue !== ' ' ? cellValue : null
                    });
                }
                
                crosswordContainer.appendChild(cellElement);
            }
        }
        
        // Crea le definizioni
        crosswordData.words.across.forEach(word => {
            const li = document.createElement('li');
            li.textContent = `${word.number}. ${word.clue}`;
            li.setAttribute('data-number', word.number);
            li.setAttribute('data-direction', 'across');
            li.addEventListener('click', () => {
                selectWordByNumber(word.number, 'across');
            });
            horizontalCluesList.appendChild(li);
        });
        
        crosswordData.words.down.forEach(word => {
            const li = document.createElement('li');
            li.textContent = `${word.number}. ${word.clue}`;
            li.setAttribute('data-number', word.number);
            li.setAttribute('data-direction', 'down');
            li.addEventListener('click', () => {
                selectWordByNumber(word.number, 'down');
            });
            verticalCluesList.appendChild(li);
        });
    }
    
    // Gestione della tastiera
    function handleKeyDown(e) {
        const row = parseInt(e.target.getAttribute('data-row'));
        const col = parseInt(e.target.getAttribute('data-col'));
        
        switch (e.key) {
            case 'ArrowUp':
                e.preventDefault();
                moveSelection(row - 1, col);
                break;
            case 'ArrowDown':
                e.preventDefault();
                moveSelection(row + 1, col);
                break;
            case 'ArrowLeft':
                e.preventDefault();
                if (e.target.selectionStart === 0) {
                    moveSelection(row, col - 1);
                }
                break;
            case 'ArrowRight':
                e.preventDefault();
                moveSelection(row, col + 1);
                break;
            case 'Backspace':
                if (e.target.value === '') {
                    e.preventDefault();
                    moveSelection(row, col - 1);
                }
                break;
            case 'Tab':
                e.preventDefault();
                selectedDirection = selectedDirection === 'across' ? 'down' : 'across';
                highlightWord();
                break;
            case ' ':
                e.preventDefault();
                selectedDirection = selectedDirection === 'across' ? 'down' : 'across';
                highlightWord();
                break;
        }
    }
    
    // Sposta la selezione a una nuova cella
    function moveSelection(row, col) {
        if (row >= 0 && row < grid.length && col >= 0 && col < grid[0].length) {
            if (grid[row][col] !== '*') {
                selectCell(row, col);
            }
        }
    }
    
    // Seleziona una cella
    function selectCell(row, col) {
        clearSelection();
        
        const cell = cells.find(cell => cell.row === row && cell.col === col);
        if (cell) {
            selectedCell = cell;
            cell.element.classList.add('selected');
            cell.input.focus();
            
            highlightWord();
        }
    }
    
    // Evidenzia la parola corrente
    function highlightWord() {
        // Rimuovi tutte le evidenziazioni precedenti
        cells.forEach(cell => {
            cell.element.classList.remove('highlighted');
        });
        
        if (!selectedCell) return;
        
        // Trova la parola in cui si trova la cella selezionata
        let wordCells = [];
        
        if (selectedDirection === 'across') {
            // Trova l'inizio della parola orizzontale
            let startCol = selectedCell.col;
            while (startCol > 0 && grid[selectedCell.row][startCol - 1] !== '*') {
                startCol--;
            }
            
            // Evidenzia tutta la parola orizzontale
            for (let col = startCol; col < grid[0].length && grid[selectedCell.row][col] !== '*'; col++) {
                const cell = cells.find(cell => cell.row === selectedCell.row && cell.col === col);
                if (cell) {
                    cell.element.classList.add('highlighted');
                    wordCells.push(cell);
                }
            }
        } else { // down
            // Trova l'inizio della parola verticale
            let startRow = selectedCell.row;
            while (startRow > 0 && grid[startRow - 1][selectedCell.col] !== '*') {
                startRow--;
            }
            
            // Evidenzia tutta la parola verticale
            for (let row = startRow; row < grid.length && grid[row][selectedCell.col] !== '*'; row++) {
                const cell = cells.find(cell => cell.row === row && cell.col === selectedCell.col);
                if (cell) {
                    cell.element.classList.add('highlighted');
                    wordCells.push(cell);
                }
            }
        }
        
        // Evidenzia la definizione corrispondente
        highlightClue();
    }
    
    // Evidenzia la definizione corrispondente
    function highlightClue() {
        // Rimuovi evidenziazione precedente
        document.querySelectorAll('.clues li').forEach(li => {
            li.classList.remove('active');
        });
        
        if (!selectedCell) return;
        
        // Trova il numero iniziale della parola corrente
        let startCell = null;
        let wordNumber = null;
        
        if (selectedDirection === 'across') {
            // Trova l'inizio della parola orizzontale
            let startCol = selectedCell.col;
            while (startCol > 0 && grid[selectedCell.row][startCol - 1] !== '*') {
                startCol--;
            }
            
            startCell = cells.find(cell => cell.row === selectedCell.row && cell.col === startCol);
            
        } else { // down
            // Trova l'inizio della parola verticale
            let startRow = selectedCell.row;
            while (startRow > 0 && grid[startRow - 1][selectedCell.col] !== '*') {
                startRow--;
            }
            
            startCell = cells.find(cell => cell.row === startRow && cell.col === selectedCell.col);
        }
        
        if (startCell && startCell.number) {
            wordNumber = startCell.number;
            
            // Evidenzia la definizione
            const clueElement = document.querySelector(`.clues li[data-number="${wordNumber}"][data-direction="${selectedDirection}"]`);
            if (clueElement) {
                clueElement.classList.add('active');
                clueElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }
    }
    
    // Seleziona una parola per numero e direzione
    function selectWordByNumber(number, direction) {
        selectedDirection = direction;
        
        // Trova la cella iniziale della parola
        const startCell = cells.find(cell => cell.number === number);
        
        if (startCell) {
            selectCell(startCell.row, startCell.col);
        }
    }
    
    // Passa alla cella successiva
    function moveToNextCell() {
        if (!selectedCell) return;
        
        const row = selectedCell.row;
        const col = selectedCell.col;
        
        if (selectedDirection === 'across') {
            moveSelection(row, col + 1);
        } else {
            moveSelection(row + 1, col);
        }
    }
    
    // Pulisci la selezione attuale
    function clearSelection() {
        cells.forEach(cell => {
            cell.element.classList.remove('selected');
            cell.element.classList.remove('highlighted');
        });
        
        document.querySelectorAll('.clues li').forEach(li => {
            li.classList.remove('active');
        });
    }
    
    // Verifica la soluzione
    function checkSolution() {
        let correct = true;
        
        // Verifica le parole orizzontali
        crosswordData.words.across.forEach(word => {
            let startCell = cells.find(cell => cell.number === word.number);
            
            if (startCell) {
                let wordInput = '';
                let col = startCell.col;
                
                for (let i = 0; i < word.answer.length; i++) {
                    const cell = cells.find(cell => cell.row === startCell.row && cell.col === col + i);
                    if (cell) {
                        wordInput += cell.input.value || ' ';
                        cell.element.classList.remove('error', 'success');
                    }
                }
                
                if (wordInput.replace(/ /g, '') !== word.answer) {
                    correct = false;
                    
                    // Evidenzia errori
                    for (let i = 0; i < word.answer.length; i++) {
                        const cell = cells.find(cell => cell.row === startCell.row && cell.col === col + i);
                        if (cell && cell.input.value && cell.input.value !== word.answer[i]) {
                            cell.element.classList.add('error');
                        }
                    }
                }
            }
        });
        
        // Verifica le parole verticali
        crosswordData.words.down.forEach(word => {
            let startCell = cells.find(cell => cell.number === word.number);
            
            if (startCell) {
                let wordInput = '';
                let row = startCell.row;
                
                for (let i = 0; i < word.answer.length; i++) {
                    const cell = cells.find(cell => cell.row === row + i && cell.col === startCell.col);
                    if (cell) {
                        wordInput += cell.input.value || ' ';
                    }
                }
                
                if (wordInput.replace(/ /g, '') !== word.answer) {
                    correct = false;
                    
                    // Evidenzia errori
                    for (let i = 0; i < word.answer.length; i++) {
                        const cell = cells.find(cell => cell.row === row + i && cell.col === startCell.col);
                        if (cell && cell.input.value && cell.input.value !== word.answer[i]) {
                            cell.element.classList.add('error');
                        }
                    }
                }
            }
        });
        
        if (correct) {
            messageEl.textContent = 'Complimenti! Hai completato correttamente il cruciverba!';
            messageEl.className = 'correct';
        } else {
            messageEl.textContent = 'Ci sono ancora degli errori. Continua a provare!';
            messageEl.className = 'incorrect';
        }
    }
    
    // Rivela la soluzione
    function revealSolution() {
        // Inserisci la soluzione per le parole orizzontali
        crosswordData.words.across.forEach(word => {
            let startCell = cells.find(cell => cell.number === word.number);
            
            if (startCell) {
                let col = startCell.col;
                
                for (let i = 0; i < word.answer.length; i++) {
                    const cell = cells.find(cell => cell.row === startCell.row && cell.col === col + i);
                    if (cell) {
                        cell.input.value = word.answer[i];
                        cell.element.classList.add('success');
                    }
                }
            }
        });
        
        messageEl.textContent = 'Ecco la soluzione completa.';
        messageEl.className = '';
    }
    
    // Reset del cruciverba
    function resetCrossword() {
        cells.forEach(cell => {
            cell.input.value = '';
            cell.element.classList.remove('error', 'success');
        });
        
        messageEl.textContent = '';
        messageEl.className = '';
    }
    
    // Event listeners per i pulsanti
    checkBtn.addEventListener('click', checkSolution);
    revealBtn.addEventListener('click', revealSolution);
    resetBtn.addEventListener('click', resetCrossword);
    
    // Inizializza il cruciverba
    initCrossword();
});