from fastapi.responses import HTMLResponse, PlainTextResponse
from urllib.request import Request as URLRequest
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi import FastAPI, Request
from urllib.request import urlopen
from fake_headers import Headers
from bs4 import BeautifulSoup
import random
import math
import json
import re

app = FastAPI()
templates = Jinja2Templates(directory="web")
app.mount("/static", StaticFiles(directory="static"), name="static")
language_codes = {'Korean': 'ko', 'Hebrew': 'he', 'Chinese': 'zh', 'Arabic': 'ar', 'Hindi': 'hi', 'Greek': 'el', 'Turkish': 'tr', 'Japanese': 'ja', 'Spanish': 'es', 'French': 'fr', 'German': 'de', 'Italian': 'it', 'Russian': 'ru', 'Dutch': 'nl', 'Portuguese': 'pt'}


def is_ascii(s):
    return all(ord(c) < 128 for c in s)


def get_text(url: str):
    header = Headers(browser="chrome", os="win", headers=False)
    req = URLRequest(url=url, headers=header.generate())
    html = urlopen(req).read()
    soup = BeautifulSoup(html, features="html.parser")
    for script in soup(["script", "style"]):
        script.extract()
    text = soup.get_text()
    replacements = {'“': '"', '”': '"', '‘': "'", '’': "'", '—': '-', '–': '-', '…': '...', '„': '"', '«': '"', '»': '"', '‹': "'", '›': "'"}
    for typographic, standard in replacements.items():
        text = text.replace(typographic, standard)
    lines = (line.strip() for line in text.splitlines())
    chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
    sentence_ender = re.compile(r'[.!?](["\')\]}…]?)$')
    text = '\n'.join(chunk for chunk in chunks if len(chunk.split()) > 1 and sentence_ender.search(chunk))
    return [text, soup.title.string]


@app.get("/")
async def home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})


@app.get("/words")
async def words(request: Request):
    return templates.TemplateResponse("word.html", {"request": request})


@app.get("/memory")
async def game(request: Request):
    return templates.TemplateResponse("memory.html", {"request": request})


@app.get("/{url:path}", response_class=HTMLResponse)
async def reader(request: Request, url: str, l: str = "NULL", density: str = "medium"):
    if l == "NULL":
        return templates.TemplateResponse("redirect.html", {"request": request})
    else:
        if not url.startswith("https"):
            return PlainTextResponse("Invalid URL")
        texts = get_text(url)
        if texts[0] == "":
            return PlainTextResponse("URL Extraction Failed")
        txt = texts[0]
        words = re.findall(r'<.*?>|[\w\']+', texts[0])
        words = list(dict.fromkeys(words))
        random.shuffle(words)
        if density == "low":
            percent = 5
        elif density == "high":
            percent = 25
        else:
            percent = 15
        words = words[-math.ceil(len(words) * (percent/100)):]
        words = [word for word in words if word.isalpha() and is_ascii(word)]
        query = '%0A'.join(words)
        target_language = language_codes.get(l, 'es')
        response = urlopen(f'https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl={target_language}&dt=t&q={query}')
        translations = json.loads(response.read().decode())
        for t in translations[0]:
            txt = txt.replace(" " + t[1].rstrip() + " ", " " + f"<mark translation='{t[1].rstrip()}'>{t[0].lower().rstrip()}</mark>" + " ")
        txt = re.sub(r'\. <mark translation=\'(.*?)\'>(.*?)</mark>', lambda x: f'. <mark translation=\'{x.group(1)}\'>{x.group(2).capitalize()}</mark>', txt)
        return templates.TemplateResponse("reader.html", {"request": request, "url": url, "text": txt, "title": texts[1]})
