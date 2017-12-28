$(function() {
    // start game
    startGame();


});

const GUESS_COUNT = 4;
let winCount = 0;
let guessesRemaining = GUESS_COUNT;
let currentWord = "";
let guessedWords = [];

let testword = "phone";
currentWord = testword;
var startGame = function() {
    $('#instructionLabel').fadeOut();

    setCurrentWord(testword);
    processKeyPresses();
}

var setCurrentWord = function(currentWord) {
    let currentWordLabel = $('#currentWord');
    
    let placeholder = "";
    for (var i = 0; i < currentWord.length; i++) {
        placeholder += "_";
    }
    currentWordLabel.text(placeholder);
}

var processKeyPresses = function() {
    $(document).keyup(function(e) {
        let pressedChar = String.fromCharCode(e.which).toLowerCase();
        if (currentWord.indexOf(pressedChar) > -1) {
            let indices = getCharacterIndices(pressedChar, currentWord);

            updateWordLabel(pressedChar, indices);
        } else {
            // the character was not in the word; push it on the guessed list
            guessedWords.push(pressedChar);

            // decrement number of guesses remaining
            guessesRemaining--;
        }
      });
}

var updateWordLabel = function(letter, indices) {
    let currentWordLabel = $('#currentWord');
    let currentWordText = currentWordLabel.text();
    indices.forEach(currIndex => {
        currentWordText = currentWordText.substr(0, currIndex) + letter + currentWordText.substr(currIndex + 1);
    });
    currentWordLabel.text(currentWordText);
}

var getCharacterIndices = function(letter, word) {
    let indices = [];
    for(var i = 0; i < word.length; i++) {
        if (word[i] === letter) indices.push(i);
    }
    return indices;
}

var resetGame = function() {
    // fade in instructions
    $('#instructionLabel').fadeIn();

    // reset current word label
    $('#currentWord').text("");

    // reset current word
    currentWord = "";

    // reset guessed words
    guessedWords = [];

    // reset guess count
    let guessesRemaining = GUESS_COUNT;
}

var gameWon = function() {

}

var gameLost = function() {

}


var getRandomWord = function() {
    const wordnikApiKey = "";
    const minLength = 3;
    const maxLength = 15;

    const requestUrl = `http://api.wordnik.com:80/v4/words.json/randomWords?hasDictionaryDef=true&minCorpusCount=0&minLength=${minLength}&maxLength=${maxLength}&limit=1&api_key=${wordnikApiKey}`;

    $.ajax({
        type: "GET",
        url: requestUrl,
        data: myusername,
        cache: false,
        success: function(data){
            $("#resultarea").text(data);
        }
    });
}

var getImage = function(imageType){
    const apiKey = "AIzaSyAvmpB67Ybbh-_3r941lUlIfAZOHF87kbU";
    const searchEngineId = "014119902014769536611:z0adglgefyi";

    const requestUrl = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=flower&searchType=image&fileType=jpg&imgSize=large&alt=json`;

    $.ajax({
        type: "GET",
        url: requestUrl,
        data: myusername,
        cache: false,
        success: function(data){
            $("#resultarea").text(data);
        }
    });
}