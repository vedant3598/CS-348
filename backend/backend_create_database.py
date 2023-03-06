import mysql.connector

mydb = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    port='3306',
)

mycursor = mydb.cursor()

# Create database olympics
mycursor.execute("CREATE DATABASE olympics")
mycursor.execute("SHOW DATABASES")

for db in mycursor:
    print(db[0])

mydb.commit()
