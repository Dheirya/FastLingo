function gETC(parentSelector, textContent) {
    const parentElement = document.querySelector(parentSelector);
    const elements = parentElement.querySelectorAll('p');

    for (let element of elements) {
        if (element.textContent === textContent) {
            return element;
        }
    }
    return null;
}
if (!localStorage.getItem("lang")) {
    localStorage.setItem("lang", "Spanish");
}
if (localStorage.getItem("lang") !== "Spanish") {
    document.getElementById("topText").innerHTML = localStorage.getItem("lang");
    gETC('.dropdown-content', localStorage.getItem("lang")).innerHTML = "Spanish";
}
const dropdownItems = document.querySelectorAll('.dropdown-content p');
dropdownItems.forEach(item => {
    item.addEventListener('click', (event) => {
        const clicked = event.target.textContent;
        event.target.innerHTML = document.getElementById("topText").innerHTML;
        document.getElementById("topText").innerHTML = clicked;
        localStorage.setItem("lang", clicked);
    });
});
document.getElementById('myForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const input = document.getElementById('inputField').value;
    if (input && /^https?:\/\//i.test(input)) {
        const baseURL = 'http://127.0.0.1:8000/';
        if (!localStorage.getItem('density')) {
            localStorage.setItem('density', 'medium');
        }
        window.location.href = baseURL + encodeURIComponent(input) + "?l=" + localStorage.getItem("lang") + "&density=" + localStorage.getItem("density");
    } else {
        alert('Invalid URL');
    }
});
const N = 50;
const K = 20;
const hellos = ["Salve", "Hola", "Bonjour", "Hallo", "Ciao", "Ol\xe1", "Здравствуйте", "こんにちは", "你好", "안녕하세요", "Hej", "Hei", "Ahoj", "Sveiki", "Merhaba", "Γειά σας", "Shalom", "سلام", "नमस्ते", "Salut", "Hallo", "Kamusta", "Sawubona", "Halo", "Terve", "Selamat pagi", "Здравствуйте", "Բարեւ", "გამარჯობა", "ਸਤ ਸ੍ਰੀ ਅਕਾਲ", "ສະບາຍດີ", "สวัสดี", "नमस्कार", "வணக்கம்", "Здраво", "Mhoro", "Здрастуйте", "Привіт", "سلام", "ಹಲೋ", "ഹലോ", "හෙලෝ", "Mingalaba", "Xin ch\xe0o", "Tere", "Aloha", "Hello", "Moni", "Sain baina uu", "Dia dhuit"];
function fibonacciSpiralPoints(numPoints) {
    const points = [];
    const phi = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < numPoints; i++) {
        const y = 1 - (i / (numPoints - 1)) * 2;
        const radius = Math.sqrt(1 - y * y);
        const theta = phi * i;
        const x = Math.cos(theta) * radius;
        const z = Math.sin(theta) * radius;
        const lat = Math.asin(y) * (180 / Math.PI);
        const lng = Math.atan2(z, x) * (180 / Math.PI);
        points.push({lat, lng});
    }
    return points;
}
const gData = fibonacciSpiralPoints(N).map(point => ({
    lat: point.lat,
    lng: point.lng,
    color: "#" + ((1 << 24) * Math.random() | 0).toString(16).padStart(6, "0")
}));
const arcsData = [...Array(K).keys()].map(() => ({
    startLat: (Math.random() - 0.5) * 180,
    startLng: (Math.random() - 0.5) * 360,
    endLat: (Math.random() - 0.5) * 180,
    endLng: (Math.random() - 0.5) * 360,
    color: "#" + ((1 << 24) * Math.random() | 0).toString(16).padStart(6, "0")
}));
const globe = Globe().globeImageUrl('/static/images/earth-dark.jpg').htmlElementsData(gData).htmlElement(d => {
    const el = document.createElement('div');
    el.innerHTML = hellos[0];
    hellos.shift();
    el.style.color = d.color;
    el.style.fontWeight = 'bold';
    el.style.textShadow = '1px 1px 2px white';
    return el;
}).arcsData(arcsData).arcColor('color').arcDashLength(() => Math.random()).arcDashGap(() => Math.random()).arcDashAnimateTime(() => 5000).backgroundImageUrl('/static/images/night-sky.png')(document.getElementById('globeViz'));
globe.pointOfView({lng: 0, altitude: 1});
let rotate = false;
let u = +1;
setInterval(() => {
    if (!rotate) {
        if (globe.pointOfView().lat > 30) {
            u = -1;
        }
        if (globe.pointOfView().lat < -30) {
            u = +1;
        }
        globe.pointOfView({lat: globe.pointOfView().lat + u * 0.1, lng: globe.pointOfView().lng + 0.15});
    }
}, 10);
document.addEventListener('mousemove', function (event) {
    const x = event.clientX;
    const y = event.clientY;
    const welcome = document.getElementById('welcome');
    const rect = welcome.getBoundingClientRect();
    rotate = !(x < rect.left || x > rect.right || y < rect.top || y > rect.bottom);
});