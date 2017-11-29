import unittest
import MySQLdb as db
import sys
import algorithmEnhanced as algorithm
import json
import imp

with open('../config/config.json') as json_data:                                                                                          
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
		self.assertEqual(algorithm.getTableCount(cur),11232)

	def test_negative(self):
		connection = db.connect(host,user,password,database)
		cur = connection.cursor()
		for i in range(0, 11232):
			self.assertGreaterEqual(algorithm.getDrainflowCumulative(i,cur), 0)
			self.assertGreaterEqual(algorithm.getPrecipitationCumulative(i,cur), 0)
			self.assertGreaterEqual(algorithm.getPETCumulative(i,cur), 0)
			self.assertGreaterEqual(algorithm.getSurfacerunoffCumulative(i,cur), 0)
			self.assertGreaterEqual(algorithm.getDAE_PETCumulative(i,cur), 0)

			for j in range(1981, 2010):
				self.assertGreaterEqual(algorithm.getAnnualDrainflow(i,j,cur), 0)
				self.assertGreaterEqual(algorithm.getAnnualPrecipitation(i,j,cur), 0)
				self.assertGreaterEqual(algorithm.getAnnualPET(i,j,cur), 0)
				self.assertGreaterEqual(algorithm.getAnnualSurfacerunoff(i,j,cur), 0)
				self.assertGreaterEqual(algorithm.getAnnualDAE_PET(i,j,cur), 0)



if __name__ == '__main__':
	unittest.main()
