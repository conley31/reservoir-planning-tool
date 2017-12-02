import unittest
import MySQLdb as db
import sys
sys.path.insert(0, './util/regional_map/')
import sql_queries as dbQuery
import json
import imp
import os.path
import math

with open('./config/config.json') as json_data:                                                                                          
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
				rfile = "./public/data_sets/map_files/0000-Drainflow.json"
				with open(rfile) as json_data:
					d = json.load(json_data)
					counter = 0
					f = open(rfile, 'r')
					for a in range(0,11232):
						self.assertEqual(d[a], dbQuery.getDrainflowCumulative(a, cur))
					f.close()
			elif(l == 1):
				rfile = "./public/data_sets/map_files/0000-SurfaceRunoff.json"
				with open(rfile) as json_data:
					d = json.load(json_data)
					counter = 0
					f = open(rfile, 'r')
					for a in range(0,11232):
						self.assertEqual(d[a], dbQuery.getSurfacerunoffCumulative(a, cur))
					f.close()
			elif(l == 2):
				rfile = "./public/data_sets/map_files/0000-Precipitation.json"
				with open(rfile) as json_data:
					d = json.load(json_data)
					counter = 0
					f = open(rfile, 'r')
					for a in range(0,11232):
						self.assertEqual(d[a], dbQuery.getPrecipitationCumulative(a, cur))
					f.close()
			elif(l == 3):
				rfile = "./public/data_sets/map_files/0000-Evapotranspiration.json"
				with open(rfile) as json_data:
					d = json.load(json_data)
					counter = 0
					f = open(rfile, 'r')
					for a in range(0,11232):
						self.assertEqual(d[a], dbQuery.getDAE_PETCumulative(a, cur))
					f.close()
			elif(l == 4):
				rfile = "./public/data_sets/map_files/0000-OpenWaterEvaporation.json"
				with open(rfile) as json_data:
					d = json.load(json_data)
					counter = 0
					f = open(rfile, 'r')
					for a in range(0,11232):
						self.assertEqual(d[a], dbQuery.getPETCumulative(a, cur))
					f.close()

		for i in range(1981,2010):
			for l in range(0,5):
				rfile = ""
				if(l == 0):
					rfile = "./public/data_sets/map_files/%d-Drainflow.json"%(i)
					with open(rfile) as json_data:
						d = json.load(json_data)
						counter = 0
						f = open(rfile, 'r')
						for a in range(0,11232):
							self.assertEqual(d[a], dbQuery.getAnnualDrainflow(a, i, cur))
						f.close()
				elif(l == 1):
					rfile = "./public/data_sets/map_files/%d-SurfaceRunoff.json"%(i)
					with open(rfile) as json_data:
						d = json.load(json_data)
						counter = 0
						f = open(rfile, 'r')
						for a in range(0,11232):
							self.assertEqual(d[a], dbQuery.getAnnualSurfacerunoff(a, i, cur))
						f.close()
				elif(l == 2):
					rfile = "./public/data_sets/map_files/%d-Precipitation.json"%(i)
					with open(rfile) as json_data:
						d = json.load(json_data)
						counter = 0
						f = open(rfile, 'r')
						for a in range(0,11232):
							self.assertEqual(d[a], dbQuery.getAnnualPrecipitation(a, i, cur))
						f.close()
				elif(l == 3):
					rfile = "./public/data_sets/map_files/%d-Evapotranspiration.json"%(i)
					with open(rfile) as json_data:
						d = json.load(json_data)
						counter = 0
						f = open(rfile, 'r')
						for a in range(0,11232):
							self.assertEqual(d[a], dbQuery.getAnnualPET(a, i, cur))
						f.close()
				elif(l == 4):
					rfile = "./public/data_sets/map_files/%d-OpenWaterEvaporation.json"%(i)
					with open(rfile) as json_data:
						d = json.load(json_data)
						counter = 0
						f = open(rfile, 'r')
						for a in range(0,11232):
							self.assertEqual(d[a], dbQuery.getAnnualDAE_PET(a, i, cur))
						f.close()
				

if __name__ == '__main__':
	unittest.main()
