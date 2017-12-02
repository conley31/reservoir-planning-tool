import unittest
import sys
sys.path.insert(0, './util/regional_map/')
import MySQLdb as db
import sql_queries as dbQuery
import json
import imp

with open('./config/config.json') as json_data:                                                                                          
  config = json.load(json_data)
host = config.get('mysql').get('host')
user = config.get('mysql').get('user')
password = config.get('mysql').get('password')
database = config.get('mysql').get('database')
log_location = config.get('mysql').get('logLocation')


class TestDatabaseRequests(unittest.TestCase):
  #set up connection
  
  def test_getTableCount(self):
    connection = db.connect(host,user,password,database)
    cur = connection.cursor()
    self.assertEqual(dbQuery.getTableCount(cur),11232)

  def test_getYearCount(self):
    connection = db.connect(host,user,password,database)
    cur = connection.cursor()
    self.assertGreater(dbQuery.getYearCount(0,cur),20)

  def test_drainflowValues(self):
    connection = db.connect(host,user,password,database)
    cur = connection.cursor()
    self.assertGreater(dbQuery.getAnnualDrainflow(0,1999,cur),0)
    self.assertGreater(dbQuery.getDrainflowCumulative(0,cur),0)

  def test_precipitationValues(self):
    connection = db.connect(host,user,password,database)
    cur = connection.cursor()
    self.assertGreater(dbQuery.getAnnualPrecipitation(0,1999,cur),0)
    self.assertGreater(dbQuery.getPrecipitationCumulative(0,cur),0)

  def test_PETValues(self):
    connection = db.connect(host,user,password,database)
    cur = connection.cursor()
    self.assertGreater(dbQuery.getAnnualPET(0,1999,cur),0)
    self.assertGreater(dbQuery.getPETCumulative(0,cur),0)

  def test_surfaceRunoffValues(self):
    connection = db.connect(host,user,password,database)
    cur = connection.cursor()
    self.assertGreater(dbQuery.getAnnualSurfacerunoff(0,1999,cur),0)
    self.assertGreater(dbQuery.getSurfacerunoffCumulative(0,cur),0)

  def test_DAE_PETValues(self):
    connection = db.connect(host,user,password,database)
    cur = connection.cursor()
    self.assertGreater(dbQuery.getAnnualDAE_PET(0,1999,cur),0)
    self.assertGreater(dbQuery.getDAE_PETCumulative(0,cur),0)



if __name__ == '__main__':
  unittest.main()

