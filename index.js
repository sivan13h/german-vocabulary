const chosenWordDisplay = document.querySelector("#chosen-word");
const form = document.querySelector("#form");
const translationInput = document.querySelector("#english");
const grammerInput = document.querySelector("#grammer");
const messageDiv = document.querySelector("#message");
const addForm = document.querySelector("#add-form");
const newGerman = document.querySelector("#new-german");
const newEnglish = document.querySelector("#new-english");
const newGrammer = document.querySelector("#new-grammer");
const inputs = document.querySelectorAll("input");
const wordsTable = document.querySelector("#words-list");
const counterDisplay = document.querySelector("#counter");
const recordDisplay = document.querySelector('#record');

let currentWord = "";
counterDisplay.textContent = 0;
recordDisplay.textContent = localStorage.getItem('record')
let wordsArr = JSON.parse(localStorage.getItem("words")) || [];

window.addEventListener('load', () => {
  registerSW();
})
// WORD CLASS ---------------------------------------------------
class Word {
  constructor(german, english, grammer) {
    (this.german = german), (this.english = english), (this.grammer = grammer);
  }
}

// UI Class -----------------------------------------------------
class UI {
  static displayChosenWord(lang) {
    if (wordsArr.length === 0) {
      chosenWordDisplay.textContent = "Please add first word";
    } else {
      
      const randomWord = wordsArr[Math.floor(Math.random() * wordsArr.length)];
      if (lang === 'english'){
      chosenWordDisplay.innerHTML = capitalizeFirstLetter(randomWord.english);
      } else {
        chosenWordDisplay.innerHTML = capitalizeFirstLetter(randomWord.german);
      }
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
    wordsTable.innerHTML= ''
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
    if(germanModeButton.dataset.chosen === 'true'){
    UI.displayChosenWord('german');
    } else {
      UI.displayChosenWord('english');
    }
    inputs.forEach((input) => (input.value = ""));
  }
}

// Logic Class -------------------------------------------------
class Logic {
  static addNewWord() {
  
    let newWord = new Word(
      capitalizeFirstLetter(newGerman.value).trim(),
      capitalizeFirstLetter(newEnglish.value).trim(),
      capitalizeFirstLetter(newGrammer.value).trim()
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
      wordsArr = wordsArr.sort((a, b) => a.german.localeCompare(b.german))
      localStorage.setItem("words", JSON.stringify(wordsArr));
      UI.makeTable();
    }
  }

  static checkAnswers() {
   
    if (
      (germanModeButton.dataset.chosen === 'true' &&
      translationInput.value.toUpperCase().trim() === currentWord.english.toUpperCase().trim() &&
      grammerInput.value.toUpperCase().trim() === currentWord.grammer.toUpperCase().trim()
      ) ||
      (germanModeButton.dataset.chosen === 'false' &&
      translationInput.value.toUpperCase().trim() === currentWord.german.toUpperCase().trim() &&
      grammerInput.value.toUpperCase().trim() === currentWord.grammer.toUpperCase().trim()
      )
    ) {
      UI.showMessage("success");
      UI.resetForm();
    } else {
      if(counterDisplay.textContent > localStorage.getItem('record')){
      localStorage.setItem("record", counterDisplay.textContent);
      recordDisplay.textContent = localStorage.getItem('record');
      }
      UI.showMessage("failure");
    }

  
  }

  static validateForm() {
    const grammerValue = document.forms["addForm"]["newGrammer"].value;
    if (
      grammerValue.toUpperCase().trim() !== "DER" &&
      grammerValue.toUpperCase().trim() !== "DAS" &&
      grammerValue.toUpperCase().trim() !== "DIE" &&
      grammerValue !== "" 
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
    translationInput.select();
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

const englishModeButton = document.querySelector('#english-mode');
const germanModeButton = document.querySelector('#german-mode');


englishModeButton.addEventListener('click', function () {
  this.dataset.chosen = 'true';
  germanModeButton.dataset.chosen = 'false'
  UI.displayChosenWord('english');
})
germanModeButton.addEventListener('click', function () {
  this.dataset.chosen = 'true'
  englishModeButton.dataset.chosen = 'false'
  UI.displayChosenWord('german');
})

document.querySelector('#searchInput').addEventListener('keyup', searchInVoca);

// helpers ------------------------------------
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function searchInVoca() {
  // Declare variables
  let input, filter, table, tr, tdGerman, tdEnglish, i, txtValue;
  input = document.getElementById("searchInput");
  filter = input.value.toUpperCase();
  table = document.getElementById("myTable");
  tr = table.getElementsByTagName("tr");

  // Loop through all table rows, and hide those who don't match the search query
  for (i = 0; i < tr.length; i++) {
    tdGerman = tr[i].getElementsByTagName("td")[0];
    tdEnglish = tr[i].getElementsByTagName("td")[1];
    if (tdGerman || tdEnglish) {
      txtValueGerman = tdGerman.textContent || tdGerman.innerText;
      txtValueEnglish = tdEnglish.textContent || tdEnglish.innerText;
      if (
      txtValueGerman.toUpperCase().indexOf(filter) > -1 ||
      txtValueEnglish.toUpperCase().indexOf(filter) > -1 
      ) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}
// materialize modal jquery ------------------------------
$(document).ready(function () {
  $(".modal").modal();
});


// PWA -----------------
async function registerSW(){
  if('serviceWorker' in navigator){
    try{
      await navigator.serviceWorker.register('./sw.js', {
        
      });
    } catch (e){
      console.log('SW registration failed');
    }
  }
}