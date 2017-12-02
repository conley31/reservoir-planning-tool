import unittest
import MySQLdb as db
import sys
sys.path.insert(0, './util/regional_map/')
import sql_queries as dbQuery
import json
import imp
import math

with open('./config/config.json') as json_data:                                                                                          
	config = json.load(json_data)
host = config.get('mysql').get('host')
user = config.get('mysql').get('user')
password = config.get('mysql').get('password')
database = config.get('mysql').get('database')
log_location = config.get('mysql').get('logLocation')

class TestDatabaseQuality(unittest.TestCase):

	def test_testingTable(self):
		connection = db.connect(host,user,password,database)
		cur = connection.cursor()
		self.assertEqual(dbQuery.getTableCount(cur),11232)

	def test_negative(self):
		for i in range(1981, 2010):
			for j in range(0,3):
				for k in range(0,3):
					for l in range(0,4):
						rfile = ""
						if(l == 0):
							rfile = "./public/data_sets/map_files/%d-%d-%d-AnnualIrrigation.json"%(i,j,k)
						elif(l == 1):
							rfile = "./public/data_sets/map_files/%d-%d-%d-PercentAnnualDrainflow.json"%(i,j,k)
						elif(l == 2):
							rfile = "./public/data_sets/map_files/%d-%d-%d-CapturedDrainflow.json"%(i,j,k)
						elif(l == 3):
							rfile = "./public/data_sets/map_files/%d-%d-%d-IrrigationSufficiency.json"%(i,j,k)
						with open(rfile) as json_data:
							d = json.load(json_data)
							f = open(rfile, 'r')
							for a in range(0,11232):
								self.assertGreaterEqual(d[a], 0)
							f.close()

		for j in range(0,3):
				for k in range(0,3):
					for l in range(0,4):
						rfile = ""
						if(l == 0):
							rfile = "./public/data_sets/map_files/0000-%d-%d-AnnualIrrigation.json"%(j,k)
						elif(l == 1):
							rfile = "./public/data_sets/map_files/0000-%d-%d-PercentAnnualDrainflow.json"%(j,k)
						elif(l == 2):
							rfile = "./public/data_sets/map_files/0000-%d-%d-CapturedDrainflow.json"%(j,k)
						elif(l == 3):
							rfile = "./public/data_sets/map_files/0000-%d-%d-IrrigationSufficiency.json"%(j,k)
						with open(rfile) as json_data:
							d = json.load(json_data)
							counter = 0
							f = open(rfile, 'r')
							for a in range(0,11232):
								self.assertGreaterEqual(d[a], 0)
							f.close()


		for l in range(0,5):
			rfile = ""
			if(l == 0):
				rfile = "./public/data_sets/map_files/0000-Drainflow.json"
			elif(l == 1):
				rfile = "./public/data_sets/map_files/0000-SurfaceRunoff.json"
			elif(l == 2):
				rfile = "./public/data_sets/map_files/0000-Precipitation.json"
			elif(l == 3):
				rfile = "./public/data_sets/map_files/0000-Evapotranspiration.json"
			elif(l == 4):
				rfile = "./public/data_sets/map_files/0000-OpenWaterEvaporation.json"
			with open(rfile) as json_data:
				d = json.load(json_data)
				counter = 0
				f = open(rfile, 'r')
				for a in range(0,11232):
					self.assertGreaterEqual(d[a], 0)
				f.close()

		for i in range(1981,2010):
			for l in range(0,5):
				rfile = ""
				if(l == 0):
					rfile = "./public/data_sets/map_files/%d-Drainflow.json"%(i)
				elif(l == 1):
					rfile = "./public/data_sets/map_files/%d-SurfaceRunoff.json"%(i)
				elif(l == 2):
					rfile = "./public/data_sets/map_files/%d-Precipitation.json"%(i)
				elif(l == 3):
					rfile = "./public/data_sets/map_files/%d-Evapotranspiration.json"%(i)
				elif(l == 4):
					rfile = "./public/data_sets/map_files/%d-OpenWaterEvaporation.json"%(i)
				with open(rfile) as json_data:
					d = json.load(json_data)
					counter = 0
					f = open(rfile, 'r')
					for a in range(0,11232):
						self.assertGreaterEqual(d[a], 0)
					f.close()

	def test_percentage(self):
		for i in range(1981, 2010):
			for j in range(0,3):
				for k in range(0,3):
					rfile = ""
					rfile = "./public/data_sets/map_files/%d-%d-%d-IrrigationSufficiency.json"%(i,j,k)
					with open(rfile) as json_data:
						d = json.load(json_data)
						f = open(rfile, 'r')
						for a in range(0,11232):
							self.assertLessEqual(d[a], 100)
						f.close()

		for j in range(0,3):
			for k in range(0,3):
				rfile = ""
				rfile = "./public/data_sets/map_files/0000-%d-%d-IrrigationSufficiency.json"%(j,k)
				with open(rfile) as json_data:
					d = json.load(json_data)
					counter = 0
					f = open(rfile, 'r')
					for a in range(0,11232):
						self.assertLessEqual(d[a], 100)
					f.close()

	
	def test_capturedOutlier(self):
		for i in range(1981, 2010):
			for j in range(0,3):
				for k in range(0,3):
					rfile = ""
					rfile = "./public/data_sets/map_files/%d-%d-%d-CapturedDrainflow.json"%(i,j,k)
					with open(rfile) as json_data:
						d = json.load(json_data)
						f = open(rfile, 'r')
						count = 0
						for a in range(0,11231):
							if(d[a] > 74.331329):
								count = count + 1
						self.assertLessEqual(count, math.ceil(.25*11231))
						f.close()

		for j in range(0,3):
			for k in range(0,3):
				rfile = ""
				rfile = "./public/data_sets/map_files/0000-%d-%d-CapturedDrainflow.json"%(j,k)
				with open(rfile) as json_data:
					d = json.load(json_data)
					counter = 0
					f = open(rfile, 'r')
					count = 0
					for a in range(0,11232):
						if(d[a] > 74.331329):
								count = count + 1
						self.assertLessEqual(count, math.ceil(.4 * 11231))
					f.close()

	def test_annualOutlier(self):
		for i in range(1981, 2010):
			for j in range(0,3):
				for k in range(0,3):
					rfile = ""
					rfile = "./public/data_sets/map_files/%d-%d-%d-AnnualIrrigation.json"%(i,j,k)
					with open(rfile) as json_data:
						d = json.load(json_data)
						f = open(rfile, 'r')
						count = 0
						for a in range(0,11232):
							if(d[a] > 46.53580418):
								count = count + 1
						self.assertLessEqual(count, math.ceil(.25*11231))
						f.close()

		for j in range(0,3):
			for k in range(0,3):
				rfile = ""
				rfile = "./public/data_sets/map_files/0000-%d-%d-AnnualIrrigation.json"%(j,k)
				with open(rfile) as json_data:
					d = json.load(json_data)
					counter = 0
					f = open(rfile, 'r')
					count = 0
					for a in range(0,11232):
						if(d[a] > 46.53580418):
								count = count + 1
						self.assertLessEqual(count, math.ceil(.80 * 11231))
					f.close()

	def test_precipicationOutlier(self):
		for i in range(1981, 2010):
			rfile = ""
			rfile = "./public/data_sets/map_files/%d-Precipitation.json"%(i)
			with open(rfile) as json_data:
				d = json.load(json_data)
				f = open(rfile, 'r')
				count = 0
				for a in range(0,11232):
					if(d[a] > 55.424928):
						count = count + 1
					if(d[a] < 11.70688):
						count = count + 1								
				self.assertLessEqual(count, math.ceil(.25*11231))
				f.close()

		rfile = ""
		rfile = "./public/data_sets/map_files/0000-Precipitation.json"
		with open(rfile) as json_data:
			d = json.load(json_data)
			counter = 0
			f = open(rfile, 'r')
			count = 0
			for a in range(0,11232):
				if(d[a] > 55.424928):
						count = count + 1
				if(d[a] < 11.70688):
					count = count + 1
				self.assertLessEqual(count, math.ceil(.99 * 11231))
			f.close()

	def test_precipicationOutlier(self):
		for i in range(1981, 2010):
			rfile = ""
			rfile = "./public/data_sets/map_files/%d-SurfaceRunoff.json"%(i)
			with open(rfile) as json_data:
				d = json.load(json_data)
				f = open(rfile, 'r')
				count = 0
				for a in range(0,11232):
					if(d[a] > 27.99584814):
						count = count + 1								
				self.assertLessEqual(count, math.ceil(.25*11231))
				f.close()

		rfile = ""
		rfile = "./public/data_sets/map_files/0000-SurfaceRunoff.json"
		with open(rfile) as json_data:
			d = json.load(json_data)
			counter = 0
			f = open(rfile, 'r')
			count = 0
			for a in range(0,11232):
				if(d[a] > 27.99584814):
						count = count + 1
				self.assertLessEqual(count, math.ceil(.4 * 11231))
			f.close()

	def test_drainFlowOutlier(self):
		for i in range(1981, 2010):
			rfile = ""
			rfile = "./public/data_sets/map_files/%d-Drainflow.json"%(i)
			with open(rfile) as json_data:
				d = json.load(json_data)
				f = open(rfile, 'r')
				count = 0
				for a in range(0,11232):
					if(d[a] > 1.465003 * (10**15)):
						count = count + 1								
				self.assertLessEqual(count, math.ceil(.25*11231))
				f.close()

		rfile = ""
		rfile = "./public/data_sets/map_files/0000-Drainflow.json"
		with open(rfile) as json_data:
			d = json.load(json_data)
			counter = 0
			f = open(rfile, 'r')
			count = 0
			for a in range(0,11232):
				if(d[a] > 1.465003 * (10**15)):
						count = count + 1
				self.assertLessEqual(count, math.ceil(.3 * 11231))
			f.close()

	def test_evaporationOutlier(self):
		for i in range(1981, 2010):
			rfile = ""
			rfile = "./public/data_sets/map_files/%d-Evapotranspiration.json"%(i)
			with open(rfile) as json_data:
				d = json.load(json_data)
				f = open(rfile, 'r')
				count = 0
				for a in range(0,11232):
					if(d[a] > 74.1659641):
						count = count + 1
					if(d[a] < 32.3106577):
						count = count + 1								
				self.assertLessEqual(count, math.ceil(.25*11231))
				f.close()

		rfile = ""
		rfile = "./public/data_sets/map_files/0000-Evapotranspiration.json"
		with open(rfile) as json_data:
			d = json.load(json_data)
			counter = 0
			f = open(rfile, 'r')
			count = 0
			for a in range(0,11232):
				if(d[a] > 74.1659641):
					count = count + 1
				if(d[a] < 32.3106577):
					count = count + 1
				self.assertLessEqual(count, math.ceil(.99* 11231))
			f.close()

	def test_etOutlier(self):
		for i in range(1981, 2010):
			rfile = ""
			rfile = "./public/data_sets/map_files/%d-OpenWaterEvaporation.json"%(i)
			with open(rfile) as json_data:
				d = json.load(json_data)
				f = open(rfile, 'r')
				count = 0
				for a in range(0,11232):
					if(d[a] > 24.759455):
						count = count + 1
					if(d[a] < 14.050775):
						count = count + 1								
				self.assertLessEqual(count, math.ceil(.4*11231))
				f.close()

		rfile = ""
		rfile = "./public/data_sets/map_files/0000-OpenWaterEvaporation.json"
		with open(rfile) as json_data:
			d = json.load(json_data)
			counter = 0
			f = open(rfile, 'r')
			count = 0
			for a in range(0,11232):
				if(d[a] > 24.759455):
					count = count + 1
				if(d[a] < 14.050775):
					count = count + 1
				self.assertLessEqual(count, math.ceil(1 * 11231))
			f.close()

if __name__ == '__main__':
	unittest.main()
