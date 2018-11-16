# Dispatch analysis

Data processing analysis for dispatch data across the Twin Cities metro area.

## Data processing

1. Set DB URI with `DISPATCH_DB_URI` environment variable.
1. Put original files into the `data/sources/` folder.
   - See `lib/convert-sources.sh` to see how it should be structured.
1. Convert file formats into CSV and rename: `bash lib/convert-sources.sh`
1. Import into database, one at a time.
   - `node lib/import.js --file="data/build/minneapolis--all--all--2017-01.csv"`
   - Use the `--force` flag to delete the dispatch table and rebuild (useful for model changes)
   - TODO: Create a `--reload` flag that will delete all rows with the same file name.
1. Analysis: TODO
