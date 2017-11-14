#!/usr/bin/python

import json
import sys
import time
import algorithmEnhanced
import map_data_algorithms
from multiprocessing import Process as Task, Queue
import collections

#computeData(80,16,10,7.6,1,4.2)

def worker(area,vol,depth,moisture,incr,water,volumeTag,soilTag,status):
 map_data_algorithms.computeData(area,vol,depth,moisture,incr,water,volumeTag,soilTag,status)

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
  filenames = ['allData-16Vol-Low.json', 'allData-16Vol-Medium.json', 'allData-16Vol-High.json',
               'allData-48Vol-Low.json', 'allData-48Vol-Medium.json', 'allData-48Vol-High.json',
               'allData-80Vol-Low.json', 'allData-80Vol-Medium.json', 'allData-80Vol-High.json']
  p1 = Task(target=worker, args=(80,16,10,7.6,1,4.2,0,0,status))
  p2 = Task(target=worker, args=(80,16,10,12,1,6.1, 0,1,status))
  p3 = Task(target=worker, args=(80,16,10,15.6,1,10.2,0,2,status))
  p4 = Task(target=worker, args=(80,48,10,7.6,1,4.2,1,0,status))
  p5 = Task(target=worker, args=(80,48,10,12,1,6.1,1,1,status))
  p6 = Task(target=worker, args=(80,48,10,15.6,1,10.2,1,2,status))
  p7 = Task(target=worker, args=(80,80,10,7.6,1,4.2,2,0,status))
  p8 = Task(target=worker, args=(80,80,10,12,1,6.1,2,1,status))
  p9 = Task(target=worker, args=(80,80,10,15.6,1,10.2,2,2,status))
  
  p1.start()
  workers.append(p1)
#  p2.start()
#  workers.append(p2)
#  p3.start()
#  workers.append(p3)
#  p4.start()
#  workers.append(p4)
#  p5.start()
#  workers.append(p5)
#  p6.start()
#  workers.append(p6)
#  p7.start()
#  workers.append(p7)
#  p8.start()
#  workers.append(p8)
#  p9.start()
#  workers.append(p9)

  while any(i.is_alive() for i in workers):
    while not status.empty():
      name,percent = status.get()
      progress[name] = percent
     # print_progress(progress)
  
#  print 'JSON files built'
#  for i in filenames:
#    if algorithmEnhanced.checkJsonIntegrity(i) == True:
#      print("complete json")
