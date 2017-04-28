// Steps:
// 1. player press any key to start
// 2. Computer randomly picks a word (i.e. elephant)
// 3. Display _'s equal to the length of the chosen word (i.e. _ _ _ _ _ _ _ _)
// 4. As player guesses the correct letter, reveal letters in the word (i.e. e _ e _ _ _ _ _)
// 5. After a guess, the letter appears under "Letters Guess"
// 6. If all letters are revealed, player wins and score is incremented
// 7. If player runs out of guesses before revealing all of the letter, player loses and score does not change
// 8. Repeat steps 2-7.

// Bonus:
// 1. Play a sound when player guesses word correctly.
// 2. Add css to match theme.
// 3. Store variables in game object.

// Creates game object to store game settings
var game = {	
	wins: 0, 			// Player's score	
	missesLeft: 9,		// Number of misses left
	lettersGuessed: [],	// Letters that have been guessed
	hiddenWord: "",		// Current word player is trying to guess
	revealed: [],		// Array of revealed letters
	wordBank: ["aardvark","albatross","alligator","alpaca","antelope",	// Collection of words used in the game
				"arctic fox","armadillo","axolotl","baboon","badger",
				"bandicoot","barnacle","barracuda","basilisk","beaver",
				"beetle","bobcat","bonobo","buffalo","bumble bee",
				"butterfly","camel","canary","capybara","caterpillar",
				"centipede","chameleon","cheetah","chicken","chimpanzee",
				"chinchilla","chipmunk","cougar","coyote","crane",
				"crocodile","cuttlefish","dingo","dolphin","dolphin",
				"donkey","dragonfly","dugong","eagle","earthworm",
				"elephant","falcon","falcon","ferret","flamingo","gazelle",
				"gecko","gecko","gibbon","gila monster","giraffe","goose",
				"gopher","gorilla","guinea pig","hamster","hedgehog",
				"hippopotamus","horse","hyena","iguana","impala","jackal",
				"jaguar","jellyfish","kangaroo","koala","komodo dragon",
				"krill","lemming","lemur","leopard","llama","lobster",
				"manatee","manatee","mandrill","manta ray","marmoset",
				"meerkat","millipede","mongoose","monkey","moray eel",
				"mouse","nightingale","ocelot","octopus","opossum",
				"orangutan","ostrich","otter","oyster","panda","panther",
				"panther","peacock","penguin","pirahna","platypus",
				"polar bear","porcupine","puffer fish","rabbit",
				"raccoon","reindeer","rhinoceros","rooster","salamander",
				"scorpion","sea cucumber","sea lion","sea sponge",
				"seahorse","shark","sheep","sloth","snail","snake",
				"sparrow","squid","squirrel","starfish","stingray",
				"sturgeon","tamarin","tapir","tiger","tortoise","toucan",
				"turtle","vampire bat","walrus","warthog","weasel","whale",
				"wildebeast","wolverine","wombat","woodchuck","zebra"],
	newGame: true		
};

// Create variable for all html elements to be updated during gameplay
var pressKey = document.getElementById("press-any-key");
var hangmanImg = document.getElementById("hangman");
var revealSpan = document.getElementById("word-reveal");
var winsSpan = document.getElementById("wins");
var missesSpan = document.getElementById("misses-left");
var guessedSpan = document.getElementById("letters-guessed");

// Create variable for audio clip played when player guesses word correctly
var victory = new Audio("assets/audio/victory.wav"); //source: https://www.freesound.org/people/LittleRobotSoundFactory/sounds/274180/
var defeat = new Audio("assets/audio/defeat.wav"); // source: https://www.freesound.org/people/cabled_mess/sounds/371451/

// Resets game settings to start a new game
function newGame() {
	game.missesLeft = 9;
	game.lettersGuessed = [];
	game.hiddenWord = game.wordBank[Math.floor(Math.random() * game.wordBank.length)];
	game.revealed = new Array(game.hiddenWord.length);

	// adds spaces in the hidden word to the corresponding index in the revealed array
	for(var k = 0; k < game.revealed.length; k++) {
		if(game.hiddenWord[k] === " "){
			game.revealed[k] = " ";
		}
	}
	updateWord();
	updateLettersGuessed();
	updateMisses();
};

// Updates revealed letters
function updateWord() {
	
	var result = "";

	for(var i = 0; i < game.revealed.length; i++) {
		var char = game.revealed[i];

		if(char === undefined) {
			result += "_";
		} else if(char === " ") {
			result += "<br>";
		} else {
			result += char;
		}

		if(i < game.revealed.length - 1)
			result += " ";
	}

	revealSpan.innerHTML = result;
};

// Updates letters guessed
function updateLettersGuessed() {
	guessedSpan.textContent = game.lettersGuessed.join(", ");
}

// Updates number of misses left and hangman img
function updateMisses() {
	missesSpan.textContent = game.missesLeft;
	hangmanImg.src = "assets/images/hangman" + (9 - game.missesLeft) + ".png";
};

// Update win count
function updateWins() {
	winsSpan.textContent = game.wins;
}

// Logs game settings to console
function logSettings() {
	console.log("Wins: " + game.wins);
	console.log("Misses Left: " + game.missesLeft);
	console.log("Letters Guessed: " + game.lettersGuessed.toString());
	console.log("Hidden Word: " + game.hiddenWord);
	console.log("Revealed: " + game.revealed.toString());
	console.log("New Game: " + game.newGame);
	console.log("---------------------------------");
};

document.onkeyup = function(event) {
	if(game.newGame) {
		newGame();
		game.newGame = false;
		pressKey.style.visibility = "hidden";
	} else {
		var key = String.fromCharCode(event.keyCode).toLowerCase();
		var keycode = key.charCodeAt(0);

		// check if letter key was pressed
		if((keycode >= 97) && (keycode <= 122)) {
			// add guessed letter only if letter hasn't been guessed already
			if((game.lettersGuessed.indexOf(key) === -1)) {
				game.lettersGuessed.push(key);
				// keeps letters alphabetized
				game.lettersGuessed.sort();
				updateLettersGuessed();

				var matched = false;
				// check if key matches any letters in the hidden word
				for(var j = 0; j < game.hiddenWord.length; j++) {
					// key matches
					if(key === game.hiddenWord[j]) {
						matched = true;
						game.revealed[j] = key;
					}
				}

				// if key matched a letter in the hidden word
				if(matched) {
					updateWord();

					// if all letters are revealed, player wins
					if(!game.revealed.includes(undefined)) {
						victory.play();
						game.wins++;
						updateWins();
						game.newGame = true;
						pressKey.style.visibility = "visible";
						// alert("You win!");
					}
				} else {
					game.missesLeft--;
					updateMisses();

					// if no more misses, player loses
					if(game.missesLeft == 0){
						defeat.play();
						game.newGame = true;
						pressKey.style.visibility = "visible";
						// alert("You're out of guesses. :(");
					}
				}
			}
		}
	}
};