const fs = require('fs');

const readStream = fs.createReadStream('./01-read-file/text.txt', {encoding: 'utf-8'});

readStream.on('data', (data) => {
  console.log(data);
});