#!/usr/bin/python

import MySQLdb as db
import imp
import json
from sql_statements import *

with open('../config/config.json') as json_data:
  config = json.load(json_data)
host = config.get('mysql').get('host')
user = config.get('mysql').get('user')
password = config.get('mysql').get('password')
database = config.get('mysql').get('database')
log_location = config.get('mysql').get('logLocation')

#             
#   Classes  
#             

class LocationData(object):
  def __init__(self,locationid):
    self.annualIrrigationDepthSupplied = 0
    self.percentAnnualCapturedDrainflow = 0
    self.locationid = locationid

class yearlyData(object):
  def __init__(self,currentYear):
    self.drainflow = 0
    self.precipitation = 0
    self.surfacerunoff = 0
    self.pet = 0
    self.dae_pet = 0
    self.currentYear = currentYear

class ComparisonData(object):
  def __init__(self,locationid):
    self.locationid = locationid
    self.yearArray = []

#                                                                       
# Database funcitons                                                    
# These funcitons take an established connection and query the database 
#                                                                       

def getTableCount(connection):
  cur = connection.cursor()
  cur.execute(select_table_count.format(database))
  return  cur.fetchall()
  

def getYearCount(locationid,connection):
  cur = connection.cursor()
  cur.execute("SELECT MAX(YEAR(RecordedDate)) - MIN(YEAR(RecordedDate)) FROM Location" + str(locationid))
  return cur.fetchone()[0]

def getEarliestYear(locationid,connection):
  cur = connection.cursor()
  cur.execute("SELECT MIN(YEAR(RecordedDate)) FROM Location" + str(locationid))
  return cur.fetchone()[0]
  
def getYearByIndex(yearIndex,locationid,connection):
  return getEarliestYear(locationid,connection) + yearIndex

def getAnnualDrainflow(locationid, yearIndex,connection):
 cur = connection.cursor()
 realYear = getYearByIndex(yearIndex,locationid,connection)
 cur.execute("SELECT SUM(Drainflow) FROM Location" + str(locationid) + " WHERE YEAR(RecordedDate) = " + str(realYear) + ";")  
 return cur.fetchone()[0]

def getAnnualPrecipitation(locationid,yearIndex,connection):
  cur=connection.cursor()
  realYear = getYearByIndex(yearIndex,locationid,connection)
  cur.execute("SELECT SUM(Precipitation) FROM Location" + str(locationid) + " WHERE YEAR(RecordedDate) = " + str(realYear) + ";")
  return cur.fetchone()[0]
  
def getAnnualPET(locationid,yearIndex,connection):
  cur=connection.cursor()
  realYear = getYearByIndex(yearIndex,locationid,connection)
  cur.execute("SELECT SUM(PET) FROM Location" + str(locationid) + " WHERE YEAR(RecordedDate) = " + str(realYear) + ";")
  return cur.fetchone()[0]
 
def getAnnualSurfaceRunoff(locationid,yearIndex,connection):
  cur=connection.cursor()
  realYear = getYearByIndex(yearIndex,locationid,connection)
  cur.execute("SELECT SUM(SurfaceRunoff) FROM Location" + str(locationid) + " WHERE YEAR(RecordedDate) = " + str(realYear) + ";")
  return cur.fetchone()[0]
  
def getAnnualDAE_PET(locationid,yearIndex,connection):
  cur=connection.cursor()
  realYear = getYearByIndex(yearIndex,locationid,connection)
  cur.execute("SELECT SUM(DAE_PET) FROM Location" + str(locationid) + " WHERE YEAR(RecordedDate) = " + str(realYear) + ";")
  return cur.fetchone()[0]

def getLocationData(locationid,connection):
  cur = connection.cursor()
  cur.execute("SELECT * FROM Location" + str(locationid) + " WHERE YEAR(RecordedDate) > 1980 AND YEAR(RecordedDate) < 2010 ORDER BY (RecordedDate)")
  return cur.fetchall()


#
#   computeComparisonData
#  -returns an array of ComparisonData Objects,
#   one for each of the locations in the database
#

def computeComparisonData():
  connection = db.connect(host,user,password,database)
  all_comparison_data = []
  numLocations = getTableCount(connection)
  i = 0
  while i < numLocations :
    currentLocation = ComparisonData("Location"+str(i))
    earliestYear = getEarliestYear(i,connection)
    numYears = getYearCount(i,connection)
    j = 0
    while j < numYears :
      currentYear = yearlyData(getYearByIndex(j,i,connection))
      currentYear.drainflow = getAnnualDrainflow(i,j,connection)
      currentYear.precipitation = getAnnualPrecipitation(i,j,connection)
      currentYear.pet = getAnnualPET(i,j,connection)
      currentYear.srufacerunoff = getAnnualSurfaceRunoff(i,j,connection)
      currentYear.dae_pet = getAnnualDAE_PET(i,j,connection)

      currentLocation.yearArray.append(currentYear)
      j+=1

    all_comparison_data.append(currentLocation)
    i+=1
  connection.close()
#END computeComparisonData()  

#
#   computeData
#   -uses the Transforming Drainage Project's
#   algorithms to calculate and return an array
#   containing location-specific data, one for 
#   each location in the database
#

def computeData(_drainedArea, _pondVolume, _pondDepth, _maxSoilMoisture,  _irrigationDepth, _availableWaterCapacity):
  all_locations = []

  connection = db.connect(host,user,password,database)
  numLocations = getTableCount(connection)

  #loop through all locations
  i = 0
  while i < numLocations:
    currentLocation = LocationData('Location' + str(i))
    data = getLocationData(i,connection)
    numDays = len(data)
    pondArea = _pondVolume/_pondDepth
    seepageVolDay = 0.01

    soilMoistureDepthDayPrev = _maxSoilMoisture
    pondWaterVolDayPrev = _pondDepth * pondArea

    cumulativeIrrigation = 0
    cumulativeCapturedFlow = 0
    cumulativeDrainflow = 0

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
    
      if soilMoistureDepthDay < (0.5 * _availableWaterCapacity):

        if _pondVolume == 0 :
          irrigationVolDay = 0
        else:
          irrigationVolDay = (_irrigationDepth/12.0) * _drainedArea
          

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
      cumulativeIrrigation += irrigationVolDay
      cumulativeCapturedFlow += capturedFlowVolDay
      cumulativeDrainflow += data[j][1] 
        

      j+=1

    #update Location Data
    currentLocation.annualIrrigationDepthSupplied = (.15*cumulativeIrrigation)
    if cumulativeDrainflow > 0:
      currentLocation.percentAnnualCapturedDrainflow =  cumulativeCapturedFlow/cumulativeDrainflow
    else :
      currentLocation.percentAnnualCapturedDrainflow = 0
    #add Location Data to array of all locations
    all_locations.append(currentLocation)

    i+=1
  connection.close()
  return all_locations

#end computeData()

