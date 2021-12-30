'use strict';

/* Alias for console.log */
const log = console.log;

/* Callback that triggers when DOM content gets completely loaded */
function onDOMContentLoad(){
    
    /* Elements */
    const grid      = document.querySelector("#grid");
    const scoreSpan = document.querySelector(".score");

    /* Cards */
    const cards     = [
        {
            title: "fries", src: "assets/images/fries.png"
        },
        {
            title: "pizza", src: "assets/images/pizza.png"
        },
        {
            title: "hotdog", src: "assets/images/hotdog.png"
        },
        {
            title: "ice-cream", src: "assets/images/ice-cream.png"
        },
        {
            title: "milkshake", src: "assets/images/milkshake.png"
        },
        {
            title: "cheeseburger", src: "assets/images/cheeseburger.png"
        },
    ];

    /* Other cards */
    const blankCard = {src: "assets/images/blank.png"};
    const whiteCard = {src: "assets/images/white.png"};

    /* Randomized array of cards with pair of each cards */
    const randomCardsArray = shuffle([...cards, ...cards]);

    log(randomCardsArray);

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

            if(score === randomCardsArray.length/2){
                setTimeout(()=>{
                    alert("You won 🏆");
                    window.location = window.location;
                }, 500);
            };

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
        
        log(activeCardsIndexes, activeCards);

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
            log("YOu can't  select  the same  card!!");
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
};

/* Starts the game when the DOM content loading finishes */
document.addEventListener('DOMContentLoaded', onDOMContentLoad);