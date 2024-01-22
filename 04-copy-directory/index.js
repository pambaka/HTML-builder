const fs = require('fs');
const path = require('path');

const folderName = 'files-copy';

copyDir();

async function copyDir() {
  const existsPromise = new Promise((resolve, reject) => {
    fs.access(path.join(__dirname, folderName), (err) => {
      const exists = !Boolean(err);

      resolve(exists);
    });
  });
  const exists = await existsPromise;
  console.log('Directory exists:', exists);

  const dirPromise = new Promise((resolve, reject) => {
    if (!exists) {
      fs.mkdir(path.join(__dirname, folderName), () => {
        resolve(`${folderName} directory is created`);
      });
    } else {
      async function deleteFiles() {
        const entries = await fs.promises.readdir(
          path.join(__dirname, folderName),
        );
        console.log(`Files in directory: ${entries}`);

        for (const entry of entries) {
          await fs.promises.rm(path.join(__dirname, folderName, entry));
          console.log(`${entry} deleted`);
        }

        resolve('Files deleted');
      }

      deleteFiles();
    }
  });
  const dirMessage = await dirPromise;
  console.log(dirMessage);

  copyFiles(path.join(__dirname, 'files'), path.join(__dirname, folderName));
}

function copyFiles(srcFolder, destFolder) {
  fs.readdir(path.join(__dirname, 'files'), (err, entries) => {
    entries.forEach((entry) => {
      fs.copyFile(
        path.join(srcFolder, entry),
        path.join(destFolder, entry),
        () => {
          console.log(`${entry} copied`);
        },
      );
    });
  });
}
