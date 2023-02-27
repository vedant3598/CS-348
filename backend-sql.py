import mysql.connector

mydb = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    port='3306',
    database="olympics"
)
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
mycursor = mydb.cursor()


def select_medals_for_country():
    mycursor.execute("select country, COUNT(*) as medal_count from Athlete inner join Participates on Athlete.id = "
                     "Participates.athlete_id where medal_achieved is not null group by country order by medal_count "
                     "desc")

    result = mycursor.fetchall()
    return result


def select_medals_for_athlete(athlete_id):
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


def select_athletes_by_country(country):
    mycursor.execute("select * from Athlete where country = {}".format(country))
    result = mycursor.fetchall()
    return result


def select_athlete(athlete_id):
    mycursor.execute("select * from Athlete where athlete_id = {}".format(athlete_id))
    result = mycursor.fetchall()
    return result


def select_athletes_by_year_season(year, season):
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
    # check if result is deleted
    result = mycursor.fetchall()
    return result


def find_event_max_participation():
    mycursor.execute("select event_name, COUNT(*) as event_participants from Event inner join Participates on "
                     "Event.event_name = Participates.event_name group by event_name order by event_participants desc"
                     " limit 1")
    result = mycursor.fetchall()
    return result

