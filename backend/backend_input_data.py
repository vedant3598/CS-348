import sys
import csv
import os
from backend_sql import insert_athlete, insert_country, insert_friends, insert_event, insert_games, insert_participates, insert_selects, insert_user


def fill_sample_users():
    users = [(200_000, 'Adil', 'K', 'Canada', 'a\@gmail.com', 'adil', 'password'),
             (200_001, 'Cameron', 'S', 'Canada',
              'c\@gmail.com', 'cam', 'password'),
             (200_002, 'Jay', 'B', 'Canada', 'j\@gmail.com', 'jay', 'password'),
             (200_003, 'Vedant', 'S', 'Canada', 'v\@gmail.com', 'ved', 'password'),
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


def fill_athletes(num_read=-1):
    '''Takes in a number of fields to read from the csv, if no field is supplied read the entire CSV'''
    file = open(os.path.join(os.path.dirname(
        __file__), './data/athlete_events.csv'))
    csvreader = csv.reader(file)
    next(csvreader)  # read header
    for (aid, name, sex, age, height, weight, country, noc, games, year, season, city, sport, event, medal) in csvreader:
        print(aid, name, sex, age, height, weight, country, noc,
              games, year, season, city, sport, event, medal)

        name = escape_name(name)
        *first_name_list, surname = name.split(" ")
        first_name = " ".join(first_name_list)

        event = escape_name(event)
        country = escape_name(country)
        city = escape_name(city)
        sport = escape_name(sport)

        insert_event(event, sport, ignore=True)
        insert_games(year, season, city, ignore=True)
        insert_country(country, noc, ignore=True)
        insert_athlete(aid, first_name.replace("\'", "\'\'"), surname, sex,
                       val_or_null(age), val_or_null(height), val_or_null(weight), country, ignore=True)
        insert_participates(aid, event, year, season,
                            medal if medal != "NA" else None, ignore=True)

        num_read -= 1
        if (num_read == 0):
            return

    return


if (__name__ == "__main__"):
    fill_athletes(int(sys.argv[1]))
