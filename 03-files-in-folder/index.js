const fs = require('fs');
const path = require('path');

const folder = 'secret-folder';

fs.readdir(
  path.join(__dirname, folder),
  { withFileTypes: true },
  (err, entries) => {
    entries.forEach((entry) => {
      if (entry.isFile()) {
        const fileName = entry.name;
        const fileExtension = path.extname(fileName).replace('.', '');

        fs.stat(path.join(__dirname, folder, fileName), (err, stats) => {
          const fileSize = `${stats.size / 1000}KB`;
          const outputStr = `${fileName} - ${fileExtension} - ${fileSize}`;

          console.log(outputStr);
        });
      }
    });
  },
);
