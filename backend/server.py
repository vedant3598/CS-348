from flask import Flask
from backend_sql import get_medals_for_country

# set up flask app
app = Flask(__name__)

# api endpoint to get all the countries and their total medal counts
@app.route("/medals", methods=["GET"])
def get_all_medals():
    
    return get_medals_for_country()

app.run(host='localhost', port=5000)