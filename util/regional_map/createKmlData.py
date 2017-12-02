import json
import sys
import time
import kml_data_generator
from multiprocessing import Process as Task, Queue
import collections

def generateCumulativeKml(status,testFlag):
  kml_data_generator.generateCumulativeKml(status,testFlag)

def generateYearlyKml(status,testFlag):
  kml_data_generator.generateYearlyKml(status,testFlag)

def generateCumulativeDatabaseKml(status,testFlag):
  kml_data_generator.generateCumulativeDatabaseKml(status,testFlag)

def generateYearlyDatabaseKml(status,testFlag):
  kml_data_generator.generateYearlyDatabaseKml(status,testFlag)

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
  testFlag = 0 
  p1 = Task(target=generateCumulativeKml, args=(status,testFlag))
  p2 = Task(target=generateYearlyKml, args=(status,testFlag))
  p3 = Task(target=generateCumulativeDatabaseKml, args=(status,testFlag))
  p4 = Task(target=generateYearlyDatabaseKml, args=(status,testFlag))

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


