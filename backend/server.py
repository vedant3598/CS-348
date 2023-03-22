from flask import Flask, request
from backend_sql import *
from flask_cors import CORS
import json

# Set up flask app
app = Flask(__name__)
CORS(app)


def to_json(func):
    def wrapper(*args, **kwargs):
        return json.dumps(func(*args, **kwargs))
    wrapper.__name__ = func.__name__
    return wrapper

# Get all the countries and their total medal counts


@app.route("/country-medals", methods=["GET"])
def get_all_medals():
    return get_medals_for_country()


# Get country information
@app.route("/country", methods=["GET"])
@to_json
def get_country_route():
    return get_country(request.args.get('country'))[0]

# Get all the athletes by country


@app.route("/country-athletes", methods=["GET"])
@to_json
def get_athlete_medals():
    return get_athletes_by_country(request.args.get('country'))


# Get all countries
@app.route("/countries", methods=["GET"])
def get_countries():
    return select_countries()


# Get data for an athlete
@app.route("/athlete", methods=["GET"])
def get_athlete_data():
    athlete_id = request.args.get('athlete_id')
    athlete_data = get_athlete(athlete_id)
    athlete_medal_count = get_medals_for_athlete(athlete_id)
    return {**(athlete_data[0]), **(athlete_medal_count[0])}


# Insert a friend for user; trigger will be activated if friend_id does not exist
@app.route("/insert-friend", methods=["POST"])
def insert_friend():
    data = request.form
    user_id = data['user_id']
    friend_id = data['friend_id']
    insert_friends(user_id, friend_id)


# Favourite an athlete
@app.route("/favourite-athlete", methods=["POST"])
def insert_favourite_athlete():
    data = request.form
    user_id = data['user_id']
    athlete_id = data['athlete_id']
    insert_favourites(user_id, athlete_id)
    return "Favourited!"

# Get user's friends


@app.route("/friends", methods=["GET"])
def get_user_friends():
    user_id = request.args.get('user_id')
    return select_friends(user_id)


# Get medal stats for all athletes
@app.route("/medal-stats", methods=["GET"])
@to_json
def get_medal_stats():
    return get_medals_for_athletes(request.args.get('country'))

# Get all the super-fans for a selected country


@app.route("/country-super-fans", methods=["GET"])
def get_country_super_fans():
    country = request.args.get('country')
    super_fans = get_super_fans(country)
    return super_fans


# Get all information about medals and events for a selected country
@app.route("/country-event-stats", methods=["GET"])
def get_country_event_stats():
    country = request.args.get('country')
    event_stats = event_stats_per_country(country)
    return event_stats


# Get country performance and athletes participated for selected country
@app.route("/country-stats", methods=["GET"])
def get_country_stats():
    country = request.args.get('country')
    country_stats = stats_per_country(country)
    return country_stats[0]


# Get athlete who has won the most medals for each event
@app.route("/max-medals-athlete", methods=["GET"])
def get_max_medal_athlete_event():
    return get_max_medals_athlete()


# Deselect athlete from user
@app.route("/delete-user-selected-athlete", methods=["POST"])
def delete_user_selected_athlete():
    data = request.form
    user_id = data['user_id']
    athlete_id = data['athlete_id']
    delete_athlete_from_user(user_id, athlete_id)
    return f"{user_id} remove {athlete_id}"


# Insert new user
@app.route("/insert-new-user", methods=["POST"])
def insert_new_user():
    data = request.form
    first_name = data['first_name']
    surname = data['surname']
    fav_country = data['fav_country']
    email = data['email']
    username = data['username']
    password = data['password']

    insert_user(first_name, surname, fav_country,
                email, username, password)

    return f"User {first_name} {surname} added"

# Delete existing user


@app.route("/delete-user", methods=["POST"])
def delete_existing_user():
    data = request.form
    user_id = data['user_id']
    delete_user(user_id)
    return f"{user_id} deleted"


# Search the majority of the data using a single string
@app.route("/search", methods=["GET"])
def search():
    query_string = request.args.get('query')
    return search_DB(query_string)


@app.route("/")
def welcome():
    return 'CS-348 Backend Server'


app.run(host='localhost', port=5000, debug=True)
