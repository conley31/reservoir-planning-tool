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
databaseValues = ["Drainflow","SurfaceRunoff","Precipitation","Evapotranspiration","OpenWaterEvaporation"]

def computeData(_drainedArea, _pondVolume, _pondDepth, _maxSoilMoisture, _irrigationDepth, _availableWaterCapacity,_volumeTag,_soilTag,statusQueue):
  TEMPFLAG = 0
  connection = db.connect(host,user,password,database)
  cur = connection.cursor()

  pondArea = _pondVolume/_pondDepth
  halfAvailableWaterCapacity = .5 * _availableWaterCapacity
  expectedIrrigationVolDay = (_irrigationDepth/12.0) * _drainedArea

  tagname = str(_volumeTag) + "-" + str(_soilTag)

  #numLocations = algorithmEnhanced.getTableCount(cur) -1
  numLocations = 1
  earliestYear = algorithmEnhanced.getEarliestYear(0,cur)
  numYears = algorithmEnhanced.getYearCount(0,cur)

  #[year][data][location]
  year = []
  value = []
  for i in range(numYears + 1):
    year.append([])
    for j in range(len(regionalValues)):
      year[i].append([])
  #[data][location]
  allYears = []
  for i in range(len(regionalValues)):
    allYears.append([])
  i = 0
  while i < numLocations:
    #update loading bar
    locationstr = "Location" + str(i)
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
    yearCapturedFlow = 0
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
      yearCapturedFlow += capturedFlowVolDay
      yearDrainflow += data[j][1]
      j+=1
      if j == numDays:
        #finished this location
        #compute year first:
        tempValues = []
        tempValues.append(yearIrrigationVolume * .15)
        if yearDrainflow == 0 :
          tempValues.append(0)
        else:
          tempValues.append(yearCapturedFlow/yearDrainflow)
        tempValues.append(yearCapturedFlow)
        tempValues.append(1)
        k = 0
        while k < len(tempValues):
          year[yearValue-earliestYear][k].append(tempValues[k])
          k += 1

        #reset yearly cumulative values
        yearCapturedFlow = 0
        yearDrainflow = 0
        yearIrrigationVolume = 0

        #now compute location data
        tempValues = []
        tempValues.append(locIrrigationVolume * .15)
        if locDrainflow == 0:
          tempValues.append(0)
        else:
          tempValues.append(locCapturedFlow/locDrainflow)
        tempValues.append(locCapturedFlow)
        tempValues.append(2)
        k = 0
        while k < len(tempValues):
          allYears[k].append(tempValues[k])
          k += 1

      elif data[j][0].year != yearValue:  
        #finished with year, but still on same location. So compute values, then push to data arrays
        tempValues = []
        tempValues.append(yearIrrigationVolume * .15)
        if yearDrainflow == 0 :
          tempValues.append(0)
        else:
          tempValues.append(yearCapturedFlow/yearDrainflow)
        tempValues.append(yearCapturedFlow)
        tempValues.append(1)
        k = 0
        while k < len(tempValues):
          year[yearValue-earliestYear][k].append(tempValues[k])
          k += 1
        yearValue = data[j][0].year

        #reset yearly cumulative values
        yearCapturedFlow = 0
        yearDrainflow = 0
        yearIrrigationVolume = 0
  
    i+=1
  for i in range(len(year)):
    for j in range(len(regionalValues)):
      filestring = str(earliestYear + i) + "-" + tagname + "-" + regionalValues[j] + ".json"
      data_file = open(filestring,"w")
      json_string = json.dumps(year[i][j],default=lambda o: o.__dict__,indent=4)
      data_file.write(json_string)
      data_file.close()
  
  for i in range(len(regionalValues)):
    filestring = "0000-" + tagname + regionalValues[i] + ".json"
    data_file = open(filestring,"w")
    json_string = json.dumps(allYears[i],default=lambda o: o.__dict__,indent=4)
    data_file.write(json_string)
    data_file.close()

def generateDatabaseMaps():
  connection = db.connect(host,user,password,database)
  cur = connection.cursor()
  earliestYear = algorithmEnhanced.getEarliestYear(0,cur)
  numYears = algorithmEnhanced.getYearCount(0,cur)
  year = []
  value = []
  allYears = []
  for i in range(numYears + 1):
    year.append([])
    for j in range(len(databaseValues)):
      year[i].append([])
  currentYear = earliestYear
  #numLocations = algorithmEnhanced.getTableCount(cur) - 1
  numLocations = 10
  for i in range(numLocations):
    currentYear = earliestYear
    for j in range(numYears):
     currentYear += 1
     print(currentYear)
     tempValues = []
     tempValues.append(algorithmEnhanced.getAnnualDrainflow(i,currentYear,cur))
     tempValues.append(algorithmEnhanced.getAnnualSurfacerunoff(i,currentYear,cur))
     tempValues.append(algorithmEnhanced.getAnnualPrecipitation(i,currentYear,cur))
     tempValues.append(algorithmEnhanced.getAnnualPET(i,currentYear,cur))
     tempValues.append(algorithmEnhanced.getAnnualDAE_PET(i,currentYear,cur))
     print(tempValues)
     k = 0
     while k < len(tempValues):
       year[j][k].append(tempValues[k])
       k+=1
  for i in range(len(year)):
    for j in range(len(databaseValues)):
      filestring = str(earliestYear + i) + "-" + databaseValues[j] + ".json"
      data_file = open(filestring,"w")
      json_string = json.dumps(year[i][j],default=lambda o: o.__dict__,indent=4)
      data_file.write(json_string)
      data_file.close()


    
generateDatabaseMaps()
