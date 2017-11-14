import zipfile

for i in range(1980, 2009):
	for j in range(0,2):
		for k in range(0,2):
			for l in range(0,3):
				zfile = ""
				rfile = ""
				if(i == 1980):
					zfile = "0-%d-%d-%d-reg.zip"%(j,k,l)
					rfile = "0-%d-%d-%d-reg.json"%(j,k,l)
				else:
					zfile = "%d-%d-%d-%d-reg.zip"%(i,j,k,l)
					rfile = "%d-%d-%d-%d-reg.json"%(i,j,k,l)
				zf = zipfile.ZipFile(zfile, mode = 'w')
				zf.write(rfile)