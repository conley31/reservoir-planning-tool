import json

for j in range(0,3):
		for k in range(0,3):
			rfile = ""
			rfile = "0000-%d-%d-IrrigationSufficiency.json"%(j,k)
			with open(rfile) as json_data:
				d = json.load(json_data)
				counter = 0
				f = open('irrigationset.txt', 'a')
				for a in range(0,11232):
					counter = counter + 1
					if(counter == 10):
						f.write(str(d[a]) + '\n')
						counter = 0
				f.close()

for i in range(1981, 2010):
	for j in range(0,3):
		for k in range(0,3):
			rfile = ""
			rfile = "%d-%d-%d-IrrigationSufficiency.json"%(i,j,k)
			with open(rfile) as json_data:
				d = json.load(json_data)
				counter = 0
				f = open('irrigationset.txt', 'a')
				for a in range(0,11232):
					counter = counter + 1
					if(counter == 10):
						f.write(str(d[a]) + '\n')
						counter = 0
				f.close()
			
