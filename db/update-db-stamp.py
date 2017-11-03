import datetime

now = datetime.datetime.now()
timeString = now.strftime("%Y-%m-%d %H:%M\n")
f = open("database-timestamp.txt","w")
f.write(timeString)
f.close

print("\nWarning: database was updated\nMap data may not accurately represent the new database values\nRun 'npm run update-json-mapdata' to recalculate the map data\nNote this is a time-consuming process")

