check_table = ''' SELECT *
                  FROM information_schema.tables
                  WHERE table_schema = '{}'
                  AND table_name = '{}'
                  LIMIT 1;'''

get_tables = '''SELECT TABLE_NAME
                FROM INFORMATION_SCHEMA.TABLES
                WHERE TABLE_TYPE = 'BASE TABLE' AND TABLE_SCHEMA='{}';'''

make_table = '''CREATE TABLE IF NOT EXISTS Location{}
              (RecordedDate Date NOT NULL,
              Drainflow FLOAT DEFAULT NULL,
              Precipitation FLOAT DEFAULT NULL,
              PET FLOAT DEFAULT NULL,
              PRIMARY KEY (RecordedDate)
              );'''

insert = '''INSERT INTO Location{}
          (RecordedDate, Drainflow, Precipitation, PET)
          VALUES (STR_TO_DATE('{}', '%Y-%m-%d'), {}, {}, {});'''

select_from = '''SELECT *
                 FROM {};'''

drop_table = 'DROP TABLE Location{};'

drop_database = 'DROP DATABASE {};'

show_tables = 'SHOW TABLES;'

select_table_count = '''SELECT COUNT(*)
                        FROM information_schema.tables
                        WHERE table_schema = '{}';'''
