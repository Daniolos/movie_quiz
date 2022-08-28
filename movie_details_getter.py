import argparse
import json
import requests

URL_TITLES = "https://imdb-api.com/en/API/SearchTitle/k_dqtdrwhx/"
URL_EXTERNAL = "https://imdb-api.com/de/API/ExternalSites/k_dqtdrwhx/"
URL_AMAZON = "https://imdb-api.com/API/AdvancedSearch/k_dqtdrwhx?title={}&online_availability=DE/today/Amazon/subs"


def get_movie_details():
    parser = argparse.ArgumentParser()
    parser.add_argument("title", help="input the title you are searching for")
    parser.add_argument(
        "-i", "--id", action="store_true", help="get the imbdid from the title"
    )
    args = parser.parse_args()

    movie_id, movie_title = get_movie_id_and_title(args.title)

    if args.id:
        print(f"{movie_title}: {movie_id}")
        return

    check_netflix_availability(movie_id, movie_title)

    check_prime_video_availability(movie_id, movie_title)


def get_movie_id_and_title(title):
    try:
        response = requests.request("GET", URL_TITLES + title)
        response_dict = json.loads(response.text)

        movie = response_dict.get("results")[0]

        movie_title = movie.get("title")
        movie_id = movie.get("id")

        return (movie_id, movie_title)
    except:
        print("Title could not be loaded")


def check_netflix_availability(movie_id, movie_title):
    try:
        response = requests.request("GET", URL_EXTERNAL + movie_id)
        response_dict = json.loads(response.text)

        if "netflix" in response_dict:
            print(f"{movie_title} can possibly be streamed on netflix")
            print(response_dict.get("netflix").get("url"))
    except:
        print("Netflix availabilty could not be loaded")


def check_prime_video_availability(movie_id, movie_title):
    try:
        response = requests.request("GET", URL_AMAZON.format(movie_title))
        response_dict = json.loads(response.text)

        for result in response_dict.get("results"):
            if result.get("id") == movie_id:
                print(f"{movie_title} can be streamed on prime video")
    except:
        print("Amazon availability could not be loaded")


get_movie_details()
