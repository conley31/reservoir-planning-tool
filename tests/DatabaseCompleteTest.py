import unittest
import MySQLdb as db
import sys
sys.path.insert(0, '../util/')
import algorithmEnhanced as algorithm
import json
import imp
import os.path
import math

with open('../config/config.json') as json_data:                                                                                          
	config = json.load(json_data)
host = config.get('mysql').get('host')
user = config.get('mysql').get('user')
password = config.get('mysql').get('password')
database = config.get('mysql').get('database')
log_location = config.get('mysql').get('logLocation')
connection = db.connect(host,user,password,database)
cur = connection.cursor()
numLocations = algorithm.getTableCount(cur)

#expected number of files is (number of volumes * number of soil constraints * 4 computed values)
#                           +(number of volumes * number of soil constraints * 4 computed values * number of years)_
#                           +(database values)
#                           +(database values * number of years)
expected_data_file_count = (3 * 3 * 4) + (3 * 3 * 4 * 29) + (5) + (5 * 29)


class TestDatabaseCompletion(unittest.TestCase):
	def test_filesExist(self):
		for i in range(1981, 2010):
			for j in range(0,3):
				for k in range(0,3):
					for l in range(0,4):
						rfile = ""
						if(l == 0):
							rfile = "../public/data_sets/map_data_named/%d-%d-%d-AnnualIrrigation.json"%(i,j,k)
						elif(l == 1):
							rfile = "../public/data_sets/map_data_named/%d-%d-%d-PercentAnnualDrainflow.json"%(i,j,k)
						elif(l == 2):
							rfile = "../public/data_sets/map_data_named/%d-%d-%d-CapturedDrainflow.json"%(i,j,k)
						elif(l == 3):
							rfile = "../public/data_sets/map_data_named/%d-%d-%d-IrrigationSufficiency.json"%(i,j,k)
						self.assertTrue(os.path.isfile(rfile))

		for j in range(0,3):
				for k in range(0,3):
					for l in range(0,4):
						rfile = ""
						if(l == 0):
							rfile = "../public/data_sets/map_data_named/0000-%d-%d-AnnualIrrigation.json"%(j,k)
						elif(l == 1):
							rfile = "../public/data_sets/map_data_named/0000-%d-%d-PercentAnnualDrainflow.json"%(j,k)
						elif(l == 2):
							rfile = "../public/data_sets/map_data_named/0000-%d-%d-CapturedDrainflow.json"%(j,k)
						elif(l == 3):
							rfile = "../public/data_sets/map_data_named/0000-%d-%d-IrrigationSufficiency.json"%(j,k)
						self.assertTrue(os.path.isfile(rfile))


		for l in range(0,5):
			rfile = ""
			if(l == 0):
				rfile = "../public/data_sets/map_data_named/0000-Drainflow.json"
			elif(l == 1):
				rfile = "../public/data_sets/map_data_named/0000-SurfaceRunoff.json"
			elif(l == 2):
				rfile = "../public/data_sets/map_data_named/0000-Precipitation.json"
			elif(l == 3):
				rfile = "../public/data_sets/map_data_named/0000-Evapotranspiration.json"
			elif(l == 4):
				rfile = "../public/data_sets/map_data_named/0000-OpenWaterEvaporation.json"
			self.assertTrue(os.path.isfile(rfile))

		for i in range(1981,2010):
			for l in range(0,5):
				rfile = ""
				if(l == 0):
					rfile = "../public/data_sets/map_data_named/%d-Drainflow.json"%(i)
				elif(l == 1):
					rfile = "../public/data_sets/map_data_named/%d-SurfaceRunoff.json"%(i)
				elif(l == 2):
					rfile = "../public/data_sets/map_data_named/%d-Precipitation.json"%(i)
				elif(l == 3):
					rfile = "../public/data_sets/map_data_named/%d-Evapotranspiration.json"%(i)
				elif(l == 4):
					rfile = "../public/data_sets/map_data_named/%d-OpenWaterEvaporation.json"%(i)
				self.assertTrue(os.path.isfile(rfile))

	def test_map_data_file_count(self):
		DIR = '../public/data_sets/map_data_named'
		map_data_named_count = len([name for name in os.listdir(DIR) if name.endswith(".json")])
		print("Asserting the number of .json files(" + str(map_data_named_count) + ") is equal to expected(" + str(expected_data_file_count) + ')') 
		self.assertEqual(map_data_named_count,expected_data_file_count)

	def test_kml_file_count(self):
		DIR = '../public/data_sets/kml_files'
		kml_files_count = len([name for name in os.listdir(DIR) if name.endswith(".zip")])
		print("Asserting the number of .kml files(" + str(kml_files_count) + ") is equal to expected(" + str(expected_data_file_count) + ')') 
		self.assertEqual(kml_files_count ,expected_data_file_count)

	def test_fileSize(self):
		for i in range(1981, 2010):
			for j in range(0,3):
				for k in range(0,3):
					for l in range(0,4):
						rfile = ""
						if(l == 0):
							rfile = "../public/data_sets/map_data_named/%d-%d-%d-AnnualIrrigation.json"%(i,j,k)
						elif(l == 1):
							rfile = "../public/data_sets/map_data_named/%d-%d-%d-PercentAnnualDrainflow.json"%(i,j,k)
						elif(l == 2):
							rfile = "../public/data_sets/map_data_named/%d-%d-%d-CapturedDrainflow.json"%(i,j,k)
						elif(l == 3):
							rfile = "../public/data_sets/map_data_named/%d-%d-%d-IrrigationSufficiency.json"%(i,j,k)
						with open(rfile) as json_data:
							d = json.load(json_data)
							counter = 0
							f = open(rfile, 'r')
							self.assertEqual(len(d), numLocations)
							f.close()

		for j in range(0,3):
				for k in range(0,3):
					for l in range(0,4):
						rfile = ""
						if(l == 0):
							rfile = "../public/data_sets/map_data_named/0000-%d-%d-AnnualIrrigation.json"%(j,k)
						elif(l == 1):
							rfile = "../public/data_sets/map_data_named/0000-%d-%d-PercentAnnualDrainflow.json"%(j,k)
						elif(l == 2):
							rfile = "../public/data_sets/map_data_named/0000-%d-%d-CapturedDrainflow.json"%(j,k)
						elif(l == 3):
							rfile = "../public/data_sets/map_data_named/0000-%d-%d-IrrigationSufficiency.json"%(j,k)
						with open(rfile) as json_data:
							d = json.load(json_data)
							counter = 0
							f = open(rfile, 'r')
							self.assertEqual(len(d), numLocations)
							f.close()


		for l in range(0,5):
			rfile = ""
			if(l == 0):
				rfile = "../public/data_sets/map_data_named/0000-Drainflow.json"
			elif(l == 1):
				rfile = "../public/data_sets/map_data_named/0000-SurfaceRunoff.json"
			elif(l == 2):
				rfile = "../public/data_sets/map_data_named/0000-Precipitation.json"
			elif(l == 3):
				rfile = "../public/data_sets/map_data_named/0000-Evapotranspiration.json"
			elif(l == 4):
				rfile = "../public/data_sets/map_data_named/0000-OpenWaterEvaporation.json"
			with open(rfile) as json_data:
				d = json.load(json_data)
				counter = 0
				f = open(rfile, 'r')
				self.assertEqual(len(d), numLocations)
				f.close()

		for i in range(1981,2010):
			for l in range(0,5):
				rfile = ""
				if(l == 0):
					rfile = "../public/data_sets/map_data_named/%d-Drainflow.json"%(i)
				elif(l == 1):
					rfile = "../public/data_sets/map_data_named/%d-SurfaceRunoff.json"%(i)
				elif(l == 2):
					rfile = "../public/data_sets/map_data_named/%d-Precipitation.json"%(i)
				elif(l == 3):
					rfile = "../public/data_sets/map_data_named/%d-Evapotranspiration.json"%(i)
				elif(l == 4):
					rfile = "../public/data_sets/map_data_named/%d-OpenWaterEvaporation.json"%(i)
				with open(rfile) as json_data:
					d = json.load(json_data)
					counter = 0
					f = open(rfile, 'r')
					self.assertEqual(len(d), numLocations)
					f.close()



if __name__ == '__main__':
	unittest.main()
