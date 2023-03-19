import mysql.connector

mydb = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    port='3306',
    database="olympics"
)

mydb.autocommit = True
mycursor = mydb.cursor(dictionary=True, buffered=True)

# Get medal count for each country


def get_medals_for_country():
    mycursor.execute("select country, COUNT(*) as medal_count from Athlete inner join Participates on Athlete.id = "
                     "Participates.athlete_id where medal_achieved is not null group by country order by medal_count "
                     "desc")

    result = mycursor.fetchall()
    return result


def get_medals_for_athletes():
    mycursor.execute("select *, (select count(*) from Athlete, Participates where Athlete.id = "
                     "Participates.athlete_id and medal_achieved = 'gold' and Athlete.id = A.id) as count_gold, "
                     "(select count(*) from Athlete, Participates where Athlete.id = "
                     "Participates.athlete_id and medal_achieved = 'silver' and Athlete.id = A.id) as count_silver, "
                     "(select count(*) from Athlete, Participates where Athlete.id = Participates.athlete_id and "
                     "medal_achieved = 'bronze' and Athlete.id = A.id) as count_bronze from Athlete as A")

    athletes_medals_result = mycursor.fetchall()
    return athletes_medals_result


# Get bronze, silver, and gold medal count for selected athlete_id
def get_medals_for_athlete(athlete_id):
    mycursor.execute("create view athlete_bronze as select COUNT(*) as count_bronze from Athlete inner join "
                     "Participates on Athlete.id = Participates.athlete_id where medal_achieved = 'bronze' and "
                     "Athlete.id = {}".format(athlete_id))

    mycursor.execute("create view athlete_silver as select COUNT(*) as count_silver from Athlete inner join "
                     "Participates on Athlete.id = Participates.athlete_id where medal_achieved = 'silver' and "
                     "Athlete.id = {}".format(athlete_id))

    mycursor.execute("create view athlete_gold as select COUNT(*) as count_gold from Athlete inner join "
                     "Participates on Athlete.id = Participates.athlete_id where medal_achieved = 'gold' and "
                     "Athlete.id = {}".format(athlete_id))

    mycursor.execute(
        "select * from athlete_bronze, athlete_silver, athlete_gold")

    athlete_medals_result = mycursor.fetchall()

    mycursor.execute("drop view athlete_bronze")
    mycursor.execute("drop view athlete_silver")
    mycursor.execute("drop view athlete_gold")

    print(athlete_medals_result)
    return athlete_medals_result


# Get list of athletes for selected country
def get_athletes_by_country(country):
    mycursor.execute(
        "select * from Athlete where country = \"{}\"".format(country))
    result = mycursor.fetchall()
    return result


# Get list of users who have selected every athlete for selected country
def get_super_fans(country):
    mycursor.execute(
        "select id, first_name, surname from User where not exists (select id from Athlete where country = \"{}\" except "
        "(select athlete_id from Favourites where user_id = User.id))".format(country))
    result = mycursor.fetchall()
    return result


# Get athlete information for selected athlete
def get_athlete(athlete_id):
    mycursor.execute(
        "select * from Athlete where id = {}".format(athlete_id))
    result = mycursor.fetchall()
    return result


# Get all athletes for selected year and season
def get_athletes_by_year_season(year, season):
    mycursor.execute("select * from Games, Participates, Athlete where (year, season) = ({}, {}) group by "
                     "Athlete.country".format(year, season))
    result = mycursor.fetchall()
    return result


# Get all athletes and the events they participated in
def select_athletes_events():
    mycursor.execute(
        "select athlete_id, event_name from Participates order by athlete_id desc")
    result = mycursor.fetchall()
    return result


# Get all countries
def select_countries():
    mycursor.execute(
        "select name, country_code from Country")
    result = mycursor.fetchall()
    return result


# Get user's friends
def select_friends(user_id):
    mycursor.execute(
        "select friend_id from Friends where user_id = {}".format(user_id))
    result = mycursor.fetchall()
    return result


# Delete selected athlete for selected user
def delete_athlete_from_user(user_id, athlete_id):
    mycursor.execute("delete from Favourites where user_id = {} and athlete_id = {}".format(
        user_id, athlete_id))
    return


# Insert selected athlete for selected user
def insert_athlete_into_user(user_id, athlete_id):
    mycursor.execute(
        "insert into Favourites values ({}, {})".format(user_id, athlete_id))
    # check if result is inserted
    result = mycursor.fetchall()
    return result


# Get event and count of participants that participated in each event
def find_event_max_participation():
    mycursor.execute("select event_name, COUNT(*) as event_participants from Event inner join Participates on "
                     "Event.event_name = Participates.event_name group by event_name order by event_participants desc"
                     " limit 1")
    result = mycursor.fetchall()
    return result


# Get max medals and athlete name for each event in Olympic history
def get_max_medals_athlete():
    mycursor.execute("""
    create view athlete_medals as
        select *
        from (
            select id, sum(case when (medal_achieved is null) then 0 else 1 end) as num_medals
            from Athlete join Participates on 
                Athlete.id = Participates.athlete_id 
            group by id
        ) as S join Athlete using(id);
    """)

    mycursor.execute("""
        select id, first_name, surname, country, num_medals, rank() over (order by (num_medals) desc) as medal_rank
        from (
        select id, num_medals
        from athlete_medals
        group by id
        ) as T join Athlete using(id);
    """)

    result = mycursor.fetchall()

    mycursor.execute("drop view athlete_medals")

    return result


# Insert user
def insert_user(first_name, surname, fav_country, email, username, password, ignore=False):
    mycursor.execute(
        f"insert {'IGNORE ' if ignore else ' '}into User (first_name, surname, fav_country, email, username, password) " +
        f"values ('{first_name}', '{surname}', '{fav_country}', '{email}', '{username}', '{password}')")
    return


def delete_user(id):
    mycursor.execute(
        f"delete from Favourites where user_id={id}"
    )
    mycursor.execute(
        f"delete from Friends where user_id={id} or friend_id={id}"
    )
    mycursor.execute(
        f"delete from User where id={id}"
    )
    return


# Insert event
def insert_event(event_name, sport, ignore=False):
    mycursor.execute(
        f"insert {'IGNORE ' if ignore else ' '} into Event values ('{event_name}', '{sport}')")
    return


# Insert game
def insert_games(year, season, city, ignore=False):
    mycursor.execute(
        f"insert {'IGNORE ' if ignore else ' '} into Games values ({year}, '{season}', '{city}')")
    return


# Insert country
def insert_country(name, country_code, ignore=False):
    mycursor.execute(
        f"insert {'IGNORE ' if ignore else ' '} into Country values ('{name}', '{country_code}')")
    return


# Insert athlete
def insert_athlete(id, first_name, surname, sex, age, height, weight, country, ignore=False):
    mycursor.execute(
        f"insert {'IGNORE ' if ignore else ' '} into Athlete values ({id}, '{first_name}', '{surname}', '{sex}', {age}, {height}, {weight}, '{country}')")
    return


# Insert selected athlete id for user id
def insert_favourites(user_id, athlete_id, ignore=False):
    mycursor.execute(
        f"insert {'IGNORE ' if ignore else ' '} into Favourites values ({user_id}, {athlete_id})")
    return


# Insert selected friend id for user id
def insert_friends(user_id, friend_id, ignore=False):
    mycursor.execute(
        f"insert {'IGNORE ' if ignore else ' '} into Friends values ({user_id}, {friend_id})")
    return


# Insert athlete, the event, year, and season in which they participated and medal achieved
def insert_participates(athlete_id, event_name, year, season, medal_achieved, ignore=False):
    if medal_achieved is None:
        mycursor.execute(
            f"insert {'IGNORE ' if ignore else ' '} into Participates values ({athlete_id}, '{event_name}', {year}, '{season}', NULL)")
    else:
        mycursor.execute(
            f"insert {'IGNORE ' if ignore else ' '} into Participates values ({athlete_id}, '{event_name}', {year}, '{season}', '{medal_achieved}')")
    return


# Creates a trigger to ensure that friend id added into Friends table exists; otherwise, rollback insertion
def trigger_rollback_friend(friend_id):
    trigger = "create trigger friend_exists_check after insert on Friends" \
              "referencing new row as nrow" \
              "for each row" \
              "when (nrow.{} not in (select * from User where id = {}))" \
              "begin" \
              "rollback" \
              "end;".format(friend_id, friend_id)

    mycursor.execute(trigger)
    return


def event_stats_per_country(country):
    event_stats_country = "select event_name, count(*) as medals_achieved " \
                          "from Athlete inner join participates on Athlete.id = participates.athlete_id " \
                          "where country=\"{}\" and medal_achieved is not null group by event_name".format(
                              country)
    mycursor.execute(event_stats_country)
    result = mycursor.fetchall()

    return result


# Get average age, height, and weight statistics for specified country
def stats_per_country(country):
    stats_country = "select Country.country_code, avg(age) as avg_age, avg(height) as avg_height, avg(weight) as avg_weight " \
                    "from (Country join Athlete on Country.country_code = Athlete.country) " \
                    "where country = \"{}\" " \
                    "group by Country.country_code".format(country)

    mycursor.execute(stats_country)
    result = mycursor.fetchall()

    return result


# Get a relation that includes all tuples that somehow match the query parameter
def search_DB(query):
    athlete_search = "select id, first_name, surname from Athlete where first_name like '%{}%' or surname like '%{}%' limit 50".format(
        query, query)
    mycursor.execute(athlete_search)
    athlete_result = mycursor.fetchall()
    country_search = "select name, country_code from Country where name like '%{}%' limit 50".format(
        query)
    mycursor.execute(country_search)
    country_result = mycursor.fetchall()
    return {"athlete": athlete_result, "country": country_result}


def get_result():
    result = mycursor.fetchall()
    return result
