#!/usr/bin/python

import MySQLdb as db
import json, os
from sql_statements import *

with open('../config/config.json') as json_data:
    config = json.load(json_data)

host = config.get("mysql").get("host")
user = config.get("mysql").get("user")
password = config.get("mysql").get("password")
database = config.get("mysql").get("database")
log_location = config.get("mysql").get("logLocation")

try:
  os.remove(log_location)
except OSError as err:
  print("OS error: {0}".format(err))
  sys.exit(1)

con = db.connect(host, user, password, database)
cur = con.cursor()

print("Preparing to drop database: {}".format(database))
cur.execute(drop_database.format(database))
print("{} database has been dropped.".format(database))

if con:
  con.commit()
  con.close()
