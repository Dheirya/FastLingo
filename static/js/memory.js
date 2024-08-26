for (let i = 0; i < 16; i++) {
    let div = document.createElement('div');
    document.getElementById("playGridSection").appendChild(div);
}
if (localStorage.getItem('highScore')) {
    document.getElementById("highScore").innerText = localStorage.getItem('highScore');
} else {
    document.getElementById("pick3").style.display = 'none';
}
let answerDict = {};
let active1 = null;
let active2 = null;
let wordsActive = 0;
let timer = false;
setInterval(function () {
    if (timer) {document.getElementById("num").innerText = parseInt(document.getElementById("num").innerText) + 1;}
}, 1000);
document.querySelectorAll("#playGridSection div").forEach(div => {
    div.addEventListener('click', () => {
        div.classList = "active";
        if (active1 == null) {
            active1 = div;
        } else if (active1 === div) {
            active1.classList = "";
            active1 = null;
        } else {
            active2 = div;
            if (answerDict[active1.innerText] === active2.innerText || answerDict[active2.innerText] === active1.innerText) {
                active1.classList += " correct";
                active2.classList += " correct";
                active1 = null;
                active2 = null;
                wordsActive--;
                if (wordsActive === 0) {
                    timer = false;
                    document.getElementById("playGridSection").display = 'none';
                    let curTime = document.getElementById('num').innerText;
                    document.getElementById("pick2").innerHTML = 'Congrats! You completed this memory game in <b>' + curTime + '</b>s. Play <a href="/memory">again</a>?';
                    if (localStorage.getItem('highScore')) {
                        if (parseInt(localStorage.getItem('highScore')) > parseInt(curTime)) {
                            localStorage.setItem('highScore', curTime);
                        }
                    } else {
                        localStorage.setItem('highScore', curTime);
                    }
                    document.getElementById("highScore").innerText = localStorage.getItem('highScore');
                    document.getElementById("pick3").style.display = 'block';
                }
            } else {
                active1.classList += " shake";
                active2.classList += " shake";
                setTimeout(() => {
                    active1.classList = "";
                    active2.classList = "";
                    active1 = null;
                    active2 = null;
                }, 200);
            }
        }
    });
});
let missedList = JSON.parse(localStorage.getItem('missed')) || [];
let generalList = JSON.parse(localStorage.getItem('wordList')) || [];
let knownList = JSON.parse(localStorage.getItem('known')) || [];
document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
        const type = chip.classList[1];
        for (let i = 0; i < 4; i++) {
            document.getElementsByClassName('chip')[i].style.display = 'none';
        }
        document.getElementById("pick1").style.display = 'none';
        document.getElementById("pick2").style.display = 'block';
        document.getElementById("pick3").style.display = 'none';
        let shuffledWords = [];
        if (type === 'all') {
            let allWords = missedList.concat(generalList).concat(knownList);
            shuffledWords = allWords.sort(() => Math.random() - 0.5);
        } else if (type === 'missed') {
            shuffledWords = missedList.sort(() => Math.random() - 0.5);
        } else if (type === 'general') {
            shuffledWords = generalList.sort(() => Math.random() - 0.5);
        } else if (type === 'known') {
            shuffledWords = knownList.sort(() => Math.random() - 0.5);
        }
        let maxWords = shuffledWords.length < 8 ? shuffledWords.length : 8;
        for (let i = 0; i < maxWords; i++) {
            document.querySelectorAll("#playGridSection div")[i].innerText = shuffledWords[i].translation;
            document.querySelectorAll("#playGridSection div")[i + 8].innerText = shuffledWords[i].english;
            answerDict[shuffledWords[i].translation] = shuffledWords[i].english;
            wordsActive++;
        }
        for (let i = 0; i < 8 - maxWords; i++) {
            document.querySelectorAll("#playGridSection div")[15 - i].style.display = 'none';
            document.querySelectorAll("#playGridSection div")[7 - i].style.display = 'none';
        }
        let shuffledDivs = Array.from(document.querySelectorAll("#playGridSection div")).sort(() => Math.random() - 0.5);
        shuffledDivs.forEach((div) => {
            document.getElementById("playGridSection").appendChild(div);
        });
        document.getElementById("playGridSection").style.display = 'grid';
        timer = true;
    });
});
if (missedList.length === 0) {
    document.getElementsByClassName('missed')[0].style.display = 'none';
}
if (generalList.length === 0) {
    document.getElementsByClassName('general')[0].style.display = 'none';
}
if (knownList.length === 0) {
    document.getElementsByClassName('known')[0].style.display = 'none';
}
if (missedList.length === generalList.length && generalList.length  === knownList.length && knownList.length === 0) {
    document.getElementsByClassName('all')[0].style.display = 'none';
    document.getElementById("pick1").innerHTML = 'You have no word lists to play the game with. Create a <a href="/words">list</a> by reading articles!';
}
const urlParams = new URLSearchParams(window.location.search);
const list = urlParams.get('list');
if (list === 'missed') {
    document.getElementsByClassName('missed')[0].click();
} else if (list === 'general') {
    document.getElementsByClassName('general')[0].click();
} else if (list === 'known') {
    document.getElementsByClassName('known')[0].click();
}