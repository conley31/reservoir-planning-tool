import unittest
import MySQLdb as db
import sys
import algorithmEnhanced as algorithm
import json
import imp
import os.path
import math
from random import randint

with open('../config/config.json') as json_data:                                                                                          
	config = json.load(json_data)
host = config.get('mysql').get('host')
user = config.get('mysql').get('user')
password = config.get('mysql').get('password')
database = config.get('mysql').get('database')
log_location = config.get('mysql').get('logLocation')

class TestDatabaseCompletion(unittest.TestCase):

	def test_filesToDatabase(self):
		connection = db.connect(host,user,password,database)
		cur = connection.cursor()
		for l in range(0,5):
			print(l)
			rfile = ""
			if(l == 0):
				rfile = "../public/data_sets/map_data_named/0000-Drainflow.json"
				with open(rfile) as json_data:
					d = json.load(json_data)
					counter = 0
					rand = randint(0,11232)
					f = open(rfile, 'r')
					self.assertEqual(d[rand], algorithm.getDrainflowCumulative(rand, cur))
					f.close()
			elif(l == 1):
				rfile = "../public/data_sets/map_data_named/0000-SurfaceRunoff.json"
				with open(rfile) as json_data:
					d = json.load(json_data)
					counter = 0
					f = open(rfile, 'r')
					rand = randint(0,11232)
					self.assertEqual(d[rand], algorithm.getSurfacerunoffCumulative(rand, cur))
					f.close()
			elif(l == 2):
				rfile = "../public/data_sets/map_data_named/0000-Precipitation.json"
				with open(rfile) as json_data:
					d = json.load(json_data)
					counter = 0
					f = open(rfile, 'r')
					rand = randint(0,11232)
					self.assertEqual(d[rand], algorithm.getPrecipitationCumulative(rand, cur))
					f.close()
			elif(l == 3):
				rfile = "../public/data_sets/map_data_named/0000-Evapotranspiration.json"
				with open(rfile) as json_data:
					d = json.load(json_data)
					counter = 0
					f = open(rfile, 'r')
					rand = randint(0,11232)
					self.assertEqual(d[rand], algorithm.getDAE_PETCumulative(rand, cur))
					f.close()
			elif(l == 4):
				rfile = "../public/data_sets/map_data_named/0000-OpenWaterEvaporation.json"
				with open(rfile) as json_data:
					d = json.load(json_data)
					counter = 0
					f = open(rfile, 'r')
					rand = randint(0,11232)
					self.assertEqual(d[rand], algorithm.getPETCumulative(rand, cur))
					f.close()

		for i in range(1981,2010):
			print(i)
			for l in range(0,5):
				rfile = ""
				if(l == 0):
					rfile = "../public/data_sets/map_data_named/%d-Drainflow.json"%(i)
					with open(rfile) as json_data:
						d = json.load(json_data)
						counter = 0
						f = open(rfile, 'r')
						rand = randint(0,11232)
						self.assertEqual(d[rand], algorithm.getAnnualDrainflow(rand, i, cur))
						f.close()
				elif(l == 1):
					rfile = "../public/data_sets/map_data_named/%d-SurfaceRunoff.json"%(i)
					with open(rfile) as json_data:
						d = json.load(json_data)
						counter = 0
						f = open(rfile, 'r')
						rand = randint(0,11232)
						self.assertEqual(d[rand], algorithm.getAnnualSurfacerunoff(rand, i, cur))
						f.close()
				elif(l == 2):
					rfile = "../public/data_sets/map_data_named/%d-Precipitation.json"%(i)
					with open(rfile) as json_data:
						d = json.load(json_data)
						counter = 0
						f = open(rfile, 'r')
						rand = randint(0,11232)
						self.assertEqual(d[rand], algorithm.getAnnualPrecipitation(rand, i, cur))
						f.close()
				elif(l == 3):
					rfile = "../public/data_sets/map_data_named/%d-Evapotranspiration.json"%(i)
					with open(rfile) as json_data:
						d = json.load(json_data)
						counter = 0
						f = open(rfile, 'r')
						rand = randint(0,11232)
						self.assertEqual(d[rand], algorithm.getAnnualPET(rand, i, cur))
						f.close()
				elif(l == 4):
					rfile = "../public/data_sets/map_data_named/%d-OpenWaterEvaporation.json"%(i)
					with open(rfile) as json_data:
						d = json.load(json_data)
						counter = 0
						f = open(rfile, 'r')
						self.assertEqual(d[rand], algorithm.getAnnualDAE_PET(rand, i, cur))
						f.close()
				

if __name__ == '__main__':
	unittest.main()