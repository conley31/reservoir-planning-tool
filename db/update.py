#!/usr/bin/python

import MySQLdb as db
import csv, json, datetime, os, sys
from datetime import datetime as dt

with open('config.json') as json_data:
  config = json.load(json_data)

host = config.get("host")
user = config.get("user")
password = config.get("password")
database = config.get("db")
log_location = config.get("logLocation")

check_table = """ SELECT COUNT(*)
            FROM information_schema.tables
            WHERE table_name = '{}';
            """

make_table = """CREATE TABLE IF NOT EXISTS Location{}
              (ID INT NOT NULL AUTO_INCREMENT,
              RecordedDate Date DEFAULT NULL,
              Drainflow FLOAT DEFAULT NULL,
              Precipitation FLOAT DEFAULT NULL,
              PET FLOAT DEFAULT NULL,
              PRIMARY KEY (ID);
              )"""

insert = """INSERT INTO Location{} 
          (RecordedDate, Drainflow, Precipitation, PET)
          VALUES (STR_TO_DATE('{}', '%Y-%m-%d'), {}, {}, {});"""

def addTable(table_name, DataFileName):
  try:
    cur.execute(make_table.format(table_name))
  except db.Error as e:
    print "Error %d - %s".format(e.args[0], e.args[1])
    log.write("Error:" + "%d - %s".format(e.args[0], e.args[1]) + "\n")
    sys.exit(1)


def checkTable(table_name):
  cur.execute(check_table.format(table_name))
  if cur.fetchone()[0] == 1:
    return True
  return False

def dbCreated():
  stream = csv.reader(log, delimiter='>')
  for row in stream:
    if row[0] == 'CREATED':
      return True
  return False

def getLastUpdateTime():
  stream = csv.reader(log, delimiter='>')
  last_update = dt(1984, 1, 1)
  for row in stream:
    if row[0] == "CREATED" or row[0] == "UPDATED":
      last_update = dt.strptime(row[1], "%a %b %d %H:%M:%S %Y")
  return last_update

def updateFromIndex():
  with open('index.csv', 'rb') as csvfile:
    stream = csv.reader(csvfile, delimiter=',')
    for row in stream:
      if not checkTable('Location' + row[0]):
        try:
          addTable('Location' + row[0], row[4])
        except db.Error, e:
          print "Error %d - %s".format(e.args[0], e.args[1])
          log.write("Error:" + "%d - %s".format(e.args[0], e.args[1]) + "\n")
          sys.exit(1)

def update():
  if dbCreated:
    print("Database was created")
    last_updated = getLastUpdateTime()
    index_last_modify = dt.fromtimestamp(os.path.getmtime('index.csv'))
    if index_last_modify > last_updated:
      updateFromIndex()
    else:
      print "No changes to index.csv"
    print index_last_modify

try:
  log = open(log_location, "rb+")
except IOError as err:
  print("IO error: {0}".format(err))
  sys.exit(1)

con = db.connect(host, user, password, database)
cur = con.cursor()
update()
con.close()
