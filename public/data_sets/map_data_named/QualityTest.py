import unittest
import json
import imp


class TestDatabaseQuality(unittest.TestCase):

	def test_negative(self):
		for i in range(1981, 2010):
			for j in range(0,3):
				for k in range(0,3):
					for l in range(0,4):
						rfile = ""
						if(l == 0):
							rfile = "%d-%d-%d-AnnualIrrigation.json"%(i,j,k)
						elif(l == 1):
							rfile = "%d-%d-%d-PercentAnnualDrainflow.json"%(i,j,k)
						elif(l == 2):
							rfile = "%d-%d-%d-CapturedDrainflow.json"%(i,j,k)
						elif(l == 3):
							rfile = "%d-%d-%d-IrrigationSufficiency.json"%(i,j,k)
						with open(rfile) as json_data:
							d = json.load(json_data)
							f = open(rfile, 'r')
							for a in range(0,11231):
								self.assertGreaterEqual(d[a], 0)
							f.close()

		for j in range(0,3):
				for k in range(0,3):
					for l in range(0,4):
						rfile = ""
						if(l == 0):
							rfile = "0000-%d-%d-AnnualIrrigation.json"%(j,k)
						elif(l == 1):
							rfile = "0000-%d-%d-PercentAnnualDrainflow.json"%(j,k)
						elif(l == 2):
							rfile = "0000-%d-%d-CapturedDrainflow.json"%(j,k)
						elif(l == 3):
							rfile = "0000-%d-%d-IrrigationSufficiency.json"%(j,k)
						with open(rfile) as json_data:
							d = json.load(json_data)
							counter = 0
							f = open(rfile, 'r')
							for a in range(0,11231):
								self.assertGreaterEqual(d[a], 0)
							f.close()


		for l in range(0,5):
			rfile = ""
			if(l == 0):
				rfile = "0000-Drainflow.json"
			elif(l == 1):
				rfile = "0000-SurfaceRunoff.json"
			elif(l == 2):
				rfile = "0000-Precipitation.json"
			elif(l == 3):
				rfile = "0000-Evapotranspiration.json"
			elif(l == 4):
				rfile = "0000-OpenWaterEvaporation.json"
			with open(rfile) as json_data:
				d = json.load(json_data)
				counter = 0
				f = open(rfile, 'r')
				for a in range(0,11231):
					self.assertGreaterEqual(d[a], 0)
				f.close()

		for i in range(1981,2010):
			for l in range(0,5):
				rfile = ""
				if(l == 0):
					rfile = "%d-Drainflow.json"%(i)
				elif(l == 1):
					rfile = "%d-SurfaceRunoff.json"%(i)
				elif(l == 2):
					rfile = "%d-Precipitation.json"%(i)
				elif(l == 3):
					rfile = "%d-Evapotranspiration.json"%(i)
				elif(l == 4):
					rfile = "%d-OpenWaterEvaporation.json"%(i)
				with open(rfile) as json_data:
					d = json.load(json_data)
					counter = 0
					f = open(rfile, 'r')
					for a in range(0,11231):
						self.assertGreaterEqual(d[a], 0)
					f.close()


if __name__ == '__main__':
	unittest.main()