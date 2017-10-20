#!/usr/bin/python

import MySQLdb as db
import imp
import json

with open('../config/config.json') as json_data:
  config = json.load(json_data)


host = config.get('mysql').get('host')
user = config.get('mysql').get('user')
password = config.get('mysql').get('password')
database = config.get('mysql').get('database')
log_location = config.get('mysql').get('logLocation')


def getTableCount():
  quer = '''SELECT count(*) AS tablesCount FROM information_schema.tables WHERE table_schema = ''' 
  con = db.connect(host,user,password,database)
  cur = con.cursor()
  cur.execute(sql_statements.select_table_count.format(database))
  for row in cur.fetchall():
    print row[0]
  con.close()

