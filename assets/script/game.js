$(function() {
    // processing key presses
    processKeyPresses();
});

const DEFAULT_IMAGE = "assets/images/hangman_start.png";
const GUESS_COUNT = 6;
const FADE_TIME = 500;
let winCount = 0;
let guessesRemaining = GUESS_COUNT;
let currentWord = "";
let guessedLetters = [];

var startGame = () => {
    // initialize guess counter
    let guessCounter = $('.guess-count');
    if (!guessCounter.text()) {
        guessCounter.text(GUESS_COUNT)
    }

    // initialize win counter
    let winCounter = $('.winCount');
    if (!winCounter.text()) {
        winCounter.text(winCount)
    }

    // get current word and handle transitions
    getWord(getWordCallback);
    $('#instructionLabel').hide(FADE_TIME);
    $('#updateContainer').show(FADE_TIME);
}

var setCurrentWord = (currentWord) => {
    let currentWordLabel = $('#currentWord');
    
    let placeholder = "";
    for (var i = 0; i < currentWord.length; i++) {
        if (currentWord.charAt(i) !== '-') {
            placeholder += "_";
        } else {
            // handle hyphenated words
            placeholder += "-";
        }
    }
    currentWordLabel.text(placeholder);
}

var processKeyPresses = () => {
    $(document).keyup((e) => {
        // fade out the instruction label if this is the first key press
        if ($('#instructionLabel').is(":visible")) {
            startGame();
            return; // return; so the first key press only starts the game
        } 

        // only process if the key pressed is an alphabet character
        let pressedChar = String.fromCharCode(e.which).toLowerCase();
        if (/[a-zA-Z]/.test(pressedChar)) {
            if (currentWord.indexOf(pressedChar) > -1) {
                let indices = getCharacterIndices(pressedChar, currentWord);
    
                updateWordLabel(pressedChar, indices);
            } else {
                // the character was not in the word; update counters and other state
                if (guessedLetters.indexOf(pressedChar) === -1) {
                    guessedLetters.push(pressedChar);
    
                    // add the letter to the dom guessed list
                    let guessedList = $('.guessedLettersPreview');
                    let guessCounter = $('.guess-count');
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
    
                    // update the guess counter
                    guessCounter.text(--guessesRemaining);

                    // decrement number of guesses remaining; trigger game over if needed
                    if (guessesRemaining === 0) {
                        // no more guesses left trigger game over
                        gameLost();
                    }
                }
            }
        }
      });
}

var updateWordLabel = (letter, indices) => {
    let currentWordLabel = $('#currentWord');
    let currentWordText = currentWordLabel.text();
    indices.forEach(currIndex => {
        currentWordText = currentWordText.substr(0, currIndex) + letter + currentWordText.substr(currIndex + 1);
    });
    currentWordLabel.text(currentWordText);
}

var getCharacterIndices = (letter, word) => {
    let indices = [];
    for(var i = 0; i < word.length; i++) {
        if (word[i] === letter) {
            indices.push(i);
        }
    }
    return indices;
}

var resetGame = () => {
    // fade out instructions
    $('#updateContainer').hide(FADE_TIME);

    // fade in instructions
    $('#instructionLabel').show(FADE_TIME);

    // reset current word label
    $('#currentWord').text("");

    // reset current word
    currentWord = "";

    // reset guessed words
    guessedLetters = [];

    // reset guess count
    let guessesRemaining = GUESS_COUNT;

    // reset start image
    $('#gameImage').attr('src', DEFAULT_IMAGE);
}

var gameWon = () => {
    const MODAL_HEADER = "Ayyyeee, You've won!";
    const MODAL_TEXT = ``;
    openModal(MODAL_HEADER, MODAL_TEXT);
    closeModal();
}

var gameLost = function() {
    const MODAL_HEADER = "You've lost!";
    const MODAL_TEXT = `You've lost the game. The word you were trying to guess was '${currentWord}.' Your total score is ${winCount}`;
    openModal(MODAL_HEADER, MODAL_TEXT);
    closeModal();
}

var openModal = (modalHeader, modalText) => {
    // set modal content
    $('.modal-heading').text(modalHeader);
    $('.modal-text').text(modalText);

    // make modal visible
    $('.modal').toggleClass('is-visible');
}

var closeModal = () => {
    $(document).click(() => {
        $('.modal').toggleClass('is-visible');
        $(document).off('click');
    });

    $('#icon-close').click(() => {
        $('.modal').toggleClass('is-visible');
        $('#icon-close').off('click');
    });
}

var getWordCallback = (data) => {
    // update the current word
    currentWord = data["0"].word;
    setCurrentWord(currentWord);
    getImage(currentWord, getImageCallback);
}

var getWord = (callback) => {
    const API_KEY = "8fcc16b19ee35829a100303c3f103d9afa26fb7768c265a3b";
    const MIN_LENGTH = 3;
    const MAX_LENGTH = 15;

    const URL = `http://api.wordnik.com:80/v4/words.json/randomWords?hasDictionaryDef=true&minCorpusCount=0&minLength=${MIN_LENGTH}&maxLength=${MAX_LENGTH}&limit=1&api_key=${API_KEY}`;

    $.ajax({
        type: "GET",
        url: URL,
        cache: false,
        success: function(data){
            callback(data);
        }
    });
}

var setImage = (imageLocation) => {
    $('#gameImage').attr('src', imageLocation);
}

var getImageCallback = (data) => {
    if (data) {
        let imageLocation;
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

var getImage = (imageType, callback) => {
    const API_KEY = "AIzaSyAvmpB67Ybbh-_3r941lUlIfAZOHF87kbU";
    const SEARCH_ID = "014119902014769536611:z0adglgefyi";
    const URL = `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${SEARCH_ID}&q=${imageType}&searchType=image&fileType=jpg&imgSize=large&alt=json`;

    $.ajax({
        type: "GET",
        url: URL,
        cache: false,
        success: function(data){
            callback(data);
        }
    });
}