# Reservoir Planning Tool

## Dependencies
- Node v6.x
- Python v2.7 and pip for Database Setup (see `db/requirements.txt` for pip dependencies)
- MySQL server set up and running, with a user and a database (configure with `config/config.json` file)

## Installation
1. Clone the repository, then `cd reservoir-planning-tool`
2. Run `npm install` in the parent directory to install Node dependencies
3. Copy the example config file to a new file `cp config/config.example.json config/config.json`
4. Fill In Database Username/password
5. Run Database setup scripts

## Database Scripts

#### `npm run db_setup`
- Takes data from `db/daily_files` indexed by `db/index.csv` and sets up database tables
- `index.csv` format:

`ID, FID,LAT,LONG,FILENAME.txt,http://nevada.agriculture.purdue.edu/drains/FILENAME.txt`

### `npm run db_update`
- Takes any changes to `db/index.csv` and updates their respective table_names

### `npm run db_destroy`
- Destroys the database
