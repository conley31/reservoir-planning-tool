import zipfile
import zlib

for i in range(1981, 2010):
	for j in range(0,3):
		for k in range(0,3):
			for l in range(0,4):
				zfile = ""
				rfile = ""
				if(l == 0):
					zfile = "%d-%d-%d-AnnualIrrigation.zip"%(i,j,k)
					rfile = "%d-%d-%d-AnnualIrrigation.json"%(i,j,k)
				elif(l == 1):
					zfile = "%d-%d-%d-PercentAnnualDrainflow.zip"%(i,j,k)
					rfile = "%d-%d-%d-PercentAnnualDrainflow.json"%(i,j,k)
				elif(l == 2):
					zfile = "%d-%d-%d-CapturedDrainflow.zip"%(i,j,k)
					rfile = "%d-%d-%d-CapturedDrainflow.json"%(i,j,k)
				elif(l == 3):
					zfile = "%d-%d-%d-IrrigationSufficiency.zip"%(i,j,k)
					rfile = "%d-%d-%d-IrrigationSufficiency.json"%(i,j,k)
				zf = zipfile.ZipFile(zfile,'w',zipfile.ZIP_DEFLATED)
				zf.write(rfile)

for j in range(0,3):
		for k in range(0,3):
			for l in range(0,4):
				zfile = ""
				rfile = ""
				if(l == 0):
					zfile = "0000-%d-%d-AnnualIrrigation.zip"%(j,k)
					rfile = "0000-%d-%d-AnnualIrrigation.json"%(j,k)
				elif(l == 1):
					zfile = "0000-%d-%d-PercentAnnualDrainflow.zip"%(j,k)
					rfile = "0000-%d-%d-PercentAnnualDrainflow.json"%(j,k)
				elif(l == 2):
					zfile = "0000-%d-%d-CapturedDrainflow.zip"%(j,k)
					rfile = "0000-%d-%d-CapturedDrainflow.json"%(j,k)
				elif(l == 3):
					zfile = "0000-%d-%d-IrrigationSufficiency.zip"%(j,k)
					rfile = "0000-%d-%d-IrrigationSufficiency.json"%(j,k)
				zf = zipfile.ZipFile(zfile, 'w', zipfile.ZIP_DEFLATED)
				zf.write(rfile)


for l in range(0,5):
	zfile = ""
	rfile = ""
	if(l == 0):
		zfile = "0000-Drainflow.zip"
		rfile = "0000-Drainflow.json"
	elif(l == 1):
		zfile = "0000-SurfaceRunoff.zip"
		rfile = "0000-SurfaceRunoff.json"
	elif(l == 2):
		zfile = "0000-Precipitation.zip"
		rfile = "0000-Precipitation.json"
	elif(l == 3):
		zfile = "0000-Evapotranspiration.zip"
		rfile = "0000-Evapotranspiration.json"
	elif(l == 4):
		zfile = "0000-OpenWaterEvaporation.zip"
		rfile = "0000-OpenWaterEvaporation.json"
	zf = zipfile.ZipFile(zfile,'w',zipfile.ZIP_DEFLATED)
	zf.write(rfile)

for i in range(1981,2010):
	for l in range(0,5):
		zfile = ""
		rfile = ""
		if(l == 0):
			zfile = "%d-Drainflow.zip"%(i)
			rfile = "%d-Drainflow.json"%(i)
		elif(l == 1):
			zfile = "%d-SurfaceRunoff.zip"%(i)
			rfile = "%d-SurfaceRunoff.json"%(i)
		elif(l == 2):
			zfile = "%d-Precipitation.zip"%(i)
			rfile = "%d-Precipitation.json"%(i)
		elif(l == 3):
			zfile = "%d-Evapotranspiration.zip"%(i)
			rfile = "%d-Evapotranspiration.json"%(i)
		elif(l == 4):
			zfile = "%d-OpenWaterEvaporation.zip"%(i)
			rfile = "%d-OpenWaterEvaporation.json"%(i)
		zf = zipfile.ZipFile(zfile,'w', zipfile.ZIP_DEFLATED)
		zf.write(rfile)