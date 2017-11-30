import unittest
import MySQLdb as db
import algorithmEnhanced
import os, os.path
import json
with open('../config/config.json') as json_data:
  config = json.load(json_data)
host = config.get('mysql').get('host')
user = config.get('mysql').get('user')
password = config.get('mysql').get('password')
database = config.get('mysql').get('database')
log_location = config.get('mysql').get('logLocation')
connection = db.connect(host,user,password,database)
cur = connection.cursor()
numLocations = algorithmEnhanced.getTableCount(cur) 
numYears = 29
earliestYear = 1981
volTagCount = 3
soilTagCount = 3

file_suffixes = ['AnnualIrrigation','PercentAnnualDrainflow','CapturedDrainflow','IrrigationSufficiency']
db_file_suffixes = ['Drainflow','SurfaceRunoff','Precipitation','Evapotranspiration','OpenWaterEvaporation']
#expected number of files is (number of volumes * number of soil constraints * 4 computed values)
#                           +(number of volumes * number of soil constraints * 4 computed values * number of years)_
#                           +(database values)
#                           +(database values * number of years)
expected_data_file_count = (3 * 3 * 4) + (3 * 3 * 4 * 29) + (5) + (5 * 29)

class VerifyMapDataCount(unittest.TestCase):
  #assert the number of json files is correct
  def test_map_data_file_count(self):
    DIR = '../public/data_sets/map_data_named'
    map_data_named_count = len([name for name in os.listdir(DIR) if name.endswith(".json")])
    print("Asserting the number of .json files(" + str(map_data_named_count) + ") is equal to expected(" + str(expected_data_file_count) + ')') 
    self.assertEqual(map_data_named_count,expected_data_file_count)
  #assert the number of kml files is correct
  def test_kml_file_count(self):
    DIR = '../public/data_sets/kml_files'
    kml_files_count = len([name for name in os.listdir(DIR) if name.endswith(".kml")])
    print("Asserting the number of .kml files(" + str(kml_files_count) + ") is equal to expected(" + str(expected_data_file_count) + ')') 
    self.assertEqual(kml_files_count ,expected_data_file_count)

 #the next four functions check whether each file used to color the map contains all the locations expected
  def test_num_locations_json_computed(self):
    print("Asserting that the files used to color the map have a value for each location. Also ensures json structure, as they would not otherwise parse in this unit test")
    DIR = '../public/data_sets/map_data_named/'
    for i in range(volTagCount):
      for j in range(soilTagCount):
        for k in range(len(file_suffixes)):
          filestr = DIR + "0000-" + str(i) + '-' + str(j) + '-' + file_suffixes[k] + ".json"
          with open(filestr) as json_data:
            tmpjson = json.load(json_data)
          self.assertEqual(numLocations,len(tmpjson))

  def test_num_locations_json_computed_yearly(self):
    DIR = '../public/data_sets/map_data_named/'
    for i in range(volTagCount):
      for j in range(soilTagCount):
        for k in range(len(file_suffixes)):
          currentYear = earliestYear
          for l in range(numYears):
            filestr = DIR + str(currentYear) + '-' + str(i) + '-' + str(j) + '-' + file_suffixes[k] + ".json"
            currentYear += 1
            with open(filestr) as json_data:
              tmpjson = json.load(json_data)
            self.assertEqual(numLocations,len(tmpjson))

  def test_num_locations_json_db(self):
    DIR = '../public/data_sets/map_data_named/'
    for i in range(len(db_file_suffixes)):
      filestr = DIR + "0000-" + db_file_suffixes[i] + ".json"
      with open(filestr) as json_data:
        tmpjson = json.load(json_data)
      self.assertEqual(numLocations,len(tmpjson))

  def test_num_locations_json_db_yearly(self):
    DIR = '../public/data_sets/map_data_named/'
    for i in range(len(db_file_suffixes)):
      currentYear = earliestYear
      for j in range(numYears):
        filestr = DIR + str(currentYear) + '-' + db_file_suffixes[i] + ".json"
        currentYear += 1
        with open(filestr) as json_data:
          tmpjson = json.load(json_data)
        self.assertEqual(numLocations,len(tmpjson))

if __name__ == '__main__':
  unittest.main()

    
 

