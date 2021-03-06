#!/usr/bin/python
import datetime
import MySQLdb as db
import imp
import json
import datetime
import collections
import sql_queries as dbQuery
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

#setting up log file for recording outliers
date = datetime.datetime.now()

log_file_dir = "./public/data_sets/logs/"


########################
#   Computed Values    #
# The index corresponds#
# To button number     #
########################
regionalValues = ["AnnualIrrigation","PercentAnnualDrainflow","CapturedDrainflow","IrrigationSufficiency"] 
databaseValues = ["Drainflow","SurfaceRunoff","Precipitation","Evapotranspiration","OpenWaterEvaporation"]

def computeData(_drainedArea, _pondVolume, _pondDepth, _maxSoilMoisture, _irrigationDepth, _availableWaterCapacity,_volumeTag,_soilTag,statusQueue,testFlag):
  #set up data log
  log_file = open(log_file_dir + "LOG: " + str(date) + ' ' + str(_volumeTag) + '-' + str(_soilTag) + ".txt","w").close()
  log_file = open(log_file_dir + "LOG: " + str(date) + ' ' + str(_volumeTag) + '-' + str(_soilTag) + ".txt","a")
  log_file.write("Generating JSON map files\n")

  #set up connection to database
  connection = db.connect(host,user,password,database)
  cur = connection.cursor()
  
  #initialize values that will not change throughout the simulation
  pondArea = float(_pondVolume)/_pondDepth
  halfAvailableWaterCapacity = .5 * _availableWaterCapacity
  expectedIrrigationVolDay = (_irrigationDepth/12.0) * _drainedArea
  if testFlag == 0:
    numLocations = dbQuery.getTableCount(cur)
  else:
    numLocations = 20
  earliestYear = dbQuery.getEarliestYear(0,cur)
  numYears = dbQuery.getYearCount(0,cur)


  #values beginning with 'bottomless' are used to compute the irrigation sufficiency
  bottomlessDepth = 1000.0
  bottomlessPondArea = float(_pondVolume)/bottomlessDepth

  #this is the prefix of the filename
  tagname = str(_volumeTag) + "-" + str(_soilTag)

  
  #set up arrays to store data
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
    
    #These values represent cumulative data across all days of the location
    locIrrigationVolume = 0
    locCapturedFlow = 0

    bottomlessLocIrrigationVolume = 0
    bottomlessLocCapturedFlow = 0
    
    #These values represent cumulative for a single year of a location and are reset to zero after each year is computed
    yearIrrigationVolume = 0
    yearCapturedFlow = 0
    yearDrainflow = 0

    bottomlessYearIrrigationVolume = 0.0
    bottomlessyearCapturedFlow = 0
    
    #
    # Data will be a multidimensional array where the first dimension corresponds to the row(day) in the database,
    # and the second dimension corresponds to a column(value) such that:
    # data[j][0] = date, data[j][1] = drainflow, data[j][2] = precipitation, data[j][3] = evaporation
    #
    data = dbQuery.getLocationData(i,cur)
    
    #these values will be used while looping through the rows(days) of the database
    numDays = len(data)
    seepageVolDay = 0.01
    soilMoistureDepthDayPrev = _maxSoilMoisture
    pondWaterVolDayPrev = _pondDepth * pondArea
    yearValue = data[0][0].year

    bottomlessSoilMoistureDepthDayPrev = _maxSoilMoisture
    bottomlessPondWaterVolDayPrev = bottomlessDepth * bottomlessPondArea


    j = 0
    while (j < numDays):
      #get the necessary values from the database
      inflowVolDay = ((data[j][1]) /12) * _drainedArea
      precipDepthDay = data[j][2]
      evapDepthDay = data[j][3]
      
      irrigationVolDay = 0
      defecitVolDay = 0

      bottomlessIrrigationVolDay = 0
      bottomlessDefecitVolDay = 0

      
      #values dependent on database values
      evapVolDay = (evapDepthDay/12.0) * pondArea
      pondPrecipVolDay = (precipDepthDay/12.0) * pondArea
      soilMoistureDepthDay = (soilMoistureDepthDayPrev + precipDepthDay - evapDepthDay)

      bottomlessEvapVolDay = (evapDepthDay/12.0) * bottomlessPondArea
      bottomlessPondPrecipVolDay = (precipDepthDay/12.0) * bottomlessPondArea
      bottomlessSoilMoistureDepthDay = (bottomlessSoilMoistureDepthDayPrev + precipDepthDay - evapDepthDay)

      #computaions for regular values
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

      #computations for irrigation sufficiency (bottomless pond) values

      if bottomlessSoilMoistureDepthDay < 0:
        bottomlessSoilMoistureDepthDay = 0

      if bottomlessSoilMoistureDepthDay > _maxSoilMoisture:
        bottomlessSoilMoistureDepthDay = _maxSoilMoisture
      
      bottomlessPondWaterVolDay = bottomlessPondWaterVolDayPrev

      if bottomlessSoilMoistureDepthDay < (halfAvailableWaterCapacity):
        if _pondVolume == 0:
          bottomlessIrrigationVolDay = 0
        else:
          bottomlessIrrigationVolDay = expectedIrrigationVolDay

        if bottomlessIrrigationVolDay > bottomlessPondWaterVolDay:
          bottomlessDefecitVolDay = (bottomlessIrrigationVolDay - bottomlessPondWaterVolDay)

        if bottomlessDefecitVolDay > 0:
          bottomlessIrrigationVolDay = bottomlessIrrigationVolDay - bottomlessDefecitVolDay
        
        bottomlessSoilMoistureDepthDay = (bottomlessSoilMoistureDepthDayPrev + precipDepthDay + ((bottomlessIrrigationVolDay * 12) / _drainedArea) - evapDepthDay)

      if bottomlessSoilMoistureDepthDay < 0 :
        bottomlessSoilMoistureDepthDay = 0

      if bottomlessSoilMoistureDepthDay > _maxSoilMoisture:
        bottomlessSoilMoistureDepthDay = _maxSoilMoisture

      bottomlessPondWaterVolDay = (bottomlessPondWaterVolDayPrev + inflowVolDay + bottomlessPondPrecipVolDay - bottomlessIrrigationVolDay - seepageVolDay - bottomlessEvapVolDay)

      if bottomlessPondWaterVolDay < 0:
        bottomlessPondWaterVolDay = 0

      bottomlessBypassFlowVolDay = 0

      if bottomlessPondWaterVolDay > _pondVolume:
        bottomlessBypassFlowVolDay = bottomlessPondWaterVolDay - _pondVolume
        bottomlessPondWaterVolDay = _pondVolume
        
      bottomlessCapturedFlowVolDay = 0
      bottomlessCapturedFlowVolDay = (min(inflowVolDay, _pondVolume - bottomlessPondWaterVolDay))

      bottomlessPondWaterDepthDay = (bottomlessPondWaterVolDay / bottomlessPondArea)


      #update prevDay Vars
      soilMoistureDepthDayPrev = soilMoistureDepthDay
      pondWaterVolDayPrev = pondWaterVolDay

      bottomlessSoilMoistureDepthDayPrev = bottomlessSoilMoistureDepthDay
      bottomlessPondWaterVolDayPrev = bottomlessPondWaterVolDay

      #update cumulative values
      locIrrigationVolume += irrigationVolDay
      locCapturedFlow += capturedFlowVolDay
      yearIrrigationVolume += irrigationVolDay
      yearCapturedFlow += capturedFlowVolDay
      yearDrainflow += data[j][1]

      bottomlessLocIrrigationVolume += bottomlessIrrigationVolDay
      bottomlessLocCapturedFlow += bottomlessCapturedFlowVolDay
      bottomlessYearIrrigationVolume += bottomlessIrrigationVolDay

      #move onto next day and check if that day has a different year than the previous day
      j+=1
      if j == numDays:
        #finished this location
        #compute year first:
        #TempValues is a temporary array to store the data in the index that it needs to be in the last dimension of the 3d year array
        tempValues = []
        irrigationSupplied = yearIrrigationVolume * .15
        tempValues.append(irrigationSupplied)
        if yearDrainflow == 0 :
          percentDrainflow = 0
          tempValues.append(percentDrainflow)
        else:
          percentDrainflow = (yearCapturedFlow/yearDrainflow)
          tempValues.append(percentDrainflow)
        tempValues.append(yearCapturedFlow)
        bottomlessIrrigationSupplied = (bottomlessYearIrrigationVolume * .15)
        if bottomlessIrrigationSupplied == 0:
          irrigationSufficiency = 0
        else :
          irrigationSufficiency = (100 * (irrigationSupplied/bottomlessIrrigationSupplied))
        if irrigationSufficiency > 100:
          tempValues.append(100)
        elif irrigationSufficiency < 0:
          tempValues.append(0)
        else:
          tempValues.append(irrigationSufficiency)

        #!
        #check for outliers and write them to the log
        #!
        outlierFlag = 0
        logstr = "Location" + str(i) + " Log::Annual (" + str(yearValue) + ") Flagged values:\n"
        if irrigationSupplied > 250:
            outlierFlag = 1
            logstr += "\t IrrigationSupplied:    " + str(irrigationSupplied) + "\n"
        if percentDrainflow > 73.947912:
            outlierFlag = 1
            logstr += "\t PercentDrainflow:      " + str(percentDrainflow) + "\n"
        if yearCapturedFlow > 74.331329:
            outlierFlag = 1
            logstr += "\t CapturedFlow:          " + str(yearCapturedFlow) + "\n"

        if outlierFlag > 0:
            logstr += "\t Data Dump: \n" 
            logstr += "\t\t Irrigation Volume:                   " + str(yearIrrigationVolume) + '\n'
            logstr += "\t\t Drainflow:                           " + str(yearDrainflow) + '\n'
            logstr += "\t\t Bottomless Pond Irrigation Volume:   " + str(bottomlessYearIrrigationVolume) + '\n' 
            logstr += "----------------------------------------------------------------------------------\n"
            log_file.write(logstr)
        outlierFlag = 0

        #append the values to the 3d year array
        k = 0
        while k < len(tempValues):
          year[yearValue-earliestYear][k].append(tempValues[k])
          k += 1

        #reset yearly cumulative values
        yearCapturedFlow = 0
        yearDrainflow = 0
        yearIrrigationVolume = 0

        bottomlessYearIrrigationVolume = 0

        #now compute location data (0000 tag)
        tempValues = []
        irrigationSupplied = locIrrigationVolume * .15
        tempValues.append(irrigationSupplied)
        locDrainflow = dbQuery.getDrainflowCumulative(i,cur)
        if locDrainflow == 0:
          percentDrainflow = 0
          tempValues.append(percentDrainflow)
        else:
          percentDrainflow = (locCapturedFlow/locDrainflow)
          tempValues.append(percentDrainflow)
        tempValues.append(locCapturedFlow)
        bottomlessIrrigationSupplied = (bottomlessLocIrrigationVolume * .15)
        if bottomlessIrrigationSupplied == 0:
          irrigationSufficiency = 0
        else :
          irrigationSufficiency = (100 *(irrigationSupplied/bottomlessIrrigationSupplied))
        if irrigationSufficiency > 100:
          irrigationSufficiency = 100
        elif irrigationSufficiency < 0:
          irrigationSufficiency = 0
        tempValues.append(irrigationSufficiency)

        #!
        #check for outliers and write them to the log
        #!
        outlierFlag = 0
        logstr = "Location" + str(i) + " Log::Cumulative (All Years) Flagged values:\n"
        if irrigationSupplied > 250:
            outlierFlag = 1
            logstr += "\t IrrigationSupplied:    " + str(irrigationSupplied) + "\n"
        if percentDrainflow > 73.947912:
            outlierFlag = 1
            logstr += "\t PercentDrainflow:      " + str(percentDrainflow) + "\n"
        if yearCapturedFlow > 74.331329:
            outlierFlag = 1
            logstr += "\t CapturedFlow:          " + str(locCapturedFlow) + "\n"

        if outlierFlag > 0:
            logstr += "\t Data Dump: \n" 
            logstr += "\t\t Irrigation Volume:                   " + str(locIrrigationVolume) + '\n'
            logstr += "\t\t Drainflow:                           " + str(locDrainflow) + '\n'
            logstr += "\t\t Bottomless Pond Irrigation Volume: " + str(bottomlessLocIrrigationVolume) + '\n' 
            logstr += "----------------------------------------------------------------------------------\n"
            log_file.write(logstr)
        outlierFlag = 0

        k = 0
        while k < len(tempValues):
          allYears[k].append(tempValues[k])
          k += 1

      elif data[j][0].year != yearValue:  
        #finished with year, but still on same location. So compute values, then push to data arrays
        tempValues = []
        irrigationSupplied = yearIrrigationVolume * .15
        tempValues.append(irrigationSupplied)
        if yearDrainflow == 0 :
          percentDrainflow = 0
          tempValues.append(percentDrainflow)
        else:
          percentDrainflow = (yearCapturedFlow/yearDrainflow)
          tempValues.append(percentDrainflow)
        tempValues.append(yearCapturedFlow)
        bottomlessIrrigationSupplied = (bottomlessYearIrrigationVolume * .15)

        if bottomlessIrrigationSupplied == 0:
          irrigationSufficiency = 0
        else :
          irrigationSufficiency = (100 * (irrigationSupplied/bottomlessIrrigationSupplied))
        if irrigationSufficiency > 100:
          irrigationSufficiency = 100
        elif irrigationSufficiency < 0:
          irrigationSufficiency = 0
        tempValues.append(irrigationSufficiency)
        k = 0
        while k < len(tempValues):
          year[yearValue-earliestYear][k].append(tempValues[k])
          k += 1
        yearValue = data[j][0].year

        #!
        # Check for outliers and write them to log
        #!
        outlierFlag = 0
        logstr = "Location" + str(i) + " Log::Annual (" + str(yearValue) + ") Flagged values:\n"
        if irrigationSupplied > 250:
            outlierFlag = 1
            logstr += "\t IrrigationSupplied:    " + str(irrigationSupplied) + "\n"
        if percentDrainflow > 73.947912:
            outlierFlag = 1
            logstr += "\t PercentDrainflow:      " + str(percentDrainflow) + "\n"
        if yearCapturedFlow > 74.331329:
            outlierFlag = 1
            logstr += "\t CapturedFlow:          " + str(yearCapturedFlow) + "\n"

        if outlierFlag > 0:
            logstr += "\t Data Dump: \n" 
            logstr += "\t\t Irrigation Volume:                   " + str(yearIrrigationVolume) + '\n'
            logstr += "\t\t Drainflow:                           " + str(yearDrainflow) + '\n'
            logstr += "\t\t Bottomless Pond Irrigation Volume:   " + str(bottomlessYearIrrigationVolume) + '\n' 
            logstr += "----------------------------------------------------------------------------------\n"
            log_file.write(logstr)
        outlierFlag = 0


        #reset yearly cumulative values
        yearCapturedFlow = 0
        yearDrainflow = 0
        yearIrrigationVolume = 0

        bottomlessYearIrrigationVolume = 0
  
    i+=1
  for i in range(len(year)):
    for j in range(len(regionalValues)):
      filestring = str(earliestYear + i) + "-" + tagname + "-" + regionalValues[j] + ".json"
      if testFlag == 0:
        data_file = open("./public/data_sets/map_files/" + filestring,"w")
      else:
        data_file = open("./public/data_sets/TEST_map_files/" + filestring,"w")
      json_string = json.dumps(year[i][j],default=lambda o: o.__dict__,indent=4)
      data_file.write(json_string)
      data_file.close()
  for i in range(len(regionalValues)):
    filestring = "0000-" + tagname + "-" + regionalValues[i] + ".json"
    if testFlag == 0:
      data_file = open("./public/data_sets/map_files/" + filestring,"w")
    else:
      data_file = open("./public/data_sets/TEST_map_files/" + filestring,"w")
    json_string = json.dumps(allYears[i],default=lambda o: o.__dict__,indent=4)
    data_file.write(json_string)
    data_file.close()
  log_file.close()

def generateDatabaseMaps(statusQueue,testFlag):
  log_file = open(log_file_dir + "LOG: " + str(date) + "-DatabaseValues.txt","w").close()
  log_file = open(log_file_dir + "LOG: " + str(date) + "-DatabaseValues.txt","a")
  log_file.write("Generating JSON map files for comparison maps\n")

  connection = db.connect(host,user,password,database)
  cur = connection.cursor()
  earliestYear = dbQuery.getEarliestYear(0,cur)
  numYears = dbQuery.getYearCount(0,cur)
  year = []
  value = []
  allYears = []
  for i in range(numYears + 1):
    year.append([])
    for j in range(len(databaseValues)):
      year[i].append([])
  for i in range(len(databaseValues)):
    allYears.append([])
  currentYear = earliestYear
  if testFlag == 0:
    numLocations = dbQuery.getTableCount(cur)
  else:
    numLocations = 25
  #numLocations = 1
  for i in range(numLocations):
    if i == numLocations-1:
      statusQueue.put(["database_map",1])
    else:
      statusQueue.put(["database_map", (i/float(numLocations))])
    currentYear = earliestYear
    tempValues = []
    tempValues.append(dbQuery.getDrainflowCumulative(i,cur))
    tempValues.append(dbQuery.getSurfacerunoffCumulative(i,cur))
    tempValues.append(dbQuery.getPrecipitationCumulative(i,cur))
    tempValues.append(dbQuery.getPETCumulative(i,cur))
    tempValues.append(dbQuery.getDAE_PETCumulative(i,cur))

    
    #check for outliers
    
    outlierFlag = 0
    logstr = "Location" + str(i) + " Log::Annual (" + str(currentYear) + ") Flagged values:\n"
    if tempValues[0] > 20:
        outlierFlag = 1
        logstr += "\t Drainflow:           " + str(tempValues[0]) + "\n"

    if tempValues[1] > 110:
        outlierFlag = 1
        logstr += "\t Surface runoff:      " + str(tempValues[1]) + "\n"

    if tempValues[2] < 11.70688 or tempValues[2] > 55.424928:
        outlierFlag = 1
        logstr += "\t Precipitation:       " + str(tempValues[2]) + "\n"

    if tempValues[3] > 24.759455:
        outlierFlag = 1
        logstr += "\t PET:                 " + str(tempValues[3]) + "\n"
    
    if tempValues[4] > 24.759455:
        outlierFlag = 1
        logstr += "\t DAE_PET:             " + str(tempValues[4]) + "\n"

    if outlierFlag > 0:
        logstr += "----------------------------------------------------------------------------------\n"
        log_file.write(logstr)
    outlierFlag = 0

    k = 0
    while k < len(tempValues):
      allYears[k].append(tempValues[k])
      k+=1
    for j in range(numYears + 1):
     tempValues = []
     tempValues.append(dbQuery.getAnnualDrainflow(i,currentYear,cur))
     tempValues.append(dbQuery.getAnnualSurfacerunoff(i,currentYear,cur))
     tempValues.append(dbQuery.getAnnualPrecipitation(i,currentYear,cur))
     tempValues.append(dbQuery.getAnnualPET(i,currentYear,cur))
     tempValues.append(dbQuery.getAnnualDAE_PET(i,currentYear,cur))
     #check for outliers
    
     outlierFlag = 0
     logstr = "Location" + str(i) + " Log::Cumulative (All Years) Flagged values:\n"
     if tempValues[0] > 20:
        outlierFlag = 1
        logstr += "\t Drainflow:           " + str(tempValues[0]) + "\n"

     if tempValues[1] > 110:
        outlierFlag = 1
        logstr += "\t Surface runoff:      " + str(tempValues[1]) + "\n"

     if tempValues[2] < 11.70688 or tempValues[2] > 55.424928:
        outlierFlag = 1
        logstr += "\t Precipitation:       " + str(tempValues[2]) + "\n"

     if tempValues[3] > 24.759455:
        outlierFlag = 1
        logstr += "\t PET:                 " + str(tempValues[3]) + "\n"
    
     if tempValues[4] > 24.759455:
        outlierFlag = 1
        logstr += "\t DAE_PET:             " + str(tempValues[4]) + "\n"

     if outlierFlag > 0:
        logstr += "----------------------------------------------------------------------------------\n"
        log_file.write(logstr)
     outlierFlag = 0

     k = 0
     while k < len(tempValues):
       year[j][k].append(tempValues[k])
       k+=1
     currentYear += 1
  for i in range(len(year)):
    for j in range(len(databaseValues)):
      filestring = str(earliestYear + i) + "-" + databaseValues[j] + ".json"
      if testFlag == 0:
        data_file = open("./public/data_sets/map_files/" + filestring,"w")
      else:
        data_file = open("./public/data_sets/TEST_map_files/" + filestring,"w")
      json_string = json.dumps(year[i][j],default=lambda o: o.__dict__,indent=4)
      data_file.write(json_string)
      data_file.close()
  for i in range(len(databaseValues)):
    filestring = "0000-" + databaseValues[i] + ".json"
    if testFlag == 0:
      data_file = open("./public/data_sets/map_files/" + filestring,"w")
    else:
      data_file = open("./public/data_sets/TEST_map_files/" + filestring,"w")
    json_string = json.dumps(allYears[i],default=lambda o: o.__dict__,indent=4)
    data_file.write(json_string)
    data_file.close()
  log_file.close()


    
