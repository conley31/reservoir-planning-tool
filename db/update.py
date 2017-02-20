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
            WHERE table_name = '{}';"""

get_tables = """SELECT TABLE_NAME 
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_TYPE = 'BASE TABLE' AND TABLE_SCHEMA='TDP';"""

make_table = """CREATE TABLE IF NOT EXISTS Location{}
              (RecordedDate Date NOT NULL,
              Drainflow FLOAT DEFAULT NULL,
              Precipitation FLOAT DEFAULT NULL,
              PET FLOAT DEFAULT NULL,
              PRIMARY KEY (ID)
              );"""

insert = """INSERT INTO Location{} 
          (RecordedDate, Drainflow, Precipitation, PET)
          VALUES (STR_TO_DATE('{}', '%Y-%m-%d'), {}, {}, {});"""

def toStrDate(year, month, day):
  return (year + "-" + month + "-" + day)

def ParseDailyData(table_id, textFile):
  with open('daily_files/' + textFile, 'rb') as csvfile:
    stream = csv.reader(csvfile, delimiter=',')
    for row in stream:
      date = toStrDate(row[0],row[1],row[2])
      cur.execute(insert.format(table_id, date, row[3], row[4], row[5]))
      con.commit()

def addTable(table_id, DataFileName):
    cur.execute(make_table.format(table_id))
    con.commit()
    ParseDailyData(table_id, DataFileName)


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

def addNewFromIndex():
  with open('index.csv', 'rb') as csvfile:
    stream = csv.reader(csvfile, delimiter=',')
    for row in stream:
      if not checkTable('Location' + row[0]):
          addTable(row[0], row[4])
          print("added new location")

def removeOldTables():
  table_names = cur.execute(get_tables)
  for row in cur:
    print row

def update():
  if dbCreated:
    print("Database was created")
    last_updated = getLastUpdateTime()
    index_last_modify = dt.fromtimestamp(os.path.getmtime('index.csv'))
    if index_last_modify > last_updated:
      print("Updating from index")
      addNewFromIndex()
      removeOldTables()
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

