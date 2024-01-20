const fs = require('fs');
const path = require('path');

const folderName = 'files-copy';

fs.exists(path.join(__dirname, folderName), (exists) => {
  if (exists) {
    fs.readdir(path.join(__dirname, 'files'), (err, entries) => {
      entries.forEach((entry) => {
        fs.unlink(path.join(__dirname, folderName, entry), () => {
          // console.log('file removed'),
        });
      });
    });
    copyFiles(path.join(__dirname, 'files'), path.join(__dirname, folderName));
  } else {
    fs.mkdir(path.join(__dirname, folderName), () => {
      copyFiles(
        path.join(__dirname, 'files'),
        path.join(__dirname, folderName),
      );
    });
  }
});

function copyFiles(srcFolder, destFolder) {
  fs.readdir(path.join(__dirname, 'files'), (err, entries) => {
    entries.forEach((entry) => {
      fs.copyFile(
        path.join(srcFolder, entry),
        path.join(destFolder, entry),
        () => {
          // console.log('copied');
        });
    });
  });
}