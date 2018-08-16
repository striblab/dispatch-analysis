// Dependencies
const fs = require('fs-extra');
const path = require('path');
const csv = require('fast-csv');
const _ = require('lodash');
const MultiProgress = require('multi-progress');
const countLinesInFile = require('count-lines-in-file');
const debug = require('debug')('dispath:importers');

// Paths
const buildPath = path.join(__dirname, '..', 'data', 'build');
const cacheDirectory = path.join(__dirname, '.cache');
const cachePath = path.join(cacheDirectory, 'importing.json');

// Get cache
fs.mkdirpSync(cacheDirectory);
let cache = {};
if (fs.existsSync(cachePath)) {
  cache = JSON.parse(fs.readFileSync(cachePath, 'utf-8'));
}

// Write cache method
const updateCache = cacheData => {
  cacheData = cacheData || cache;
  fs.writeFileSync(cachePath, JSON.stringify(cacheData));
};

// Import a file
async function importFile(fileInfo, parser) {
  debug(`${fileInfo.file} Importing...`);

  // TODO: Read file lines
  const lines = await countLines(fileInfo.fullPath);

  // TODO: Create progress bar
  let progress = new MultiProgress(process.stderr);
  let readProgress = progress.newBar('  Reading CSV [:bar] :percent :etas', {
    complete: '=',
    incomplete: ' ',
    width: 30,
    total: lines
  });
  let writeProgress = progress.newBar(
    '  Writing to database [:bar] :percent :etas',
    {
      complete: '=',
      incomplete: ' ',
      width: 30,
      total: lines
    }
  );

  // Stream CSV
  return new Promise((resolve, reject) => {
    let stream = csv
      .fromPath(fileInfo.fullPath, {
        headers: true,
        ignoreEmpty: true
      })
      .on('data', d => {
        readProgress.tick();
        if (Math.random() < 0.1) {
          writeProgress.tick();
        }
        //console.log(d);
        // TODO: Parse and import
        //stream.pause();
      })
      .on('end', resolve)
      .on('error', reject);
  });
}

// Main function
async function importFiles() {
  // Read files
  let inputFiles = fs.readdirSync(buildPath);
  for (let f of inputFiles) {
    if (f.match(/^\./)) {
      continue;
    }

    // Remove extension and get parts
    let fileDescription = f.split('.')[0];
    let fileParts = fileDescription.split('--');
    let file = {
      file: f,
      fullPath: path.join(buildPath, f),
      district: fileParts[0],
      organization: fileParts[1],
      type: fileParts[2],
      date: fileParts[3]
    };

    // Get parser
    const parser = require(`./parser/${file.district}.js`);

    // Import file
    await importFile(file, parser);
  }
}

// Count lines in file
async function countLines(filePath) {
  return new Promise((resolve, reject) => {
    countLinesInFile(filePath, (error, lines) => {
      if (error) {
        return reject(error);
      }

      resolve(lines);
    });
  });
}

// Run
importFiles();
