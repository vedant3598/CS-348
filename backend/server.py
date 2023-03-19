from flask import Flask, request
from backend_sql import *

# Set up flask app
app = Flask(__name__)


# Get all the countries and their total medal counts
@app.route("/country-medals", methods=["GET"])
def get_all_medals():
    return get_medals_for_country()


# Get all the athletes by country
@app.route("/country-athletes", methods=["GET"])
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
    return athlete_data, athlete_medal_count


# Insert a friend for user; trigger will be activated if friend_id does not exist
@app.route("/insert-friend", methods=["POST"])
def insert_friend():
    user_id = request.args.get('user_id')
    friend_id = request.args.get('friend_id')
    insert_friends(user_id, friend_id)


# Favourite an athlete
@app.route("/favourite-athlete", methods=["POST"])
def insert_favourite_athlete():
    user_id = request.args.get('user_id')
    athlete_id = request.args.get('athlete_id')
    insert_selects(user_id, athlete_id)


# Get user's friends
@app.route("/friends", methods=["GET"])
def get_user_friends():
    user_id = request.args.get('user_id')
    return select_friends(user_id)


# Get medal stats for all athletes
@app.route("/medal-stats", methods=["GET"])
def get_medal_stats():
    return get_medals_for_athletes()


# Get athletes stats for selected country
@app.route("/country-stats", methods=["GET"])
def get_country_athlete_stats():
    country = request.args.get('country')
    country_stats = stats_per_country(country)
    athletes = get_athletes_by_country(country)
    return country_stats, athletes


# Get all the super-fans for a selected country
@app.route("/country-super-fans", methods=["GET"])
def get_country_super_fans():
    country = request.args.get('country')
    super_fans = get_super_fans(country)
    return super_fans


# Get all information about medals and events for a selected country
def get_country_event_stats():
    country = request.args.get('country')
    event_stats = event_stats_per_country(country)
    return event_stats


# Get country performance and athletes participated for selected country
@app.route("/country-stats", methods=["GET"])
def get_country_stats():
    country = request.args.get('country')
    country_stats = stats_per_country(country)
    athletes = get_athletes_by_country(country)
    super_fans = get_super_fans(country)
    return country_stats, athletes, super_fans


# Get athlete who has won the most medals for each event
@app.route("/max-medals-athlete", methods=["GET"])
def get_max_medal_athlete_event():
    return get_max_medals_athlete()


# Deselect athlete from user
@app.route("/delete-user-selected-athlete", methods=["POST"])
def delete_user_selected_athlete():
    user_id = request.args.get('user_id')
    athlete_id = request.args.get('athlete_id')
    delete_athlete_from_user(user_id, athlete_id)


# Insert new user
@app.route("/insert-new-user", methods=["POST"])
def insert_new_user():
    user_id = request.args.get('user_id')
    first_name = request.args.get('first_name')
    surname = request.args.get('surname')
    fav_country = request.args.get('fav_country')
    email = request.args.get('email')
    username = request.args.get('username')
    password = request.args.get('password')

    if not (user_id and first_name and surname and fav_country and email and username and password):
        ignore = True
    else:
        ignore = False
    insert_user(user_id, first_name, surname, fav_country,
                email, username, password, ignore)

# Delete existing user


@app.route("/delete-user", methods=["POST"])
def delete_existing_user():
    user_id = request.args.get('user_id')
    delete_user(user_id)


# Search the majority of the data using a single string
@app.route("/search", methods=["GET"])
def search():
    query_string = request.args.get('query')
    return search_DB(query_string)


@app.route("/")
def welcome():
    return 'CS-348 Backend Server'


app.run(host='localhost', port=5000, debug=True)
