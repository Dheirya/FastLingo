const words = JSON.parse(localStorage.getItem('wordList')) || [];
const knownWords = JSON.parse(localStorage.getItem('known')) || [];
const missedWords = JSON.parse(localStorage.getItem('missed')) || [];
const wordNums = document.getElementById('wordNums'); const missedNums = document.getElementById('missedNums'); const knownNums = document.getElementById('knownNums');
wordNums.textContent = words.length; missedNums.textContent = missedWords.length; knownNums.textContent = knownWords.length;
if (words.length === 0) {
    document.getElementById('wordMem').style.display = 'none';
}
if (knownWords.length === 0) {
    document.getElementById('knownMem').style.display = 'none';
}
if (missedWords.length === 0) {
    document.getElementById('missedMem').style.display = 'none';
}
function remove(word, listed, listName) {
    const index = listed.indexOf(word);
    listed.splice(index, 1);
    localStorage.setItem(listName, JSON.stringify(listed));
}
function addToKnown(word, listed, listName) {
    for (let i = 0; i < knownWords.length; i++) {
        if (knownWords[i].translation === word.translation && knownWords[i].english === word.english && knownWords[i].lang === word.lang) {
            alert('ERROR: Word already in list!');
            return;
        }
    }
    remove(word, listed, listName);
    knownWords.push(word);
    localStorage.setItem('known', JSON.stringify(knownWords));
}
function addToMissed(word, listed, listName) {
    for (let i = 0; i < missedWords.length; i++) {
        if (missedWords[i].translation === word.translation && missedWords[i].english === word.english && missedWords[i].lang === word.lang) {
            alert('ERROR: Word already in list!');
            return;
        }
    }
    remove(word, listed, listName);
    missedWords.push(word);
    localStorage.setItem('missed', JSON.stringify(missedWords));
}
function addToGeneral(word, listed, listName) {
    for (let i = 0; i < words.length; i++) {
        if (words[i].translation === word.translation && words[i].english === word.english && words[i].lang === word.lang) {
            alert('ERROR: Word already in list!');
            return;
        }
    }
    remove(word, listed, listName);
    words.push(word);
    localStorage.setItem('wordList', JSON.stringify(words));
}
function addCards(list, id, listName) {
    list.forEach(word => {
        const wordDiv = document.createElement('div');
        wordDiv.className = 'notice width-xs';
        wordDiv.innerHTML = `<strong>${word.translation}</strong><br/>${word.english}<br/><small>${word.lang}</small>`;
        document.getElementById(id).prepend(wordDiv);
        const deleteButton = document.createElement('button');
        deleteButton.className = 'btn delete';
        deleteButton.innerHTML = '<span class="material-symbols-outlined">delete</span>';
        deleteButton.onclick = () => {remove(word, list, listName); sessionStorage.setItem('scrollpos', window.scrollY); location.reload();};
        const upButton = document.createElement('button');
        upButton.className = 'btn upper';
        upButton.innerHTML = '<span class="material-symbols-outlined">keyboard_arrow_up</span>';
        if (id === 'missedWords') {
            upButton.innerHTML = '<span class="material-symbols-outlined">keyboard_arrow_down</span>';
        } else if (id === 'knownWords') {
            upButton.innerHTML = '<span class="material-symbols-outlined">keyboard_double_arrow_up</span>';
        }
        upButton.onclick = () => {
            if (id === 'missedWords') {
                addToGeneral(word, list, listName);
            } else {
                addToMissed(word, list, listName);
            }
            sessionStorage.setItem('scrollpos', window.scrollY);
            location.reload();
        };
        const downButton = document.createElement('button');
        downButton.className = 'btn lower';
        downButton.innerHTML = '<span class="material-symbols-outlined">keyboard_arrow_down</span>';
        if (id === 'missedWords') {
            downButton.innerHTML = '<span class="material-symbols-outlined">keyboard_double_arrow_down</span>';
        } else if (id === 'knownWords') {
            downButton.innerHTML = '<span class="material-symbols-outlined">keyboard_arrow_up</span>';
        }
        downButton.onclick = () => {
            if (id === 'knownWords') {
                addToGeneral(word, list, listName);
            } else {
                addToKnown(word, list, listName);
            }
            sessionStorage.setItem('scrollpos', window.scrollY);
            location.reload();
        };
        wordDiv.appendChild(deleteButton); wordDiv.appendChild(upButton); wordDiv.appendChild(downButton);
    });
}
addCards(words, 'words', 'wordList');
addCards(missedWords, 'missedWords', 'missed');
addCards(knownWords, 'knownWords', 'known');
function showHideMore(divId, thisId) {
    if (window.innerWidth >= 1188) {
        document.querySelectorAll('#' + divId + ' .notice').forEach((word, index) => {
           if (index > 4) {word.style.display = word.style.display === 'none' ? 'block' : 'none';}
        });
    } else if (1188 > window.innerWidth && window.innerWidth >= 777) {
        document.querySelectorAll('#' + divId + ' .notice').forEach((word, index) => {
           if (index > 3) {word.style.display = word.style.display === 'none' ? 'block' : 'none';}
        });
    } else if (777 > window.innerWidth) {
        document.querySelectorAll('#' + divId + ' .notice').forEach((word, index) => {
           if (index > 2) {word.style.display = word.style.display === 'none' ? 'block' : 'none';}
        });
    }
    if (thisId) {
        thisId.innerHTML === 'Show All ↓' ? 'Hide All ↑' : 'Show All ↓';
        thisId.innerHTML = thisId.innerHTML === 'Show All ↓' ? 'Hide All ↑' : 'Show All ↓';
        if (thisId.innerHTML === 'Show All ↓') {
            sessionStorage.setItem('shown' + divId, 'false');
        } else {
            sessionStorage.setItem('shown' + divId, 'true');
        }
    }
}
let showAllWord = false;
let showAllMissed = false;
let showAllKnown = false;
if (window.innerWidth >= 1188) {
    document.querySelectorAll('#words .notice').forEach((word, index) => {if (index > 4) {word.style.display = 'none'; showAllWord = true;}});
    document.querySelectorAll('#missedWords .notice').forEach((word, index) => {if (index > 4) {word.style.display = 'none'; showAllMissed = true;}});
    document.querySelectorAll('#knownWords .notice').forEach((word, index) => {if (index > 4) {word.style.display = 'none'; showAllKnown = true;}});
} else if (1188 > window.innerWidth && window.innerWidth >= 777) {
    document.querySelectorAll('#words .notice').forEach((word, index) => {if (index > 3) {word.style.display = 'none'; showAllWord = true;}});
    document.querySelectorAll('#missedWords .notice').forEach((word, index) => {if (index > 3) {word.style.display = 'none'; showAllMissed = true;}});
    document.querySelectorAll('#knownWords .notice').forEach((word, index) => {if (index > 3) {word.style.display = 'none'; showAllKnown = true;}});
} else if (777 > window.innerWidth) {
    document.querySelectorAll('#words .notice').forEach((word, index) => {if (index > 2) {word.style.display = 'none'; showAllWord = true;}});
    document.querySelectorAll('#missedWords .notice').forEach((word, index) => {if (index > 2) {word.style.display = 'none'; showAllMissed = true;}});
    document.querySelectorAll('#knownWords .notice').forEach((word, index) => {if (index > 2) {word.style.display = 'none'; showAllKnown = true;}});
}
function addButton(id) {
    let theBtn = document.createElement("button");
    theBtn.innerHTML = 'Show All ↓'; theBtn.classList = "showMore";
    theBtn.onclick = () => {showHideMore(id, theBtn);};
    document.getElementById(id).insertAdjacentElement('afterend', theBtn);
}
if (showAllWord) {addButton('words');}
if (showAllMissed) {addButton('missedWords');}
if (showAllKnown) {addButton('knownWords');}
document.getElementById('clear').onclick = () => {
    localStorage.removeItem('wordList');
    document.getElementById('words').innerHTML = '';
    localStorage.removeItem('known');
    document.getElementById('knownWords').innerHTML = '';
    localStorage.removeItem('missed');
    document.getElementById('missedWords').innerHTML = '';
    knownNums.textContent = 0;
    missedNums.textContent = 0;
    wordNums.textContent = 0;
    document.getElementById('missedMem').style.display = 'none';
    document.getElementById('wordMem').style.display = 'none';
    document.getElementById('knownMem').style.display = 'none';
};
document.addEventListener("DOMContentLoaded", function() {
    let shownWords = sessionStorage.getItem('shownwords');
    let shownMissed = sessionStorage.getItem('shownmissedWords');
    let shownKnown = sessionStorage.getItem('shownknownWords');
    if (shownWords === 'true') {showHideMore('words', document.querySelector('#words + button'));}
    if (shownMissed === 'true') {showHideMore('missedWords', document.querySelector('#missedWords + button'));}
    if (shownKnown === 'true') {showHideMore('knownWords', document.querySelector('#knownWords + button'));}
    let scrollpos = sessionStorage.getItem('scrollpos');
    if (scrollpos) window.scrollTo(0, scrollpos);
    sessionStorage.removeItem('scrollpos');
});