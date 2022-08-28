## .env
---

create a .env file and enter the api key which can be acquired at https://rapidapi.com/hub

insert the api key together with this line

`X_RAPID_API_KEY=<api_key>`

note: this is not necessary, if the constant `API_ACCESS` is set to False

## venv
---

create a virtual environment using

`python3 -m venv movienv`,

activate the venv using

`.  movie_env/bin/activate`

and deactivate using

`deactivate`

in the console.

To install all needed requirments use

`pip install -r requirements.txt`


## coverage
---

To create a coverage report write

`coverage run -m pytest`

in the console followed by

`coverage html`.

Then open the index.html inside the htmlcov folder
