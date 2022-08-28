import os
from dotenv import load_dotenv

load_dotenv()


TYPING_SPEED = 80
DESCRIPTION_TYPING_SPEED = 500
MAX_KEYWORDS = 15
API_ACCESS = False
SKIPPABLE = True
LANGUAGE = "en"
TTS_LANGUAGE = "en"
TTS_LANGUAGE_PRONOUNCIATION = "en"
TTS = True
KEYWORD_TTS = True
DESCRIPTION_TTS = False
TITLE_TTS = False

MDB_LIST_URL = "https://mdblist.p.rapidapi.com/"

MDB_LIST_HEADERS = {
    "x-rapidapi-host": "mdblist.p.rapidapi.com",
    "x-rapidapi-key": os.getenv('X_RAPID_API_KEY'),
}

STATUS_CODE_INFO = {
    "1": "Informational",
    "2": "Success!",
    "3": "Redirect. The requested page has moved somewhere else.",
    "4": "Client error. There’s something wrong with the way the browser asked for the page.",
    "5": "Server error. Something went wrong with the way the server tried to send the page.",
}

RESPONSES_PATH = "responses/"

STARTING_TEXT = """
███╗   ███╗ ██████╗ ██╗   ██╗██╗███████╗     ██████╗ ██╗   ██╗██╗███████╗
████╗ ████║██╔═══██╗██║   ██║██║██╔════╝    ██╔═══██╗██║   ██║██║╚══███╔╝
██╔████╔██║██║   ██║██║   ██║██║█████╗      ██║   ██║██║   ██║██║  ███╔╝ 
██║╚██╔╝██║██║   ██║╚██╗ ██╔╝██║██╔══╝      ██║▄▄ ██║██║   ██║██║ ███╔╝  
██║ ╚═╝ ██║╚██████╔╝ ╚████╔╝ ██║███████╗    ╚██████╔╝╚██████╔╝██║███████╗
╚═╝     ╚═╝ ╚═════╝   ╚═══╝  ╚═╝╚══════╝     ╚══▀▀═╝  ╚═════╝ ╚═╝╚══════╝
"""

DESCRIPTION_TEXT = "Here is the movie description:"
TITLE_TEXT = "The title of the movie is"

ID_BY_MOVIE = {
    "Garfield": "tt0356634",
    "Finding Nemo": "tt0266543",
    "The Incredibles": "tt0317705",
    "Monsters, Inc.": "tt0198781",
    "Robin Hood": "tt0070608",
    "The Princess and the Frog": "tt0780521",
    "The Lion King": "tt0110357",
    "Frozen": "tt2294629",
    "Frozen II": "tt4520988",
    "Tangled": "tt0398286",
    "Moana": "tt3521164",
    "Encanto": "tt2953050",
    "Pirates of the Caribbean: The Curse of the Black Pearl": "tt0325980",
    "Iron Man": "tt0371746",
    "Iron Man 2": "tt1228705",
    "Iron Man 3": "tt1300854",
    "Thor": "tt0800369",
    "Thor: The Dark World": "tt1981115",
    "Thor: Ragnarok": "tt3501632",
    "Captain America: The First Avenger": "tt0458339",
    "Captain America: The Winter Soldier": "tt1843866",
    "Captain America: Civil War": "tt3498820",
    "Guardians of the Galaxy": "tt2015381",
    "Guardians of the Galaxy Vol. 2": "tt3896198",
    "Ant-Man": "tt0478970",
    "Ant-Man and the Wasp": "tt5095030",
    "Black Panther": "tt1825683",
    "Doctor Strange": "tt1211837",
    "Spider-Man: Homecoming": "tt2250912",
    "Spider-Man: Far from Home": "tt6320628",
    "Spider-Man: No Way Home": "tt10872600",
    "Captain Marvel": "tt4154664",
    "Shang-Chi and the Legend of the Ten Rings": "tt9376612",
    "The Avengers": "tt0848228",
    "Avengers: Age of Ultron": "tt2395427",
    "Avengers: Infinity War": "tt4154756",
    "Avengers: Endgame": "tt4154796",
    "Star Wars: Episode I - The Phantom Menace": "tt0120915",
    "Star Wars: Episode II - Attack of the Clones": "tt0121765",
    "Star Wars: Episode III - Revenge of the Sith": "tt0121766",
    "Star Wars: Episode IV - A New Hope": "tt0076759",
    "Star Wars: Episode V - The Empire Strikes Back": "tt0080684",
    "Star Wars: Episode VI - Return of the Jedi": "tt0086190",
    "Star Wars: Episode VII - The Force Awakens": "tt2488496",
    "Star Wars: Episode VIII - The Last Jedi": "tt2527336",
    "Star Wars: Episode IX - The Rise of Skywalker": "tt2527338",
    "Harry Potter and the Sorcerer's Stone": "tt0241527",
    "Harry Potter and the Chamber of Secrets": "tt0295297",
    "Harry Potter and the Prisoner of Azkaban": "tt0304141",
    "Harry Potter and the Goblet of Fire": "tt0330373",
    "Harry Potter and the Order of the Phoenix": "tt0373889",
    "Harry Potter and the Half-Blood Prince": "tt0417741",
    "Harry Potter and the Deathly Hallows: Part 1": "tt0926084",
    "Harry Potter and the Deathly Hallows: Part 2": "tt1201607",
    "The Lord of the Rings: The Fellowship of the Ring": "tt0120737",
    "The Lord of the Rings: The Two Towers": "tt0167261",
    "The Lord of the Rings: The Return of the King": "tt0167260",
    "Indiana Jones and the Raiders of the Lost Ark:": "tt0082971",
    "Indiana Jones and the Temple of Doom": "tt0087469",
    "Indiana Jones and the Last Crusade": "tt0097576",
    "Beverly Hills Cop": "tt0086960",
    "Beverly Hills Cop II": "tt0092644",
    "Beverly Hills Cop III": "tt0109254",
    "The Terminator": "tt0088247",
    "Terminator 2: Judgment Day": "tt0103064",
    "The Mummy": "tt0120616",
    "The Mummy Returns": "tt0209163",
    "2012": "tt1190080",
    "Independence Day": "tt0116629",
}

TITLE_TRANSLATOR_DICTIONARY = {
    "Finding Nemo": "Findet Nemo",
    "The Incredibles": "Die Unglaublichen",
    "Monsters, Inc.": "Die Monster AG",
    "The Princess and the Frog": "Küss den Frosch",
    "The Lion King": "Der König der Löwen",
    "Frozen": "Die Eiskönigin",
    "Frozen II": "Die Eiskönigin II",
    "Tangled": "Rapunzel",
    "Moana": "Vaiana",
    "Pirates of the Caribbean: The Curse of the Black Pearl": "Fluch der Karibik",
    "Star Wars: Episode I - The Phantom Menace": "Star Wars: Episode I - Eine Dunkle Bedrohung",
    "Star Wars: Episode II - Attack of the Clones": "Star Wars: Episode II - Angriff der Klonkrieger",
    "Star Wars: Episode III - Revenge of the Sith": "Star Wars: Episode III - Die Rache der Sith",
    "Star Wars: Episode IV - A New Hope": "Star Wars: Episode IV - Eine Neue Hoffnung",
    "Star Wars: Episode V - The Empire Strikes Back": "Star Wars: Episode V - Das Emperium Schlägt Zurück",
    "Star Wars: Episode VI - Return of the Jedi": "Star Wars: Episode VI - Die Rückkehr der Jedi",
    "Harry Potter and the Sorcerer's Stone": "Harry Potter und der Stein der Weisen",
    "Harry Potter and the Philosopher's Stone": "Harry Potter und der Stein der Weisen",
    "Harry Potter and the Chamber of Secrets": "Harry Potter und die Kammer des Schreckens",
    "Harry Potter and the Prisoner of Azkaban": "Harry Potter und der Gefangene aus Askaban",
    "Harry Potter and the Goblet of Fire": "Harry Potter und der Feuerkelch",
    "Harry Potter and the Order of the Phoenix": "Harry Potter und Orden des Phoenix",
    "Harry Potter and the Half-Blood Prince": "Harry Potter und der Halblutprinz",
    "Harry Potter and the Deathly Hallows: Part 1": "Harry Potter und die Heiligtümer des Todes: Teil 1",
    "Harry Potter and the Deathly Hallows: Part 2": "Harry Potter und die Heiligtümer des Todes: Teil 2",
    "The Lord of the Rings: The Fellowship of the Ring": "Der Herr der Ringe: Die Gefährten",
    "The Lord of the Rings: The Two Towers": "Der Herr der Ringe: Die Zwei Türme",
    "The Lord of the Rings: The Return of the King": "Der Herr der Ringe: Die Rükkehr des Königs",
    "Indiana Jones and the Raiders of the Lost Ark:": "Indiana Jones und der Jäger des Verlorenen Schatzes",
    "Raiders of the Lost Ark": "Indiana Jones und der Jäger des Verlorenen Schatzes",
    "Indiana Jones and the Temple of Doom": "Indiana Jones und der Tempel des Todes",
    "Indiana Jones and the Last Crusade": "Indiana Jones und der Letzte Kreuzzug",
    "The Terminator": "Der Terminator",
    "The Mummy": "Die Mumie",
    "The Mummy Returns": "Die Mumie kehrt zurück",
}
