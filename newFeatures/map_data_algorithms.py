#!/usr/bin/python

import MySQLdb as db
import imp
import json
import datetime
import collections
import algorithmEnhanced
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


########################
#   Computed Values    #
# The index corresponds#
# To button number     #
########################
regionalValues = ["AnnualIrrigation","PercentAnnualDrainflow","CapturedDrainflow","IrrigationSufficiency"] 
comparisonValues = ["Drainflow","SurfaceRunoff","Precipitation","Evapotranspiration","OpenWaterEvaporation"]



####################             
#   Classes        #
#################### 

class mapData(object):
  def __init__(self,locationID):
    self.locationID = locationID
    self.value = 0
  def toJSON(self):
    return json.dumps(self,default=lambda o: o.__dict__, indent=4)

def computeData(_drainedArea, _pondVolume, _pondDepth, _maxSoilMoisture, _irrigationDepth, _availableWaterCapacity,_volumeTag,_soilTag,statusQueue):
  connection = db.connect(host,user,password,database)
  cur = connection.cursor()

  pondArea = _pondVolume/_pondDepth
  halfAvailableWaterCapacity = .5 * _availableWaterCapacity
  expectedIrrigationVolDay = (_irrigationDepth/12.0) * _drainedArea

  tagname = str(_volumeTag) + "-" + str(_soilTag)

 # numLocations = algorithmEnhanced.getTableCount(cur) -1
  numLocations = 200

  i = 0
  while i < numLocations:
    currentData = mapData('Location' + str(i))


    #update loading bar
    if i == numLocations-1:
      statusQueue.put([tagname,1],)
    else:
      statusQueue.put([tagname, (i/float(numLocations))])

    #write overall location data
    locDrainflow = algorithmEnhanced.getDrainflowCumulative(i,cur)
   # locPrecipitation = getPrecipitationCumulative(i,cur)
   # locSurfacerunoff = getSurfacerunoffCumulative(i,cur)
   # locPet = getPETCumulative(i,cur)
   # locDae = getDAE_PETCumulative(i,cur)
    
    #cumulative values
    locIrrigationVolume = 0
    locCapturedFlow = 0

    yearIrrigationVolume = 0
    yearCapturedflow = 0
    yearDrainflow = 0

    data = algorithmEnhanced.getLocationData(i,cur)
    numDays = len(data)
    seepageVolDay = 0.01
    soilMoistureDepthDayPrev = _maxSoilMoisture
    pondWaterVolDayPrev = _pondDepth * pondArea
    yearValue = data[0][0].year

    j = 0
    while (j < numDays):
      #data[j][0] = date, data[j][1] = drainflow, data[j][2] = precipitation, data[j][3] = evaporation
      inflowVolDay = ((data[j][1]) /12) * _drainedArea
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
      locIrrigationVolume += irrigationVolDay
      locCapturedFlow += capturedFlowVolDay
      yearIrrigationVolume += irrigationVolDay
      yearCapturedflow += capturedFlowVolDay
      yearDrainflow += data[j][1]
      j+=1
      if j == numDays:
        #finished this location
        #compute year first:
        yearIrrigationDepthSupplied = (yearIrrigationVolume * .15)
        if yearDrainflow == 0 :
          yearPercentAnnualDrainflow = 0
        else:
          yearPercentAnnualDrainflow = (yearCapturedflow/yearDrainflow)
        yearIrrigationSufficiency = 1
        tempValues = []
        tempValues.append(yearIrrigationDepthSupplied)
        tempValues.append(yearPercentAnnualDrainflow) 
        tempValues.append(yearCapturedflow)
        tempValues.append(yearIrrigationSufficiency)
        #for each value
        index = 0
        for val in regionalValues:
          currentData.value = tempValues[index] 
          filestring = str(yearValue) + "-" + str(_volumeTag) + "-" + str(_soilTag) + "-" + val + ".json"
          data_file = open(filestring, "a")
          obj = currentData
          json_string = obj.toJSON()
          data_file.write(json_string)
          data_file.close()
          index += 1

        #now compute location
        locIrrigationDepthSupplied = (locIrrigationVolume *.15)
        locIrrigationSufficiency = 2
        if locDrainflow == 0:
          locPercentAnnualDrainflow = 0
        else:
          locPercentAnnualDrainflow = (locCapturedFlow/locDrainflow)
        tempValues = []
        tempValues.append(locIrrigationDepthSupplied)
        tempValues.append(locPercentAnnualDrainflow)
        tempValues.append(locCapturedFlow)
        tempValues.append(locIrrigationSufficiency)
        index = 0
        for val in regionalValues:
          currentData.value = tempValues[index]
          filestring = "0000-" + str(_volumeTag) + "-" + str(_soilTag) + "-" + val + ".json"
          data_file = open(filestring, "a")
          obj = currentData
          json_string = obj.toJSON()
          data_file.write(json_string)
          data_file.close()
          index += 1


      elif data[j][0].year != yearValue:  #finished with year. write data to file.
        yearIrrigationDepthSupplied = (yearIrrigationVolume * .15)
        if yearDrainflow == 0 :
          yearPercentAnnualDrainflow = 0
        else:
          yearPercentAnnualDrainflow = (yearCapturedflow/yearDrainflow)
        yearIrrigationSufficiency = 1
        tempValues = []
        tempValues.append(yearIrrigationDepthSupplied)
        tempValues.append(yearPercentAnnualDrainflow) 
        tempValues.append(yearCapturedflow)
        tempValues.append(yearIrrigationSufficiency)
        #for each value
        index = 0
        for val in regionalValues:
          currentData.value = tempValues[index] 
          filestring = str(yearValue) + "-" + str(_volumeTag) + "-" + str(_soilTag) + "-" + val + ".json"
          data_file = open(filestring, "a")
          obj = currentData
          json_string = obj.toJSON()
          data_file.write(json_string)
          data_file.close()
          index += 1
        yearValue = data[j][0].year

    i+=1




#computeData(_drainedArea, _pondVolume, _maxSoilMoisture, _irrigationDepth, _availableWaterCapacity,_volumeTag,_soilTag):
#computeData(80,16,10,7.6,1,4.2,0,0)
