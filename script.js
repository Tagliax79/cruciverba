document.addEventListener('DOMContentLoaded', function() {
    // Dati del cruciverba
    const crosswordData = {
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
    };
    
    // Elementi DOM
    const messageDiv = document.getElementById('message');
    const checkButton = document.getElementById('check');
    const revealButton = document.getElementById('reveal');
    const resetButton = document.getElementById('reset');
    
    // Variabili globali
    let currentDirection = 'across';
    let selectedCell = null;
    let cells = Array.from(document.querySelectorAll('td input')).map(input => {
        const row = parseInt(input.dataset.row);
        const col = parseInt(input.dataset.col);
        return {
            row,
            col,
            input,
            td: input.parentElement,
            number: input.parentElement.querySelector('.cell-number') ? 
                   parseInt(input.parentElement.querySelector('.cell-number').textContent) : null
        };
    });
    
    // Inizializza gli eventi
    function initEvents() {
        // Event listener per tutte le celle
        cells.forEach(cell => {
            cell.input.addEventListener('focus', function() {
                selectCell(cell.row, cell.col);
            });
            
            cell.input.addEventListener('keydown', function(e) {
                handleKeyDown(e, cell.row, cell.col);
            });
            
            cell.input.addEventListener('input', function() {
                this.value = this.value.toUpperCase();
                if (this.value) {
                    moveToNextCell(cell.row, cell.col);
                }
            });
        });
        
        // Event listener per le definizioni
        document.querySelectorAll('#across-clues li, #down-clues li').forEach(li => {
            li.addEventListener('click', function() {
                const number = parseInt(this.dataset.number);
                const direction = this.dataset.direction;
                selectClue(number, direction);
            });
        });
        
        // Event listener per i pulsanti
        checkButton.addEventListener('click', checkSolution);
        revealButton.addEventListener('click', revealSolution);
        resetButton.addEventListener('click', resetCrossword);
        
        // Seleziona la prima cella automaticamente
        selectClue(1, 'across');
    }
    
    // Seleziona una definizione
    function selectClue(number, direction) {
        // Rimuovi la classe active da tutte le definizioni
        document.querySelectorAll('.clues li').forEach(li => {
            li.classList.remove('active');
        });
        
        // Aggiungi la classe active alla definizione selezionata
        const clueElement = document.querySelector(`.clues li[data-number="${number}"][data-direction="${direction}"]`);
        if (clueElement) {
            clueElement.classList.add('active');
            clueElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        
        // Trova la prima cella della parola e selezionala
        const startCell = cells.find(cell => cell.number === number);
        if (startCell) {
            currentDirection = direction;
            selectCell(startCell.row, startCell.col);
        }
        
        // Mostra la definizione
        const clueList = direction === 'across' ? crosswordData.across : crosswordData.down;
        const clue = clueList.find(c => c.number === number);
        if (clue) {
            messageDiv.textContent = `${number}. ${clue.clue}`;
            messageDiv.className = 'message hint';
        }
    }
    
    // Seleziona una cella
    function selectCell(row, col) {
        // Rimuovi la classe highlight da tutte le celle
        cells.forEach(cell => {
            cell.td.classList.remove('highlight');
        });
        
        const cell = cells.find(c => c.row === row && c.col === col);
        if (cell) {
            selectedCell = cell;
            cell.input.focus();
            
            // Evidenzia la parola corrente
            highlightWord(row, col);
            
            // Trova e seleziona la definizione corrispondente
            findAndHighlightClue(row, col);
        }
    }
    
    // Evidenzia la parola corrente
    function highlightWord(row, col) {
        if (currentDirection === 'across') {
            // Trova l'inizio della parola orizzontale
            let startCol = col;
            while (startCol > 0) {
                const prevCell = cells.find(c => c.row === row && c.col === startCol - 1);
                if (!prevCell || prevCell.td.classList.contains('black')) {
                    break;
                }
                startCol--;
            }
            
            // Evidenzia tutta la parola orizzontale
            let currentCol = startCol;
            while (currentCol < 10) {
                const cell = cells.find(c => c.row === row && c.col === currentCol);
                if (!cell || cell.td.classList.contains('black')) {
                    break;
                }
                cell.td.classList.add('highlight');
                currentCol++;
            }
        } else { // down
            // Trova l'inizio della parola verticale
            let startRow = row;
            while (startRow > 0) {
                const prevCell = cells.find(c => c.row === startRow - 1 && c.col === col);
                if (!prevCell || prevCell.td.classList.contains('black')) {
                    break;
                }
                startRow--;
            }
            
            // Evidenzia tutta la parola verticale
            let currentRow = startRow;
            while (currentRow < 10) {
                const cell = cells.find(c => c.row === currentRow && c.col === col);
                if (!cell || cell.td.classList.contains('black')) {
                    break;
                }
                cell.td.classList.add('highlight');
                currentRow++;
            }
        }
    }
    
    // Trova e evidenzia la definizione corrispondente
    function findAndHighlightClue(row, col) {
        // Rimuovi la classe active da tutte le definizioni
        document.querySelectorAll('.clues li').forEach(li => {
            li.classList.remove('active');
        });
        
        // Trova la prima cella della parola corrente
        let startCell = findStartOfWord(row, col, currentDirection);
        if (startCell && startCell.number) {
            // Trova la definizione corrispondente
            const clueElement = document.querySelector(`.clues li[data-number="${startCell.number}"][data-direction="${currentDirection}"]`);
            if (clueElement) {
                clueElement.classList.add('active');
                clueElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                // Mostra la definizione
                const clueList = currentDirection === 'across' ? crosswordData.across : crosswordData.down;
                const clue = clueList.find(c => c.number === startCell.number);
                if (clue) {
                    messageDiv.textContent = `${startCell.number}. ${clue.clue}`;
                    messageDiv.className = 'message hint';
                }
            }
        }
    }
    
    // Trova la prima cella di una parola
    function findStartOfWord(row, col, direction) {
        if (direction === 'across') {
            // Trova l'inizio della parola orizzontale
            let startCol = col;
            while (startCol > 0) {
                const prevCell = cells.find(c => c.row === row && c.col === startCol - 1);
                if (!prevCell || prevCell.td.classList.contains('black')) {
                    break;
                }
                startCol--;
            }
            return cells.find(c => c.row === row && c.col === startCol);
        } else { // down
            // Trova l'inizio della parola verticale
            let startRow = row;
            while (startRow > 0) {
                const prevCell = cells.find(c => c.row === startRow - 1 && c.col === col);
                if (!prevCell || prevCell.td.classList.contains('black')) {
                    break;
                }
                startRow--;
            }
            return cells.find(c => c.row === startRow && c.col === col);
        }
    }
    
    // Gestione della tastiera
    function handleKeyDown(e, row, col) {
        switch (e.key) {
            case 'ArrowUp':
                e.preventDefault();
                moveUp(row, col);
                break;
            case 'ArrowDown':
                e.preventDefault();
                moveDown(row, col);
                break;
            case 'ArrowLeft':
                e.preventDefault();
                moveLeft(row, col);
                break;
            case 'ArrowRight':
                e.preventDefault();
                moveRight(row, col);
                break;
            case 'Tab':
                e.preventDefault();
                toggleDirection();
                highlightWord(row, col);
                break;
            case ' ':
                e.preventDefault();
                toggleDirection();
                highlightWord(row, col);
                break;
            case 'Backspace':
                const input = e.target;
                if (input.value === '') {
                    e.preventDefault();
                    if (currentDirection === 'across') {
                        moveLeft(row, col);
                    } else {
                        moveUp(row, col);
                    }
                }
                break;
        }
    }
    
    // Muovi alla cella successiva
    function moveToNextCell(row, col) {
        if (currentDirection === 'across') {
            moveRight(row, col);
        } else {
            moveDown(row, col);
        }
    }
    
    // Muovi in su
    function moveUp(row, col) {
        if (row > 0) {
            const newRow = row - 1;
            const newCell = cells.find(c => c.row === newRow && c.col === col);
            if (newCell && !newCell.td.classList.contains('black')) {
                selectCell(newRow, col);
            }
        }
    }
    
    // Muovi in giù
    function moveDown(row, col) {
        if (row < 9) {
            const newRow = row + 1;
            const newCell = cells.find(c => c.row === newRow && c.col === col);
            if (newCell && !newCell.td.classList.contains('black')) {
                selectCell(newRow, col);
            }
        }
    }
    
    // Muovi a sinistra
    function moveLeft(row, col) {
        if (col > 0) {
            const newCol = col - 1;
            const newCell = cells.find(c => c.row === row && c.col === newCol);
            if (newCell && !newCell.td.classList.contains('black')) {
                selectCell(row, newCol);
            }
        }
    }
    
    // Muovi a destra
    function moveRight(row, col) {
        if (col < 9) {
            const newCol = col + 1;
            const newCell = cells.find(c => c.row === row && c.col === newCol);
            if (newCell && !newCell.td.classList.contains('black')) {
                selectCell(row, newCol);
            }
        }
    }
    
    // Cambia direzione
    function toggleDirection() {
        currentDirection = currentDirection === 'across' ? 'down' : 'across';
    }
    
    // Verifica la soluzione
    function checkSolution() {
        let allCorrect = true;
        
        // Rimuovi tutte le classi di errore e successo
        cells.forEach(cell => {
            cell.td.classList.remove('error-cell', 'correct-cell');
        });
        
        // Verifica le parole orizzontali
        crosswordData.across.forEach(clue => {
            const word = getWordAtNumber(clue.number, 'across');
            if (word !== clue.answer) {
                allCorrect = false;
                // Evidenzia le celle con errori
                highlightErrors(clue.number, 'across', word, clue.answer);
            }
        });
        
        // Verifica le parole verticali
        crosswordData.down.forEach(clue => {
            const word = getWordAtNumber(clue.number, 'down');
            if (word !== clue.answer) {
                allCorrect = false;
                // Evidenzia le celle con errori
                highlightErrors(clue.number, 'down', word, clue.answer);
            }
        });
        
        if (allCorrect) {
            messageDiv.textContent = 'Complimenti! Hai completato correttamente il cruciverba!';
            messageDiv.className = 'message success';
        } else {
            messageDiv.textContent = 'Ci sono ancora degli errori. Continua a provare!';
            messageDiv.className = 'message error';
        }
    }
    
    // Ottieni la parola corrente a partire dal numero
    function getWordAtNumber(number, direction) {
        const startCell = cells.find(cell => cell.number === number);
        if (!startCell) return '';
        
        let word = '';
        
        if (direction === 'across') {
            let col = startCell.col;
            while (col < 10) {
                const cell = cells.find(c => c.row === startCell.row && c.col === col);
                if (!cell || cell.td.classList.contains('black')) {
                    break;
                }
                word += cell.input.value || ' ';
                col++;
            }
        } else { // down
            let row = startCell.row;
            while (row < 10) {
                const cell = cells.find(c => c.row === row && c.col === startCell.col);
                if (!cell || cell.td.classList.contains('black')) {
                    break;
                }
                word += cell.input.value || ' ';
                row++;
            }
        }
        
        return word.replace(/ /g, '');
    }
    
    // Evidenzia le celle con errori
    function highlightErrors(number, direction, userWord, correctWord) {
        const startCell = cells.find(cell => cell.number === number);
        if (!startCell) return;
        
        if (direction === 'across') {
            let col = startCell.col;
            for (let i = 0; i < correctWord.length; i++) {
                const cell = cells.find(c => c.row === startCell.row && c.col === col + i);
                if (!cell) break;
                
                const userLetter = cell.input.value;
                const correctLetter = correctWord[i];
                
                if (userLetter && userLetter !== correctLetter) {
                    cell.td.classList.add('error-cell');
                }
            }
        } else { // down
            let row = startCell.row;
            for (let i = 0; i < correctWord.length; i++) {
                const cell = cells.find(c => c.row === row + i && c.col === startCell.col);
                if (!cell) break;
                
                const userLetter = cell.input.value;
                const correctLetter = correctWord[i];
                
                if (userLetter && userLetter !== correctLetter) {
                    cell.td.classList.add('error-cell');
                }
            }
        }
    }
    
    // Rivela la soluzione
    function revealSolution() {
        // Rimuovi tutte le classi di errore
        cells.forEach(cell => {
            cell.td.classList.remove('error-cell');
        });
        
        // Inserisci le risposte corrette
        crosswordData.across.forEach(clue => {
            const startCell = cells.find(cell => cell.number === clue.number);
            if (startCell) {
                let col = startCell.col;
                for (let i = 0; i < clue.answer.length; i++) {
                    const cell = cells.find(c => c.row === startCell.row && c.col === col + i);
                    if (cell) {
                        cell.input.value = clue.answer[i];
                        cell.td.classList.add('correct-cell');
                    }
                }
            }
        });
        
        messageDiv.textContent = 'Ecco la soluzione completa.';
        messageDiv.className = 'message success';
    }
    
    // Reset del cruciverba
    function resetCrossword() {
        // Pulisci tutte le celle
        cells.forEach(cell => {
            cell.input.value = '';
            cell.td.classList.remove('error-cell', 'correct-cell');
        });
        
        messageDiv.textContent = 'Cruciverba reimpostato. Buon divertimento!';
        messageDiv.className = 'message hint';
        
        // Seleziona la prima cella
        selectClue(1, 'across');
    }
    
    // Inizializza il cruciverba
    initEvents();
    
    // Mostra un messaggio iniziale
    messageDiv.textContent = "Seleziona una cella o una definizione per iniziare a giocare!";
    messageDiv.className = "message hint";
});