import csv, json, datetime, os
from nose.tools import assert_equals
from nose.plugins.attrib import attr
from db import sql_statements, update, setupdb
import MySQLdb as db

def test_to_str_date():
    str_date = update.toStrDate('1995', '10', '24')
    assert_equals(str_date, '1995-10-24')

def test_db_create():
    setupdb.database = 'testTDP'
    setupdb.index_file = 'test/index.csv'
