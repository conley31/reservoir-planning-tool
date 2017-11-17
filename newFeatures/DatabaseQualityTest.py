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

	def test_testingNegative(self):
		connection = db.connect(host,user,password,database)
		cur = connection.cursor()
		self.assertEqual(algorithm.getTableCount(cur),11232)

if __name__ == '__main__':
	unittest.main()
