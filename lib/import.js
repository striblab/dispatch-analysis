// Dependencies
const fs = require('fs-extra');
const path = require('path');
const csv = require('fast-csv');
const _ = require('lodash');
const MultiProgress = require('multi-progress');
const countLinesInFile = require('count-lines-in-file');
const debug = require('debug')('dispatch:importers');
const argv = require('yargs').argv;
const db = require('./db.js');

// Paths
const buildPath = path.join(__dirname, '..', 'data', 'build');
const cacheDirectory = path.join(__dirname, '.cache');
const cachePath = path.join(cacheDirectory, 'importing.json');

// Batch size
const BATCH_SIZE = parseInt(argv.batch, 10) || 250;

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
  let ignoredRows = 0;
  let importedRows = 0;

  // Stream CSV
  return new Promise((resolve, reject) => {
    let queue = [];
    let stream = csv
      .fromPath(fileInfo.fullPath, {
        headers: true,
        ignoreEmpty: true
      })
      .on('data', async d => {
        readProgress.tick();
        stream.pause();

        let p = await parser(d, fileInfo, cache);
        if (p !== false) {
          queue.push(p);
          queue = await handleQueue(queue, writeProgress);
        }
        else {
          ignoredRows++;
        }

        setTimeout(() => {
          stream.resume();
        }, 1);
      })
      .on('end', async () => {
        await handleQueue(queue, writeProgress, true);
        resolve();
      })
      .on('error', reject);
  });
}

// Handle queue
async function handleQueue(queue, progress, force = false) {
  if (queue.length < BATCH_SIZE && !force) {
    return queue;
  }
  debug('Upserting...', queue.length);

  try {
    await db.bulkUpsert(db.models.dispatch, queue);
    progress.tick(queue.length);
    debug(`Upserted ${queue.length} rows.`);
  }
  catch (e) {
    queue.forEach(q => {
      debug(q);
      debug('\n\n');
    });
    debug(`Error trying to bulk upsert ${queue.length} rows.`);
    debug(e);
    throw e;
  }

  return [];
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

// Do import
async function doImport() {
  // Setup database
  await db.connect();
  await db.sync({ force: argv.force });

  // Remove extension and get parts
  let fileDescription = argv.file
    .split('/')
    .pop()
    .split('.')[0];
  let fileParts = fileDescription.split('--');
  let file = {
    file: argv.file,
    fullPath: path.resolve(argv.file),
    district: fileParts[0],
    organization: fileParts[1],
    type: fileParts[2],
    date: fileParts[3]
  };

  // Get parser
  const parser = require(`./parser/${file.district}.js`);

  await importFile(file, parser);
  await db.close();
}

// If file provided, import one
if (argv.file) {
  doImport();
}

// Export
module.exports = {
  importFile
};
