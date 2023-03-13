import sys
import csv
import os
import mysql.connector
from backend_sql import insert_friends, insert_selects, insert_user


def fill_sample_users():
    users = [(200_000, 'Adil', 'K', 'Canada', 'a@gmail.com', 'adil', 'password'),
             (200_001, 'Cameron', 'S', 'Canada',
              'c@gmail.com', 'cam', 'password'),
             (200_002, 'Jay', 'B', 'Canada', 'j@gmail.com', 'jay', 'password'),
             (200_003, 'Vedant', 'S', 'Canada', 'v@gmail.com', 'ved', 'password'),
             ]

    selects = [(200_000, 1), (200_000, 2), (200_001, 3), (200_001, 4), (200_002, 5), (200_002, 6), (200_002, 7),
               (200_003, 1), (200_003, 2), (200_003, 3), (200_003, 4), (200_003, 5), (200_003, 6), (200_003, 7)]

    friends = [(200_000, 200_001), (200_000, 200_002), (200_000, 200_003),
               (200_001, 200_000), (200_001, 200_002), (200_001, 200_003),
               (200_002, 200_000), (200_002, 200_001), (200_002, 200_003),
               (200_003, 200_000), (200_003, 200_001), (200_003, 200_002)]

    for uid, first_name, last_name, fav_country, email, username, password in users:
        print(uid, first_name, last_name, fav_country, email, username, password)
        insert_user(uid, first_name, last_name, fav_country,
                    email, username, password, ignore=True)

    for uid, aid in selects:
        print(uid, aid)
        insert_selects(uid, aid, ignore=True)

    for uid, fid in friends:
        print(uid, fid)
        insert_friends(uid, fid, ignore=True)


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
