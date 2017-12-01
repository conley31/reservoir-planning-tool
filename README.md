# Reservoir Planning Tool

## Dependencies
- Node v6.x
- Python v2.7 and pip for Database Setup (see `db/requirements.txt` for pip dependencies)
- MySQL server set up and running, with a user and a database (configure with `config/config.json` file)
- Redis >= 2.0.0 (Saves user session data)

## Installation
More detailed installation instructions can be found in `docs/ExtraDocumentation`
1. Clone the repository, then `cd reservoir-planning-tool`
2. Run `npm install` in the parent directory to install Node dependencies
3. Copy the example config file to a new file `cp config/config.example.json config/config.json`
4. Create a MySQL Database; Fill In Database, Username, and password to `config.json,`
5. Run Database setup scripts
6. Run the server with `npm start`, or use `pm2 start processes.yml`

## Database Schema
- The database contains a table for each daily data file in the `db/daily_files/` directory.
- Each table follows the naming convention of: `Location{ID}`. Where ID is specified in the `db/index.csv`.
- Schema: `Location{ID}(RecordedDate:Date, Drainflow:Float, Precipitation:Float, PET:Float)`

## Regional Results
- The application contains features that allows users to view interactive maps displaying data computed using the TDP algorithms
- Because this data is a conglomerate of all 112,000+ database Locations, which each contain data for each day for each year spanning
1981-2009, generating the data for these maps is quite time consuming. 
- Each potential map configuration corresponds to a JSON file that is read by the Google Maps geo-json formatter.
- The .zip files located in `public/data_sets/map_data_named` and `public/data_sets/kml_files` contain these files, however, if the database is updated then these files will not be up to date without running the following node scripts
#### Node scripts for updating regional map data:
- `npm run generate_map_data`
- `npm run generate_kml_data`
- Each of these will present you with loading bars to track the progress
- After the files are generated, they will be compressed and ready for use in the live map, and for optional kml download
- If you would like to preview the generation process, run the test scripts below to get a sample of 25 locations
- `npm run test_generate_map_data`
- `npm run test_generate_kml_data`
- This will NOT override any values. The outputs are located in `public/data_sets/TEST_map_data_named` and `public/data_sets/TEST_kml_files`

## Converting Whitespace Delimited Daily Files into CSVs
- When exported, the daily data files do not have a common delimiter. One row is delimited a tab and a space and the others are delimited by two spaces.
- To fix this, running the following command: `find . -name '*.txt' | xargs -n 10 sed -E -i '' 's/[[:space:]]+/,/g'` in the db/daily_files directory will convert all daily files to CSVs in-place.

## CSV Schemas
- `User Uploaded CSV:(Year, Month, Day, Drain Flow, Precipitation)`
- `Daily Files CSV: (Year, Month, Day, Drain Flow, Precipitation, PET)`

## Database Scripts

#### `npm run db_setup`
- Takes data from `db/daily_files` indexed by `db/index.csv` and sets up database tables
- `index.csv` format:

`ID, FID,LAT,LONG,FILENAME.txt,http://nevada.agriculture.purdue.edu/drains/FILENAME.txt`

#### `npm run db_update`
- Takes any changes to `db/index.csv` and updates their respective table_names

#### `npm run db_destroy`
- Destroys the database

## Testing Scripts
#### `npm test tests/<test folder>`
#### `npm run test-db-quick`
#### `npm run test-db-complete`
#### `npm run data_test` checks the data computed for the regional maps

## Folder Structure and important files
- `config/`: Configuration Files
- `db/`: Database management python scripts and Node interface
- `db/daily_files/`: Manually added directory to contain all daily data for database setup
- `db/index.js`: Exports functions to interface with the MySQL database
- `db/requirements.txt`: Python Dependencies
- `docs/`: Design Document, Backlock, Charter, Sprint Planning Documents, Sprint Retrospectives, Weekly Logs
- `newFeatures/`: Contains code used to compute the new data needed for the regional and comparison maps and creates files for the data - more information can be found in `docs/ExtraDocumentation`
- `package.json`: Node.js dependencies
- `processes.yml`: Process definition for PM2 process manager
- `public/`: Static files for the front end
- `public/app.js`: Code for every event listener in `views/index.ejs`
- `public/colorCompareMap.js`: Code used to color in each grid of the GeoJSON overlay based on that grid's calculated data - for the comparison map
- `public/colorMap.js`: Code used to identify which file to load/download, and also to color in each grid of the GeoJSON overlay based on that grid's calculated data - for the regional map
- `public/data_sets/map_data_named`: Contains all data files and their statistics used in the creation of the regional and comparison maps
- `public/data_sets/stats_data`: Contains all statistical analyses performed on the data calculated for the regional and comparison maps
- `public/generateGraphData.js`: Code used to generate the graph data given the results from TDPAlg.js
- `public/graph.js`: Code used to create the actual google graphs given the final results from generateGraphData.js
- `public/map.js`: Code that loads the actual google map onto the page
- `public/zip`: Contains code used to zip/unzip map files
- `server.js`: Main Express server
- `util`: Misc. Backend functions
- `util/TDPAlg.js`: Main Algorithm to calculate reservoir sizing - more information can be found in `docs/ExtraDocumentation`
- `util/UserParse.js`: Parsing of user-submitted csv files
- `util/polygons.js`: Function to retrieve the id of a polygon given coordinates
- `views/`: EJS templates to be used in the website
- `tests/`: Test scripts for components inside of TDPAlg.js

## Creating New Legends
 Currently the implementation of legends loads in a static unique image for each individual map. We created these legends after analyzing the data to find the best fit for each result. However, if the database is ever significantly changed these legends may no longer be accurate representations of the numbers, so here are a few easy steps to create your own:
  1. Save the legend template we have provided. It can be found in the public folder under the name 'legend template.png'.
  2. Open the template in an image editor of your choice, and insert text aligned with the color boxes. The colors of the boxes can also      be easily changed with the use of a Fill tool.
  3. Upload your newly created legend to the public folder.
  4. Navigate to style.css in the public folder, find the legend for the result you're changing and insert your image's name inside the      background: url() line.
  Your legend should now be inside the application and fully functional.
