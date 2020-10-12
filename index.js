const chosenWordDisplay = document.querySelector("#chosen-word");
const form = document.querySelector("#form");
const englishInput = document.querySelector("#english");
const grammerInput = document.querySelector("#grammer");
const messageDiv = document.querySelector("#message");
const addForm = document.querySelector("#add-form");
const newGerman = document.querySelector("#new-german");
const newEnglish = document.querySelector("#new-english");
const newGrammer = document.querySelector("#new-grammer");
const inputs = document.querySelectorAll("input");
const wordsTable = document.querySelector("#words-list");
const counterDisplay = document.querySelector("#counter");

let currentWord = "";
counterDisplay.textContent = 0;
let wordsArr = JSON.parse(localStorage.getItem("words")) || [];

// WORD CLASS ---------------------------------------------------
class Word {
  constructor(german, english, grammer) {
    (this.german = german), (this.english = english), (this.grammer = grammer);
  }
}

// UI Class -----------------------------------------------------
class UI {
  static displayChosenWord() {
    if (wordsArr.length === 0) {
      chosenWordDisplay.textContent = "Please add first word";
    } else {
      const randomWord = wordsArr[Math.floor(Math.random() * wordsArr.length)];
      chosenWordDisplay.innerHTML = capitalizeFirstLetter(randomWord.german);
      currentWord = randomWord;
    }
  }

  static showMessage(result) {
    if (result === "success") {
      messageDiv.innerHTML =
        "<h4 class='container center-align green accent-3 z-depth-3'>Correct!</h4>";
      counterDisplay.textContent++;
    } else if (result === "failure") {
      messageDiv.innerHTML =
        "<h4 class='container center-align red darken-1 z-depth-3'>Wrong! Try Again</h4>";
      counterDisplay.textContent = 0;
    }
  }

  static addWordToTable(word) {
    const wordRow = document.createElement("tr");
    wordRow.innerHTML = `
       <td>${word.german}</td>
       <td>${word.english}</td>
       <td>${word.grammer}</td>
       <td><a href="#" class="btn red delete">X</a></td>
       `;
    wordsTable.appendChild(wordRow);
  }

  static makeTable() {
    wordsArr.forEach((word) => UI.addWordToTable(word));
  }

  static removeWord(deleteButton, germanWord) {
    const tableRow = deleteButton.parentElement.parentElement;
    tableRow.remove();
    wordsArr.forEach((word, index) => {
      if (word.german === germanWord) {
        wordsArr.splice(index, 1);
        UI.displayChosenWord();
      }
    });
    localStorage.setItem("words", JSON.stringify(wordsArr));
    UI.checkForEmptyList();
  }

  static checkForEmptyList() {
    if (wordsArr.length === 0) {
      chosenWordDisplay.textContent = "Add your first word";
      messageDiv.innerHTML = "";
      counterDisplay.textContent = 0;
      currentWord = "";
    }
  }

  static resetForm() {
    UI.displayChosenWord();
    inputs.forEach((input) => (input.value = ""));
  }
}

// Logic Class -------------------------------------------------
class Logic {
  static addNewWord() {
    let newWord = new Word(
      capitalizeFirstLetter(newGerman.value),
      capitalizeFirstLetter(newEnglish.value),
      capitalizeFirstLetter(newGrammer.value)
    );
    // check if word already exists?
    if (
      wordsArr.some(
        (word) => word.german.toUpperCase() === newWord.german.toUpperCase()
      )
    ) {
      alert("This word already exists in your vocabulary");
      // and if not add:
    } else {
      wordsArr.push(newWord);
      localStorage.setItem("words", JSON.stringify(wordsArr));
      UI.addWordToTable(newWord);
    }
  }

  static checkAnswers() {
    if (
      englishInput.value.toUpperCase() === currentWord.english.toUpperCase() &&
      grammerInput.value.toUpperCase() === currentWord.grammer.toUpperCase()
    ) {
      UI.showMessage("success");
      UI.resetForm();
    } else {
      UI.showMessage("failure");
    }
  }

  static validateForm() {
    const grammerValue = document.forms["addForm"]["newGrammer"].value;
    if (
      grammerValue.toUpperCase() !== "DER" &&
      grammerValue.toUpperCase() !== "DAS" &&
      grammerValue.toUpperCase() !== "DIE"
    ) {
      alert("Please Insert Der / Die / Das");
      return false;
    }
  }
}

// App initializing ------------------------------------------------------
UI.displayChosenWord();
UI.makeTable();

// Event listeners --------------------------------------------------------
form.addEventListener("submit", function (e) {
  e.preventDefault();
  if (wordsArr.length !== 0) {
    Logic.checkAnswers();
    englishInput.select();
  } else {
    alert("please add your first word to the vocabulary first");
  }
});

addForm.addEventListener("submit", function (e) {
  e.preventDefault();
  Logic.validateForm();
  Logic.addNewWord();
  UI.resetForm();
  newGerman.select();
});

wordsTable.addEventListener("click", function (e) {
  if (e.target.classList.contains("delete")) {
    UI.removeWord(
      e.target,
      e.target.parentElement.previousElementSibling.previousElementSibling
        .previousElementSibling.textContent
    );
  }
});

// helpers ------------------------------------
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}
// materialize modal jquery ------------------------------
$(document).ready(function () {
  $(".modal").modal();
});
