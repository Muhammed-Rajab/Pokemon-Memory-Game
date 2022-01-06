'use strict';

/* Alias for console.log */
const log = console.log;

/* Callback that triggers when DOM content gets completely loaded */
function onDOMContentLoad(){
    
    /* Elements */
    const grid      = document.querySelector("#grid");
    const scoreSpan = document.querySelector(".score");
    const timerSpan = document.querySelector(".timer");
    const pressMeBtn = document.querySelector(".press-here-text");
    const blurredBackground = document.querySelector(".blurred-bg");
    const startGameContainer = document.querySelector('.start-game-container');
    const difficultyModal = document.querySelector(".select-difficulty-modal-container");
    const mainGameWindow = document.querySelector(".main-game-window");
    const [easyDiffBtn, mediumDiffBtn, hardDiffBtn] = document.querySelectorAll('.difficulty-btn');

    /* Function to hide the whole start game container */
    /* Function to hide select difficulty modal and blurred background */
    const toggleModalAndBackground = () => {
        if(blurredBackground.classList.contains('hidden') && difficultyModal.classList.contains('hidden')){
            blurredBackground.classList.remove('hidden');
            difficultyModal.classList.remove('hidden');
        }else{
            blurredBackground.classList.add('hidden');
            difficultyModal.classList.add('hidden');
        }
    };
    
    /* Handle select difficulty modal visibility*/
    pressMeBtn.addEventListener('click', toggleModalAndBackground);

    /* Eventlistener to hide modal window on escape key click */
    window.addEventListener('keydown', (e)=>{
        if(e.key === "Escape"){
            if(!blurredBackground.classList.contains('hidden') && !difficultyModal.classList.contains('hidden')){
                toggleModalAndBackground();
            }
        }
    });

    /* Setting game's difficulty */
    [easyDiffBtn, mediumDiffBtn, hardDiffBtn].forEach(btn=>{
        btn.addEventListener('click', ()=>{
            const gameDifficulty = btn.dataset.code;
            toggleModalAndBackground();
            startGameContainer.classList.add('hidden');
            mainGameWindow.classList.remove('hidden');
            startGame(parseInt(gameDifficulty));
        });
    });

    /* Game Logics */
    function startGame(difficulty) {
        
        /* Starts timer */
        let timeCounter = 0;
        
        const timer = setInterval(()=>{

            /* Formatting the to minutes and seconds */
            const minutes = Math.floor(timeCounter/60);
            const seconds = timeCounter % 60;

            /* Updates time and set time to UI */
            timerSpan.textContent = `${minutes < 10?`0${minutes}`:minutes}:${seconds < 10?`0${seconds}`:seconds}`;
            timeCounter++;

        }, 1000);
        
        /* Game's difficulty level */
        const gameDifficulty = difficulty;

        /* Setting number of row's and columm for each difficulty level */

        const gameGridSize = new Map();
        gameGridSize.set(1, {row: 2, col: 2});
        gameGridSize.set(2, {row: 4, col: 4});
        gameGridSize.set(3, {row: 6, col: 6});

        /* gets current game grid size based on difficulty */
        const currentGridSize = gameGridSize.get(gameDifficulty);

        /* Setting game grid size */
        grid.style.width = `${currentGridSize.row*100}px`;
        grid.style.height = `${currentGridSize.col*100}px`;

        /* Function to create random card array according to gam difficulty level */
        function generateRandomCardArray(){
            
            const randomCardsArray = [];
            const slicedArray = cards.slice(0, currentGridSize.col);
            
            for(let i = 0; i < currentGridSize.row; i++){
                randomCardsArray.push(...slicedArray);
            };
            
            return shuffle(randomCardsArray);
        };

        /* Cards */
        const cards     = [
            {
                title: "bulbasaur", src: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png"
            },
            {
                title: "charmander", src: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png"
            },
            {
                title: "squirtle", src: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png"
            },
            {
                title: "pikachu", src: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png"
            },
            {
                title: "jigglypuff", src: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/39.png"
            },
            {
                title: "snorlax", src: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/143.png"
            },
        ];

        /* Other cards */
        const blankCard = {src: "assets/images/blank.png"};
        const whiteCard = {src: "assets/images/white.png"};

        /* Randomized array of cards with pair of each cards */
        const randomCardsArray = generateRandomCardArray();

        /* Keeps track of score */
        let     score   = 0;
        const   activeCards = [];
        const   activeCardsIndexes = [];

        /* Creates a grid of random cards with a blank image to hide them */
        createGameGrid(randomCardsArray, blankCard, whiteCard);


        /* ! ------------------ Functions ------------------ ! */

        /* Clears the array of activeCards and activeCardIndexes */
        function clearActiveCardsAndIndexes() {
        
            while(activeCards.length) activeCards.pop();
            while(activeCardsIndexes.length) activeCardsIndexes.pop();

        };


        /*
            ! Replaces the card 
                * Selects all img tags inside grid
                * If the selected cards matches
                    * Changes their src property to whiteCard.src
                    * Removes their eventlistener to prevent clicking again
                * Else
                    * Changes their src propery to blankCard.src and game continues
        */
        function replaceCards(matches){
        
            const cardElements = grid.querySelectorAll('img');
            const [card1Index, card2Index] = activeCardsIndexes;

            if (matches){
                cardElements[card1Index].src = cardElements[card2Index].src = whiteCard.src;
                
                cardElements[card1Index].removeEventListener('click', flipCard);
                cardElements[card2Index].removeEventListener('click', flipCard);

                checkWin();

            }else{
                cardElements[card1Index].src = cardElements[card2Index].src = blankCard.src;
            };
        };


        /* Function to shuffle array elements */
        function shuffle(array) {
            
            /*
                Code copied from:
                    https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
            */
            let currentIndex = array.length,  randomIndex;

            while (currentIndex != 0) {
                
                randomIndex = Math.floor(Math.random() * currentIndex);
                
                currentIndex--;
            
                [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];

            };

            return array;
        };


        /* 
            ! Creates game grid
                * Loops through randomCardsArray
                    * Creates a new image element
                    * Sets is src to blankCard.src
                    * Sets a data-index attiribute to preserve their position in   randomCardsarray 
                    * Attaches an eventlistener to flip card on click and stores that eventlistener to an array
                    * Appends the image element to grid
        */
        function createGameGrid (){
            
            for(const [index, card] of randomCardsArray.entries()){
                
                const cardElement   = document.createElement('img');

                cardElement.src     = blankCard.src;

                cardElement.classList.add("pokemon-card");
                
                /* 
                    Creates a data attribute to store the index of current card to it,
                    so that we can use that index to show the card image when we flip cards 
                */
                cardElement.dataset['index']  = index;

                cardElement.addEventListener('click', flipCard);

                grid.appendChild(cardElement);
            };
        };
        

        /* 
            Callback that triggers when clicked on card 
                * Gets data-index attribute
                * Pushes the current card object and current card index to activeCards and activeCardsIndexes array respectively.
                * It changes the card's src from blank to the card of data-index;
                * Invokes checkMatch function
        */
        function flipCard (){
            
            const cardIndex = this.dataset.index;

            activeCards.push(randomCardsArray[cardIndex]);

            activeCardsIndexes.push(cardIndex);

            this.src    = randomCardsArray[cardIndex].src;
            
            setTimeout(checkMatch, 150);
            
        };



        /*
            * Checks whether last two cards matches
            * If length of activeCards === 2
                * If the current card has same title as the previously clicked one
                    * Increments score by 1
                    * Invokes replaceCards(true)
                * Else
                    * Invokes replaceCards(true)
                * Invokes clearActiveCardsAndIndexes function
                
                * If the score is equal to half of the length of randomCards arrray
                    * Shows `You win` alert and reloads the page
        */
    function checkMatch(){

            if (activeCards.length >= 2){
            
            const [card1, card2] = activeCards;
            const [card1Index, card2Index] = activeCardsIndexes;

            if (card2Index === card1Index){
                replaceCards(false);
                clearActiveCardsAndIndexes();
                return;
            }
            if (card1.title === card2.title){
                
                scoreSpan.textContent = ++score;
                replaceCards(true);

            } else{
                replaceCards(false);
            };
            
            /* Clears both activeCards and activeCardsIndexes array */ 
            clearActiveCardsAndIndexes();
        
            };
        
        };

        function checkWin(){
            if(score === randomCardsArray.length/2){
                
                clearInterval(timer);
                
                const blurredBackground2 = document.querySelector(".blurred-bg-2");
                const wonGame = document.querySelector(".won-game-container");
                const timeTakenWin = document.querySelector(".time-taken-win");
                const restartBtn = document.querySelector(".restart-again");

                blurredBackground2.classList.remove("hidden");
                wonGame.classList.remove("hidden");

                timeTakenWin.textContent = timeCounter;
                
                restartBtn.addEventListener('click', ()=>{
                    window.location = window.location;
                });
            };
        };
    };
};

/* Starts the game when the DOM content loading finishes */
window.addEventListener('load', onDOMContentLoad);