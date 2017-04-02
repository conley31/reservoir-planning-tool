#!/usr/bin/python

import MySQLdb as db
import csv, json, datetime, os, sys, time
from datetime import datetime as dt
from sql_statements import *

with open('../config/config.json') as json_data:
  config = json.load(json_data)

host = config.get("mysql").get("host")
user = config.get("mysql").get("user")
password = config.get("mysql").get("password")
database = config.get("mysql").get("database")
log_location = config.get("mysql").get("logLocation")

INCH_FACTOR = 0.03937007874
index_file = 'index.csv'

con = None
cur = None
log = None

def configureLog():
    global log
    try:
        log = open(log_location, 'rb+')
    except IOError:
        log = open(log_location, 'w')
        log.close()
        log = open(log_location, 'rb+')

def configureMySQL():
    global con, cur
    con = db.connect(host, user, password, database)
    cur = con.cursor()

def getID(locationStr):
  return locationStr[8:]

def idExistsInIndex(LocationID):
  idFound = False
  with open(index_file, 'rb') as csvfile:
    stream = csv.reader(csvfile, delimiter=',')
    for row in stream:
      if row[0] == LocationID:
        idFound = True
  return idFound

def dbCreated():
  global log
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

def toStrDate(year, month, day):
  return (year + "-" + month + "-" + day)

def ParseDailyData(table_id, textFile):
  with open('daily_files/' + textFile, 'rb') as csvfile:
    stream = csv.reader(csvfile, delimiter=',')
    for row in stream:
      date = toStrDate(row[0],row[1],row[2])
      dfInches = float(row[3]) * INCH_FACTOR
      precipInches = float(row[4]) * INCH_FACTOR
      PETInches = float(row[5]) * INCH_FACTOR
      cur.execute(insert.format(table_id, date, dfInches, precipInches, PETInches))
      con.commit()

def addTable(table_id, DataFileName):
    cur.execute(make_table.format(table_id))
    con.commit()
    ParseDailyData(table_id, DataFileName)

def checkTable(table_name):
  cur.execute(check_table.format(database, table_name))
  return cur.fetchone() != None

def addNewFromIndex():
  with open(index_file, 'rb') as csvfile:
    stream = csv.reader(csvfile, delimiter=',')
    for row in stream:
      if not checkTable('Location' + row[0]):
          addTable(row[0], row[4])
          print("added new Location" + row[0])

def removeOldTables():
  table_names = cur.execute(get_tables.format(database))
  for row in cur:
    locationID = getID(row[0])
    if not idExistsInIndex(locationID):
      cur.execute(drop_table.format(locationID))
      con.commit()
      print "Removed Table: Location" + locationID

def checkDataFile(locationID, fileName):
  data_last_modified = dt.fromtimestamp(os.path.getmtime("daily_files/" + fileName))
  if data_last_modified > getLastUpdateTime():
    cur.execute(drop_table.format(locationID))
    con.commit()
    addTable(locationID, fileName)
    print "Updated table: Location" + locationID

def updateFromDataFiles():
  with open(index_file, 'rb') as csvfile:
    stream = csv.reader(csvfile, delimiter=',')
    for row in stream:
      checkDataFile(row[0], row[4])

def update():
  if dbCreated:
    print("Database was created")
    index_last_modify = dt.fromtimestamp(os.path.getmtime(index_file))
    if index_last_modify > getLastUpdateTime():
      print("Updating from index")
      addNewFromIndex()
      removeOldTables()
    else:
      print "No changes to index.csv"
    updateFromDataFiles()
    log.write('UPDATED>' + time.strftime("%c") + '\n')

try:
  log = open(log_location, 'rb+')
except IOError:
  log = open(log_location, 'w')
  log.close()
  log = open(log_location, 'rb+')


if __name__ == '__main__':
  configureMySQL()
  update()

  if con:
    con.commit()
    con.close()
