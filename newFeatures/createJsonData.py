#!/usr/bin/python

import threading
import time
import Queue
import algorithmEnhanced

#computeData(80,16,10,7.6,1,4.2)

class MyThread(threading.Thread):
  def __init__(self,area,volume,depth,soil,inc,water):
    super(MyThread,self).__init__()
    self.area=area
    self.volume=volume
    self.depth=depth
    self.soil=soil
    self.inc=inc
    self.water=water
  def run(self):
    algorithmEnhanced.computeData(self.area,self.volume,self.depth,self.soil,self.inc,self.water)

    #computeData(80,16,10,7.6,1,4.2)


thread1 = MyThread(80,16,10,7.6,1,4.2)
thread2 = MyThread(80,16,10,12,1,6.1)
thread3 = MyThread(80,16,10,15.6,1,10.2)
thread4 = MyThread(80,48,10,7.6,1,4.2)
thread5 = MyThread(80,48,10,12,1,6.1)
thread6 = MyThread(80,48,10,15.6,1,10.2)
thread7 = MyThread(80,80,10,7.6,1,4.2)
thread8 = MyThread(80,80,10,12,1,6.1)
thread9 = MyThread(80,80,10,15.6,1,10.2)

thread1.start()
thread2.start()
thread3.start()
thread4.start()
thread5.start()
thread6.start()
thread7.start()
thread8.start()
thread9.start()
