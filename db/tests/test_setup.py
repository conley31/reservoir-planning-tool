import csv, json, time, sys, os.path
from nose.tools import assert_equals
from db import sql_statements
import MySQLdb as db

with open('../../config/config.json') as json_data:
    config = json.load(json_data)

host = config.get("mysql").get("host")
user = config.get("mysql").get("user")
password = config.get("mysql").get("password")
database = config.get("mysql").get("database")
log_location = config.get("mysql").get("logLocation")

con = db.connect(host, user, password, database)
cur = con.cursor()

def get_table_name(input):
    return input[0]

def test_tables():
    cur.execute(sql_statements.show_tables)
    tables = cur.fetchall()
    table_names = map(get_table_name, tables)
    print(table_names)
    with open('../index.csv', 'rb') as csvfile:
        stream = csv.reader(csvfile, delimiter=',')
        for row in stream:
            assert(str('Location' + row[0]) in table_names)

    if con:
      con.commit()
      con.close()
