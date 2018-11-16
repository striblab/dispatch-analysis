/**
 * Read in all build files and import
 */

// Dependencies
const fs = require('fs');
const path = require('path');
const argv = require('yargs').argv;
const db = require('./db.js');
const { importFile } = require('./import.js');

// Consts
const buildPath = path.join(__dirname, '..', 'data', 'build');

// Main function
async function importFiles() {
  // Setup database
  await db.connect();
  await db.sync({ force: argv.force });

  // Read files
  let inputFiles = fs.readdirSync(buildPath);
  for (let f of inputFiles) {
    if (f.match(/^\./) || !f.match(/\.csv$/)) {
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

    // Allow to pass district part
    if (argv.district && argv.district !== file.district) {
      continue;
    }

    // Get parser
    const parser = require(`./parser/${file.district}.js`);

    // Import file
    await importFile(file, parser);
  }

  await db.close();
}

importFiles();
