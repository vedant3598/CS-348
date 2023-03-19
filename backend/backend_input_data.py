import sys
import csv
import os
import mysql.connector
from backend_sql import insert_friends, insert_favourites, insert_user


def fill_sample_users():
    users = [('Adil', 'K', 'USA', 'a@gmail.com', 'adil', 'password'),
             ('Cameron', 'S', 'USA', 'c@gmail.com', 'cam', 'password'),
             ('Jay', 'B', 'USA', 'j@gmail.com', 'jay', 'password'),
             ('Vedant', 'S', 'USA', 'v@gmail.com', 'ved', 'password'),
             ]

    favourites = [(1, 1), (1, 2), (2, 3), (2, 4), (3, 5), (3, 6), (3, 7),
                  (4, 1), (4, 2), (4, 3), (4, 4), (4, 5), (4, 6), (4, 7)]

    friends = [(1, 2), (1, 3), (1, 4),
               (2, 1), (2, 3), (2, 4),
               (3, 1), (3, 2), (3, 4),
               (4, 1), (4, 2), (4, 3)]

    for first_name, last_name, fav_country, email, username, password in users:
        print(first_name, last_name, fav_country, email, username, password)
        insert_user(first_name, last_name, fav_country,
                    email, username, password)

    for uid, aid in favourites:
        print(uid, aid)
        insert_favourites(uid, aid)

    for uid, fid in friends:
        print(uid, fid)
        insert_friends(uid, fid)


def escape_name(s):
    return s.replace("\'", "\'\'")


def val_or_null(value):
    return value if value != "NA" else 'NULL'


def insertIntoTables(events, games, countries, athletes, participates):
    mydb = mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        port='3306',
        database="olympics"
    )

    mydb.autocommit = True
    mycursor = mydb.cursor()

    print("Inputting data this could take up to 1 minute.")

    allEvents = ", ".join(events)
    allGames = ", ".join(games)
    allCountries = ", ".join(countries)
    allAthletes = ", ".join(athletes)
    allParticipates = ", ".join(participates)
    mycursor.execute(f"insert IGNORE into Event values {allEvents}")
    mycursor.execute(f"insert IGNORE into Games values {allGames}")
    mycursor.execute(f"insert IGNORE into Country values {allCountries}")
    mycursor.execute(f"insert IGNORE into Athlete values {allAthletes}")
    mycursor.execute(
        f"insert IGNORE into Participates values {allParticipates}")


def fill_athletes(num_read=-1):
    '''Takes in a number of fields to read from the csv, if no field is supplied read the entire CSV'''
    file = open(os.path.join(os.path.dirname(
        __file__), './data/athlete_events.csv'))
    csvreader = csv.reader(file)
    next(csvreader)  # read header
    events = []
    games = []
    countries = []
    athletes = []
    participates = []
    for (aid, name, sex, age, height, weight, country, noc, gamesName, year, season, city, sport, event, medal) in csvreader:
        name = escape_name(name)
        *first_name_list, surname = name.split(" ")
        first_name = " ".join(first_name_list)

        first_name = first_name.replace("\'", "\'\'")
        age = val_or_null(age)
        height = val_or_null(height)
        weight = val_or_null(weight)

        event = escape_name(event)
        country = escape_name(country)
        city = escape_name(city)
        sport = escape_name(sport)

        events += [f"('{event}', '{sport}')"]
        games += [f"({year}, '{season}', '{city}')"]
        countries += [f"('{country}', '{noc}')"]
        athletes += [f"({aid}, '{first_name}', '{surname}', '{sex}', {age}, {height}, {weight}, '{noc}')"]
        if (medal == "NA"):
            participates += [f"({aid}, '{event}', {year}, '{season}', NULL)"]
        else:
            participates += [f"({aid}, '{event}', {year}, '{season}', '{medal}')"]

        num_read -= 1
        if (num_read == 0):
            insertIntoTables(events, games, countries, athletes, participates)
            return
    insertIntoTables(events, games, countries, athletes, participates)
    return


if (__name__ == "__main__"):
    fill_athletes(int(sys.argv[1]))
