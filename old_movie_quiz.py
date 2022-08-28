from deep_translator import GoogleTranslator as GT
from typing import Optional
import json
import random
import requests
import os
import gtts
from playsound import playsound
from movie import Movie
from constants import *

def get_movie(id: str) -> Optional[Movie]:

    url = 'https://mdblist.p.rapidapi.com/'

    querystring = {'i':id}

    headers = {
        'x-rapidapi-host': 'mdblist.p.rapidapi.com',
        'x-rapidapi-key': '323cf39924msh5b6fb84122a6bb7p1bc977jsn427210d2dcfd'
        }

    response = requests.request('GET', url, headers=headers, params=querystring)

    movie_details = json.loads(response.text)
    movie = Movie(movie_details)

    return movie


def start_movie_quiz():

    n = random.randint(1,len(ID_BY_MOVIE))
    id = list(ID_BY_MOVIE.values())[n-1]
    movie = get_movie(id)

    if not movie.title:
        print('Your daily quota was reached')
        return

    if not movie.keywords:
        print(f'There are no keywords for {movie.title}')
        return

    random.shuffle(movie.keywords)

    for keyword in movie.keywords:
        name = keyword.get('name')
        name_translated = name if LANGUAGE == 'en' else GT(
                source='en', 
                target=LANGUAGE
            ).translate(name)

        if '-' in name_translated:
            continue

        print(name_translated)
        convert_text_to_speech(name_translated)
        text = input()

        if text == 'skip':
            break
    
    description_text_translated = DESCRIPTION_TEXT if LANGUAGE == 'en' else GT(
            source='en', 
            target=LANGUAGE
        ).translate(DESCRIPTION_TEXT)
    print(description_text_translated)
    #convert_text_to_speech(description_text_translated)

    description_translated = movie.description if LANGUAGE == 'en' else GT(
            source='en', 
            target=LANGUAGE
        ).translate(movie.description)
    print(description_translated)
    #convert_text_to_speech(description_translated)

    input()

    title_text_translated = TITLE_TEXT if LANGUAGE == 'en' else GT(
            source='en', 
            target=LANGUAGE
        ).translate(TITLE_TEXT)
    print(title_text_translated)
    #convert_text_to_speech(title_text_translated)

    title_translated = movie.title

    if LANGUAGE=='de':
        title_translated = TITLE_TRANSLATOR_DICTIONARY.get(
            movie.title, 
            movie.title
        )
    elif LANGUAGE != 'en':
        title_translated = GT(
            source='en', 
            target=LANGUAGE
        ).translate(movie.title)

    print(title_translated)
    #convert_text_to_speech(title_translated)

def convert_text_to_speech(text):
    if not TTS:
        return

    tts = gtts.gTTS(text, lang=LANGUAGE)
    tts.save('tts.mp3')
    playsound('tts.mp3')
    os.remove('tts.mp3') if os.path.exists('tts.mp3') else print(
        'The mp3 file could not be created'
    )


start_movie_quiz()