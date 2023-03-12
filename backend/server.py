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


# Insert a friend for user
@app.route("/insert-friend", methods=["POST"])
def insert_friend():
    user_id = request.args.get('user_id')
    friend_id = request.args.get('friend_id')
    insert_friends(user_id, friend_id)


# Favourite an athlete
@app.route("/favourite-athlete", methods=["POST"])
def favourite_athlete():
    user_id = request.args.get('user_id')
    athlete_id = request.args.get('athlete_id')
    insert_selects(user_id, athlete_id)


# Get user's friends
@app.route("/friends", methods=["GET"])
def favourite_athlete():
    user_id = request.args.get('user_id')
    return select_friends(user_id)


# Get all user’s friends
app.run(host='localhost', port=5000)
