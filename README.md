# Reservoir Planning Tool

## Dependencies
- Node v6.x
- Python v2.7 and pip for Database Setup (see `db/requirements.txt` for pip dependencies)
- MySQL server set up and running, with a user and a database (configure with `config/config.json` file)
- Redis >= 2.0.0 (Saves user session data)

## Installation
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

## Folder Structure and important files
- `config/`: Configuration Files
- `db/`: Database management python scripts and Node interface
- `db/daily_files/`: Manually added directory to contain all daily data for database setup
- `db/index.js`: Exports functions to interface with the MySQL database
- `db/requirements.txt`: Python Dependencies
- `docs/`: Design Document, Backlock, Charter, Sprint Planning Documents, Sprint Retrospectives, Weekly Logs
- `public/`: Static files for the front end
- `views/`: EJS templates to be used in the website
- `server.js`: Main Express server
- `util`: Misc. Backend functions
- `util/TDPAlg.js`: Main Algorithm to calculate reservoir sizing
- `util/UserParse.js`: Parsing of user-submitted csv files
- `util/polygons.js`: Function to retrieve the id of a polygon given coordinates
- `package.json`: Node.js dependencies
- `tests/`: Test scripts for components inside of TDPAlg.js
- `processes.yml`: Process definition for PM2 process manager
