# Dispatch analysis

Data processing analysis for dispatch data across the Twin Cities metro area.

## Data processing

1. Set DB URI with `DISPATCH_DB_URI` environment variable.

### Import data

1. Put original files into the `data/sources/` folder.
   - See `lib/convert-sources.sh` to see how it should be structured.
1. Convert file formats into CSV and rename: `bash lib/convert-sources.sh`
1. Import into database, one at a time.
   - Example: `node lib/import.js --file="data/build/minneapolis--all--all--2017-01.csv"`
   - Use the `--force` flag to delete the dispatch table and rebuild (useful for model changes)
   - TODO: Create a `--reload` flag that will delete all rows with the same file name.
1. Get census tracts:
   - [Metro area race data](https://censusreporter.org/data/table/?table=B03002&geo_ids=140|31000US33460)
     - `curl "https://api.censusreporter.org/1.0/data/download/latest?table_ids=B03002&geo_ids=140|31000US33460&format=geojson" | tar -xOzf - acs2016_5yr_B03002_14000US27003050608/acs2016_5yr_B03002_14000US27003050608.geojson | node lib/geojson-to-postgis --table="census_tracts_B03002"`
   - [Metro area median household income](https://censusreporter.org/data/table/?table=B19013&geo_ids=140|31000US33460)
     - `curl "https://api.censusreporter.org/1.0/data/download/latest?table_ids=B19013&geo_ids=140|31000US33460&format=geojson" | tar -xOzf - acs2016_5yr_B19013_14000US27003050608/acs2016_5yr_B19013_14000US27003050608.geojson | node lib/geojson-to-postgis --table="census_tracts_B19013"`
1. Get Minnesota cities from [state legislature](https://www.gis.leg.mn/html/download.html):
   - `curl "https://www.gis.leg.mn/php/shptoGeojson.php?file=/geo/data/mcd/mcd2012" | node lib/geojson-to-postgis --table="mn_cities" --source-proj="EPSG:26915" --target-proj="EPSG:4326"`
1. Get Minneapolis precincts from [Minneapolis open data](http://opendata.minneapolismn.gov/datasets/minneapolis-police-precincts):
   - `curl "https://opendata.arcgis.com/datasets/02ab4e12be434fee9d266531f563a6e8_0.zip" | shp2json | node lib/geojson-to-postgis --table="mpls_precincts"`
1. Get Minneapolis neightborhoods from [Minneapolis open data](http://opendata.minneapolismn.gov/datasets/neighborhoods):
   - `curl "https://opendata.arcgis.com/datasets/7f88316841ce471faa33c89035fb69e8_0.zip" | shp2json | node lib/geojson-to-postgis --table="mpls_neighborhoods"`

### Analysis

For hexbin analysis

1. Create hexbins and import into database (database queries are much faster than doing anything JS).
   - `node lib/hexbin.js | node lib/geojson-to-postgis.js --table="dispatch_hexes"`
   - Can change the hexbin options with:
     - `--units`: Defaults to miles.
     - `--side`: length of side, defaults to `0.25`.
1. Run query and create geojson: `node lib/hexbin-analysis.js > data/build/hexbin-analysis.geo.json`
   - Can use the `--responding-type="fire"` flag, but note not all data has this information.
     - `node lib/hexbin-analysis.js --responding-type="fire" > data/build/hexbin-analysis-fire.geo.json`
     - `node lib/hexbin-analysis.js --responding-type="police" > data/build/hexbin-analysis-police.geo.json`

For race by census tract

1. Create CSV: `node lib/race-analysis.js > data/build/race-analysis.csv`

For median income by census tract

1. Create CSV: `node lib/income-analysis.js > data/build/income-analysis.csv`

For MPD hour analysis

1. Create JSON: `node lib/hour-analysis > data/build/hour-analysis.json`

For MPD neighborhood analysis

1. Create JSON: `node lib/neighborhood-analysis > data/build/neighborhood-analysis.json`
