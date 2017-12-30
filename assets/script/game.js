$(function() {
    // processing key presses
    processKeyPresses();
});

const DEFAULT_IMAGE = "assets/images/hangman_start.png";
const GUESS_COUNT = 4;
let winCount = 0;
let guessesRemaining = GUESS_COUNT;
let currentWord = "";
let guessedLetters = [];

var startGame = function() {
    getWord(getWordCallback);
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
        // fade out the instruction label if this is the first key press
        if ($('#instructionLabel').is(":visible")) {
            $('#instructionLabel').fadeOut();
            startGame();
        } 

        let pressedChar = String.fromCharCode(e.which).toLowerCase();
        if (currentWord.indexOf(pressedChar) > -1) {
            let indices = getCharacterIndices(pressedChar, currentWord);

            updateWordLabel(pressedChar, indices);
        } else {
            // the character was not in the word; update counters and other state
            if (guessedLetters.indexOf(pressedChar) === -1) {
                guessedLetters.push(pressedChar);

                // add the letter to the dom guessed list
                let guessedList = $('#guessedLettersPreview');
                let guessedListText = guessedList.text();
                if (guessedList.text()) {
                    // the string is not empty append letter with comma
                    guessedListText = guessedList.text() + ", " + pressedChar.toUpperCase();
                } else {
                    // the string is empty just append letter
                    guessedListText = pressedChar.toUpperCase();
                }
                // update with new guessed list string
                guessedList.text(guessedListText);

                // decrement number of guesses remaining; trigger game over if needed
                if (--guessesRemaining === 0) {
                    // no more guesses left trigger game over
                    alert("Game over");
                }
            }
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
        if (word[i] === letter) {
            indices.push(i);
        }
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
    guessedLetters = [];

    // reset guess count
    let guessesRemaining = GUESS_COUNT;

    // reset start image
    
}

var gameWon = function() {

}

var gameLost = function() {

}

var getWordCallback = function(data) {
    // update the current word
    currentWord = data["0"].word;
    setCurrentWord(currentWord);
    getImage(currentWord, getImageCallback);
}

var getWord = function(callback) {
    const wordnikApiKey = "8fcc16b19ee35829a100303c3f103d9afa26fb7768c265a3b";
    const minLength = 3;
    const maxLength = 15;

    const requestUrl = `http://api.wordnik.com:80/v4/words.json/randomWords?hasDictionaryDef=true&minCorpusCount=0&minLength=${minLength}&maxLength=${maxLength}&limit=1&api_key=${wordnikApiKey}`;

    $.ajax({
        type: "GET",
        url: requestUrl,
        cache: false,
        success: function(data){
            console.log(data);
            callback(data);
        }
    });
}

var setImage = function(imageLocation) {
    $('#gameImage').attr('src', imageLocation);
}

var getImageCallback = function(data) {
    if (data) {
        let imageLocation;
        console.log(data);
        let imageResults = data.items;
        if (imageResults.length !== 0) {
            // images found; set source to first image
            imageLocation = imageResults["0"].link;
        } else {
            // no image found; set the source to default
            imageLocation = DEFAULT_IMAGE;
        }

        if (imageLocation) {
            // update the dom if there was no issue getting an image src
            setImage(imageLocation);
        }
    }
}

var getImage = function(imageType, callback){
    const apiKey = "AIzaSyAvmpB67Ybbh-_3r941lUlIfAZOHF87kbU";
    const searchEngineId = "014119902014769536611:z0adglgefyi";
    console.log("image to search for: " + imageType);
    const requestUrl = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${imageType}&searchType=image&fileType=jpg&imgSize=large&alt=json`;

    $.ajax({
        type: "GET",
        url: requestUrl,
        cache: false,
        success: function(data){
            callback(data);
        }
    });
}