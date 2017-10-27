#!/usr/bin/python

import json
import algorithmEnhanced
import multiprocessing

#computeData(80,16,10,7.6,1,4.2)

def worker(area,vol,depth,moisture,incr,water,num):
  data = algorithmEnhanced.computeData(area,vol,depth,moisture,incr,water)
  json_string = json.dumps([ob.__dict__ for ob in data])
  text_file = open("output.txt"+str(num),"w")
  text_file.write(json_string)
  text_file.close()

if __name__ == '__main__':
  jobs = []
  p1 = multiprocessing.Process(target=worker, args=(80,16,10,7.6,1,4.2,1))
  p2 = multiprocessing.Process(target=worker, args=(80,16,10,12,1,6.1,2))
  p3 = multiprocessing.Process(target=worker, args=(80,16,10,15.6,1,10.2,3))
  p4 = multiprocessing.Process(target=worker, args=(80,48,10,7.6,1,4.2,4))
  p5 = multiprocessing.Process(target=worker, args=(80,48,10,12,1,6.1,5))
  p6 = multiprocessing.Process(target=worker, args=(80,48,10,15.6,1,10.2,6))
  p7 = multiprocessing.Process(target=worker, args=(80,80,10,7.6,1,4.2,7))
  p8 = multiprocessing.Process(target=worker, args=(80,80,10,12,1,6.1,8))
  p9 = multiprocessing.Process(target=worker, args=(80,80,10,15.6,1,10.2,9))
  p1.start()
  p2.start()
  p3.start()
  p4.start()
  p5.start()
  p6.start()
  p7.start()
  p8.start()
  p9.start()
