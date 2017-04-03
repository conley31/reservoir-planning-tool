import csv, json, datetime, os, time
from nose.tools import assert_equals
from db import sql_statements, setupdb, destroy
import MySQLdb as db

with open('../config/config.json') as json_data:
    config = json.load(json_data)

host = config.get("mysql").get("host")
user = config.get("mysql").get("user")
password = config.get("mysql").get("password")
database = 'testTDP'
log_location = 'tests/.db.log'

con = db.connect(host, user, password)
cur = con.cursor()
cur.execute('CREATE DATABASE IF NOT EXISTS testTDP;')
con.close()
con = db.connect(host, user, password, database)
cur = con.cursor()

class TestDestroy(object):
    @classmethod
    def setup_class(self):
        setupdb.database = database
        setupdb.index_file = 'tests/index.csv'
        setupdb.log_location = log_location
        cur.execute(sql_statements.select_table_count.format(database))
        if cur.fetchone()[0] > 0:
            print("Tables are already setup for testTDP")
        else:
            setupdb.setupDB()

    def test_erase_log(self):
        destroy.log_location = log_location
        destroy.eraseLog()
        assert_equals(os.path.isfile('tests/.db.log'), False)

    def test_drop_db(self):
        destroy.database = database
        destroy.dropDB()
        cur.execute(sql_statements.select_table_count.format(database))
        assert_equals(cur.fetchone()[0], 0)
