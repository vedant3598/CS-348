import sys
import csv
from backend_sql import insert_athlete, insert_country, insert_event, insert_games, insert_participates


def fill_db(num_read=-1):
    '''Takes in a number of fields to read from the csv, if no field is supplied read the entire CSV'''
    file = open('./data/athlete_events.csv')
    csvreader = csv.reader(file)
    next(csvreader)  # read header

    rows = []
    for (aid, name, sex, age, height, weight, country, noc, games, year, season, city, sport, event, medal) in csvreader:
        print(aid, name, sex, age, height, weight, country, noc,
              games, year, season, city, sport, event, medal)

        *first_name_list, surname = name.split(" ")
        first_name = " ".join(first_name_list)

        event_escaped = event.replace("\'", "\'\'")

        insert_event(event_escaped, sport)
        insert_games(year, season, city)
        insert_country(country, noc)
        insert_athlete(aid, first_name.replace("\'", "\'\'"), surname, sex,
                       age, height if height != "NA" else 'NULL', weight if weight != "NA" else 'NULL', country)
        insert_participates(aid, event_escaped, year, season,
                            medal if medal != "NA" else None)

        num_read -= 1
        if (num_read == 0):
            return

    return


if (__name__ == "__main__"):
    fill_db(int(sys.argv[1]))
