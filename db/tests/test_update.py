import csv, json, datetime, os
from nose.tools import assert_equals
from nose.plugins.attrib import attr
from db import sql_statements, update, setupdb
import MySQLdb as db

with open('../config/config.json') as json_data:
    config = json.load(json_data)

host = config.get("mysql").get("host")
user = config.get("mysql").get("user")
password = config.get("mysql").get("password")
database = 'testTDP'
log_location = config.get("mysql").get("logLocation")

con = db.connect(host, user, password)
cur = con.cursor()
cur.execute('CREATE DATABASE IF NOT EXISTS testTDP;')
con.close()
con = db.connect(host, user, password, database)
cur = con.cursor()

class TestUpdate(object):
    @classmethod
    def setup_class(self):
        setupdb.database = 'testTDP'
        setupdb.index_file = 'tests/index.csv'
        setupdb.log_location = 'tests/.db.log'
        cur.execute(sql_statements.select_table_count.format(database))
        if cur.fetchone()[0] > 0:
            print("Tables are already setup for testTDP")
        else:
            setupdb.setupDB()

    def test_to_str_date(self):
        str_date = update.toStrDate('1995', '10', '24')
        assert_equals(str_date, '1995-10-24')

    def test_id_exists_in_index(self):
        update.index_file = 'tests/index.csv'
        assert update.idExistsInIndex('3')

    def test_id_doesnt_exists_in_index(self):
        update.index_file = 'tests/index.csv'
        assert update.idExistsInIndex('12') == False

    def test_was_dbCreated(self):
        update.log_location = 'tests/.db.log'
        update.configureLog()
        assert update.dbCreated()

    def test_db_not_Created(self):
        update.log_location = 'tests/.fakedb.log'
        update.configureLog()
        assert update.dbCreated() == False

    def test_update_index_addition(self):
        update.database = 'testTDP'
        update.log_location = 'tests/.db.log'
        update.index_file = 'tests/index.csv'
        index = open('tests/index.csv', 'a')
        index.write('6,6,36.1875,-90.0625,Daily_36.1875_-90.0625.txt,http://nevada.agriculture.purdue.edu/drains/Daily_36.1875_-90.0625.txt\n')
        index.close()
        update.configureMySQL()
        update.configureLog()
        update.update()
        cur.execute(sql_statements.check_table.format(database, 'Location6'))
        assert cur.fetchone() != None
