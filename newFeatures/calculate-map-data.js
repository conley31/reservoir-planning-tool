/*
* Constants used in the algorithms.
* Low, Medium, and High are
* DRAINED_AREA is in acres
* DEPTH_FIRST_DAY is in feet
* IRRIGATION INCREMENT is in inches
* VOLUME is in acres
* MOISTURE is in ??
* WATER_CAPACITY is in ??
*
*/
const DRAINED_AREA = 80;                                                                                                                 
const DEPTH_FIRST_DAY = 10;
const IRRIGATION_INCREMENT = 1;
                
const LOW_VOLUME = 16;
const MEDIUM_VOLUME = 48;
const HIGH_VOLUME = 80;
                    
const LOW_SOIL_MOISTURE = 7.6;
const MEDIUM_SOIL_MOISTURE =  12;
const HIGH_SOIL_MOISTURE = 15.6;
                        
const LOW_WATER_CAPACITY = 4.2;
const MEDIUM_WATER_CAPACITY = 6.1;
const HIGH_WATER_CAPACITY = 10.2;

/*
 * example: 
 * Map[0] = calcAllLocations(DRAINED_AREA,DEPTH_FIRST_DAY,IRRIGATION_INCREMENT, LOW_VOLUME, LOW_SOIL_MOISTURE, LOW_WATER_CAPACITY);
 * Map[1] = calcAllLocations(DRAINED_AREA,DEPTH_FIRST_DAY,IRRIGATION_INCREMENT, LOW_VOLUME, LOW_SOIL_MOISTURE, MEDIUM_WATER_CAPACITY);
 * ...
 * Map[8] = calcAllLocations(DRAINED_AREA,DEPTH_FIRST_DAY,IRRIGATION_INCREMENT, HIGH_VOLUME, HIGH_SOIL_MOISTURE, HIGH_WATER_CAPACITY);
 *
 * where Map is an array holding our map data computed by calcAllLocations()
/*
