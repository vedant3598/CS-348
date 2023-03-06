from flask import Flask, request
from backend_sql import get_medals_for_country, get_athletes_by_country

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


app.run(host='localhost', port=5000)