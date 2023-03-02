# CS 348 Final Project

An olympics database driven application.

Team members: Adil Kapadia, Cameron Shum, Jay Bhagat, Vedant Shah

## Pre-requistes

The following need to be installed prior to using this application:
1. MySQL
2. Python3

## Installation

Run the following command to install the project.
```
git clone git@github.com:vedant3598/CS-348.git
```

Then, to install the packages, run:
```
source backend/env/bin/activate
pip install -r backend/requirements.txt
```

## Set-up

To set up the database, make sure MySQL is installed. Then run:
```
cd backend
python3 backend_create_database.py
python3 backend_create_tables.py
```

### Adding sample data

To add sample data to the database, run the following:
```
python3 backend_init_data.py [num_of_columns_to_add]
```

## Running the server

To run the server, complete the commands above and then run:
```
cd backend
python3 server.py
```

## Features

The current SQL queries that are coded are the following. Only the ones with an asterisk (*) beside them have actual server endpoints created for them.
1. Getting a count of the total medals won for each country.*
2. Getting the medals won for a given athlete.
3. Getting all the athletes for a given country.
4. Getting the athlete from the athlete ID.
5. Getting all the athletes that play at a specific year and season.
6. Getting all the events that an athlete plays.
7. Deleting an athlete from a user.
8. Inserting an athlete to a user.
9. Find the event that has the maximum number of athletes participating.
10. Getting the athlete that won the maximum number of medals per event.
11. Adding a user, event, game, country, athlete, user selects, user friends, athlete participates.
12. Trigger to rollback a friend request if the friend does not exist.
13. Getting the stats per country.