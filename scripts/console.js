'use strict';

let textColor;

/*
    File to log details on how to cheat on this game
*/

/* 
    Code copied from 
        * https://stackoverflow.com/questions/56393880/how-do-i-detect-dark-mode-using-javascript
*/

/*
    Checks if Media queries are supported
*/
if (window.matchMedia) {
    /*
        If supports Media queries,
            * Then sets console text color to white
        Else
            * Sets console text color to black
    */
    if(window.matchMedia('(prefers-color-scheme: dark)').matches)
        textColor = "white";
    else
        textColor = "black";
};

/* Text styles */
const textStyle          = `color: ${textColor}`;

/* Function to print colored text */
const print = (text="", css=textStyle) => {
    console.log(`%c${text}`, css);
};


const greenOnBlack  = "background: #222; color: #bada55;";
const blueOnBlack  = "background: #222; color: #1bfaf6;";
const yellowOnBlack  = "background: #222; color: #fcea1c;";
const redOnBlack  = "background: #222; color: #fc1c85;";

print("Welcome, user.", greenOnBlack);
print("Your are here, probably because of you follow me on some social media platforms. Good.", blueOnBlack);
print("Here's the challenge for you.", yellowOnBlack);
print("I made this game after watching Ania Kubów's (https://www.youtube.com/channel/UC5DNytAJ6_FISueUfzZCVsw) Youtube video. I've fixed many bugs that she made while making this game. Still there are some. I want you to find way to cheat on this game. Here's the github repo (https://github.com/Muhammed-Rajab/Pokemon-Memory-Game). I want you to go through the source code and find ways to hack this game.")
print("Share your findings with me on twitter: (https://twitter.com/mrisawesome)", redOnBlack)