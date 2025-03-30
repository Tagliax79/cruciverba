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