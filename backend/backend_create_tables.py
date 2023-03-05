import mysql.connector

mydb = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    port='3306',
    database="olympics"
)

mycursor = mydb.cursor()

mycursor.execute("CREATE TABLE User (id VARCHAR(255), first_name VARCHAR(255), surname VARCHAR(255), "
                 "fav_country VARCHAR(255), email VARCHAR(255), username VARCHAR(255), password VARCHAR(255), "
                 "PRIMARY KEY (id))")

mycursor.execute(
    "CREATE TABLE Event (event_name VARCHAR(255), sport VARCHAR(255), PRIMARY KEY(event_name))")

mycursor.execute("CREATE TABLE Games (year INT, season VARCHAR(10) CHECK(season = 'Winter' OR season = 'Summer'), "
                 "city VARCHAR(255), PRIMARY KEY(year, season))")

mycursor.execute(
    "CREATE TABLE Country (name VARCHAR(255), country_code VARCHAR(10), PRIMARY KEY(name))")

mycursor.execute("CREATE TABLE Athlete (id VARCHAR(255), first_name VARCHAR(255), surname VARCHAR(255), "
                 "sex CHAR(1) CHECK(sex = 'M' OR sex = 'F'), age INT, height INT NULL, weight INT NULL, "
                 "country VARCHAR(255), PRIMARY KEY (id), FOREIGN KEY (country) REFERENCES Country(name))")

mycursor.execute("CREATE TABLE Selects (user_id VARCHAR(255), athlete_id VARCHAR(255), PRIMARY KEY(user_id, "
                 "athlete_id), FOREIGN KEY (user_id) REFERENCES User(id), FOREIGN KEY(athlete_id) REFERENCES "
                 "Athlete(id))")

mycursor.execute("CREATE TABLE Friends (user_id VARCHAR(255), friend_id VARCHAR(255), PRIMARY KEY(user_id, "
                 "friend_id), FOREIGN KEY(user_id) REFERENCES "
                 "User(id))")

mycursor.execute("CREATE TABLE Participates (athlete_id VARCHAR(255), event_name VARCHAR(255), year INT, "
                 "season VARCHAR(10), medal_achieved VARCHAR(10) CHECK(medal_achieved = 'bronze' OR medal_achieved = "
                 "'silver' OR medal_achieved = 'gold' OR medal_achieved is null), PRIMARY KEY(athlete_id, event_name, "
                 "year, season), FOREIGN KEY(athlete_id) REFERENCES Athlete(id), FOREIGN KEY(event_name) REFERENCES "
                 "Event(event_name), FOREIGN KEY(year, season) REFERENCES Games(year, season))")

mycursor.execute("SHOW TABLES")

for x in mycursor:
    print(x)

mydb.commit()
