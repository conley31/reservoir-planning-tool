import json
import sys
import time
import kml_data_generator
from multiprocessing import Process as Task, Queue
import collections

def generateCumulativeKml(zero,status):
  kml_data_generator.generateCumulativeKml(status)

def generateYearlyKml(zero,status):
  kml_data_generator.generateYearlyKml(status)

def generateCumulativeDatabaseKml(zero,status):
  kml_data_generator.generateCumulativeDatabaseKml(status)

def generateYearlyDatabaseKml(zero,status):
  kml_data_generator.generateYearlyDatabaseKml(status)

def print_progress(progress):
  sys.stdout.write('\033[2J\033[H') #clear screen 
  for name, percent in progress.items():
    bar = ('=' * int(percent * 20)).ljust(20)
    percent = int(percent * 100)
    sys.stdout.write("%s [%s] %s%%\n" % (name, bar, percent),)
    sys.stdout.flush()

if __name__ == '__main__':
  status = Queue()
  progress = collections.OrderedDict()
  workers = []
  
  p1 = Task(target=generateCumulativeKml, args=(0,status))
  p2 = Task(target=generateYearlyKml, args=(0,status))
  p3 = Task(target=generateCumulativeDatabaseKml, args=(0,status))
  p4 = Task(target=generateYearlyDatabaseKml, args=(0,status))

  p1.start()
  workers.append(p1)
  p2.start()
  workers.append(p2)
  p3.start()
  workers.append(p3)
  p4.start()
  workers.append(p4)

  while any(i.is_alive() for i in workers):
    while not status.empty():
      name,percent = status.get()
      progress[name] = percent
      print_progress(progress)
      time.sleep(.1)


