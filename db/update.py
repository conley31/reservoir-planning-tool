#!/usr/bin/python

import MySQLdb as db
import csv, json, datetime, os, sys, time
from datetime import datetime as dt
from sql_statements import *

with open('config.json') as json_data:
  config = json.load(json_data)

host = config.get("host")
user = config.get("user")
password = config.get("password")
database = config.get("db")
log_location = config.get("logLocation")

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
  log.seek(0)
  stream = csv.reader(log, delimiter='>')
  for row in stream:
    if row[0] == 'CREATED':
      return True
  return False

def getLastUpdateTime():
  log.seek(0)
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

def getID(locationStr):
  return locationStr[8:]

def idExistsInIndex(LocationID):
  idFound = False
  with open('index.csv', 'rb') as csvfile:
    stream = csv.reader(csvfile, delimiter=',')
    for row in stream:
      if row[0] == LocationID:
        idFound = True
  return idFound

def removeOldTables():
  table_names = cur.execute(get_tables)
  for row in cur:
    locationID = getID(row[0])
    if not idExistsInIndex(locationID):
      cur.execute(drop_table.format(locationID))
      con.commit()
      print "Removed Table: Location" + locationID

def checkDataFile(locationID, fileName):
  data_last_modified = dt.fromtimestamp(os.path.getmtime("daily_files/" + fileName))
  print "data last modified: " + str(data_last_modified)
  print "Last update time: " + str(getLastUpdateTime())
  if data_last_modified > getLastUpdateTime():
    cur.execute(drop_table.format(locationID))
    con.commit()
    addTable(locationID, fileName)
    print "Updated table: Location" + locationID

def updateFromDataFiles():
  with open('index.csv', 'rb') as csvfile:
    stream = csv.reader(csvfile, delimiter=',')
    for row in stream:
      checkDataFile(row[0], row[4])

def update():
  if dbCreated:
    print("Database was created")
    index_last_modify = dt.fromtimestamp(os.path.getmtime('index.csv'))
    if index_last_modify > getLastUpdateTime():
      print("Updating from index")
      addNewFromIndex()
      removeOldTables()
    else:
      print "No changes to index.csv"
    updateFromDataFiles()

try:
  log = open(log_location, "rb+")
except IOError as err:
  print("IO error: {0}".format(err))
  sys.exit(1)

con = db.connect(host, user, password, database)
cur = con.cursor()
update()
log.close()
log = open(log_location, "a+")
log.write("UPDATED>" + time.strftime("%c"))
