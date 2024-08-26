document.getElementsByClassName('scroll-progress-wrap')[2].addEventListener('click', function () {
    if (document.getElementById('box2').style.display === 'none') {
        document.getElementById('box2').style.display = 'block';
        document.getElementById('box1').style.display = 'none';
    } else {
        document.getElementById('box2').style.display = 'none';
    }
});
document.getElementById('textRange').addEventListener('input', function () {
    document.getElementById('content').style.fontSize = (this.value * .008 + .6) + 'em';
});
let url = new URL(window.location.href);
if (!localStorage.getItem('density')) {
    localStorage.setItem('density', 'medium');
}
oldSelection = localStorage.getItem('density');
if (localStorage.getItem('density') === 'low') {
    document.getElementById('low').classList.add('active');
} else if (localStorage.getItem('density') === 'high') {
    document.getElementById('high').classList.add('active');
} else {
    document.getElementById('med').classList.add('active');
}
document.getElementById('low').addEventListener('click', function () {
    localStorage.setItem('density', 'low');
    document.getElementById('low').classList.add('active');
    document.getElementById('med').classList.remove('active');
    document.getElementById('high').classList.remove('active');
    url.searchParams.set('density', 'low');
    window.history.pushState({}, '', url);
    if (oldSelection !== 'low') {
        document.getElementById('reload').style.display = 'block';
    } else {
        document.getElementById('reload').style.display = 'none';
    }
});
document.getElementById('med').addEventListener('click', function () {
    localStorage.setItem('density', 'medium');
    document.getElementById('low').classList.remove('active');
    document.getElementById('med').classList.add('active');
    document.getElementById('high').classList.remove('active');
    url.searchParams.set('density', 'medium');
    window.history.pushState({}, '', url);
    if (oldSelection !== 'medium') {
        document.getElementById('reload').style.display = 'block';
    } else {
        document.getElementById('reload').style.display = 'none';
    }
});
document.getElementById('high').addEventListener('click', function () {
    localStorage.setItem('density', 'high');
    document.getElementById('low').classList.remove('active');
    document.getElementById('med').classList.remove('active');
    document.getElementById('high').classList.add('active');
    url.searchParams.set('density', 'high');
    window.history.pushState({}, '', url);
    if (oldSelection !== 'high') {
        document.getElementById('reload').style.display = 'block';
    } else {
        document.getElementById('reload').style.display = 'none';
    }
});
document.getElementsByClassName('scroll-progress-wrap')[1].addEventListener('click', function () {
    if (document.getElementById('box1').style.display === 'none') {
        document.getElementById('box1').style.display = 'block';
        document.getElementById('box2').style.display = 'none';
    } else {
        document.getElementById('box1').style.display = 'none';
    }
});
let langConversions = {
    'Korean': 'ko',
    'Hebrew': 'he',
    'Chinese': 'zh',
    'Arabic': 'ar',
    'Hindi': 'hi',
    'Greek': 'el',
    'Turkish': 'tr',
    'Japanese': 'ja',
    'Spanish': 'es',
    'French': 'fr',
    'German': 'de',
    'Italian': 'it',
    'Russian': 'ru',
    'Dutch': 'nl',
    'Portuguese': 'pt'
};
let synth = window.speechSynthesis;
let voices = synth.getVoices();
let curLang = langConversions[window.location.search.replace('?l=', '').split('&')[0]];
let choseVoice = voices[0];
for (let i = 0; i < voices.length; i++) {
    if (voices[i].lang.includes(curLang)) {
        choseVoice = voices[i];
        break;
    }
}
function speakToText(word) {
    let utterThis = new SpeechSynthesisUtterance(word);
    utterThis.voice = choseVoice;
    utterThis.rate = .95;
    synth.speak(utterThis);
}
function saveWord(word, translation, addList) {
    let language = window.location.search.replace('?l=', '').split('&')[0];
    let localWordList = JSON.parse(localStorage.getItem(addList)) || [];
    let wordExists = false;
    for (let i = 0; i < localWordList.length; i++) {
        if (localWordList[i].translation === word.toLowerCase()) {
            wordExists = true;
            break;
        }
    }
    let m = (addList !== 'wordList') ? addList : 'general';
    if (!wordExists) {
        localWordList.push({translation: word.toLowerCase(), english: translation, lang: language});
        localStorage.setItem(addList, JSON.stringify(localWordList));
        Toastify({
            text: "Added to your " + m + " word list!",
            duration: 1500,
            close: false,
            className: "info",
            style: {background: "linear-gradient(to right, #00b09b, #96c93d)"},
            onClick: function () {
                document.querySelectorAll('.toastify').forEach(function (element) {
                    element.remove();
                });
            }
        }).showToast();
    } else {
        Toastify({
            text: "Word already in list",
            duration: 1500,
            close: false,
            className: "info",
            style: {background: "linear-gradient(to right, rgb(255, 95, 109), rgb(255, 195, 113))"},
            onClick: function () {
                document.querySelectorAll('.toastify').forEach(function (element) {
                    element.remove();
                });
            }
        }).showToast();
    }
}
document.getElementById("l").textContent = window.location.search.replace('?l=', '').split('&')[0];
let marks = document.querySelectorAll('#content mark');
marks.forEach(function (mark) {
    let tooltipContainer = document.createElement('span');
    tooltipContainer.classList.add('tooltip');
    mark.parentNode.insertBefore(tooltipContainer, mark);
    let markClicked = false;
    mark.onclick = function () {
        if (!markClicked) {
            let parentN = this.parentNode.querySelectorAll("span")[0];
            parentN.querySelectorAll('span')[0].style.display = 'none';
            parentN.querySelectorAll('span')[1].style.display = 'block';
            markClicked = true;
        }
    };
    tooltipContainer.appendChild(mark);
    let tooltipText = document.createElement('span');
    tooltipText.classList.add('tooltiptext');
    tooltipText.innerHTML = `<span>
                                Guess the Meaning
                                <button class="openT">Check!</button>
                            </span>
                            <span style="display: none">
                                <span>` + mark.innerText + `: <b>` + mark.getAttribute("translation") + `</b></span>
                                <br/>
                                <div class="btnCont">
                                    <button class="sBtn" onclick="speakToText('` + mark.innerText + `')"><span class="material-symbols-outlined">volume_up</span></button>
                                    <button class="sBtn" onclick="this.childNodes[0].innerHTML = 'bookmark_check'; saveWord('` + mark.innerText + `', '` + mark.getAttribute("translation") + `', 'wordList')"><span class="material-symbols-outlined">bookmark_add</span></button>
                                </div>
                                <button class="btnActs redBtn" onclick="this.childNodes[0].innerHTML = 'bookmark_check'; saveWord('` + mark.innerText + `', '` + mark.getAttribute("translation") + `', 'missed')">Missed!</button>
                                <button class="btnActs" onclick="this.childNodes[0].innerHTML = 'bookmark_check'; saveWord('` + mark.innerText + `', '` + mark.getAttribute("translation") + `', 'known')">Got it!</button>
                            </span>`;
    tooltipContainer.appendChild(tooltipText);
});
function openTooltip() {
    let parentN = this.parentNode.parentNode;
    parentN.querySelectorAll('span')[0].style.display = 'none';
    parentN.querySelectorAll('span')[1].style.display = 'block';
}
function closedTooltip() {
    let parentN = this.parentNode.parentNode;
    parentN.querySelectorAll('span')[0].style.display = 'block';
    parentN.querySelectorAll('span')[1].style.display = 'none';
    if (this.innerHTML === 'Got it!') {
        parentN.innerHTML = '<b>Nice!</b> Keep going 👍';
    } else {
        parentN.innerHTML = '<b>Almost!</b> Remember to review this one 🔄';
    }
    let knownWords = (JSON.parse(localStorage.getItem('known')) || []).length;
    let missedWords = (JSON.parse(localStorage.getItem('missed')) || []).length;
    parentN.innerHTML = parentN.innerHTML + `<br/><span onclick="window.open('/words')" class='stat learning'>Learning ${missedWords}</span> <span onclick="window.open('/words')" class='stat known'>Known ${knownWords}</span>`;
}
const btnActs = document.getElementsByClassName("btnActs");
for (let i = 0; i < btnActs.length; i++) {
    btnActs[i].addEventListener('click', closedTooltip);
}
const opens = document.getElementsByClassName("openT");
for (let i = 0; i < opens.length; i++) {
    opens[i].addEventListener('click', openTooltip);
}
document.getElementsByClassName('scroll-progress-wrap')[0].addEventListener('mouseover', function () {
    document.querySelector('#circ > span').innerHTML = "&#x2191;";
});
document.getElementsByClassName('scroll-progress-wrap')[0].addEventListener('click', function () {
    window.scrollTo(0, 0);
});
window.onscroll = function () {
    let winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    let height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    let scrollPercent = (winScroll / height) * 100;
    document.querySelector("#circ > span").innerHTML = Math.round(scrollPercent).toString();
    let deg = (scrollPercent / 100) * 360;
    document.getElementById("circ").style.backgroundImage = `conic-gradient(orange ${deg}deg, transparent 0deg)`;
};
