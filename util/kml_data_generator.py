import lxml
import json
import algorithmEnhanced
import MySQLdb as db
from pykml import parser
from lxml import etree

with open('../config/config.json') as json_data:
  config = json.load(json_data)
host = config.get('mysql').get('host')
user = config.get('mysql').get('user')
password = config.get('mysql').get('password')
database = config.get('mysql').get('database')
log_location = config.get('mysql').get('logLocation')

with open('doc.kml','rw') as stockKml:
  kmlstr = stockKml.read()

root = parser.fromstring(kmlstr)
prefix = "../public/data_sets/map_data_named/"
computed_file_suffixes = ['AnnualIrrigation','PercentAnnualDrainflow','CapturedDrainflow','IrrigationSufficiency']
database_file_suffixes = ['Drainflow','SurfaceRunoff','Precipitation','Evapotranspiration','OpenWaterEvaporation']

connection = db.connect(host,user,password,database)
cur = connection.cursor()
numLocationsDB = algorithmEnhanced.getTableCount(cur)
volTagCount = 3
soilTagCount = 3

def generateCumulativeKml(statusQueue,testFlag):
  if testFlag == 0:
    numLocations = numLocationsDB
  else: 
    numLocations = 25
  filesMade = 0
  maxFiles = volTagCount*soilTagCount*len(computed_file_suffixes)
  for i in range(volTagCount):
    for j in range(soilTagCount):
      for k in range(len(computed_file_suffixes)):
        if filesMade == maxFiles-1:
          statusQueue.put(["cumulativeKml",1])
        else:
          statusQueue.put(["cumulativeKml",(filesMade/float(maxFiles))])
        filestr = "0000-" + str(i) + '-' + str(j) + '-' + computed_file_suffixes[k]
        jsonfilestr = prefix + filestr + ".json"
        if testFlag == 0:
            kmlfilestr ="../public/data_sets/kml_files/" + filestr + ".kml"
        else:
            kmlfilestr ="../public/data_sets/TEST_kml_files/" + filestr + ".kml"
        with open(jsonfilestr) as data_file:
          data = json.load(data_file)
          loc = 0

          if k == 0: #annual irrigation values
            while loc < numLocations:
              val = data[loc]
              polygon = root.Document.Folder.Placemark[loc]
              polygon.name = "Location ID: " + str(loc)
              polygon.description = computed_file_suffixes[k] + ' ' + str(val)
              if val > 250 :
                polygon.styleUrl = '#darkGray'
              elif val < 50:
                polygon.styleUrl = '#darkOrange'
              elif val < 100:
                polygon.styleUrl = '#verySoftOrange'
              elif val < 150:
                polygon.styleUrl = '#lightGray'
              elif val < 200:
                polygon.styleUrl = '#cyan'
              else:
                polygon.styleUrl = '#darkCyan'
              loc += 1

          elif k == 1:
            while loc < numLocations:
              val = data[loc]
              polygon = root.Document.Folder.Placemark[loc]
              polygon.name = "Location ID: " + str(loc)
              polygon.description = computed_file_suffixes[k] + ' ' + str(val)

              if val > 73.947912 :
                polygon.styleUrl = '#darkGray'
              elif val < 12.5:
                polygon.styleUrl = '#strongRed'
              elif val < 25:
                polygon.styleUrl = '#softOrange'
              elif val < 37.5:
                polygon.styleUrl = '#paleYellow'
              elif val < 50:
                polygon.styleUrl = '#verySoftBlue'
              else:
                polygon.styleUrl = '#darkBlue'
              loc += 1

          elif k ==2:
            while loc < numLocations:
              val = data[loc]
              polygon = root.Document.Folder.Placemark[loc]
              polygon.name = "Location ID: " + str(loc)
              polygon.description = computed_file_suffixes[k] + ' ' + str(val)

              if val > 74.331329 :
                polygon.styleUrl = '#darkGray'
              elif val < 30:
                polygon.styleUrl = '#strongRed'
              elif val < 60:
                polygon.styleUrl = '#softOrange'
              elif val < 90:
                polygon.styleUrl = '#paleYellow'
              elif val < 120:
                polygon.styleUrl = '#verySoftBlue'
              else:
                polygon.styleUrl = '#strongYellow'
              loc += 1

          elif k == 3:
            while loc < numLocations:
              val = data[loc]
              polygon = root.Document.Folder.Placemark[loc]
              polygon.name = "Location ID: " + str(loc)
              polygon.description = computed_file_suffixes[k] + ' ' + str(val)

              if val > 100 :
                polygon.styleUrl = '#darkGray'
              elif val == 0:
                polygon.styleUrl = '#darkOrange'
              elif val < 25:
                polygon.styleUrl = '#softOrange'
              elif val < 50:
                polygon.styleUrl = '#paleYellow'
              elif val < 75:
                polygon.styleUrl = '#verySoftBlue'
              else:
                polygon.styleUrl = '#strongYellow'
              loc += 1
        new_kml = open(kmlfilestr,'w')
        new_kml.write(etree.tostring(root,pretty_print=True))
        new_kml.close()
        filesMade += 1


#now do the yearly data
def generateYearlyKml(statusQueue,testFlag):
  if testFlag == 0:
    numLocations = numLocationsDB
  else: 
    numLocations = 25
  earliestYear = 1981
  numYears = 28 + 1
  filesMade = 0
  maxFiles = soilTagCount * volTagCount * len(computed_file_suffixes) * numYears
  for i in range(volTagCount):
    for j in range(soilTagCount):
      for k in range(len(computed_file_suffixes)): 
        currentYear = earliestYear
        for l in range(numYears):
          if filesMade == maxFiles-1:
            statusQueue.put(["yearlyKml",1])
          else:
            statusQueue.put(["yearlyKml",(filesMade/float(maxFiles))])
          filestr = str(currentYear) + '-' + str(i) + '-' + str(j) + '-' + computed_file_suffixes[k]
          currentYear += 1
          jsonfilestr = prefix + filestr + ".json"
          if testFlag == 0:
            kmlfilestr ="../public/data_sets/kml_files/" + filestr + ".kml"
          else:
            kmlfilestr ="../public/data_sets/TEST_kml_files/" + filestr + ".kml"

          with open(jsonfilestr) as data_file:
            data = json.load(data_file)
          loc = 0

          if k == 0: #annual irrigation values
            while loc < numLocations:
              val = data[loc]
              polygon = root.Document.Folder.Placemark[loc]
              polygon.name = "Location ID: " + str(loc)
              polygon.description = computed_file_suffixes[k] + ' ' + str(val)

              if val > 250 :
                polygon.styleUrl = '#darkGray'
              elif val < 50:
                polygon.styleUrl = '#darkOrange'
              elif val < 100:
                polygon.styleUrl = '#verySoftOrange'
              elif val < 150:
                polygon.styleUrl = '#lightGray'
              elif val < 200:
                polygon.styleUrl = '#cyan'
              else:
                polygon.styleUrl = '#darkCyan'
              loc += 1

          elif k == 1:
            while loc < numLocations:
              val = data[loc]
              polygon = root.Document.Folder.Placemark[loc]
              polygon.name = "Location ID: " + str(loc)
              polygon.description = computed_file_suffixes[k] + ' ' + str(val)

              if val > 73.947912 :
                polygon.styleUrl = '#darkGray'
              elif val < 12.5:
                polygon.styleUrl = '#strongRed'
              elif val < 25:
                polygon.styleUrl = '#softOrange'
              elif val < 37.5:
                polygon.styleUrl = '#paleYellow'
              elif val < 50:
                polygon.styleUrl = '#verySoftBlue'
              else:
                polygon.styleUrl = '#darkBlue'
              loc += 1

          elif k ==2:
            while loc < numLocations:
              val = data[loc]
              polygon = root.Document.Folder.Placemark[loc]
              polygon.name = "Location ID: " + str(loc)
              polygon.description = computed_file_suffixes[k] + ' ' + str(val)

              if val > 74.331329 :
                polygon.styleUrl = '#darkGray'
              elif val < 30:
                polygon.styleUrl = '#strongRed'
              elif val < 60:
                polygon.styleUrl = '#softOrange'
              elif val < 90:
                polygon.styleUrl = '#paleYellow'
              elif val < 120:
                polygon.styleUrl = '#verySoftBlue'
              else:
                polygon.styleUrl = '#strongYellow'
              loc += 1

          elif k == 3:
            while loc < numLocations:
              val = data[loc]
              polygon = root.Document.Folder.Placemark[loc]
              polygon.name = "Location ID: " + str(loc)
              polygon.description = computed_file_suffixes[k] + ' ' + str(val)

              if val > 100 :
                polygon.styleUrl = '#darkGray'
              elif val == 0:
                polygon.styleUrl = '#darkOrange'
              elif val < 25:
                polygon.styleUrl = '#softOrange'
              elif val < 50:
                polygon.styleUrl = '#paleYellow'
              elif val < 75:
                polygon.styleUrl = '#verySoftBlue'
              else:
                polygon.styleUrl = '#strongYellow'
              loc += 1
          new_kml = open(kmlfilestr,'w')
          new_kml.write(etree.tostring(root,pretty_print=True))
          new_kml.close()
          filesMade += 1

def generateCumulativeDatabaseKml(statusQueue,testFlag):
  if testFlag == 0:
    numLocations = numLocationsDB
  else: 
    numLocations = 25
  filesMade = 0
  maxFiles = len(database_file_suffixes)
  for i in range(len(database_file_suffixes)):
    if filesMade == maxFiles-1:
      statusQueue.put(["cumulativeDatabaseKml",1])
    else:
      statusQueue.put(["cumulativeDatabaseKml",(filesMade/float(maxFiles))])
    filestr = "0000-" + database_file_suffixes[i]
    jsonfilestr = prefix + filestr + ".json"
    if testFlag == 0:
        kmlfilestr ="../public/data_sets/kml_files/" + filestr + ".kml"
    else:
        kmlfilestr ="../public/data_sets/TEST_kml_files/" + filestr + ".kml"
    with open(jsonfilestr) as data_file:
      data = json.load(data_file)
    loc = 0
    if i == 0: #drainflow
      while loc < numLocations:
        val = data[loc]
        polygon = root.Document.Folder.Placemark[loc]
        polygon.name = "Location ID: " + str(loc)
        polygon.description = database_file_suffixes[i] + ' ' + str(val)

        if val  > 20:
          polygon.styleUrl = '#darkGray'
        elif val < 1.5 :
          polygon.styleUrl = '#lightGrayishViolet'
        elif val < 3:
          polygon.styleUrl = '#lightGrayishBlue'
        elif val < 4.5:
          polygon.styleUrl = '#desaturatedBlue'
        elif val < 6:
          polygon.styleUrl = '#strongBlue'
        else:
          polygon.styleUrl = '#darkBlue'
        loc += 1

    elif i == 1: #surface runoff
      while loc < numLocations:
        val = data[loc]
        polygon = root.Document.Folder.Placemark[loc]
        polygon.name = "Location ID: " + str(loc)
        polygon.description = database_file_suffixes[i] + ' ' + str(val)

        if val > 110:
          polygon.styleUrl = '#darkGray'
        elif val < 25 :
          polygon.styleUrl = '#paleYellow'
        elif val < 50:
          polygon.styleUrl = '#softOrange'
        elif val < 75:
          polygon.styleUrl = '#brightOrange'
        elif val < 100:
          polygon.styleUrl = '#vividOrange'
        else:
          polygon.styleUrl = '#darkOrange'
        loc += 1

    elif i == 2: #Precipitation
      while loc < numLocations:
        val = data[loc]
        polygon = root.Document.Folder.Placemark[loc]
        polygon.name = "Location ID: " + str(loc)
        polygon.description = database_file_suffixes[i] + ' ' + str(val)

        if val < 11.70688 or val > 55.424928:
          polygon.styleUrl = '#darkGray'
        elif val < 12.5 :
          polygon.styleUrl = '#veryPaleYellow'
        elif val < 25:
          polygon.styleUrl = '#limeGreen'
        elif val < 37.5:
          polygon.styleUrl = '#cyan'
        elif val < 50:
          polygon.styleUrl = '#stongBlue'
        else:
          polygon.styleUrl = '#darkBlue'
        loc += 1

    elif i == 3: #PET
      while loc < numLocations:
        val = data[loc]
        polygon = root.Document.Folder.Placemark[loc]
        polygon.name = "Location ID: " + str(loc)
        polygon.description = database_file_suffixes[i] + ' ' + str(val)

        if val > 24.759455:
          polygon.styleUrl = '#darkGray'
        elif val < 5 :
          polygon.styleUrl = '#lightGray'
        elif val < 10:
          polygon.styleUrl = '#verySoftBlue'
        elif val < 15:
          polygon.styleUrl = '#desaturatedBlue'
        elif val < 20:
          polygon.styleUrl - '#violet'
        else:
         polygon.styleUrl = '#magenta'
        loc += 1

    elif i == 4: #DAE_PET
      while loc < numLocations:
        val = data[loc]
        polygon = root.Document.Folder.Placemark[loc]
        polygon.name = "Location ID: " + str(loc)
        polygon.description = database_file_suffixes[i] + ' ' + str(val)

        if val > 24.759455:
          polygon.styleUrl = '#darkGray'
        elif val < 5 :
          polygon.styleUrl = '#lightGray'
        elif val < 10:
          polygon.styleUrl = '#cyan'
        elif val < 15:
          polygon.styleUrl = '#limeGreen'
        elif val < 20:
          polygon.styleUrl = '#darkGreen'
        else:
          polygon.styleUrl = '#veryDarkGreen'
        loc += 1

    new_kml = open(kmlfilestr,'w')
    new_kml.write(etree.tostring(root,pretty_print=True))
    new_kml.close()
    filesMade += 1

def generateYearlyDatabaseKml(statusQueue,testFlag):
  if testFlag == 0:
    numLocations = numLocationsDB
  else: 
    numLocations = 25
  earliestYear = 1981
  numYears = 28 + 1
  filesMade = 0
  maxFiles = len(database_file_suffixes) * numYears
  for i in range(len(database_file_suffixes)):
    currentYear = earliestYear
    for j in range(numYears):
      if filesMade == maxFiles-1:
        statusQueue.put(["YearlyDatabaseKml",1])
      else:
        statusQueue.put(["YearlyDatabaseKml",(filesMade/float(maxFiles))])

      filestr = str(currentYear) + '-' + database_file_suffixes[i]
      currentYear += 1
      jsonfilestr = prefix + filestr + ".json"
      if testFlag == 0:
        kmlfilestr ="../public/data_sets/kml_files/" + filestr + ".kml"
      else:
        kmlfilestr ="../public/data_sets/TEST_kml_files/" + filestr + ".kml"
      with open(jsonfilestr) as data_file:
        data = json.load(data_file)
      loc = 0

      if i == 0: #drainflow
        while loc < numLocations:
          val = data[loc]
          polygon = root.Document.Folder.Placemark[loc]
          polygon.name = "Location ID: " + str(loc)
          polygon.description = database_file_suffixes[i] + ' ' + str(val)

          if val > 20:
            polygon.styleUrl = '#darkGray'
          elif val < 1.5 :
            polygon.styleUrl = '#lightGrayishViolet'
          elif val < 3:
            polygon.styleUrl = '#lightGrayishBlue'
          elif val < 4.5:
            polygon.styleUrl = '#desaturatedBlue'
          elif val < 6:
            polygon.styleUrl = '#strongBlue'
          else:
            polygon.styleUrl = '#darkBlue'
          loc += 1

      elif i == 1: #surface runoff
        while loc < numLocations:
          val = data[loc]
          polygon = root.Document.Folder.Placemark[loc]
          polygon.name = "Location ID: " + str(loc)
          polygon.description = database_file_suffixes[i] + ' ' + str(val)

          if val > 110:
            polygon.styleUrl = '#darkGray'
          elif val < 25 :
            polygon.styleUrl = '#paleYellow'
          elif val < 50:
            polygon.styleUrl = '#softOrange'
          elif val < 75:
            polygon.styleUrl = '#brightOrange'
          elif val < 100:
            polygon.styleUrl = '#vividOrange'
          else:
            polygon.styleUrl = '#darkOrange'
          loc += 1

      elif i == 2: #Precipitation
        while loc < numLocations:
          val = data[loc]
          polygon = root.Document.Folder.Placemark[loc]
          polygon.name = "Location ID: " + str(loc)
          polygon.description = database_file_suffixes[i] + ' ' + str(val)

          if val < 11.70688 or val > 55.424928:
            polygon.styleUrl = '#darkGray'
          elif val < 12.5 :
            polygon.styleUrl = '#veryPaleYellow'
          elif val < 25:
            polygon.styleUrl = '#limeGreen'
          elif val < 37.5:
            polygon.styleUrl = '#cyan'
          elif val < 50:
            polygon.styleUrl = '#stongBlue'
          else:
            polygon.styleUrl = '#darkBlue'
          loc += 1

      elif i == 3: #PET
          while loc < numLocations:
            val = data[loc]
            polygon = root.Document.Folder.Placemark[loc]
            polygon.name = "Location ID: " + str(loc)
            polygon.description = database_file_suffixes[i] + ' ' + str(val)

            if val > 24.759455:
              polygon.styleUrl = '#darkGray'
            elif val < 5 :
              polygon.styleUrl = '#lightGray'
            elif val < 10:
              polygon.styleUrl = '#verySoftBlue'
            elif val < 15:
              polygon.styleUrl = '#desaturatedBlue'
            elif val < 20:
              polygon.styleUrl - '#violet'
            else:
              polygon.styleUrl = '#magenta'
            loc += 1

      elif i == 4: #DAE_PET
          while loc < numLocations:
            val = data[loc]
            polygon = root.Document.Folder.Placemark[loc]
            polygon.name = "Location ID: " + str(loc)
            polygon.description = database_file_suffixes[i] + ' ' + str(val)

            if val > 24.759455:
              polygon.styleUrl = '#darkGray'
            elif val < 5 :
              polygon.styleUrl = '#lightGray'
            elif val < 10:
              polygon.styleUrl = '#cyan'
            elif val < 15:
              polygon.styleUrl = '#limeGreen'
            elif val < 20:
              polygon.styleUrl = '#darkGreen'
            else:
              polygon.styleUrl = '#veryDarkGreen'
            loc += 1

      new_kml = open(kmlfilestr,'w')
      new_kml.write(etree.tostring(root,pretty_print=True))
      new_kml.close()
      filesMade += 1



