import mysql.connector

mydb = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    port='3306',
    database="olympics"
)

mycursor = mydb.cursor()


def get_medals_for_country():
    mycursor.execute("select country, COUNT(*) as medal_count from Athlete inner join Participates on Athlete.id = "
                     "Participates.athlete_id where medal_achieved is not null group by country order by medal_count "
                     "desc")

    result = mycursor.fetchall()
    return result


def get_medals_for_athlete(athlete_id):
    mycursor.execute("create view athlete_bronze as select COUNT(*) as count_bronze from Athlete inner join "
                     "Participates on Athlete.id = Participates.athlete_id where medal_achieved = 'bronze' and "
                     "Athlete.id = {}".format(athlete_id))

    mycursor.execute("create view athlete_bronze as select COUNT(*) as count_bronze from Athlete inner join "
                     "Participates on Athlete.id = Participates.athlete_id where medal_achieved = 'silver' and "
                     "Athlete.id = {}".format(athlete_id))

    mycursor.execute("create view athlete_bronze as select COUNT(*) as count_bronze from Athlete inner join "
                     "Participates on Athlete.id = Participates.athlete_id where medal_achieved = 'gold' and "
                     "Athlete.id = {}".format(athlete_id))

    mycursor.execute("select * from athlete_bronze, athlete_silver, athlete_gold")

    athlete_medals_result = mycursor.fetchall()
    return athlete_medals_result


def get_athletes_by_country(country):
    mycursor.execute("select * from Athlete where country = {}".format(country))
    result = mycursor.fetchall()
    return result


def get_athlete(athlete_id):
    mycursor.execute("select * from Athlete where athlete_id = {}".format(athlete_id))
    result = mycursor.fetchall()
    return result


def get_athletes_by_year_season(year, season):
    mycursor.execute("select * from Games, Participates, Athlete where (year, season) = ({}, {}) group by "
                     "Athletes.country".format(year, season))
    result = mycursor.fetchall()
    return result


def select_athletes_events():
    mycursor.execute("select athlete_id, event_name from Participates order by athlete_id desc")
    result = mycursor.fetchall()
    return result


def delete_athlete_from_user(user_id, athlete_id):
    mycursor.execute("delete from Selects where user_id = {} and athlete_id = {}".format(user_id, athlete_id))
    # check if result is deleted
    result = mycursor.fetchall()
    return result


def insert_athlete_into_user(user_id, athlete_id):
    mycursor.execute("insert into Selects values ({}, {})".format(user_id, athlete_id))
    # check if result is inserted
    result = mycursor.fetchall()
    return result


def find_event_max_participation():
    mycursor.execute("select event_name, COUNT(*) as event_participants from Event inner join Participates on "
                     "Event.event_name = Participates.event_name group by event_name order by event_participants desc"
                     " limit 1")
    result = mycursor.fetchall()
    return result


def get_max_medals_athlete():
    mycursor.execute("create view athlete_medal_count as select *, COUNT(*) as num_medals from Athlete, Participates "
                     "where Athlete.id = Participates.athlete_id and Participates.medal_achieved is not null group by"
                     " Athlete.id")

    mycursor.execute("select event_name, athlete_name, max(num_medals) as medal_count from athlete_medal_count group "
                     "by athlete_medals.event_name order by most_medals desc")

    result = mycursor.fetchall()
    return result


def insert_user(id, first_name, surname, fav_country, email, username, password):
    mycursor.execute("insert into User values ({}, {}, {}, {}, {}, {}, {})".format(id, first_name, surname, fav_country, email, username, password))
    # check if result is inserted
    result = mycursor.fetchall()
    return result


def insert_event(event_name, sport):
    mycursor.execute("insert into Event values ({}, {})".format(event_name, sport))
    # check if result is inserted
    result = mycursor.fetchall()
    return result


def insert_games(year, season, city):
    mycursor.execute("insert into Games values ({}, {}, {})".format(year, season, city))
    # check if result is inserted
    result = mycursor.fetchall()
    return result


def insert_country(name, country_code):
    mycursor.execute("insert into Country values ({}, {})".format(name, country_code))
    # check if result is inserted
    result = mycursor.fetchall()
    return result


def insert_athlete(id, first_name, surname, age, height, weight, gold_medals, silver_medals, bronze_medals, country):
    mycursor.execute("insert into Country values ({}, {}, {}, {}, {}, {}, {}, {}, {}, {})".format(id, first_name, surname, age, height, weight, gold_medals, silver_medals, bronze_medals, country))
    # check if result is inserted
    result = mycursor.fetchall()
    return result


def insert_selects(user_id, athlete_id):
    mycursor.execute("insert into Selects values ({}, {})".format(user_id, athlete_id))
    # check if result is inserted
    result = mycursor.fetchall()
    return result


def insert_friends(user_id, friend_id):
    mycursor.execute("insert into Selects values ({}, {})".format(user_id, friend_id))
    # check if result is inserted
    result = mycursor.fetchall()
    return result


def insert_participates(athlete_id, event_name, year, season, medal_achieved):
    mycursor.execute("insert into Participates values ({}, {}, {}, {}, {})".format(athlete_id, event_name, year, season, medal_achieved))
    # check if result is inserted
    result = mycursor.fetchall()
    return result
