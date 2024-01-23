const fs = require('fs');
const path = require('path');

const folder = 'secret-folder';

fs.readdir(
  path.join(__dirname, folder),
  { withFileTypes: true },
  (err, entries) => {
    entries.forEach((entry) => {
      if (entry.isFile()) {
        const filePath = path.join(__dirname, folder, entry.name);
        const fileName = path.parse(filePath).name;
        const fileExtension = path.extname(entry.name).replace('.', '');

        fs.stat(path.join(__dirname, folder, entry.name), (err, stats) => {
          // const fileSize = `${stats.size / 1024}KB`;
          const fileSize = `${stats.size}B`;
          const outputStr = `${fileName} - ${fileExtension} - ${fileSize}`;

          console.log(outputStr);
        });
      }
    });
  },
);
