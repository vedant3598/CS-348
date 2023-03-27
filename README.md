# CS 348 Final Project

An olympics database driven application.

Team members: Adil Kapadia, Cameron Shum, Jay Bhagat, Vedant Shah

## Pre-requisites

The following need to be installed prior to using this application:
1. MySQL
2. Python3
3. yarn

## Installation

Run the following command to install the project.
```
git clone git@github.com:vedant3598/CS-348.git
```

Then, to install the packages, run:
```
python3 -m venv backend/.venv
source backend/.venv/bin/activate
pip install -r backend/requirements.txt
```

If the pip install fails, follow the instructions [here](https://stackoverflow.com/questions/35190465/virtualenvpython3-4-pip-install-mysqlclient-error) to fix it.

## Set-up 
Only one of the sample database and production database can be loaded at one time. In order to load the other one, the `olympic` database needs to be dropped. It is **recommended** to do implementation testing on the production database.
### Sample Database

To set up the sample database, make sure MySQL is installed. Then run:
```
cd backend
python3 backend_init_sample.py
```

### Production Database

To set up the production database, make sure MySQL is installed. Then run:
```
cd backend
python3 backend_init_production.py
```


## Running the server

To run the server, complete the commands above and then run:
```
cd backend
python3 server.py
```

## Starting the Frontend

In a different terminal run:
```
cd frontend
yarn
yarn start
```

## Features

The current SQL queries that are coded are the following. Only the ones with an asterisk (*) beside them have actual server endpoints created for them.
1. Getting a count of the total medals won for each country.*
1. Getting the medals won for a given athlete. *
1. Getting all the athletes for a given country. *
1. Getting the athlete from the athlete ID. *
1. Getting all the events that an athlete plays. *
1. Deleting an athlete from a user. *
1. Inserting an athlete to a user. *
1. Getting the athlete that won the maximum number of medals per event. *
1. Adding a user, event, game, country, athlete, user favourites, user friends, athlete participates. *
1. Getting the stats per country. *

## C2 - SQL code (create tables, etc)
These can be found in /backend. The ones that handle creating the database and all relevant pieces are contained in:

* backend_create_database.py
* backend_create_tables.py

## C3 - SQL queries for features, test-sample.sql, test-sample.out
These can be found in /backend/sample-queries. These are the features (R6-R11) ran against the sample database.

## C4 - SQL queries for features, test-production.sql, test-production.out
These can be found in /backend/production-queries. These are the features (R6-R11) ran against the production database.

## C5 - Application Code
The application code for the backend is stored in:
* backend_sql.py
* server.py

The application code for the frontend is stored in /frontend. The frontend calls the backend server endpoints locally.
