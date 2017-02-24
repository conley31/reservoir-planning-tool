#!/usr/bin/python

import MySQLdb as db
import csv, json, time, sys, os.path
from sql_statements import *

with open('../config/config.json') as json_data:
    config = json.load(json_data)

host = config.get("mysql").get("host")
user = config.get("mysql").get("user")
password = config.get("mysql").get("password")
database = config.get("mysql").get("database")
log_location = config.get("mysql").get("logLocation")

def toStrDate(year, month, day):
  return (year + "-" + month + "-" + day)

def ParseDailyData(table_id, textFile):
  with open('daily_files/' + textFile, 'rb') as csvfile:
    stream = csv.reader(csvfile, delimiter=',')
    for row in stream:
      date = toStrDate(row[0],row[1],row[2])
      cur.execute(insert.format(table_id, date, row[3], row[4], row[5]))
      con.commit()

try:
  log = open(log_location, "wb+")
except IOError as err:
  print("IO error: {0}".format(err))
  log.write("IO error: {0}".format(err))
  sys.exit(1)

stream = csv.reader(log, delimiter='>')
for row in stream:
  if row[0] == 'CREATED':
    print("Database already created. Exiting...")
    sys.exit(1)

con = db.connect(host, user, password, database)
cur = con.cursor()

with open('index.csv', 'rb') as csvfile:
  stream = csv.reader(csvfile, delimiter=',')
  for row in stream:
    cur.execute(make_table.format(row[0]))
    ParseDailyData(row[0], row[4])
    print "Created Table: Location{}".format(row[0])
   
if con:
  con.commit()
  con.close()

log.write("CREATED>" + time.strftime("%c") + "\n")
