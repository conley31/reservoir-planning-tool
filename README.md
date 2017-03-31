# Reservoir Planning Tool

## Dependencies
- Node v6.x
- Python v2.7 and pip for Database Setup (see `db/requirements.txt` for pip dependencies)
- MySQL server set up and running, with a user and a database (configure with `config/config.json` file)

## Installation
1. Clone the repository, then `cd reservoir-planning-tool`
2. Run `npm install` in the parent directory to install Node dependencies
3. Copy the example config file to a new file `cp config/config.example.json config/config.json`
4. Create a MySQL Database; Fill In Database, Username, and password to `config.json,`
5. Run Database setup scripts

## Database Scripts

#### `npm run db_setup`
- Takes data from `db/daily_files` indexed by `db/index.csv` and sets up database tables
- `index.csv` format:

`ID, FID,LAT,LONG,FILENAME.txt,http://nevada.agriculture.purdue.edu/drains/FILENAME.txt`

#### `npm run db_update`
- Takes any changes to `db/index.csv` and updates their respective table_names

#### `npm run db_destroy`
- Destroys the database

## Folder Structure and important files
- `config/`: Configuration Files
- `db/`: Database management python scripts and Node interface
- `db/index.js`: Exports functions to interface with the MySQL database
- `db/requirements.txt`: Python Dependencies
- `docs/`: Design Document, Backlock, Charter, Sprint Planning Documents, Sprint Retrospectives, Weekly Logs
- `public/`: Static files for the front end
- `views/`: EJS templates to be used in the website
- `server.js`: Main Express server
- `TDPAlg.js`: Main Algorithm to calculate reservoir sizing
- `UserParse.js`: Parsing of user-submitted csv files
- `package.json`: Node.js dependencies
