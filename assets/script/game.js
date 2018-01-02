$(function() {
    // stat processing key presses
    processKeyPresses();
});

const DEFAULT_IMAGE = "assets/images/hangman_start.png";
const GUESS_COUNT = 6;
const FADE_TIME = 500;
let winCount = 0;
let remainingLetters = 0;
let guessesRemaining = GUESS_COUNT;
let currentWord = "";
let guessedLetters = [];
let correctLetters = [];

// Not required for if the page isn't hoste on github
let wordList = ['cat', 'dog', 'flower', 'power', 'cower', 'shower', 'chowder', 'powder', 'slide', 'marinade']

let startGame = () => {
    // initialize guess counter
    let guessCounter = $('.guess-count');
    if (!guessCounter.text()) {
        guessCounter.text(GUESS_COUNT);
    }

    // initialize win counter
    let winCounter = $('.win-count');
    if (!winCounter.text()) {
        winCounter.text(winCount)
    }

    // get current word and handle transitions
    getWord(getWordCallback);
    $('.instruction-label').hide(FADE_TIME);
    $('.update-container').show(FADE_TIME);
}

let startNewRound = () => {
    resetInternalState();

    // initialize guess counter
    let guessCounter = $('.guess-count');
    guessCounter.text(GUESS_COUNT);

    // increment win counter
    let winCounter = $('.win-count');
    winCounter.text(++winCount);

    // reset correctly guessed letter 
    correctLetters = [];

    // reset guessed letters
    guessedLetters = [];
    $('.guessed-letters-preview').text("");

    // get current word and handle transitions
    getWord(getWordCallback);
    $('.instruction-label').hide(FADE_TIME);
    $('.update-container').show(FADE_TIME);
}

let setCurrentWord = (currentWord) => {
    let currentWordLabel = $('.current-word');
    
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

let processKeyPresses = () => {
    $(document).keyup((e) => {
        // fade out the instruction label if this is the first key press
        if ($('.instruction-label').is(":visible")) {
            startGame();
            return; // return; so the first key press only starts the game
        } 

        // only process if the key pressed is an alphabet character, and there are guesses remaining
        let pressedChar = String.fromCharCode(e.which).toLowerCase();
        if (/[a-zA-Z]/.test(pressedChar) && guessesRemaining !== 0) {
            if (currentWord.indexOf(pressedChar) > -1 && correctLetters.indexOf(pressedChar) === -1) {
                // the character is in the current word, and it hasn't been correctly guessed already
                // update current word label
                let indices = getCharacterIndices(pressedChar, currentWord);
                updateWordLabel(pressedChar, indices);

                // update remaining letters counter
                correctLetters.push(pressedChar);
                remainingLetters -= indices.length;

                // if no more letter open won game modal
                if (remainingLetters === 0) {
                    gameWon();
                }

            } else {
                // the character was not in the word; update counters and other state
                if (guessedLetters.indexOf(pressedChar) === -1) {
                    guessedLetters.push(pressedChar);
    
                    // add the letter to the dom guessed list
                    let guessedList = $('.guessed-letters-preview');
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

let updateWordLabel = (letter, indices) => {
    let currentWordLabel = $('.current-word');
    let currentWordText = currentWordLabel.text();
    indices.forEach(currIndex => {
        currentWordText = currentWordText.substr(0, currIndex) + letter + currentWordText.substr(currIndex + 1);
    });
    currentWordLabel.text(currentWordText);
}

let getCharacterIndices = (letter, word) => {
    let indices = [];
    for(var i = 0; i < word.length; i++) {
        if (word[i] === letter) {
            indices.push(i);
        }
    }
    return indices;
}

let resetGame = () => {
    resetInternalState();
    
    // fade out instructions
    $('.update-container').hide(FADE_TIME);

    // fade in instructions
    $('.instruction-label').show(FADE_TIME);

    // reset current word label
    $('.current-word').text("");

    // reset guessed letters
    $('.guessed-letters-preview').text("");

    // reset guess count
    $('.guess-count').text(guessesRemaining);

    // reset wincount
    winCount = 0;
    $('.win-count').text('0');

    // reset start image
    $('.game-image').attr('src', DEFAULT_IMAGE);
}

let resetInternalState = () => {
    guessesRemaining = GUESS_COUNT;
    remainingLetters = 0;
    currentWord = "";
    guessedLetters = [];
    correctLetters = [];
}

let gameWon = () => {
    const MODAL_HEADER = "Ayyyeee, You've won!";
    const MODAL_TEXT = `You've won the round! Your current score is ${winCount + 1}`;
    const CONTINUE_GAME = true;
    openModal(MODAL_HEADER, MODAL_TEXT);
    closeModal(CONTINUE_GAME);
}

let gameLost = function() {
    const MODAL_HEADER = "You've lost!";
    const MODAL_TEXT = `You've lost the game. The word you were trying to guess was '${currentWord}.' Your total score is ${winCount}`;
    const CONTINUE_GAME = false;
    openModal(MODAL_HEADER, MODAL_TEXT);
    closeModal(CONTINUE_GAME);
}

let openModal = (modalHeader, modalText) => {
    // set modal content
    $('.modal-heading').text(modalHeader);
    $('.modal-text').text(modalText);

    // make modal visible
    $('.modal').addClass('is-visible');
}

let closeModal = (continueGame) => {
    $(document).click(() => {
        $('.modal').removeClass('is-visible');
        $(document).off('click');
        handleGameFlow(continueGame);
    });

    $('.icon-close').click(() => {
        $('.modal').removeClass('is-visible');
        $('.icon-close').off('click');
        handleGameFlow(continueGame);
    });
}

let handleGameFlow = (continueGame) => {
    if (continueGame) {
        // start new round
        startNewRound();
    } else {
        // reset the game
        resetGame();
    }
}

let setImage = (imageLocation) => {
    $('.game-image').attr('src', imageLocation);
}

let getWordCallback = (data) => {
    // update the current word
    //currentWord = data["0"].word.toLowerCase();
    currentWord = null;
    if (!currentWord) {
        // assign a word from the static list if none was retrieved from the service
        let index = Math.floor(Math.random() * wordList.length);
        currentWord = wordList[index];
    }
    
    setCurrentWord(currentWord);
    getImage(currentWord, getImageCallback);

    // set letters left to guess counter
    remainingLetters = currentWord.length;
}

let getWord = (callback) => {
    const API_KEY = "8fcc16b19ee35829a100303c3f103d9afa26fb7768c265a3b";
    const MIN_LENGTH = 3;
    const MAX_LENGTH = 8;
    const URL = `https://api.wordnik.com:80/v4/words.json/randomWords?hasDictionaryDef=true&minCorpusCount=0&minLength=${MIN_LENGTH}&maxLength=${MAX_LENGTH}&limit=1&api_key=${API_KEY}`;

    $.ajax({
        type: "GET",
        url: URL,
        cache: false,
        success: function(data){
            callback(data);
        },
        error: function(data) {
            callback(data);
        }
    });
}

let getImageCallback = (data) => {
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

let getImage = (imageType, callback) => {
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