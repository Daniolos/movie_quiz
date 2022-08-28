import json
import os
import random
import time

import gtts
import requests
from deep_translator import GoogleTranslator as GT
from playsound import playsound

from constants import (
    API_ACCESS,
    DESCRIPTION_TEXT,
    DESCRIPTION_TTS,
    DESCRIPTION_TYPING_SPEED,
    ID_BY_MOVIE,
    KEYWORD_TTS,
    LANGUAGE,
    MAX_KEYWORDS,
    MDB_LIST_HEADERS,
    MDB_LIST_URL,
    SKIPPABLE,
    STARTING_TEXT,
    STATUS_CODE_INFO,
    TITLE_TEXT,
    TITLE_TRANSLATOR_DICTIONARY,
    TITLE_TTS,
    TTS,
    TTS_LANGUAGE_PRONOUNCIATION,
    TTS_LANGUAGE,
    TYPING_SPEED,
)
from movie import Movie


def main() -> None:

    print(STARTING_TEXT)

    id = get_random_movie_id(ID_BY_MOVIE)

    response_json = get_response_json(id)

    if response_json is None:
        return

    movie = set_movie(response_json)

    if API_ACCESS:
        print(f"{movie.remaining_api_calls} calls left\n")

    if not movie.keywords:
        print(f"No keywords could be found")
        return

    run_keyword_quiz(movie.keywords)

    if not movie.description:
        print(f"A description was not provided")
        return

    show_movie_description(movie.description)

    if SKIPPABLE:
        input()
    else:
        time.sleep(1)
        print()

    if not movie.title:
        print(f"A title was not provided")
        return

    show_movie_title(movie.title)


def get_random_movie_id(id_by_movie: dict[str, str]) -> str:
    n = random.randint(0, len(id_by_movie) - 1)
    return list(id_by_movie.values())[n]


def get_response_json(id):
    if not API_ACCESS:
        with open(f"responses/{id}.json", "r") as file:
            return file.read()

    response = get_response_by_movie_id(id)

    if not str(response.status_code).startswith("2"):
        print(get_status_code_info(response.status_code))
        return

    return response.text


def get_response_by_movie_id(id: str) -> requests.Response:
    return requests.request(
        "GET", MDB_LIST_URL, headers=MDB_LIST_HEADERS, params={"i": id}
    )


def get_status_code_info(status_code: int) -> str:
    first_digit = str(status_code)[:1]
    return STATUS_CODE_INFO.get(first_digit)


def set_movie(json_string: str) -> Movie:
    movie_details = json.loads(json_string)
    return Movie(movie_details)


def run_keyword_quiz(keyword_dicts: list[dict]) -> None:

    random.shuffle(keyword_dicts)
    
    keywords = [
        keyword_dict.get("name")
        for keyword_dict in keyword_dicts
        if "-" not in keyword_dict.get("name")
    ][:MAX_KEYWORDS]

    for keyword in keywords:
        keyword_translated = get_translation(keyword)

        human_print(keyword_translated)
        if KEYWORD_TTS:
            convert_text_to_speech(keyword, keyword_translated)

        if SKIPPABLE:
            text = input()
            if text == "skip":
                break
        else:
            time.sleep(1)
            print()


def show_movie_description(description: str) -> None:
    description_text_translated = get_translation(DESCRIPTION_TEXT)
    human_print(description_text_translated)

    description_translated = get_translation(description)
    human_print(description_translated, DESCRIPTION_TYPING_SPEED)

    if DESCRIPTION_TTS:
        convert_text_to_speech(DESCRIPTION_TEXT, description_text_translated)
        convert_text_to_speech(description, description_translated)


def show_movie_title(title: str) -> None:
    title_text_translated = get_translation(TITLE_TEXT)
    human_print(title_text_translated)

    title_translated = get_translation_with_dictionary(
        title, TITLE_TRANSLATOR_DICTIONARY
    )
    human_print(title_translated)

    if TITLE_TTS:
        convert_text_to_speech(TITLE_TEXT, title_text_translated)
        convert_text_to_speech(title, title_translated)


def get_translation(text: str, language=LANGUAGE) -> str:
    return (
        text if language == "en" else GT(source="en", target=language).translate(text)
    )


def get_translation_with_dictionary(text: str, dictionary: dict) -> str:
    if LANGUAGE == "de":
        return dictionary.get(text, text)
    elif LANGUAGE != "en":
        return GT(source="en", target=LANGUAGE).translate(text)
    return text


def human_print(text: str, typing_speed: int = TYPING_SPEED) -> None:
    for char in text:
        print(char, end="")
        time.sleep(random.random() * 10.0 / typing_speed)
    print()


def convert_text_to_speech(text: str, text_translated) -> None:
    if not TTS:
        return

    text = (
        text_translated
        if LANGUAGE == TTS_LANGUAGE
        else get_translation(text, TTS_LANGUAGE)
    )

    tts = gtts.gTTS(text, lang=TTS_LANGUAGE_PRONOUNCIATION)
    tts.save("tts.mp3")
    playsound("tts.mp3")
    os.remove("tts.mp3") if os.path.exists("tts.mp3") else print(
        "The mp3 file could not be created"
    )


if __name__ == "__main__":
    main()
