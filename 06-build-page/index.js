const fs = require('fs');
const path = require('path');

const projectFolder = 'project-dist';

async function myFunc() {
  const existsPromise = new Promise ((resolve, reject) => {
    fs.exists(path.join(__dirname, projectFolder), (exists) => {
      // console.log('in promise');
      resolve(exists);
    });
    console.log('after resolve')
  })
  const exists = await existsPromise;

  const dirPromise = new Promise ((resolve, reject) => {
    console.log('in promise', exists)
    if (!exists) {
      fs.mkdir(path.join(__dirname, projectFolder), (err, data) => {});
      resolve('folder created');
    } else {
      console.log('in exists');
      async function deleteFiles() {
        const entries = await fs.promises.readdir(path.join(__dirname, projectFolder));
        console.log(entries)
        for (const entry of entries) {
          await fs.promises.rm(path.join(__dirname, projectFolder, entry));
          console.log('unlink', entry);
        }
        resolve('old files deleted');
      }

      deleteFiles();
    }
  })
  const dirMessage = await dirPromise;
  console.log(dirMessage);
 
  createHtmlFile();
  createStyleFile();
}

myFunc();

// copy assets
function copyFiles(srcFolder, destFolder) {
  fs.readdir(path.join(__dirname, 'files'), (err, entries) => {
    entries.forEach((entry) => {
      fs.copyFile(
        path.join(srcFolder, entry),
        path.join(destFolder, entry),
        () => {
          // console.log('copied');
        },
      );
    });
  });
}

function createHtmlFile() {
  const readStream = fs.createReadStream(path.join(__dirname, 'template.html'), {encoding: 'utf-8'});
  const writeStream = fs.createWriteStream(path.join(__dirname, projectFolder, 'index.html'));
  
  const componenetsFolder = 'components';
  
  readStream.on('data', (data) => {
    console.log('writing index.html');
    
    const tags = [];

    fs.readdir(path.join(__dirname, componenetsFolder), (err, entries) => {
      entries.forEach(entry => {
       
        tags.push(entry);
        
      });
      // console.log(tags);

      for (let i = 0; i < tags.length; i += 1) {
        const str = `{{${tags[i].replace('.html', '')}}}`;

        const stream = fs.createReadStream(path.join(__dirname, componenetsFolder, tags[i]), {encoding: 'utf-8'});
        
        stream.on('data', (htmlData) => {
          data = data.replace(str, htmlData);
          
          if (i === tags.length - 1) {
            writeStream.write(data);
          }
        });
      }
    })  
  })
}
  
function createStyleFile() {
  console.log('writing style.css');
  const stylesFolder = 'styles';
  // const projectFolder = 'project-dist';
  const bundleCssFile = 'style.css';

  fs.promises
    .readdir(path.join(__dirname, stylesFolder), { withFileTypes: true })
    .then((entries) => {
      const stylesArr = [];

      entries.forEach((entry) => {
        const filePath = path.join(__dirname, stylesFolder, entry.name);

        if (entry.isFile() && path.extname(filePath) === '.css') {
          const readStream = fs.createReadStream(
            path.join(__dirname, stylesFolder, entry.name),
            { encoding: 'utf-8' },
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
    });
}