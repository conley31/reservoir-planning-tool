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

with open('../config/config.json') as json_data:
  config = json.load(json_data)
host = config.get('mysql').get('host')
user = config.get('mysql').get('user')
password = config.get('mysql').get('password')
database = config.get('mysql').get('database')
log_location = config.get('mysql').get('logLocation')

####################             
#   Classes        #
####################             
  
#
# LocationData contains the summed
# values of all the yearlyData for a
# single location. It also contains the
# list that holds every yearlyData object
# 
class LocationData(object):
  def __init__(self,locationid):
    
    self.drainflow = 0
    self.precipitation = 0
    self.surfacerunoff = 0
    self.pet = 0
    self.dae_pet = 0
    self.irrigationVolume = 0
    self.capturedFlow = 0
    self.annualIrrigationDepthSupplied = 0
    self.percentAnnualCapturedDrainflow = 0
    self.irrigationSufficiency = 0
    self.allYears = []

    self.locationid = locationid
  def toJSON(self):
    return json.dumps(self, default=lambda o: o.__dict__, indent=4)

    
#
# yearlyData contains data for one year
# in the database for a single location
#
class YearlyData(object):
  def __init__(self,year):

    self.year = year
    self.drainflow = 0
    self.precipitation = 0
    self.surfacerunoff = 0
    self.pet = 0
    self.dae_pet = 0
    self.irrigationVolume = 0
    self.capturedFlow = 0
    self.annualIrrigationDepthSupplied = 0
    self.percentAnnualCapturedDrainflow = 0
    self.irrigationSufficiency = 0
    
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

#
#   computeData
#   -uses the Transforming Drainage Project's
#   algorithms to calculate and return an array
#   containing location-specific data, one for 
#   each location in the database
#

def computeData(_drainedArea, _pondVolume, _pondDepth, _maxSoilMoisture,  _irrigationDepth, _availableWaterCapacity,name,statusQueue):
  all_locations = []

  connection = db.connect(host,user,password,database)
  cur = connection.cursor()

  pondArea = _pondVolume/_pondDepth
  halfAvailableWaterCapacity = .5 * _availableWaterCapacity
  expectedIrrigationVolDay = (_irrigationDepth/12.0) * _drainedArea

  numLocations = getTableCount(cur) -1

  #loop through all locations
  i = 0
  while i < numLocations:
    #update loading bar
    statusQueue.put([name, (i/float(numLocations))])
    #create new LocationData object and get cumulative values from the database
    currentLocation = LocationData('Location' + str(i))
    currentLocation.drainflow = getDrainflowCumulative(i,cur)
    currentLocation.precipitation = getPrecipitationCumulative(i,cur)
    currentLocation.surfacerunoff = getSurfacerunoffCumulative(i,cur)
    currentLocation.pet = getPETCumulative(i,cur)
    currentLocation.dae_pet = getDAE_PETCumulative(i,cur)
    data = getLocationData(i,cur)
    numDays = len(data)
    seepageVolDay = 0.01

    soilMoistureDepthDayPrev = _maxSoilMoisture
    pondWaterVolDayPrev = _pondDepth * pondArea
    yearValue = data[0][0].year
    currentYear = YearlyData(yearValue)
    j = 0 
    while (j < numDays):
      
      inflowVolDay = ((data[j][1]) /12.0) * _drainedArea
      precipDepthDay = data[j][2]
      evapDepthDay = data[j][3]

      irrigationVolDay = 0
      defecitVolDay = 0

      evapVolDay = (evapDepthDay/12.0) * pondArea

      pondPrecipVolDay = (precipDepthDay/12.0) * pondArea

      soilMoistureDepthDay = (soilMoistureDepthDayPrev + precipDepthDay - evapDepthDay)

      if soilMoistureDepthDay < 0:
        soilMoistureDepthDay = 0

      if soilMoistureDepthDay > _maxSoilMoisture:
        soilMostureDepthDay = _maxSoilMoisture
    
      pondWaterVolDay = pondWaterVolDayPrev
    
      if soilMoistureDepthDay < (halfAvailableWaterCapacity):

        if _pondVolume == 0 :
          irrigationVolDay = 0
        else:
          irrigationVolDay = expectedIrrigationVolDay
          

        if irrigationVolDay > pondWaterVolDay:
          defecitVolDay = (irrigationVolDay - pondWaterVolDay)

        if defecitVolDay > 0:
          irrigationVolDay = irrigationVolDay - defecitVolDay
        soilMoistureDepthDay = (soilMoistureDepthDayPrev + precipDepthDay + ((irrigationVolDay * 12) / _drainedArea) - evapDepthDay)

      if soilMoistureDepthDay < 0 :
        soilMoistureDepthDay = 0

      if soilMoistureDepthDay > _maxSoilMoisture :
        soilMoistureDepthDay = _maxSoilMoisture
    
      pondWaterVolDay = (pondWaterVolDayPrev + inflowVolDay + pondPrecipVolDay - irrigationVolDay - seepageVolDay - evapVolDay)

      if pondWaterVolDay < 0 :
        pondWaterVolDay = 0

      bypassFlowVolDay = 0

      if pondWaterVolDay > _pondVolume :
        bypassFlowVolDay = pondWaterVolDay - _pondVolume
        pondWaterVolDay = _pondVolume

      capturedFlowVolDay = 0
      capturedFlowVolDay = min(inflowVolDay, _pondVolume - pondWaterVolDay)

      pondWaterDepthDay = (pondWaterVolDay/pondArea)

      #update prevDay Vars
      soilMoistureDepthDayPrev = soilMoistureDepthDay
      pondWaterVolDayPrev = pondWaterVolDay
    
      #update cumulative values

      currentYear.irrigationVolume += irrigationVolDay
      currentYear.capturedFlow += capturedFlowVolDay
        
      j+=1
      if j == numDays:
        #last day of location, update values then compute overall location values that rely on algorithm
        currentYear.annualIrrigationDepthSupplied = (currentYear.irrigationVolume *.15)
        currentYear.irrigationSufficiency = (currentYear.annualIrrigationDepthSupplied/1000) * 100
        if currentYear.drainflow == 0:
          currentYear.percentAnnualCapturedDrainflow = 0
        else:
          currentYear.percentAnnualCapturedDrainflow = (currentYear.capturedFlow/currentYear.drainflow)

        #update location data
        currentLocation.capturedFlow += currentYear.capturedFlow
        currentLocation.irrigationVolume += currentYear.irrigationVolume
        #update location data that rely on algorithm
        currentLocation.annualIrrigationDepthSupplied = (currentLocation.irrigationVolume * .15)
        currentLocation.irrigationSufficiency = (currentLocation.annualIrrigationDepthSupplied/1000.0) * 100
        if currentLocation.drainflow == 0:
          currentLocation.percentAnnualCapturedDrainflow = 0
        else:
          currentLocation.percentAnnualCapturedDrainflow = currentLocation.capturedFlow/currentLocation.drainflow
        #append year to the list of all years
        currentLocation.allYears.append(currentYear)

      elif data[j][0].year != yearValue:
        #last day of YEAR, update algorithm values and initialize the next year
        currentYear.annualIrrigationDepthSupplied = (currentYear.irrigationVolume *.15)
        currentYear.irrigationSufficiency = (currentYear.annualIrrigationDepthSupplied/1000) * 100
        if currentYear.drainflow == 0:
          currentYear.percentAnnualCapturedDrainflow = 0
        else:
          currentYear.percentAnnualCapturedDrainflow = (currentYear.capturedFlow/currentYear.drainflow)

        #update location data's cumulative vales
        currentLocation.capturedFlow += currentYear.capturedFlow
        currentLocation.irrigationVolume += currentYear.irrigationVolume

        #append year to the list of all years
        currentLocation.allYears.append(currentYear)

        #set up new year
        yearValue = data[j][0].year
        newYear = YearlyData(yearValue)
        newYear.drainflow = getAnnualDrainflow(i, yearValue, cur)
        newYear.precipitation = getAnnualPrecipitation(i, yearValue, cur)
        newYear.surfacerunoff = getAnnualSurfacerunoff(i, yearValue, cur)
        newYear.pet = getAnnualPET(i, yearValue, cur)
        newYear.dae_pet = getAnnualDAE_PET(i, yearValue, cur)
        currentYear = newYear
     #while j < numDays loop

    #update Location Data

    all_locations.append(currentLocation)

    i+=1
  connection.close()
  return all_locations

#end computeData()
#computeData(80,16,10,7.6,1,4.2,'All-data')
