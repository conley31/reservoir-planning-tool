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

class LocationData(object):
  def __init__(self,locationid):
    self.annualIrrigationDepthSupplied = 0
    self.percentAnnualCapturedDrainflow = 0


def getTableCount():
  con = db.connect(host,user,password,database)
  cur = con.cursor()
  cur.execute(select_table_count.format(database))
  tableCount = cur.fetchall()
  con.close()
  return tableCount

def computeData(_drainedArea, _pondVolume, _pondDepth, _maxSoilMoisture,  _irrigationDepth, _availableWaterCapacity):


  sqlStringBeginning = "SELECT * FROM "
  sqlStringEnd = " WHERE YEAR(RecordedDate) > 1980 AND YEAR(RecordedDate) < 2010 ORDER BY (RecordedDate)"
  #numLocations = getTableCount()
  numLocations = 10
  all_locations = []

  #loop thru all locations
  i = 0
  while i < numLocations:
    
    locationString = 'Location' + str(i)
    sqlQuery = sqlStringBeginning + locationString + sqlStringEnd
    currentLocation = LocationData(locationString)


    con = db.connect(host,user,password,database)
    cur = con.cursor()
    cur.execute(sqlQuery)

    #do for each day (row)
    numrows = cur.rowcount
    data = cur.fetchall()
    pondArea = _pondVolume/_pondDepth
    seepageVolDay = 0.01

    soilMoistureDepthDayPrev = _maxSoilMoisture
    pondWaterVolDayPrev = _pondDepth * pondArea

    cumulativeIrrigation = 0
    cumulativeCapturedFlow = 0
    cumulativeDrainflow = 0

    j = 0 
    while (j < numrows):
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
    
      cumulativeIrrigation += irrigationVolDay
      cumulativeCapturedFlow += capturedFlowVolDay
      cumulativeDrainflow += data[j][1] 

      j+=1

    con.close()
    currentLocation.annualIrrigationDepthSupplied = (.15*cumulativeIrrigation)
    currentLocation.percentAnnualCapturedDrainflow =  cumulativeCapturedFlow/cumulativeDrainflow
    
    all_locations.append(currentLocation)
    i+=1
#end computeData()

computeData(80,16,10,7.6,1,4.2)
