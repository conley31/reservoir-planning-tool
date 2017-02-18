#!/usr/bin/python
# -*- coding: utf-8 -*-

import MySQLdb as db
import csv

make_table = """CREATE TABLE IF NOT EXISTS Location{}
              (ID INT NOT NULL AUTO_INCREMENT,
              RecordedDate Date DEFAULT NULL,
              Drainflow FLOAT DEFAULT NULL,
              Precipitation FLOAT DEFAULT NULL,
              PET FLOAT DEFAULT NULL,
              PRIMARY KEY (ID)
              )"""

insert = """INSERT INTO Location{} 
          (RecordedDate, Drainflow, Precipitation, PET)
          VALUES (STR_TO_DATE('{}', '%Y-%m-%d'), {}, {}, {});"""

def toStrDate(year, month, day):
  return (year + "-" + month + "-" + day)

def ParseDailyData(cur, id, textFile):
  with open(textFile, 'rb') as csvfile:
    stream = csv.reader(csvfile, delimiter=',')
    for row in stream:
      date = toStrDate(row[0],row[1],row[2])
      cur.execute(insert.format(id, date, row[3], row[4], row[5]))

try:
  con = db.connect('localhost', 'root', 'PxrhjGtvWwC4^X%Z', 'TDP');
  cur = con.cursor()
  with open('index.csv', 'rb') as csvfile:
    stream = csv.reader(csvfile, delimiter=',')
    for row in stream:
      cur.execute(make_table.format(row[0]))
      ParseDailyData(cur, row[0], "daily_files/" + row[4])
      print "Created Table: Location{}".format(row[0])

except db.Error, e:
  print "Error %d: %s" % (e.args[0],e.args[1])
  sys.exit(1)
finally:    
  if con:    
    con.close()

