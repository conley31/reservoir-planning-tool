#!/usr/bin/python

import MySQLdb as db
import sys
import imp
import json
import datetime
import collections
from Queue import Queue
from sql_statements import *
from time import sleep

with open('./config/config.json') as json_data:
  config = json.load(json_data)
host = config.get('mysql').get('host')
user = config.get('mysql').get('user')
password = config.get('mysql').get('password')
database = config.get('mysql').get('database')
log_location = config.get('mysql').get('logLocation')

###################################################                                                                       
# Database functions                              #                      
# These funcitons take an established connection  #
# and query the database                          #
###################################################

def getTableCount(cursor):
  cursor.execute(select_table_count.format(database))
  return  cursor.fetchone()[0]

def getYearCount(locationid,cursor):
  cursor.execute("SELECT MAX(YEAR(RecordedDate)) - MIN(YEAR(RecordedDate)) FROM Location" + str(locationid))
  return cursor.fetchone()[0]

def getEarliestYear(locationid,cursor):
  cursor.execute("SELECT MIN(YEAR(RecordedDate)) FROM Location" + str(locationid))
  return cursor.fetchone()[0]
  
def getAnnualDrainflow(locationid, year,cursor):
 cursor.execute("SELECT SUM(Drainflow) FROM Location" + str(locationid) + " WHERE YEAR(RecordedDate) = " + str(year) + ";")  
 return cursor.fetchone()[0]

def getDrainflowCumulative(locationid,cursor):
  cursor.execute("SELECT SUM(Drainflow) FROM Location" + str(locationid))
  return cursor.fetchone()[0]

def getAnnualPrecipitation(locationid,year,cursor):
  cursor.execute("SELECT SUM(Precipitation) FROM Location" + str(locationid) + " WHERE YEAR(RecordedDate) = " + str(year) + ";")
  return cursor.fetchone()[0]

def getPrecipitationCumulative(locationid,cursor):
  cursor.execute("SELECT SUM(Drainflow) FROM Location" + str(locationid))
  return cursor.fetchone()[0]
  
def getAnnualPET(locationid,year,cursor):
  cursor.execute("SELECT SUM(PET) FROM Location" + str(locationid) + " WHERE YEAR(RecordedDate) = " + str(year) + ";")
  return cursor.fetchone()[0]

def getPETCumulative(locationid,cursor):
  cursor.execute("SELECT SUM(Drainflow) FROM Location" + str(locationid))
  return cursor.fetchone()[0]
 
def getAnnualSurfacerunoff(locationid,year,cursor):
  cursor.execute("SELECT SUM(SurfaceRunoff) FROM Location" + str(locationid) + " WHERE YEAR(RecordedDate) = " + str(year) + ";")
  return cursor.fetchone()[0]

def getSurfacerunoffCumulative(locationid,cursor):
  cursor.execute("SELECT SUM(Drainflow) FROM Location" + str(locationid))
  return cursor.fetchone()[0]
 
def getAnnualDAE_PET(locationid,year,cursor):
  cursor.execute("SELECT SUM(DAE_PET) FROM Location" + str(locationid) + " WHERE YEAR(RecordedDate) = " + str(year) + ";")
  return cursor.fetchone()[0]

def getDAE_PETCumulative(locationid,cursor):
  cursor.execute("SELECT SUM(Drainflow) FROM Location" + str(locationid))
  return cursor.fetchone()[0]

def getLocationData(locationid,cursor):
  cursor.execute("SELECT * FROM Location" + str(locationid) + " WHERE YEAR(RecordedDate) > 1980 AND YEAR(RecordedDate) < 2010 ORDER BY (RecordedDate)")
  return cursor.fetchall()

def checkJsonIntegrity(jsonfile):
  with open(jsonfile) as data_file:
    try:
      json_object = json.load(data_file)
    except ValueError, e:
      return False
    return True

  


