import json
from pathlib import Path
from time import sleep
from constants import ID_BY_MOVIE, RESPONSES_PATH
from movie_quiz import get_response_by_movie_id, get_status_code_info


def main():
    for movie_id in ID_BY_MOVIE.values():

        movie_id_missing = (
            False
            if len(
                [
                    file
                    for file in Path(RESPONSES_PATH).rglob("*")
                    if movie_id in file.name
                ]
            )
            else True
        )

        if not movie_id_missing:
            continue

        response = get_response_by_movie_id(movie_id)

        if not str(response.status_code).startswith("2"):
            print(get_status_code_info(response.status_code))
            return

        response_dict: dict = json.loads(response.text)
        imdbid: str = response_dict.get("imdbid")

        with open(f"{RESPONSES_PATH}{imdbid}.json", "w") as f:
            f.write(response.text)

        sleep(2)


if __name__ == "__main__":
    main()
