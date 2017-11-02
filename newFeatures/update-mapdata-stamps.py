import datetime                                                                                                                     
now = datetime.datetime.now()
timeString = now.strftime("%Y-%m-%d %H:%M\n")
f = open("json-timestamps.txt","w")
f.write(timeString)
f.close
