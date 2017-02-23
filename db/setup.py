#!/usr/bin/python

import MySQLdb as db
import csv, json, time, sys, os.path
from sql_statements import *

with open('config.json') as json_data:
    config = json.load(json_data)

host = config.get("host")
user = config.get("user")
password = config.get("password")
database = config.get("db")
log_location = config.get("logLocation")

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

def toStrDate(year, month, day):
  return (year + "-" + month + "-" + day)

def ParseDailyData(cur, id, textFile):
  with open(textFile, 'rb') as csvfile:
    stream = csv.reader(csvfile, delimiter=',')
    for row in stream:
      date = toStrDate(row[0],row[1],row[2])
      cur.execute(insert.format(id, date, row[3], row[4], row[5]))

try:
  con = db.connect(host, user, password, database)
  cur = con.cursor()
  with open('index.csv', 'rb') as csvfile:
    stream = csv.reader(csvfile, delimiter=',')
    for row in stream:
      cur.execute(make_table.format(row[0]))
      ParseDailyData(cur, row[0], "daily_files/" + row[4])
      print "Created Table: Location{}".format(row[0])

except db.Error, e:
  print "Error {} - {}".format(e.args[0], e.args[1])
  log.write("Error:" + "{} - {}".format(e.args[0], e.args[1]) + "\n")
  sys.exit(1)
finally:   
  if con:
    con.commit()
    con.close()
  log.write("CREATED>" + time.strftime("%c") + "\n")
