const fs = require('fs');
const path = require('path');

const stylesFolder = 'styles';
const projectFolder = 'project-dist';
const bundleCssFile = 'bundle.css';

fs.readdir(
  path.join(__dirname, stylesFolder),
  { withFileTypes: true },
  (err, entries) => {
    const stylesArr = [];

    entries.forEach((entry) => {
      const filePath = path.join(__dirname, stylesFolder, entry.name);

      if (entry.isFile() && path.extname(filePath) === '.css') {
        const readStream = fs.createReadStream(
          path.join(__dirname, stylesFolder, entry.name),
          { encoding: 'utf8' },
        );
        const writeStream = fs.createWriteStream(
          path.join(__dirname, projectFolder, bundleCssFile),
        );

        const promise = new Promise(function (resolve, reject) {
          readStream.on('data', (data) => {
            stylesArr.push(data);

            resolve(stylesArr);
          });
        });

        promise.then((array) => {
          writeStream.write(array.join(''));
        });
      }
    });
  },
);
