![Cover Photo](https://cdn.jsdelivr.net/gh/Dheirya/FastLingo@latest/static/demo/cover.png)
# **FastLingo**
*Learn a new language quick thru reading!*

FastLingo is a unique language-learning web app that allows people to passively learn a new language while browsing the web. Through the use of the innovative Diglot Weave method, language learners can passively and quickly strengthen their vocabulary in a foreign language by reading!

In more detail, after a learner selects a target language and inputs a website URL on the homepage, the app automatically reads the content of the page and presents it with randomly translated words in the target language. The learner can then hover over the translated words to see the original text. This allows learners to learn new vocabulary in context rapidly while reading articles, news, or any other content on the web.

In addition to this, after learners hover over a translated word and make a guess, a module appears where they can choose to add that word to one of three automatically-created flashcard lists: The known words list, the general words list, and the tough words list. With these lists, learners can review words and reinforce their memory via the built-in memory game. The game presents words and translations in a grid from their lists and asks them to correlate the translations with the definitions, thereby physically building and strengthening the language connections in their brain.

In short, FastLingo is a creative and seamless solution for language learners around the world looking to build their vocabulary and improve their skills. It's a fun and easy way to learn a new language while doing what you already do: browsing the web!
## Features

- Enhanced Diglot Weave technique
- Pronounication assistance
- Translation density customization
- Support for 15 languages
- Text size customization
- Locally stored flashcards
- Fun memory game

## Demo

A demo video is posted on youtube [here](https://youtu.be/JCzjd4akr_M). A live demo is also available [here](https://fastlingo.koyeb.app)


## Installation

Install this project via pypi

```bash
pip install -r requirements.txt
```

You can run this project locally via Uvicorn

```bash
uvicorn run:app --reload 
```
## Screenshots
![Index Screenshot](https://cdn.jsdelivr.net/gh/Dheirya/FastLingo@latest/static/demo/index.png)

![Reader Screenshot](https://cdn.jsdelivr.net/gh/Dheirya/FastLingo@latest/static/demo/reader.png)

![Hover Screenshot](https://cdn.jsdelivr.net/gh/Dheirya/FastLingo@latest/static/demo/hover.png)

![Hover Click Screenshot](https://cdn.jsdelivr.net/gh/Dheirya/FastLingo@latest/static/demo/hoverClick.png)

![List Screenshot](https://cdn.jsdelivr.net/gh/Dheirya/FastLingo@latest/static/demo/list.png)

![Game Site Screenshot](https://cdn.jsdelivr.net/gh/Dheirya/FastLingo@latest/static/demo/game.png)


## License

[MIT](https://choosealicense.com/licenses/mit/)
